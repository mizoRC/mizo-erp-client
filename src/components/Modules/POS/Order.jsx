import React from 'react';
import { makeStyles, Typography, Fab, Divider } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { TranslatorContext } from '../../../contextProviders/Translator';
import * as mainStyles from '../../../styles';
import { primary, tertiary } from '../../../styles/colors';
import OrderLine from './OrderLine';

const useStyles = makeStyles(theme => ({
    ...mainStyles
}));

const Order = ({products, newReading}) => {
    const classes = useStyles();
    const { translations } = React.useContext(TranslatorContext);
    const [lines, setLines] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const [totalTaxes, setTotalTaxes] = React.useState(0);
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

    React.useEffect(() => {
        if(!!newReading && !!newReading.barcode  && (newReading.barcode !== '') && (newReading.barcode !== null)) addLine(newReading.barcode);
    },[newReading]);

    React.useEffect(() => {
        console.info(lines);
        let newTotal = 0;
        let newTotalTaxes = 0;
        lines.forEach(line => {
            newTotal = newTotal + line.total;
            newTotalTaxes = newTotalTaxes + parseFloat((line.total * (line.vat/100)).toFixed(2));
        });

        setTotal(newTotal);
        setTotalTaxes(newTotalTaxes);
    }, [lines]);

    return(
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
                        <Fab variant="extended">
                            <i className="fas fa-user" style={{marginRight: '6px'}}></i>
                            {translations.customer}
                        </Fab>
                        <Fab variant="extended" color="primary">
                            <i className="fas fa-cash-register" style={{marginRight: '6px'}}></i>
                            {translations.payment}
                        </Fab>
                    </div>
                </div>
            </div>                        
        </div>
    )
}

export default Order;