import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, RadioGroup, Radio, MenuItem, CircularProgress } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import { v4 } from 'uuid';
import { isMobile } from "react-device-detect";
import { TranslatorContext } from '../../../contextProviders/Translator';

const defaultServiceTypes = {
    mounting: false,
    maintenance: false,
    repair: false,
    others: true
}

const PartModal = ({open, handleClose, handleSave, adding, updating, part, customers, employees, isTechnician}) => {
	const { translations } = React.useContext(TranslatorContext);
    const [partId] = React.useState((!!part && !!part.partId) ? part.partId : v4());
    const [customer, setCustomer] = React.useState((!!part && !!part.customerId) ? part.customerId : null);
    const [address, setAddress] = React.useState((!!part && !!part.address) ? part.address : "");
    const [employee, setEmployee] = React.useState((!!part && !!part.employeeId) ? part.employeeId : null);
    const [date, setDate] = React.useState((!!part && !!part.date) ? (new Date((parseInt(part.date / 1000)) * 1000)) : (new Date()));
    const [reason, setReason] = React.useState((!!part && !!part.reason) ? part.reason : null);
    const [type, setType] = React.useState((!!part && !!part.type) ? part.type : defaultServiceTypes);
    const [finished, setFinished] = React.useState(!!part.finished ? part.finished : false);
    const [notFinishedReason, setNotFinishedReason] = React.useState((!!part && !!part.notFinishedReason) ? part.notFinishedReason : "");
    const [errorEmptyCustomer, setErrorEmptyCustomer] = React.useState(false);
    const [errorEmptyAddress, setErrorEmptyAddress] = React.useState(false);
    const [errorEmptyEmployee, setErrorEmptyEmployee] = React.useState(false);
    const [errorEmptyDate, setErrorEmptyDate] = React.useState(false);
    const [errorEmptyReason, setErrorEmptyReason] = React.useState(false);
    const [errorEmptyType, setErrorEmptyType] = React.useState(false);

    const getCustomerAddressById = id => {
        let address = "";
        customers.forEach(customer => {
            if(customer.id === id) address =  customer.address;
        })
        return address;
    }

    const handleChangeCustomer = (event) => {
        const customerId = event.target.value;
        setCustomer(customerId);
        const address = getCustomerAddressById(customerId);
        setAddress(address);
    }

    const handleChangeAddress = event => {
        setAddress(event.target.value);
    }

    const handleChangeDate = date => {
        setDate(date);
    };

    const handleChangeEmployee = (event) => {
        setEmployee(event.target.value);
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

    const checkErrors = () => {
        let hasErrors = false;

        const isEmptyCustomer = (!customer || customer === "" || customer === null) ? true : false;
        const isEmptyAddress = (!address || address === "" || address === null) ? true : false;
        const isEmptyEmployee = (!employee || employee === "" || employee === null) ? true : false;
        const isEmptyDate = (!date || date === "" || date === null) ? true : false; 
        const isEmptyReason = (!reason || reason === "" || reason === null) ? true : false; 
        const isEmptyType = (!type.mounting && !type.maintenance && !type.repair && !type.others) ? true : false; 

        setErrorEmptyCustomer(isEmptyCustomer);
        setErrorEmptyAddress(isEmptyAddress);
        setErrorEmptyEmployee(isEmptyEmployee);
        setErrorEmptyDate(isEmptyDate);
        setErrorEmptyReason(isEmptyReason);
        setErrorEmptyType(isEmptyType);

        hasErrors = isEmptyCustomer || isEmptyAddress || isEmptyEmployee || isEmptyDate || isEmptyReason || isEmptyType;

        return hasErrors;
    };

    const save = () => {
        const hasErrors = checkErrors();

        if(!hasErrors && !!handleSave){
            let partSave = {
                partId: partId,
                date: date,
                address: address,
                reason: reason,
                type: type,
                finished: finished,
                notFinishedReason: notFinishedReason,
                employeeId: employee,
                customerId: customer
            };
            if(part.id) partSave.id = part.id;

            handleSave(partSave);
        }
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
                            <Grid container item xs={isMobile ? 12 : 6}>
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
                                    <TextField
										id="outlined-select-customer"
										select
										label={translations.customer}
										value={customer}
										onChange={handleChangeCustomer}
										margin="normal"
										variant="outlined"
										fullWidth={true}
                                        error={errorEmptyCustomer}
										disabled={(customers.length === 0) || isTechnician}
									>
										<MenuItem key={0} value={null}>
                                            {translations.neither}
										</MenuItem>
										{customers.map(customer => {
											return(
												<MenuItem key={customer.id} value={customer.id}>
													{customer.name}
												</MenuItem>
											)
										})}
									</TextField>
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
                                        error={errorEmptyAddress}
                                        disabled={isTechnician}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container item xs={isMobile ? 12 : 6}>
                                <Grid container item xs={12}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <DateTimePicker
                                            autoOk
                                            ampm={false}
                                            value={date}
                                            onChange={handleChangeDate}
                                            label={translations.date}
                                            format="dd/MM/yyyy HH:mm"
                                            margin="normal"
                                            fullWidth={true}
                                            disablePast
                                            inputVariant="outlined"
                                            error={errorEmptyDate}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>

                                <Grid container item xs={12} style={{marginTop: '25px'}}>
                                    {!isTechnician &&
                                        <TextField
                                            id="outlined-select-employee"
                                            select
                                            label={translations.technician}
                                            value={employee}
                                            onChange={handleChangeEmployee}
                                            margin="normal"
                                            variant="outlined"
                                            fullWidth={true}
                                            disabled={employees.length === 0}
                                            error={errorEmptyEmployee}
                                        >
                                            <MenuItem key={0} value={null}>
                                                {translations.neither}
                                            </MenuItem>
                                            {employees.map(employee => {
                                                return(
                                                    <MenuItem key={employee.id} value={employee.id}>
                                                        {employee.name} {employee.surname}
                                                    </MenuItem>
                                                )
                                            })}
                                        </TextField>
                                    }
                                </Grid>

                                <Grid container item xs={12} style={{marginTop: '10px'}}>
                                    <FormControl component="fieldset" style={{margin: '10px'}} error={errorEmptyType}>
                                        <FormLabel component="legend">{translations.typeOfService}</FormLabel>
                                        <FormGroup>
                                            <Grid container item xs={12}>
                                                <Grid container item xs={isMobile ? 12 : 6}>
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

                                                <Grid container item xs={isMobile ? 12 : 6}>
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

                                                <Grid container item xs={isMobile ? 12 : 6}>
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

                                                <Grid container item xs={isMobile ? 12 : 6}>
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
                                rows="3"
                                value={reason}
                                margin="normal"
                                variant="outlined"
                                fullWidth={true}
                                onChange={handleChangeReason}
                                error={errorEmptyReason}
                                disabled={isTechnician}
                            />
                        </Grid>

                        <Grid container item xs={12}>
                            <Grid container item xs={isMobile ? 12 : 6} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
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

                            <Grid container item xs={isMobile ? 12 : 6}>
                                <TextField
                                    id="multiline-clarification"
                                    label={translations.technicianClarifications}
                                    multiline
                                    rows="3"
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
                    <Button onClick={handleClose} disabled={(adding || updating)} color="primary">
                        {translations.cancel}
                    </Button>
                    <Button onClick={save} disabled={(adding || updating)} color="primary">
                        <div
                            style={{
                                display: 'flex',
                                flexDirection:' row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {translations.save}
                            {(adding || updating) &&
                                <div style={{marginLeft: '6px', display: 'flex', alignItems: 'center'}}>
                                    <CircularProgress size={20} color="secondary" />
                                </div>
                            }
                        </div>
                    </Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default PartModal;