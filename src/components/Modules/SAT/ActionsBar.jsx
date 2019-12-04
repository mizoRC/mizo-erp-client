import React from 'react';
import { Paper, Grid, TextField, Button, IconButton, Tooltip } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { BrowserView, MobileView, isMobile } from "react-device-detect";
import { TranslatorContext } from '../../../contextProviders/Translator';
import { formatSearchDate } from '../../../utils/format'; 
const defaultLimit = 16;
const initialOffset = 0;
let filtersTimeout;

const ActionsBar = ({height, handleChangeFilters: handleChangeFiltersParent, handleAdd, loading}) => {
    const { translations } = React.useContext(TranslatorContext);
    const [text, setText] = React.useState('');
    const [date, setDate] = React.useState(new Date());
    const [offset] = React.useState(initialOffset);
    const [limit] = React.useState(defaultLimit);

    const handleChangeText = event => {
        setText(event.target.value);
    }

    const handleChangeDate = date => {
        setDate(date);
    };

    const handleAddNewPart = () => {
        handleAdd({});
    }

    const clearFilters = () => {
        setText('');
        setDate();
    }

    const buildFilterVariables = () => {
        let filters = {
            filters: [
                {
                    field: 'search',
                    value: text
                }
            ],
            options:{
                limit: limit,
                offset: offset
            }
        }

        if(date) filters.filters.push({
            field: 'date',
            value: formatSearchDate(date)
        });

        return filters;
    }

    React.useEffect(() => {
        const filters = buildFilterVariables();
        
        clearTimeout(filtersTimeout);
        filtersTimeout = setTimeout(() => {
            handleChangeFiltersParent(filters)
        }, 450);

        // return clearTimeout(filtersTimeout);
    },[text, date]);

    return(
        <Paper
            style={{
                height: isMobile ? '135px' : `${height}px`,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <BrowserView 
                style={{
                    width: 'calc(100% - 10px)',
                    height: 'calc(100% - 10px)',
                    display: 'flex',
                    padding: '5px'
                }}
            >
                <Grid container spacing={2} style={{width: '100%', height: '100%'}}>
                    <Grid item xs={12} sm={6} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <TextField
                            id="outlined-search"
                            label={translations.search}
                            value={text}
                            margin="normal"
                            variant="outlined"
                            fullWidth={true}
                            onChange={handleChangeText}
                        />
                    </Grid>

                    <Grid item xs={10} sm={4} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                inputVariant="outlined"
                                format="dd/MM/yyyy"
                                margin="normal"
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

                    <Grid item xs={12} sm={2} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Tooltip title={translations.cleanFilters}>
                            <IconButton color="primary" aria-label="clean" onClick={clearFilters} style={{marginRight: '20px'}}>
                                <i className="fas fa-eraser"></i>
                            </IconButton>
                        </Tooltip>

                        {!!handleAdd &&
                            <Button variant="contained" color="primary" onClick={handleAddNewPart}>
                                {translations.add}
                            </Button>
                        }
                    </Grid>
                </Grid>
            </BrowserView>

            <MobileView
                style={{
                    width: 'calc(100% - 10px)',
                    height: 'calc(100% - 10px)',
                    display: 'flex',
                    padding: '5px'
                }}
            >
                <Grid container spacing={2} style={{width: '100%', height: '100%', margin: '0px'}}>
                    <Grid item xs={12} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <TextField
                            id="outlined-search"
                            label={translations.search}
                            value={text}
                            margin="dense"
                            variant="outlined"
                            fullWidth={true}
                            onChange={handleChangeText}
                        />
                    </Grid>

                    <Grid item xs={10} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                inputVariant="outlined"
                                format="dd/MM/yyyy"
                                margin="dense"
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

                     <Grid item xs={2} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Tooltip title={translations.cleanFilters}>
                            <IconButton color="primary" aria-label="clean" onClick={clearFilters} style={{marginRight: '20px'}}>
                                <i className="fas fa-eraser"></i>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </MobileView>
        </Paper>
    )
}

export default ActionsBar;