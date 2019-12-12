import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, OutlinedInput, FormControl, Button, CircularProgress, InputAdornment, Typography, makeStyles } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ToastContainer, toast } from 'react-toastify';
import { v4 } from 'uuid';
import { TranslatorContext } from '../../../contextProviders/Translator';
import * as mainStyles from '../../../styles';
import { primary } from '../../../styles/colors';
import { PAYMENT_METHODS } from '../../../constants';
import Ticket from '../../Segments/Ticket';
import { printTicket } from '../../../utils/print';

const useStyles = makeStyles(theme => ({
    ...mainStyles,
    input: {
        maxWidth: '120px'
    }
}));

const Payment = ({open, handleClose, handleDone, lines, total, totalTaxes, customer, company, addOrder, addingOrder}) => {
    const classes = useStyles();
	const { translations } = React.useContext(TranslatorContext);
    const [order] = React.useState({
        ticketId: v4(),
        total: total,
        totalTaxes: totalTaxes,
        lines: lines
    });
    const [paymentMethod, setPaymentMethod] = React.useState(PAYMENT_METHODS.CASH);
    const [delivered, setDelivered] = React.useState(total);
    const [errorEmptyDelivered, setErrorEmptyDelivered] = React.useState(false);
    const [exchange, setExchange] = React.useState(0);
    const [printed, setPrinted] = React.useState(false);

    const handleChangePaymentCash = () => {
        setPaymentMethod(PAYMENT_METHODS.CASH);
    }

    const handleChangePaymentCreditCard = () => {
        setDelivered(total);
        setPaymentMethod(PAYMENT_METHODS.CREDIT_CARD);
    }

    const handleChangeDelivered = event => {
        const hasError = (event.target.value === "" || !event.target.value) ? true : false;
        setErrorEmptyDelivered(hasError);
        setDelivered(event.target.value);
    }

    const saveOrder = async() => {
        try {
            const { totalTaxes, ...currentOrder } = order;
            let newOrder;
            if(customer && !!customer.id){
                newOrder = {
                    ...currentOrder,
                    paymentMethod: paymentMethod,
                    customerId: customer.id
                }
            }
            else{
                newOrder = {
                    ...currentOrder,
                    paymentMethod: paymentMethod
                }
            }
            await addOrder({variables:{order:newOrder}});
            return;
        } catch (error) {
            const message = `
                ${translations.errorSavingSaleMessage} ${error}
            `;
            toast.error(message, {
                position: "top-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            throw error;
        }
    }

    const handleSaveOrder = async() => {
        await saveOrder();
        handleDone();
    }

    const handlePrint = () => {
        setPrinted(true);
        printTicket();
    }

    React.useEffect(() => {
        const newExchangeCalc = parseFloat((delivered - total).toFixed(2));
        const newExchange = (newExchangeCalc >= 0) ? newExchangeCalc : 0;
        setExchange(newExchange);
    },[delivered]);

    React.useEffect(() => {
        setPrinted(false);
    }, [open]);

	return (
		<div>
			<Dialog 
				open={open} 
				onClose={handleClose}
				disableBackdropClick={true}
				disableEscapeKeyDown={true}
				fullWidth={true}
				maxWidth="md"
			>
				<DialogTitle style={{textAlign: 'center'}}>
					{translations.payment}
				</DialogTitle>
				<DialogContent
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflowY: 'hidden'
                    }}
                >
                    <div
                        style={{
                            width: '50%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '15px',
                            backgroundColor: "#EDEFF2",
                            borderRadius: '6px'
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                padding: '10px',
                                marginTop: '20px'
                            }}
                        >
                            <Button 
                                variant="contained" 
                                onClick={handleChangePaymentCash}
                                color={(paymentMethod === PAYMENT_METHODS.CASH) ? "primary" : "default"}
                            >
                                <i className="far fa-money-bill-alt" style={{marginRight: '10px'}}></i>
                                {translations.cash}
                            </Button>   

                            <Button 
                                variant="contained" 
                                onClick={handleChangePaymentCreditCard}
                                color={(paymentMethod === PAYMENT_METHODS.CREDIT_CARD) ? "primary" : "default"}
                            >
                                <i className="far fa-credit-card" style={{marginRight: '10px'}}></i>
                                {translations.card}
                            </Button>
                        </div>

                        <div
                            style={{
                                width: 'calc(100% - 100px)',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px',
                                marginTop: '20px'
                            }}
                        >
                            <div>
                                <Typography variant="h5">{translations.total}</Typography>
                            </div>

                            <div>
                                <Typography variant="h5">{total}€</Typography>
                            </div>
                        </div>

                        <div
                            style={{
                                width: 'calc(100% - 100px)',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px',
                                marginTop: '20px'
                            }}
                        >
                            <div>
                                <Typography variant="h5">{translations.delivered}</Typography>
                            </div>

                            {(paymentMethod === PAYMENT_METHODS.CREDIT_CARD) ?
                                <div>
                                    <Typography variant="h5">{delivered}€</Typography>
                                </div>
                                :
                                <div>
                                    <FormControl 
                                        className={classes.input} 
                                        variant="outlined"
                                        disabled={paymentMethod === PAYMENT_METHODS.CREDIT_CARD}
                                    >
                                        <OutlinedInput
                                            id="input_delivered"
                                            value={delivered}
                                            onChange={handleChangeDelivered}
                                            error={errorEmptyDelivered}
                                            margin="dense"
                                            type="number" 
                                            inputProps={{ min: total, step: "0.01" }}
                                            endAdornment={<InputAdornment position="end">€</InputAdornment>}
                                            labelWidth={0}
                                        />
                                    </FormControl>
                                </div>
                            }
                        </div>

                        <div
                            style={{
                                width: 'calc(100% - 100px)',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px',
                                marginTop: '20px'
                            }}
                        >
                            <div>
                                <Typography variant="h5">{translations.exchange}</Typography>
                            </div>

                            <div>
                                <Typography variant="h5">{exchange}€</Typography>
                            </div>
                        </div>

                        {customer &&
                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '10px',
                                    marginTop: '40px'
                                }}
                            >
                                <div>
                                    <i className="fas fa-user" style={{marginRight: '6px'}}></i>
                                    {translations.customer}:
                                </div>
                                <div style={{marginTop: '10px'}}>
                                    {customer.name}
                                </div>                                
                            </div>
                        }
                    </div>

                    <div
                        style={{
                            width: '50%',
                            height: '400px',
                            maxHeight: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderLeft: `1px dashed ${primary}`,
                            padding: '10px'
                        }}
                    >
                        <div
                            style={{
                                height: '46px',
                                 width: '330px',
                                marginBottom: '10px'
                            }}
                        >
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={handlePrint}
                                fullWidth={true}
                            >
                                <i className="fas fa-print" style={{marginRight: '10px'}}></i>
                                {translations.printTicket}
                            </Button>
                        </div>
                        <div
                            style={{
                                width: '330px',
                                minWidth: '330px',
                                maxWidth: '330px',
                                height: 'calc(100% - 46px)',
                                maxHeight: '400px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #C8CED8'
                            }}
                        >
                            <PerfectScrollbar 
                                options={{suppressScrollX: true}}
                            >
                                <Ticket 
                                    company={company}
                                    order={order}
                                />
                            </PerfectScrollbar>
                        </div>		
                    </div>	
				</DialogContent>
				<DialogActions>
                    <Button onClick={handleClose} color="default" disabled={printed || addingOrder}>
                        {translations.cancel}
                    </Button>

                    <Button onClick={handleSaveOrder} color="primary" disabled={addingOrder}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection:' row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {translations.save}
                            {addingOrder &&
                                <div style={{marginLeft: '6px', display: 'flex', alignItems: 'center'}}>
                                    <CircularProgress size={20} color="secondary" />
                                </div>
                            }
                        </div>
                    </Button>
				</DialogActions>
			</Dialog>
            <ToastContainer/>
		</div>
	);
}

export default Payment;