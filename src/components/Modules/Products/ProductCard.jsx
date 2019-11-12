import React from 'react';
import { Card, CardActionArea, Typography, Divider } from '@material-ui/core';
import { TranslatorContext } from '../../../contextProviders/Translator';
import ReactBarcode from 'react-barcode';
import CameraIcon from '../../../assets/camera.svg';

const ProductCard = ({product, action}) => {
    const barcodeRef = React.useRef();
    const { translations } = React.useContext(TranslatorContext);
    const [barcode] = React.useState(product.barcode);

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
                        <img alt="product_image" src={(!!product && !!product.image) ? product.image : CameraIcon} style={{width: '100%', height: '100%'}}/>
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
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: '15px'
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection:'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start'
                        }}
                    >
                        <div style={{width: '100%'}}>
                            <Typography variant="subtitle1">
                                {translations.name}: 
                            </Typography>
                        </div>
                        <div style={{width: '100%'}}>
                            <Typography variant="subtitle2">
                                {product.name}
                            </Typography>
                        </div>
                    </div>

                    <Divider style={{width: '98%'}}/>

                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection:'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start'
                        }}
                    >
                        <div style={{width: '100%'}}>
                            <Typography variant="subtitle1">
                                {translations.brand}: 
                            </Typography>
                        </div>
                        <div style={{width: '100%'}}>
                            <Typography variant="subtitle2">
                                {product.brand}
                            </Typography>
                        </div>
                    </div>

                    <Divider style={{width: '98%'}}/>

                    {/* <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection:'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start'
                        }}
                    >
                        <div style={{width: '100%'}}>
                            <Typography variant="subtitle1">
                                {translations.barcodeAbbr}: 
                            </Typography>
                        </div>

                        <div style={{width: '100%'}}>
                            <Typography variant="subtitle2">
                                {product.barcode}
                            </Typography>
                        </div>
                    </div>

                    <Divider style={{width: '98%'}}/> */}

                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection:'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start'
                        }}
                    >
                        <div
                            style={{
                                width: '50%',
                                display: 'flex',
                                flexDirection:'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                            }}
                        >
                            <Typography variant="subtitle1">
                                {translations.price}: 
                            </Typography>
                            <Typography variant="subtitle2" style={{marginLeft: '8px'}}>
                                {product.price}€
                            </Typography>
                        </div>

                        <div
                            style={{
                                width: '50%',
                                display: 'flex',
                                flexDirection:'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
                            }}
                        >
                            <Typography variant="subtitle1">
                                {translations.vat}: 
                            </Typography>
                            <Typography variant="subtitle2" style={{marginLeft: '8px'}}>
                                {product.vat}%
                            </Typography>
                        </div>
                    </div>
                </div>
            </CardActionArea>
        </Card>
    )
}

export default ProductCard;