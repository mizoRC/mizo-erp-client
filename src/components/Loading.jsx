import React from 'react';
import { Paper, makeStyles } from '@material-ui/core';
import * as defaultStyles from '../styles';
import loadingSVG from '../assets/loading.svg';

const useStyles = makeStyles(theme => ({
    ...defaultStyles
}));

const Loading = () => {
    const classes = useStyles();
    return (
        <Paper className={classes.fullHeightWidth}>
            <Paper className={classes.centered}>
                <img src={loadingSVG} alt="loadingIcon" style={{maxWidth: "80px"}}/>
            </Paper>
        </Paper>
    )
}

export default Loading;