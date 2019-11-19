import React from 'react';
import { Paper, Grid, TextField, MenuItem, Button, Fab, Tooltip } from '@material-ui/core';
import { TranslatorContext } from '../../../contextProviders/Translator';
const defaultLimit = 16;
const initialOffset = 0;
let filtersTimeout;

const ActionsBar = ({height, categories, handleChangeFilters: handleChangeFiltersParent, loading}) => {
    const { translations } = React.useContext(TranslatorContext);
    const [text, setText] = React.useState('');
    const [category, setCategory] = React.useState();
    const [offset] = React.useState(initialOffset);
    const [limit] = React.useState(defaultLimit);

    const handleChangeText = event => {
        setText(event.target.value);
    }

    const handleChangeCategory = event => {
        setCategory(event.target.value);
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

        if(category) filters.filters.push({
            field: 'category',
            value: category.toString()
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
    },[text, category]);

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
                    <TextField
                        id="outlined-select-currency"
                        select
                        label={translations.category}
                        value={category}
                        onChange={handleChangeCategory}
                        margin="normal"
                        variant="outlined"
                        fullWidth={true}
                    >
                        <MenuItem key={0} value={null}>
                            {translations.neither}
                        </MenuItem>
                        {categories.map(category => {
                            return(
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            )
                        })}
                    </TextField>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default ActionsBar;