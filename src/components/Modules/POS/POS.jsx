import React from 'react';
import { makeStyles } from '@material-ui/core';
import BarcodeReader from 'react-barcode-reader';
import * as mainStyles from '../../../styles';
import Bar from '../../Segments/Bar';
import Order from './Order';

const useStyles = makeStyles(theme => ({
    ...mainStyles,
    posContainer: {
        height: "100%",
        width: "100%",
        backgroundColor: "#C8CED8"
    },
    inputs: {
        maxWidth: '40%'
    }
}));

const POS = () => {
    const classes = useStyles();
    const [reading, setReading] = React.useState({});

    const handleScan = (data) => {
        const newReading = {
            barcode: data,
            time: (new Date()).getTime()
        }
        setReading(newReading);
    }

    const handleError = (err) => {
        console.error(err)
    }

    return(
        <div className={classes.posContainer}>
            <Bar/>
            <div
                style={{
                    height: 'calc(100% - 64px)',
                    width: '100%'
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row'
                    }}
                >
                    <Order newReading={reading}/>
                    <div
                        style={{
                            width:'100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        PRODUCTS
                    </div>
                </div>
            </div>

            <BarcodeReader
                onError={handleError}
                onScan={handleScan}
            />
        </div>
    )
}

export default POS;