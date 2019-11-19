import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, MenuItem, Card, CardActionArea, Tooltip, CircularProgress, InputAdornment, makeStyles } from '@material-ui/core';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { TranslatorContext } from '../../../contextProviders/Translator';
import Loading from '../../Segments/Loading';
import Table from '../../Segments/Table';

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
}));

const CUSTOMERS = gql`
    query customers {
        customers {
            id
            name
            phone
            email
            address
        }
    }
`;

const CustomerModal = ({open, handleClose, handleSelect, customer: currentCustomer}) => {
    const classes = useStyles();
	const { translations } = React.useContext(TranslatorContext);
    const { loading, data } = useQuery(CUSTOMERS, {
        fetchPolicy: "network-only"
    });
	const [customer, setCustomer] = React.useState(currentCustomer);

    const pickCustomer = (event, pick) => {
        setCustomer(pick);
    }

    const agree = () => {
        handleSelect(customer);
    }

    const deleteCustomer = () => {
        setCustomer();
        handleSelect();
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
					{translations.customer}
				</DialogTitle>
				<DialogContent>
                    {loading ? 
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
                            <Table
                                title={''}
                                columns={[
                                    { title: translations.name, field: 'name' },
                                    { title: translations.phone, field: 'phone' },
                                    { title: translations.email, field: 'email' },
                                    { title: translations.address, field: 'address' }
                                ]}
                                data={data.customers}
                                onRowClick={pickCustomer}
                                options={{
                                    rowStyle: rowData => ({
                                        backgroundColor:
                                            (!!customer && rowData.id === customer.id)
                                                ? '#C8CED8'
                                                : null,
                                        color: 
                                            (!!customer && rowData.id === customer.id)
                                                ? 'white'
                                                : 'inherit',
                                    })
                                }}
                            />
                    }					
				</DialogContent>
				<DialogActions>
                    <Button onClick={deleteCustomer} disabled={loading} className={classes.deleteButton}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection:' row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {translations.delete}
                        </div>
                    </Button>

                    <Button onClick={handleClose} disabled={loading} color="default">
                        {translations.cancel}
                    </Button>

                    <Button onClick={agree} disabled={loading} color="primary">
                        <div
                            style={{
                                display: 'flex',
                                flexDirection:' row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {translations.agree}
                        </div>
                    </Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default CustomerModal;