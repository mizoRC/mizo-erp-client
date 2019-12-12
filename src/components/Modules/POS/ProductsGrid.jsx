import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { TranslatorContext } from '../../../contextProviders/Translator';
import * as mainStyles from '../../../styles';
import Loading from '../../Segments/Loading';
import ProductsActionsBar from './ProductsActionsBar';
import ProductCard from '../Products/ProductCard';
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

const CATEGORIES = gql`
    query categories {
        categories{
            id
            name
        }
    }
`;

const ProductsGrid = ({addLine}) => {
    const classes = useStyles();
    const { translations } = React.useContext(TranslatorContext);
    const [filters, setFilters] = React.useState(defaultFilters);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const { loading, data, refetch, fetchMore } = useQuery(PRODUCTS, {
        fetchPolicy: "network-only",
        variables: filters
    });
    const { loading: loadingCategories, data: dataCategories } = useQuery(CATEGORIES, {
        fetchPolicy: "network-only"
    });

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
        <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '10px'
            }}
        >
            <ProductsActionsBar 
                height={100} 
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
                                    <Grid key={product.id} item xs={12} sm={6} md={6} lg={6} xl={4}>
                                        <ProductCard product={product} action={addLine}/>
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
    )
}

export default ProductsGrid;