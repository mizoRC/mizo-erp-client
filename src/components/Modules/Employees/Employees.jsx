import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography, makeStyles } from '@material-ui/core';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import MaterialTable from 'material-table';
import { TranslatorContext } from '../../../contextProviders/Translator';
import { MeContext } from '../../../contextProviders/Me';
import * as mainStyles from '../../../styles';
import Bar from '../../Segments/Bar';
import Loading from '../../Segments/Loading';
import Table from '../../Segments/Table';
import { ROLES } from '../../../constants';

const useStyles = makeStyles(theme => ({
    ...mainStyles,
    cardSlim: {
        width: '200px', 
        height: '200px'
    },
    cardXL: {
        width: '300px', 
        height: '300px'
    },
    cardSlimImg: {
        width: '100px', 
        height: '100px'
    },
    cardXLImg: {
        width: '200px', 
        height: '200px'
    }
}));

const Employees = () => {
    const classes = useStyles();
    const { translations } = React.useContext(TranslatorContext);
    const { me } = React.useContext(MeContext);
    const loading = false;
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
                                        lookup: { 1: 'Español', 2: 'English' },
                                    },
                                    {
                                        title: "Rol",
                                        field: 'role',
                                        lookup: { 
                                            [ROLES.MANAGER]: 'Manager', 
                                            [ROLES.SELLER]: 'Vendedor', 
                                            [ROLES.TECHNICIAN]: 'Técnico'
                                        }
                                    },
                                ]}
                                data={[
                                    { name: 'Mehmet', surname: 'Baran', email: 'mehmet@gmail.com', language: 2, role: ROLES.MANAGER },
                                    { name: 'Zerya Betül', surname: 'Baran', email: 'zerya@gmail.com', language: 1,  role: ROLES.SELLER },
                                ]} 
                                editable={{
                                    onRowAdd: async(newData) => {
                                        return;
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