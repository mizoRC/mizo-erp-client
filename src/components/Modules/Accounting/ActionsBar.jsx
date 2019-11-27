import React from 'react';
import { Paper, Grid, TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { TranslatorContext } from '../../../contextProviders/Translator';
import { formatSearchDate } from '../../../utils/format'; 
const defaultLimit = 16;
const initialOffset = 0;
let filtersTimeout;

const ActionsBar = ({height, handleChangeFilters: handleChangeFiltersParent, loading}) => {
    const { translations } = React.useContext(TranslatorContext);
    const [text, setText] = React.useState('');
    const [date, setDate] = React.useState();
    const [offset] = React.useState(initialOffset);
    const [limit] = React.useState(defaultLimit);

    const handleChangeText = event => {
        setText(event.target.value);
    }

    const handleChangeDate = date => {
        setDate(date);
    };

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
                height: `${height}px`,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Grid container spacing={2} style={{width: '100%', height: '100%'}}>

                <Grid item xs={8} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
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

                <Grid item xs={4} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
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
            </Grid>
        </Paper>
    )
}

export default ActionsBar;