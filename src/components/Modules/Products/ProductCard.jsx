import React from 'react';
import { Card, CardActionArea } from '@material-ui/core';
import ReactBarcode from 'react-barcode';
import CameraIcon from '../../../assets/camera.svg';

const ProductCard = ({product, action}) => {
    const barcodeRef = React.useRef();
    const [barcode] = React.useState("8480000783912");

    React.useEffect(() => {
		if(!!barcodeRef && !!barcodeRef.current && !!barcodeRef.current.refs && !!barcodeRef.current.refs.renderElement){
			barcodeRef.current.refs.renderElement.setAttribute('width','100%');
            barcodeRef.current.refs.renderElement.setAttribute('height','40px');
		}
	},[barcode]);

    return(
        <Card
            style={{
                display: 'flex',
                flexDirection: 'row'
            }}
        >
            <CardActionArea onClick={() => {action(product)}} style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'row'}}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            width: '120px', 
                            height: '120px', 
                            maxWidth: '120px', 
                            maxHeight: '120px'
                        }}
                    >
                        <img alt="product_image" src={CameraIcon} style={{width: '100%', height: '100%'}}/>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            width: '120px', 
                            maxWidth: '120px',
                            height: '40px',
                            maxHeight: '40px'
                        }}
                    >
                        <ReactBarcode 
                            ref={barcodeRef} 
                            value={barcode} 
                            format={"EAN13"} 
                            height={40}
                        />
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        Name: Test
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        Barcode: 8480000783912
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        Price: 12
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        VAT: 21
                    </div>
                </div>
            </CardActionArea>
        </Card>
    )
}

export default ProductCard;