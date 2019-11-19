import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { TranslatorContext } from '../../../contextProviders/Translator';
import * as mainStyles from '../../../styles';
import Bar from '../../Segments/Bar';
import Loading from '../../Segments/Loading';
import ActionsBar from './ActionsBar';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import AddCategoryModal from './AddCategoryModal';
import loadingWhiteSVG from '../../../assets/loading_white.svg';
const limit = 16;

const defaultFilters = {
    filters: [
        {
            field: 'search',
            value: ''
        }
    ],
    options: {
        limit: limit,
        offset: 0
    }
}

const useStyles = makeStyles(theme => ({
    ...mainStyles
}));

const PRODUCTS = gql`
    query products($filters: [Filter]!, $options: Options!) {
        products(filters: $filters, options: $options) {
            rows{
                id
                name
                brand
                barcode
                price
                image
                vat
                categoryId
            }
            count
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
    const [filters, setFilters] = React.useState(defaultFilters);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const { loading, data, refetch, fetchMore } = useQuery(PRODUCTS, {
        fetchPolicy: "network-only",
        variables: filters
    });
    const [ addProduct, {loading: addingProduct} ] = useMutation(ADD_PRODUCT, {
        refetchQueries: [{query: PRODUCTS, variables: filters}],
        awaitRefetchQueries: true
    });
    const [ updateProduct, {loading: updatingProduct} ] = useMutation(UPDATE_PRODUCT, {
        refetchQueries: [{query: PRODUCTS, variables: filters}],
        awaitRefetchQueries: true
    });
    const [ unsubscribeProduct, {loading: unsubscribingProduct} ] = useMutation(UNSUBSCRIBE_PRODUCT, {
        refetchQueries: [{query: PRODUCTS, variables: filters}],
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

    const handleUnsubscribe = async(id) => {
        if(!!id) await unsubscribeProduct({variables:{productId:id}});
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

    const handleChangeFilters = (newFilters) => {
        try {
            setFilters(newFilters);
            if(!!refetch) refetch(newFilters);
        } catch (error) {
            console.warn(error);
        }
    }

    const onScrollYReachEnd = () => {
        if((data.products.rows.length < data.products.count) && !loadingMore){
            loadMore();
        }
    };

    const loadMore = async () => {
        setLoadingMore(true);
        await fetchMore({
			variables: {
				options: {
					offset: data.products.rows.length,
					limit: limit
				}
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!fetchMoreResult) {
					return prev;
				}
				return {
					...prev,
					products:{
                        ...prev.products,
                        rows: [
                            ...prev.products.rows,
                            ...fetchMoreResult.products.rows
                        ],
                        count: fetchMoreResult.products.count
                    } 
				};
			}
		});
        setLoadingMore(false);
    }

    return(
        <div className={classes.containerBG}>
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
                        categories={(!!dataCategories && !!dataCategories.categories) ? dataCategories.categories : []}
                        handleChangeFilters={handleChangeFilters}
                        loading={loading}
                    />

                    <div
                        style={{
                            height: '30px',
                            minHeight: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}
                    >
                        {(!loading && !loadingCategories) &&
                            <> {translations.showing} {data.products.rows.length} {translations.of} {data.products.count} </>
                        }
                    </div>

                    <div
                        style={{
                            height: 'calc(100% - 150px)',
                            width: 'calc(100% - 20px)',
                            display: 'flex',
                            padding: '10px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: '6px'
                        }}
                    >
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
                                <PerfectScrollbar onYReachEnd={onScrollYReachEnd} style={{width: '100%'}}>
                                    <Grid container spacing={1} style={{margin: '0px', width: '100%'}}>
                                        {data.products.rows.map(product => (
                                            <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
                                                <ProductCard product={product} action={handleOpen}/>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    {loadingMore && 
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginTop: '5px'
                                            }}
                                        >
                                            <img src={loadingWhiteSVG} alt="loadingIcon" style={{maxWidth: "80px"}}/>
                                        </div>
                                    }
                                </PerfectScrollbar>
                        }
                    </div>
                </div>
            </div>

            {open &&
                <ProductModal 
                    open={open} 
                    handleClose={handleClose} 
                    handleSave={handleSave}
                    handleUnsubscribe={handleUnsubscribe}
                    adding={addingProduct}
                    updating={updatingProduct}
                    unsubscribing={unsubscribingProduct}
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
        </div>
    )
}

export default Products;