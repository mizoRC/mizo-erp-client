import React from "react";
import { makeStyles, FormControl, OutlinedInput, InputAdornment, Paper } from '@material-ui/core';
import { TranslatorContext } from '../../../contextProviders/Translator';
import * as mainStyles from '../../../styles';
import { primary } from '../../../styles/colors';

const useStyles = makeStyles(theme => ({
    ...mainStyles,
    posContainer: {
        height: "100%",
        width: "100%",
        backgroundColor: "#C8CED8"
    },
    inputs: {
        maxWidth: '40%'
    },
    totalPaper: {
        backgroundColor: primary,
        color: 'white',
        padding: '10px',
        maxWidth: '100%'
    }
}));

const OrderLine = ({line, modifyLine}) => {
    const classes = useStyles();
    const { translations } = React.useContext(TranslatorContext);
    const [units, setUnits] = React.useState(1);
    const [price, setPrice] = React.useState(line.price);
    const [total, setTotal] = React.useState(1);

    const handleModifyLine = () => {
        const modifiedLine = {
            ...line,
            price: price,
            units: units,
            total: total
        }
        modifyLine(modifiedLine);
    }

    const handleChangeUnits = event => {
        setUnits(parseInt(event.target.value));
    }

    const handleChangePrice = event => {
        setPrice(parseFloat(event.target.value));
    }

    React.useEffect(() => {
        const newTotal = parseFloat((price * units).toFixed(2));
        setTotal(Number.isNaN(newTotal) ? 0 : newTotal);
    }, [units, price]);

    React.useEffect(() => {
        handleModifyLine();
    }, [total]);

	return (
		<div
			style={{
				width: "100%",
				height: "85px",
				minHeight: "85px",
				maxHeight: "85px",
				display: "flex",
				flexDirection: "row"
			}}
		>
			<div
				style={{
					width: "70%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center"
				}}
			>
				<div
                    style={{
                        whiteSpace: 'nowrap',
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '10px',
                        marginLeft: '10px'
                    }}
                >
                    {line.name}
                </div>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-around"
					}}
				>
					<FormControl className={classes.inputs} variant="outlined">
						<OutlinedInput
							id="input_uds"
							value={units}
							onChange={handleChangeUnits}
							margin="dense"
                            type="number" 
                            inputProps={{ min: "1", step: "1" }}
							endAdornment={
								<InputAdornment position="end">
									{translations.uts}
								</InputAdornment>
							}
							labelWidth={0}
						/>
					</FormControl>

					<div>{translations.at}</div>

					<FormControl className={classes.inputs} variant="outlined">
						<OutlinedInput
							id="input_price"
							value={price}
							onChange={handleChangePrice}
                            type="number" 
                            inputProps={{ min: "1", step: "0.01" }}
							margin="dense"
							endAdornment={
								<InputAdornment position="end">
									€/{translations.u}
								</InputAdornment>
							}
							labelWidth={0}
						/>
					</FormControl>
				</div>
			</div>

			<div
				style={{
					width: "30%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center"
				}}
			>
                <Paper className={classes.totalPaper} elevation={8}>
				    {total}€
                </Paper>
			</div>
		</div>
	);
};

export default OrderLine;
