import React from 'react';
import { makeStyles } from '@material-ui/core';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import BarcodeReader from 'react-barcode-reader';
import * as mainStyles from '../../../styles';
import Loading from '../../Segments/Loading';
import Bar from '../../Segments/Bar';
import Order from './Order';
import ProductsGrid from './ProductsGrid';

const useStyles = makeStyles(theme => ({
    ...mainStyles,
    posContainer: {
        height: "100%",
        width: "100%",
        backgroundColor: "#C8CED8"
    },
    inputs: {
        maxWidth: '40%'
    }
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
                vat
            }
            count
        }
    }
`;

const POS = () => {
    const classes = useStyles();
    const [reading, setReading] = React.useState({});
    const { loading, data } = useQuery(PRODUCTS, {
        variables: {
            filters: [
                {
                    field: 'search',
                    value: ''
                }
            ],
            options: {
                limit: 0,
                offset: 0
            }
        }
    });

    const handleScan = (data) => {
        const newReading = {
            barcode: data,
            time: (new Date()).getTime()
        }
        setReading(newReading);
    }

    const handleError = (err) => {
        console.error(err)
    }

    return(
        <div className={classes.posContainer}>
            <Bar/>
            <div
                style={{
                    height: 'calc(100% - 64px)',
                    width: '100%'
                }}
            >
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
                        <div
                            style={{
                                height: '100%',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row'
                            }}
                        >
                            <Order products={data.products.rows} newReading={reading}/>
                            <ProductsGrid />
                        </div>
                }
            </div>

            <BarcodeReader
                onError={handleError}
                onScan={handleScan}
            />
        </div>
    )
}

export default POS;