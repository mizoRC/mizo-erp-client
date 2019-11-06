import React from 'react';
import { makeStyles } from '@material-ui/core';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { TranslatorContext } from '../../../contextProviders/Translator';
//import { MeContext } from '../../../contextProviders/Me';
import * as mainStyles from '../../../styles';
import Bar from '../../Segments/Bar';
import Loading from '../../Segments/Loading';
import Table from '../../Segments/Table';
import { ROLES } from '../../../constants';

const useStyles = makeStyles(theme => ({
    ...mainStyles
}));

const EMPLOYEES = gql`
    query employees {
        employees {
            id
            name
            surname
            email
            language
            role
            password
        }
    }
`;

const ADD_EMPLOYEE = gql`
    mutation addEmployee($employee: EmployeeInput!) {
        addEmployee(employee: $employee) {
            id
            name
            surname
            email
            language
            role
            password
        }
    }
`;

/* const mockData = [
    { name: 'Mehmet', surname: 'Baran', email: 'mehmet@gmail.com', language: 2, role: ROLES.MANAGER },
    { name: 'Zerya Betül', surname: 'Baran', email: 'zerya@gmail.com', language: 1,  role: ROLES.SELLER },
] */

const Employees = () => {
    const classes = useStyles();
    const { translations } = React.useContext(TranslatorContext);
    // const { me } = React.useContext(MeContext);
    const { loading, data } = useQuery(EMPLOYEES, {
        fetchPolicy: "network-only"
    });
    const [ addEmployee, { loading: addEmployeeLoading, error: addEmployeeError }] = useMutation(ADD_EMPLOYEE, {
        refetchQueries: [{query: EMPLOYEES}],
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
                                title={translations.employees}
                                columns={[
                                    { title: translations.name, field: 'name' },
                                    { title: translations.surname, field: 'surname' },
                                    { title: translations.email, field: 'email' },
                                    {
                                        title: translations.language,
                                        field: 'language',
                                        lookup: { 'es': 'Español', 'en': 'English' },
                                    },
                                    {
                                        title: translations.role,
                                        field: 'role',
                                        lookup: { 
                                            [ROLES.MANAGER]: translations.manager, 
                                            [ROLES.SELLER]: translations.seller, 
                                            [ROLES.TECHNICIAN]: translations.technician
                                        }
                                    },
                                    { title: translations.password, field: 'password', editable: 'never', cellStyle: {maxWidth: '50px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'} }
                                ]}
                                data={data.employees} 
                                editable={{
                                    onRowAdd: async(newData) => {
                                        if(newData.name && newData.surname && newData.email && newData.language && newData.role){
                                            console.info('NEW DATA', newData);
                                            await addEmployee({ variables: { employee:newData } });
                                            return;
                                        }
                                        else{
                                            alert('Empleado no creado. Es necesario cubrir todos los campos para poder crearlo.');
                                        }
                                    },
                                    onRowUpdate: async(newData, oldData) => {
                                        return;
                                    },
                                    onRowDelete: async(oldData) => {
                                        return;
                                    }
                                }}
                            />
                        </div>
                    </>
            }
        </div>
    )
}

export default Employees;