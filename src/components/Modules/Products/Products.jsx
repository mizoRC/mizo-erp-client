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
import AddCategoryModal from './AddCategoryModal';

const useStyles = makeStyles(theme => ({
    ...mainStyles
}));

const PRODUCTS = gql`
    query products {
        products {
            id
            name
            brand
            barcode
            price
            image
            vat
            categoryId
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

const ADD_CATEGORY = gql`
    mutation addCategory($category: CategoryInput!) {
        addCategory(category: $category) {
            id
            name
        }
    }
`;

const Products = () => {
    const classes = useStyles();
    const { translations } = React.useContext(TranslatorContext);
    const [open, setOpen] = React.useState(false);
    const [openCategory, setOpenCategory] = React.useState(false);
    const [product, setProduct] = React.useState({});
    const { loading, data } = useQuery(PRODUCTS, {
        fetchPolicy: "network-only"
    });
    const [ addProduct, {loading: addingProduct} ] = useMutation(ADD_PRODUCT, {
        refetchQueries: [{query: PRODUCTS}],
        awaitRefetchQueries: true
    });
    const [ updateProduct, {loading: updatingProduct} ] = useMutation(UPDATE_PRODUCT, {
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
    const [ addCategory, {loading: savingCategory} ] = useMutation(ADD_CATEGORY, {
        refetchQueries: [{query: CATEGORIES}],
        awaitRefetchQueries: true
    });

    const handleOpen = product => {
        const {__typename, ...selectedProduct} = product;
        setProduct(selectedProduct);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleSave = async(product) => {
        if(!!product.id){
            await updateProduct({variables:{product:product}});
        }
        else{
            await addProduct({variables:{product:product}});
        }
        setOpen(false);
    }

    const handleOpenCategory = () => {
        setOpenCategory(true);
    }

    const handleCloseCategory = () => {
        setOpenCategory(false);
    }

    const handleSaveCategory = async(newCategory) => {
        await addCategory({variables:{category:{name: newCategory}}});
        setOpenCategory(false);
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
                                <ActionsBar 
                                    height={100} 
                                    add={handleOpen} 
                                    addCategory={handleOpenCategory} 
                                    categories={dataCategories.categories}
                                />

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
                                        {data.products.map(product => (
                                            <Grid key={product.id} item xs={12} sm={6} md={3}>
                                                <ProductCard product={product} action={handleOpen}/>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </div>
                            </div>
                        </div>

                        {open &&
                            <AddProductModal 
                                open={open} 
                                handleClose={handleClose} 
                                handleSave={handleSave}
                                adding={addingProduct}
                                updating={updatingProduct}
                                product={product}
                                categories={dataCategories.categories}
                            />
                        }

                        <AddCategoryModal
                            open={openCategory} 
                            handleClose={handleCloseCategory} 
                            handleSave={handleSaveCategory}
                            saving={savingCategory}
                        />
                    </>
            }
        </div>
    )
}

export default Products;