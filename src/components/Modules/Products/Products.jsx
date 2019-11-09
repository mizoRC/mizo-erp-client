import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { TranslatorContext } from '../../../contextProviders/Translator';
import * as mainStyles from '../../../styles';
import Bar from '../../Segments/Bar';
import Loading from '../../Segments/Loading';
import ActionsBar from './ActionsBar';
import ProductCard from './ProductCard';
import AddProductModal from './AddProductModal';

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

const CATEGORIES = gql`
    query categories {
        categories{
            id
            name
        }
    }
`;

const Products = () => {
    const classes = useStyles();
    const { translations } = React.useContext(TranslatorContext);
    const [open, setOpen] = React.useState(false);
    const { loading, data } = useQuery(PRODUCTS, {
        fetchPolicy: "network-only"
    });
    const [ addProduct ] = useMutation(ADD_PRODUCT, {
        refetchQueries: [{query: PRODUCTS}],
        awaitRefetchQueries: true
    });
    const [ updateProduct ] = useMutation(UPDATE_PRODUCT, {
        refetchQueries: [{query: PRODUCTS}],
        awaitRefetchQueries: true
    });
    const [ unsubscribeProduct ] = useMutation(UNSUBSCRIBE_PRODUCT, {
        refetchQueries: [{query: PRODUCTS}],
        awaitRefetchQueries: true
    });
    const { loading: loadingCategories, data: dataCategories } = useQuery(CATEGORIES, {
        fetchPolicy: "network-only"
    });

    const handleOpen = product => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleSave = () => {
        setOpen(false);
    }

    return(
        <div className={classes.containerBG}>
            {(loading || loadingCategories) ? 
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
                                <ActionsBar height={100} add={handleOpen} categories={dataCategories.categories}/>

                                <div
                                    style={{
                                        height: 'calc(100% - 150px)',
                                        width: 'calc(100% - 20px)',
                                        display: 'flex',
                                        marginTop: '30px',
                                        padding: '10px',
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        borderRadius: '6px'
                                    }}
                                >
                                    <Grid container spacing={1} style={{overflowY: 'auto'}}>
                                        {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map(item => (
                                            <Grid item xs={12} sm={6} md={3}>
                                                <ProductCard action={handleOpen}/>
                                            </Grid>
                                        ))}

                                        {data.products.map(product => (
                                            <Grid item xs={12} sm={6} md={3}>
                                                <ProductCard product={product} action={handleOpen}/>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </div>
                            </div>
                        </div>
                        <AddProductModal 
                            open={open} 
                            handleClose={handleClose} 
                            handleSave={handleSave}
                            product={{}}
                            categories={dataCategories.categories}
                        />
                    </>
            }
        </div>
    )
}

export default Products;