import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, RadioGroup, Radio, makeStyles } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';
import { v4 } from 'uuid';
import { TranslatorContext } from '../../../contextProviders/Translator';

const defaultServiceTypes = {
    mounting: false,
    maintenance: false,
    repair: false,
    others: true
}

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
    const [address, setAddress] = React.useState();
    const [employee, setEmployee] = React.useState();
    const [date, setDate] = React.useState();
    const [reason, setReason] = React.useState();
    const [type, setType] = React.useState(defaultServiceTypes);
    const [finished, setFinished] = React.useState(false);
    const [notFinishedReason, setNotFinishedReason] = React.useState();

     React.useEffect(() => {
        setPartId((!!part && !!part.partId) ? part.partId : v4());
        setCustomer(part.customer);
        setAddress((!!part.customer && !!part.customer.address) ? part.customer.address : "");
        setEmployee(part.employee);
        setDate(part.date);
        setReason(part.reason);
        setType((!!part && !!part.type) ? part.type : defaultServiceTypes);
        setFinished(!!part.finished ? part.finished : false);
        setNotFinishedReason(part.notFinishedReason);
    }, [part]);

    const handleChangeCustomer = (event, newValue) => {
        console.info('CHANGE CUSTOMER NEWVALUE', newValue);
        setCustomer(newValue);
    }

    const handleChangeAddress = event => {
        setAddress(event.target.value);
    }

    const handleChangeDate = date => {
        setDate(date);
    };

    const handleChangeEmployee = (event, newValue) => {
        setEmployee(newValue);
    }

    const handleChangeType = name => event => {
        setType({ ...type, [name]: event.target.checked });
    };

    const handleChangeReason = event => {
        setReason(event.target.value);
    }

    const handleChangeFinished = event => {
        setFinished(event.target.value === 'true');
    }

    const handleChangeNotFinishedReason = event => {
        setNotFinishedReason(event.target.value);
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
                        <Grid container spacing={1} item xs={12}>
                            <Grid container item xs={6}>
                                <Grid container item xs={12}>
                                    <TextField
                                        margin="normal"
                                        id="partId"
                                        label={translations.partId}
                                        value={partId}
                                        fullWidth
                                        variant="outlined"
                                        disabled
                                    />
                                </Grid>
                                <Grid container item xs={12}>
                                    <Autocomplete
                                        id="autocompleteCustomer"
                                        options={customers}
                                        getOptionLabel={option => option.name}
                                        style={{ width: '100%' }}
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
                                <Grid container item xs={12}>
                                    <TextField
                                        margin="normal"
                                        id="address"
                                        label={translations.address}
                                        value={address}
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleChangeAddress}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container item xs={6}>
                                <Grid container item xs={12}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDateTimePicker
                                            disableToolbar
                                            variant="inline"
                                            inputVariant="outlined"
                                            format="dd/MM/yyyy HH:mm"
                                            margin="normal"
                                            fullWidth={true}
                                            id="date-picker-inline"
                                            label={translations.date}
                                            value={date}
                                            onChange={handleChangeDate}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>

                                <Grid container item xs={12} style={{marginTop: '25px'}}>
                                    <Autocomplete
                                        id="autocompleteEmployee"
                                        options={employees}
                                        getOptionLabel={option => option.name}
                                        style={{ width: '100%' }}
                                        autoHighlight
                                        value={employee}
                                        onChange={handleChangeEmployee}
                                        renderOption={option => (
                                            <React.Fragment>
                                                {option.name} {option.surname}
                                            </React.Fragment>
                                        )}
                                        renderInput={params => (
                                            <TextField 
                                                {...params} 
                                                label={translations.technician}
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

                                <Grid container item xs={12} style={{marginTop: '10px'}}>
                                    <FormControl component="fieldset" style={{margin: '10px'}}>
                                        <FormLabel component="legend">{translations.typeOfService}</FormLabel>
                                        <FormGroup>
                                            <Grid container item xs={12}>
                                                <Grid container item xs={6}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox 
                                                                checked={type.mounting} 
                                                                onChange={handleChangeType('mounting')} 
                                                                value="mounting" 
                                                                color="primary"
                                                            />
                                                        }
                                                        label={translations.mounting}
                                                    />
                                                </Grid>

                                                <Grid container item xs={6}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox 
                                                                checked={type.maintenance} 
                                                                onChange={handleChangeType('maintenance')} 
                                                                value="maintenance" 
                                                                color="primary"
                                                            />
                                                        }
                                                        label={translations.maintenance}
                                                    />
                                                </Grid>

                                                <Grid container item xs={6}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox 
                                                                checked={type.repair} 
                                                                onChange={handleChangeType('repair')} 
                                                                value="repair" 
                                                                color="primary"
                                                            />
                                                        }
                                                        label={translations.repair}
                                                    />
                                                </Grid>

                                                <Grid container item xs={6}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox 
                                                                checked={type.others} 
                                                                onChange={handleChangeType('others')} 
                                                                value="others" 
                                                                color="primary"
                                                            />
                                                        }
                                                        label={translations.others}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </FormGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container spacing={1} item xs={12}>
                            <TextField
                                id="multiline-reason"
                                label={translations.reason}
                                multiline
                                rows="4"
                                value={reason}
                                margin="normal"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleChangeReason}
                            />
                        </Grid>

                        <Grid container item xs={12}>
                            <Grid container item xs={6} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <FormControl component="fieldset" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <FormLabel component="legend">{translations.finishedAssistance}</FormLabel>
                                    <RadioGroup aria-label="finished" name="finished" onChange={handleChangeFinished} style={{flexDirection: 'row'}}>
                                        <FormControlLabel
                                            value={true}
                                            control={<Radio color="primary" checked={finished} />}
                                            label={translations.yes}
                                            labelPlacement="start"
                                        />
                                        <FormControlLabel
                                            value={false}
                                            control={<Radio color="primary" checked={!finished} />}
                                            label={translations.no}
                                            labelPlacement="start"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            <Grid container item xs={6}>
                                <TextField
                                    id="multiline-clarification"
                                    label={translations.technicianClarifications}
                                    multiline
                                    rows="4"
                                    value={notFinishedReason}
                                    margin="normal"
                                    variant="outlined"
                                    fullWidth={true}
                                    onChange={handleChangeNotFinishedReason}
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