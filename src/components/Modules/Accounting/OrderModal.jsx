import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, TableBody, TableRow, TableCell, makeStyles } from '@material-ui/core';
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import ReactBarcode from 'react-barcode';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { TranslatorContext } from '../../../contextProviders/Translator';
import { PAYMENT_METHODS } from '../../../constants';
import { primary } from '../../../styles/colors';
import { formatDate } from '../../../utils/format';
import Loading from '../../Segments/Loading';
import Ticket from '../../Segments/Ticket';
import { printTicket } from '../../../utils/print';

const ORDER = gql`
	query order($ticketId: String!, $customerId: Int) {
		order(ticketId: $ticketId, customerId: $customerId) {
            id
            ticketId
            total
            customer{
                id
                name
            }
            lines {
                name
                price
                vat
                units 
                total
            }
            paymentMethod
            creationDate
		}
	}
`;

const useStyles = makeStyles(theme => ({
    deleteButton: {
        boxShadow: 'none',
        color: "#FF3232",
        '&:hover': {
            backgroundColor: "rgb(255,50,50,0.1)",
            borderColor: "rgb(255,50,50,0.1)",
            color: "#FF3232",
            boxShadow: 'none',
        },
        '&:active': {
            boxShadow: 'none',
        },
        '&:focus': {
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
        }
    }
}))

const OrderModal = ({open, handleClose, ticketId, company, customerId}) => {
    const classes = useStyles();
	const barcodeRef = React.useRef();
	const { translations } = React.useContext(TranslatorContext);
    const { loading, data } = useQuery(ORDER, {
		fetchPolicy: "network-only",
		variables: {
            ticketId: ticketId,
            customerId: customerId
        }
	});

	React.useEffect(() => {
		if(!!data && !!data.order && !!barcodeRef && !!barcodeRef.current && !!barcodeRef.current.refs && !!barcodeRef.current.refs.renderElement){
			barcodeRef.current.refs.renderElement.setAttribute('width','100%');
		}
	},[data]);

    const handlePrint = () => {
        printTicket();
    }

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
					{translations.invoice}
				</DialogTitle>
				<DialogContent>
                    {loading ? 
							<div
								style={{
									display: "flex",
									height: "100%",
									width: "100%"
								}}
							>
								<Loading />
							</div>
						: 
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
                                        margin: '15px',
                                        backgroundColor: "#EDEFF2",
                                        borderRadius: '6px'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '10px'
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: '12px',
                                                marginBottom: '10px'
                                            }}
                                        >
                                            {translations.simplifiedInvoice}: {data.order.ticketId}
                                        </div>

                                        <div 
                                            style={{
                                                width: '100%', 
                                                maxWidth: 'calc(100% - 10px)', 
                                                maxHeight: '50px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <ReactBarcode 
                                                ref={barcodeRef} 
                                                value={data.order.ticketId} 
                                                format={"CODE128"} 
                                                height={100}
                                                displayValue={false}
                                            />
                                        </div>
                                    </div>
                                
                                    <div
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            padding: '10px'
                                        }}
                                    >
                                        <div style={{width: 'calc(100% - 10px)', display: 'flex', marginBottom: '10px'}}>
                                            {translations.date}: {formatDate(data.order.creationDate)}
                                        </div>

                                        <div style={{width: 'calc(100% - 10px)', display: 'flex', marginBottom: '10px'}}>
                                            {translations.paymentMethod}: {(data.order.paymentMethod === PAYMENT_METHODS.CASH) ? translations.cash : translations.card }
                                        </div>

                                        <div style={{width: 'calc(100% - 10px)', display: 'flex', marginBottom: '10px'}}>
                                            {translations.total}: {data.order.total}€
                                        </div>

                                        {(!!data && !!data.order && !!data.order.customer && !!data.order.customer.name) &&
                                            <div style={{width: 'calc(100% - 10px)', display: 'flex', marginBottom: '10px'}}>
                                                {translations.customer}: {data.order.customer.name}
                                            </div>
                                        }
                                    </div>

                                    <div
                                        style={{
                                            width: 'calc(100% - 10px)',
                                            height: '250px',
                                            maxHeight: '250px',
                                            marginTop: '10px',
                                            marginBottom: '10px'
                                        }}
                                    >
                                        <PerfectScrollbar
                                            style={{ width: "100%" }}
                                        >
                                            <Table stickyHeader aria-label="sticky table" style={{backgroundColor: 'white'}}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>
                                                            {translations.name}
                                                        </TableCell>
                                                        <TableCell
                                                            align="right"
                                                        >
                                                            {translations.price}
                                                        </TableCell>
                                                        <TableCell
                                                            align="right"
                                                        >
                                                            {translations.uts}
                                                        </TableCell>
                                                        <TableCell
                                                            align="right"
                                                        >
                                                            {translations.vat}
                                                        </TableCell>

                                                        <TableCell
                                                            align="right"
                                                        >
                                                            {translations.total}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {data.order.lines.map(line => (
                                                        <TableRow
                                                            hover
                                                            role="checkbox"
                                                            tabIndex={-1}
                                                            key={line.id}
                                                        >
                                                            <TableCell>
                                                                {line.name}
                                                            </TableCell>
                                                            <TableCell
                                                                align="right"
                                                            >
                                                                {line.price}
                                                            </TableCell>
                                                            <TableCell
                                                                align="right"
                                                            >
                                                                {line.units}
                                                            </TableCell>
                                                            <TableCell
                                                                align="right"
                                                            >
                                                                {line.vat}
                                                            </TableCell>

                                                            <TableCell
                                                                align="right"
                                                            >
                                                                {line.total}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </PerfectScrollbar>
                                    </div>
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
                                        onClick={handlePrint}
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
                                        <PerfectScrollbar 
                                            options={{suppressScrollX: true}}
                                        >
                                            <Ticket 
                                                company={company}
                                                order={data.order}
                                            />
                                        </PerfectScrollbar>
                                    </div>		
                                </div>	
                            </div>
                    }
				</DialogContent>
				<DialogActions>
                    <Button onClick={handleClose} color="primary">
                        {translations.accept}
                    </Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default OrderModal;