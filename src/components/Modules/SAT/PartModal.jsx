import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, makeStyles } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { v4 } from 'uuid';
import { TranslatorContext } from '../../../contextProviders/Translator';

const useStyles = makeStyles(theme => ({
    deleteButton: {
        boxShadow: 'none',
        color: "#FF3232",
        '&:hover': {
            backgroundColor: "rgb(255,50,50,0.1)",
            borderColor: "rgb(255,50,50,0.1)",
            color: "#FF3232",
            boxShadow: 'none',
        },
        '&:active': {
            boxShadow: 'none',
        },
        '&:focus': {
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
        }
    }
}))

const PartModal = ({open, handleClose, handleSave, adding, updating, part, customers, employees}) => {
    const classes = useStyles();
	const { translations } = React.useContext(TranslatorContext);
    const [partId, setPartId] = React.useState();
    const [customer, setCustomer] = React.useState();
    const [employee, setEmployee] = React.useState();
    const [date, setDate] = React.useState();
    const [reason, setReason] = React.useState();
    const [type, setType] = React.useState();
    const [finished, setFinished] = React.useState();
    const [notFinishedReason, setNotFinishedReason] = React.useState();

     React.useEffect(() => {
        setPartId((!!part && !!part.partId) ? part.partId : v4());
        setCustomer(part.customer);
        setEmployee(part.employee);
        setDate(part.date);
        setReason(part.reason);
        setType(part.type);
        setFinished(part.finished);
        setNotFinishedReason(part.notFinishedReason);
    }, [part]);

    const handleChangeCustomer = event => {
        setCustomer(event.target.value);
    }

	return (
		<div>
			<Dialog 
				open={open} 
				onClose={handleClose}
				disableBackdropClick={true}
				disableEscapeKeyDown={true}
				fullWidth={true}
				maxWidth="md"
			>
				<DialogTitle style={{textAlign: 'center'}}>
					{translations.part}
				</DialogTitle>
				<DialogContent>
                    <Grid container spacing={1} style={{width: '100%', height: '100%'}}>
                        <Grid container item xs={6}>
                            <Grid container item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="price"
                                    label={translations.partId}
                                    value={partId}
                                    fullWidth
                                    variant="outlined"
                                    disabled
                                />
                            </Grid>
                            <Grid container item xs={12}>
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={customers}
                                    getOptionLabel={option => option.name}
                                    style={{ width: 300 }}
                                    autoHighlight
                                    value={customer}
                                    onChange={handleChangeCustomer}
                                    renderOption={option => (
                                        <React.Fragment>
                                            {option.name}
                                        </React.Fragment>
                                    )}
                                    renderInput={params => (
                                        <TextField 
                                            {...params} 
                                            label={translations.customer}
                                            variant="outlined" 
                                            fullWidth  
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'disabled', // disable autocomplete and autofill
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Grid container item xs={6}>
                            <Grid container item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="price"
                                    label={translations.partId}
                                    value={partId}
                                    fullWidth
                                    variant="outlined"
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Grid>
				</DialogContent>
				<DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {translations.cancel}
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        {translations.save}
                    </Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default PartModal;