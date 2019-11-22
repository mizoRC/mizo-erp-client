import React from 'react';
import { makeStyles, Typography, Fab, Tooltip } from '@material-ui/core';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import BarcodeReader from 'react-barcode-reader';
import { TranslatorContext } from '../../../contextProviders/Translator';
import * as mainStyles from '../../../styles';
import { primary, tertiary } from '../../../styles/colors';
import Loading from '../../Segments/Loading';
import Bar from '../../Segments/Bar';
import Order from './Order';
import ProductsGrid from './ProductsGrid';
import CustomerModal from './CustomerModal';
import Payment from './Payment';

const useStyles = makeStyles(theme => ({
    ...mainStyles,
    posContainer: {
        height: "100%",
        width: "100%",
        backgroundColor: "#C8CED8"
    },
    inputs: {
        maxWidth: '40%'
    },
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

const PRODUCTS = gql`
    query products($filters: [Filter]!, $options: Options!) {
        products(filters: $filters, options: $options) {
            rows{
                id
                name
                brand
                barcode
                price
                vat
            }
            count
        }
    }
`;

const COMPANY = gql`
    query company {
        company {
            id
            name
            country
            address
            phone
            logo
        }
    }
`;

const ADD_ORDER = gql`
    mutation addOrder($order: OrderInput!) {
        addOrder(order: $order) {
            id
            ticketId
        }
    }
`;

const POS = () => {
    const classes = useStyles();
    const { translations } = React.useContext(TranslatorContext);
    const [lines, setLines] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const [totalTaxes, setTotalTaxes] = React.useState(0);
    const [customer, setCustomer] = React.useState();
    const [openCustomer, setOpenCustomer] = React.useState(false);
    const [openPayment, setOpenPayment] = React.useState(false);
    const { loading, data } = useQuery(PRODUCTS, {
        variables: {
            filters: [
                {
                    field: 'search',
                    value: ''
                }
            ],
            options: {
                limit: 0,
                offset: 0
            }
        }
    });
    const { loading: loadingCompany, data: dataCompany } = useQuery(COMPANY, {
        fetchPolicy: "network-only"
    });
    const [ addOrder, {loading: addingOrder} ] = useMutation(ADD_ORDER);

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
            data.products.rows.forEach(product => {
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

    const addLineFromGrid = product => {
        addLine(product.barcode);
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

    const deleteLine = productId => {
        const newLines = lines.filter(line => line.productId !== productId);
        setLines(newLines);
    };

    const handleOpenCustomer = () => {
        setOpenCustomer(true);
    }

    const handleCloseCustomer = () => {
        setOpenCustomer(false);
    }

    const handlePickCustomer = (selectedCustomer) => {
        setCustomer(selectedCustomer);
        setOpenCustomer(false);
    }

    const handleOpenPayment = () => {
        setOpenPayment(true);
    }

    const handleClosePayment = () => {
        setOpenPayment(false);
    }

    const handleDonePayment = () => {
        setLines([]);
        setTotal(0);
        setTotalTaxes(0);
        setOpenPayment(false);
    }

    const handleScan = barcode => {
        addLine(barcode);
    }

    const handleError = (err) => {
        console.error(err)
    }

    React.useEffect(() => {
        let newTotal = 0;
        let newTotalTaxes = 0;
        lines.forEach(line => {
            newTotal = parseFloat((newTotal + line.total).toFixed(2));
            newTotalTaxes = parseFloat((newTotalTaxes + (line.total * (line.vat/100))).toFixed(2));
        });

        setTotal(newTotal);
        setTotalTaxes(newTotalTaxes);
    }, [lines]);

    return(
        <div className={classes.posContainer}>
            <Bar/>
            <div
                style={{
                    height: 'calc(100% - 64px)',
                    width: '100%'
                }}
            >
                {(loading || loadingCompany) ? 
                        <div
                            style={{
                                display: 'flex',
                                height: '100%',
                                width: '100%'
                            }}
                        >
                            <Loading />
                        </div>
                    :
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
                                <Order 
                                    lines={lines}
                                    total={total}
                                    totalTaxes={totalTaxes}
                                    modifyLine={modifyLine}
                                    deleteLine={deleteLine}
                                    customer={customer}
                                    handlePickCustomer={handlePickCustomer}
                                />

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
                                            <Fab 
                                                variant="extended" 
                                                color="primary" 
                                                className={classes.orderActionBtn} 
                                                disabled={lines.length === 0}
                                                onClick={handleOpenPayment}
                                            >
                                                <i className="fas fa-cash-register" style={{marginRight: '6px'}}></i>
                                                {translations.payment}
                                            </Fab>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                            <ProductsGrid addLine={addLineFromGrid}/>

                            {openCustomer &&
                                <CustomerModal 
                                    open={openCustomer} 
                                    handleClose={handleCloseCustomer} 
                                    handleSelect={handlePickCustomer}
                                    customer={customer}
                                />
                            }

                            {openPayment &&
                                <Payment 
                                    open={openPayment} 
                                    handleClose={handleClosePayment}
                                    handleDone={handleDonePayment}
                                    lines={lines}
                                    total={total}
                                    totalTaxes={totalTaxes}
                                    customer={customer}
                                    company={dataCompany.company}
                                    addOrder={addOrder}
                                    addingOrder={addingOrder}
                                />
                            }
                        </div>
                }
            </div>

            <BarcodeReader
                onError={handleError}
                onScan={handleScan}
            />
        </div>
    )
}

export default POS;