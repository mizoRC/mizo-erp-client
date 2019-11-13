import React from 'react';
import { makeStyles, Button, Typography, Fab } from '@material-ui/core';
import BarcodeReader from 'react-barcode-reader';
import { TranslatorContext } from '../../../contextProviders/Translator';
import * as mainStyles from '../../../styles';
import { primary, tertiary } from '../../../styles/colors';
import Bar from '../../Segments/Bar';

const useStyles = makeStyles(theme => ({
    ...mainStyles,
    posContainer: {
        height: "100%",
        width: "100%",
        backgroundColor: "#C8CED8"
    }
}));

const POS = () => {
    const classes = useStyles();
    const { translations } = React.useContext(TranslatorContext);
    const [barcode, setBarcode] = React.useState("");

    const handleScan = (data) => {
        setBarcode(data);
    }

    const handleError = (err) => {
        console.error(err)
    }

    /* <BarcodeReader
                onError={handleError}
                onScan={handleScan}
            /> */

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
                    <div
                        style={{
                            width:'450px',
                            minWidth: '450px',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: `8px 0 10px -6px ${primary}`
                        }}
                    >
                        <div
                            style={{
                                width:'100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: '#EDEFF2'
                            }}
                        >
                            {/* LINE */}
                            <div
                                style={{
                                    width: '100%',
                                    height: '70px',
                                    minHeight: '70px',
                                    maxHeight: '70px',
                                    display: 'flex',
                                    flexDirection: 'row'
                                }}
                            >
                                <div
                                    style={{
                                        width: '70%',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <div>
                                        Nombre
                                    </div>
                                    <div>
                                        5uds a 1,00€/ud
                                    </div>
                                </div>

                                <div
                                    style={{
                                        width: '30%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    5,00€
                                </div>
                            </div>
                            {/* LINE */}
                        </div>

                        <div
                            style={{
                                width:'100%',
                                height: '200px',
                                minHeight: '200px',
                                maxHeight: '200px',
                                display: 'flex',
                                flexDirection: 'column',
                                borderTop: `4px solid ${tertiary}`
                            }}
                        >
                            <div 
                                style={{
                                    height: '100%', 
                                    width: 'calc(100% - 16px)', 
                                    margin: '8px',
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <div
                                    style={{
                                        width: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '20px'
                                    }}
                                >
                                    <div>
                                        <Typography variant="h4" gutterBottom>
                                           5,35€
                                        </Typography>
                                    </div>

                                    <div>
                                        <Typography variant="subtitle2">
                                            (0,35€ {translations.taxes})
                                        </Typography>
                                    </div>
                                </div>
                            
                                <div
                                    style={{
                                        width:'100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-around'
                                    }}
                                >
                                    <Fab variant="extended">
                                        <i className="fas fa-user" style={{marginRight: '6px'}}></i>
                                        {translations.customer}
                                    </Fab>
                                    <Fab variant="extended" color="primary">
                                        <i className="fas fa-cash-register" style={{marginRight: '6px'}}></i>
                                        {translations.payment}
                                    </Fab>
                                    {/* <Button variant="contained" color="default" >
                                        __CLIENTE__
                                    </Button>

                                    <Button variant="contained" color="primary">
                                        __COBRAR__
                                    </Button> */}
                                </div>
                            </div>
                            {/* <Card style={{display: 'flex', height: '100%', width: 'calc(100% - 16px)', margin: '8px'}}>
                                CALC
                            </Card> */}
                        </div>                        
                    </div>

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
        </div>
    )
}

export default POS;