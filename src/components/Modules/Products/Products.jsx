import React from 'react';
import { makeStyles, Paper, Grid } from '@material-ui/core';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { TranslatorContext } from '../../../contextProviders/Translator';
import * as mainStyles from '../../../styles';
import Bar from '../../Segments/Bar';
import Loading from '../../Segments/Loading';
import ProductCard from './ProductCard';

const useStyles = makeStyles(theme => ({
    ...mainStyles
}));

const PRODUCTS = gql`
    query products {
        products {
            id
            name
            barcode
            price
            image
            vat
            category{
                id
                name
                translationTag
                companyId
            }
        }
    }
`;

const ADD_PRODUCT = gql`
    mutation addProduct($product: ProductInput!) {
        addProduct(product: $product) {
            id
            barcode
        }
    }
`;

const UPDATE_PRODUCT = gql`
    mutation updateProduct($product: ProductInputUpdate!) {
        updateProduct(product: $product) {
            id
            barcode
        }
    }
`;

const UNSUBSCRIBE_PRODUCT = gql`
    mutation unsubscribeProduct($productId: Int!) {
        unsubscribeProduct(productId: $productId) {
            id
            barcode
        }
    }
`;

const Products = () => {
    const classes = useStyles();
    const { translations } = React.useContext(TranslatorContext);
    const { loading, data } = useQuery(PRODUCTS, {
        fetchPolicy: "network-only"
    });
    const [ addProduct] = useMutation(ADD_PRODUCT, {
        refetchQueries: [{query: PRODUCTS}],
        awaitRefetchQueries: true
    });
    const [ updateProduct] = useMutation(UPDATE_PRODUCT, {
        refetchQueries: [{query: PRODUCTS}],
        awaitRefetchQueries: true
    });
    const [ unsubscribeProduct] = useMutation(UNSUBSCRIBE_PRODUCT, {
        refetchQueries: [{query: PRODUCTS}],
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
                                height: 'calc(100% - 84px)',
                                width: 'calc(100% - 20px)',
                                padding: '10px 10px 10px 10px'
                            }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <Paper
                                    style={{
                                        height: '150px',
                                        width: '100%',
                                        display: 'flex'
                                    }}
                                >
                                    Header
                                </Paper>

                                <div
                                    style={{
                                        height: 'calc(100% - 180px)',
                                        width: '100%',
                                        display: 'flex',
                                        marginTop: '30px'
                                    }}
                                >
                                    <Grid container className={classes.root} spacing={1}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <ProductCard />
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={3}>
                                            <ProductCard />
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </div>
    )
}

export default Products;