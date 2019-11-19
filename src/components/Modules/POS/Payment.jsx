import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, MenuItem, Card, Tooltip, CircularProgress, InputAdornment, Typography, makeStyles } from '@material-ui/core';
import { TranslatorContext } from '../../../contextProviders/Translator';
import * as mainStyles from '../../../styles';
import { primary } from '../../../styles/colors';

const useStyles = makeStyles(theme => ({
    ...mainStyles
}));

const Payment = ({open, handleClose, handleDone, lines, total, customer}) => {
    const classes = useStyles();
	const { translations } = React.useContext(TranslatorContext);

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
				<DialogContent>
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
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
                                backgroundColor: 'red',
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
                                    marginRight: '30px'
                                }}
                            >
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                >
                                    <i className="far fa-money-bill-alt" style={{marginRight: '10px'}}></i>
                                    {translations.cash}
                                </Button>   

                                <Button 
                                    variant="contained" 
                                    color="primary"
                                >
                                    <i className="far fa-credit-card" style={{marginRight: '10px'}}></i>
                                    {translations.card}
                                </Button>
                            </div>

                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    padding: '10px'
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
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    padding: '10px'
                                }}
                            >
                                <div>
                                    <Typography variant="h5">{translations.delivered}</Typography>
                                </div>

                                <div>
                                    <Typography variant="h5">0</Typography>
                                </div>
                            </div>

                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    padding: '10px'
                                }}
                            >
                                <div>
                                    <Typography variant="h5">{translations.exchange}</Typography>
                                </div>

                                <div>
                                    <Typography variant="h5">{total}€</Typography>
                                </div>
                            </div>

                            <div
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '10px'
                                }}
                            >
                                <div>
                                    <i className="fas fa-user" style={{marginRight: '6px'}}></i>
                                    {translations.customer}
                                    PEDRIN SAKFASF GSAGSAG
                                </div>
                            </div>
                            CUENTAS
                        </div>

                        <div
                            style={{
                                width: '50%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderLeft: `1px dashed ${primary}`,
                                padding: '10px'
                            }}
                        >
                            <Button 
                                variant="contained" 
                                color="primary"
                                style={{marginBottom: '10px', width: '330px'}}
                            >
                                <i className="fas fa-print" style={{marginRight: '10px'}}></i>
                                {translations.printTicket}
                            </Button>
                            <div
                                style={{
                                    width: '330px',
                                    minWidth: '330px',
                                    maxWidth: '330px',
                                    height: '550px',
                                    minHeight: '550px',
                                    maxHeight: '550px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid #C8CED8'
                                }}
                            >
                                TICKET
                            </div>		
                        </div>	
                    </div>
				</DialogContent>
				<DialogActions>
                    <Button onClick={handleClose} color="default">
                        {translations.cancel}
                    </Button>

                    <Button onClick={handleDone} color="primary">
                        <div
                            style={{
                                display: 'flex',
                                flexDirection:' row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {translations.save}
                        </div>
                    </Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default Payment;