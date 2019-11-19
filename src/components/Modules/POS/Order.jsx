import React from 'react';
import { makeStyles, Typography, Fab, Divider, Tooltip } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { TranslatorContext } from '../../../contextProviders/Translator';
import * as mainStyles from '../../../styles';
import { primary, tertiary } from '../../../styles/colors';
import OrderLine from './OrderLine';
import CustomerModal from './CustomerModal';

const useStyles = makeStyles(theme => ({
    ...mainStyles,
    orderActionBtn:{
        width: '140px',
        maxWidth: '140px',
        minWidth: '140px'
    },
    textOverflow: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '100%'
    }
}));

const Order = ({products, newReading}) => {
    const classes = useStyles();
    const { translations } = React.useContext(TranslatorContext);
    const [lines, setLines] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const [totalTaxes, setTotalTaxes] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [customer, setCustomer] = React.useState();

    const checkBarcodeIsInOrder = barcode => {
        let isInOrder = false;

        lines.forEach(line => {
            if(line.barcode === barcode) isInOrder = true;
        })

        return isInOrder;
    }

    const addLine = barcode => {
        const newLines = [...lines];
        const isInOrder = checkBarcodeIsInOrder(barcode);

        if(isInOrder){
            for (let index = 0; index < newLines.length; index++) {
                if(newLines[index].barcode === barcode) newLines[index].units = newLines[index].units + 1;
            }
        }
        else{
            products.forEach(product => {
                if(product.barcode === barcode){
                    const newLine = {
                        productId: product.id,
                        barcode: product.barcode,
                        name: `${product.name} ( ${product.brand} )`,
                        price: product.price,
                        vat: product.vat,
                        units: 1,
                        total: 1 * product.price
                    }
                    newLines.unshift(newLine);
                }
            });
        }
        
        setLines(newLines);
    }

    const modifyLine = line => {
        const newLines = [...lines];
        for (let index = 0; index < newLines.length; index++) {
            if(newLines[index].productId === line.productId){
                newLines[index].price = line.price;
                newLines[index].units = line.units;
                newLines[index].total = line.total;
            }
        }
        setLines(newLines);
    }

    const deleteLine = (productId) => {
        const newLines = lines.filter(line => line.productId !== productId);
        setLines(newLines);
    };

    const handleOpenCustomer = () => {
        setOpen(true);
    }

    const handleCloseCustomer = () => {
        setOpen(false);
    }

    const handleSelectCustomer = (selectedCustomer) => {
        setCustomer(selectedCustomer);
        setOpen(false);
    }

    React.useEffect(() => {
        if(!!newReading && !!newReading.barcode  && (newReading.barcode !== '') && (newReading.barcode !== null)) addLine(newReading.barcode);
    },[newReading]);

    React.useEffect(() => {
        let newTotal = 0;
        let newTotalTaxes = 0;
        lines.forEach(line => {
            newTotal = parseFloat((newTotal + line.total).toFixed(2));
            newTotalTaxes = newTotalTaxes + parseFloat((line.total * (line.vat/100)).toFixed(2));
        });

        setTotal(newTotal);
        setTotalTaxes(newTotalTaxes);
    }, [lines]);

    React.useEffect(() => {
        console.info('ORDER CUSTOMER', customer);
    }, [customer]);

    return(
        <React.Fragment>
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
                        height: 'calc(100% - 200px)',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#EDEFF2'
                    }}
                >
                    <PerfectScrollbar 
                        options={{suppressScrollX: true}}
                    >
                        {lines.map((line, index) => (
                            <React.Fragment key={`fragment-${line.productId}`}>
                                <OrderLine 
                                    key={`orderline-${line.productId}-${line.price}-${line.units}`} 
                                    line={line} 
                                    modifyLine={modifyLine}
                                    deleteLine={deleteLine}
                                />
                                {(index < (lines.length - 1)) &&
                                    <Divider key={index}/>
                                }
                            </React.Fragment>
                        ))}
                    </PerfectScrollbar>
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
                                    {total}€
                                </Typography>
                            </div>

                            <div>
                                <Typography variant="subtitle2">
                                    ({totalTaxes}€ {translations.taxes})
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
                            <Tooltip 
                                title={customer ? customer.name : null}
                                disableFocusListener={!customer}
                                disableHoverListener={!customer}
                                disableTouchListener={!customer}
                            >
                                <Fab variant="extended" onClick={handleOpenCustomer} className={classes.orderActionBtn}>
                                    <i className="fas fa-user" style={{marginRight: '6px'}}></i>
                                    <div className={classes.textOverflow}>
                                        {customer ? customer.name : translations.customer}
                                    </div>
                                </Fab>
                            </Tooltip>
                            <Fab variant="extended" color="primary" className={classes.orderActionBtn} disabled={lines.length === 0}>
                                <i className="fas fa-cash-register" style={{marginRight: '6px'}}></i>
                                {translations.payment}
                            </Fab>
                        </div>
                    </div>
                </div>                        
            </div>

            {open &&
                <CustomerModal 
                    open={open} 
                    handleClose={handleCloseCustomer} 
                    handleSelect={handleSelectCustomer}
                    customer={customer}
                />
            }
        </React.Fragment>
    )
}

export default Order;