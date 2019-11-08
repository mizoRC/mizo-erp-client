import React from 'react';
import { makeStyles } from '@material-ui/core';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { TranslatorContext } from '../../../contextProviders/Translator';
import * as mainStyles from '../../../styles';
import Bar from '../../Segments/Bar';
import Loading from '../../Segments/Loading';
import Table from '../../Segments/Table';

const useStyles = makeStyles(theme => ({
    ...mainStyles
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

const ADD_CUSTOMER = gql`
    mutation addCustomer($customer: CustomerInput!) {
        addCustomer(customer: $customer) {
            id
            name
            phone
            email
            address
        }
    }
`;

const UPDATE_CUSTOMER = gql`
    mutation updateCustomer($customer: CustomerInputUpdate!) {
        updateCustomer(customer: $customer) {
            id
            name
            phone
            email
            address
        }
    }
`;

const UNSUBSCRIBE_CUSTOMER = gql`
    mutation unsubscribeCustomer($customerId: Int!) {
        unsubscribeCustomer(customerId: $customerId) {
            id
            name
            phone
            email
            address
        }
    }
`;


const Customers = () => {
    const classes = useStyles();
    const { translations } = React.useContext(TranslatorContext);
    const { loading, data } = useQuery(CUSTOMERS, {
        fetchPolicy: "network-only"
    });
    const [ addCustomer] = useMutation(ADD_CUSTOMER, {
        refetchQueries: [{query: CUSTOMERS}],
        awaitRefetchQueries: true
    });
    const [ updateCustomer] = useMutation(UPDATE_CUSTOMER, {
        refetchQueries: [{query: CUSTOMERS}],
        awaitRefetchQueries: true
    });
    const [ unsubscribeCustomer] = useMutation(UNSUBSCRIBE_CUSTOMER, {
        refetchQueries: [{query: CUSTOMERS}],
        awaitRefetchQueries: true
    });

    return(
        <div className={classes.containerBG}>
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
                    <>
                        <Bar/>
                        <div
                            style={{
                                height: '100%',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Table
                                title={translations.customers}
                                columns={[
                                    { title: translations.name, field: 'name' },
                                    { title: translations.phone, field: 'phone' },
                                    { title: translations.email, field: 'email' },
                                    { title: translations.address, field: 'address' }
                                ]}
                                data={data.customers} 
                                editable={{
                                    onRowAdd: async(newData) => {
                                        if(newData.name && newData.phone){
                                            await addCustomer({ variables: { customer:newData } });
                                            return;
                                        }
                                        else{
                                            alert(translations.customerNotCreatedNecessaryCoverAllFields);
                                        }
                                    },
                                    onRowUpdate: async(newData) => {
                                        if(newData.name && newData.phone){
                                            const {__typename, ...newCustomer} = newData;
                                            await updateCustomer({ variables: { customer:newCustomer } });
                                            return;
                                        }
                                        else{
                                            alert(translations.customerNotCreatedNecessaryCoverAllFields);
                                        }
                                    },
                                    onRowDelete: async(oldData) => {
                                        if(oldData.id){
                                            await unsubscribeCustomer({ variables: { customerId:oldData.id } });
                                            return;
                                        }
                                    }
                                }}
                            />
                        </div>
                    </>
            }
        </div>
    )
}

export default Customers;