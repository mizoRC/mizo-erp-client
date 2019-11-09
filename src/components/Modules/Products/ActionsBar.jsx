import React from 'react';
import { makeStyles, Paper, Grid, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Fab, Tooltip } from '@material-ui/core';
import { TranslatorContext } from '../../../contextProviders/Translator';

const ActionsBar = ({height, add, categories}) => {
    const { translations } = React.useContext(TranslatorContext);
    const [text, setText] = React.useState('');
    const [category, setCategory] = React.useState('');

    const handleChangeText = event => {
        setText(event.target.value);
    }

    const handleChangeCategory = () => {

    }

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
                <Grid item xs={3} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <div>
                        <Typography variant="h4">
                            {translations.products}
                        </Typography>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Button variant="contained" color="primary" style={{marginRight: '6px'}} onClick={add}>
                            {translations.add}
                        </Button>

                        <Button variant="contained" color="secondary">
                            {translations.import}
                        </Button>
                    </div>
                </Grid>

                <Grid item xs={6} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <TextField
                        id="outlined-search"
                        label="Required"
                        value={text}
                        margin="normal"
                        variant="outlined"
                        fullWidth={true}
                        onChange={handleChangeText}
                    />
                </Grid>

                <Grid item xs={3} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <TextField
                        id="outlined-select-currency"
                        select
                        label={translations.category}
                        value={category}
                        onChange={handleChangeCategory}
                        margin="normal"
                        variant="outlined"
                        fullWidth={true}
                        disabled={categories.length === 0}
                    >
                        <MenuItem value="">
                        </MenuItem>
                        {categories.map(category => {
                            return(
                                <MenuItem value={category.id}>
                                    {category.name}
                                </MenuItem>
                            )
                        })}
                    </TextField>
                    
                    {/* <Tooltip title={translations.addCategory}>
                        <Fab 
                            color="primary" 
                            size="small" 
                            aria-label="add"
                            style={{
                                marginLeft: '6px',
                                height: '40px',
                                width: '40px',
                                minWidth: '40px',
                                minHeight: '40px',
                                marginTop: '8px'
                            }}
                        >
                            <i className="fas fa-plus"></i>
                        </Fab>
                    </Tooltip> */}
                </Grid>
            </Grid>
        </Paper>
    )
}

export default ActionsBar;