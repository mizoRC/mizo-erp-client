import React from 'react';
import { Card } from '@material-ui/core';
import CameraIcon from '../../../assets/camera.svg'

const ProductCard = ({product}) => {
    return(
        <Card
            style={{
                display: 'flex',
                flexDirection: 'row'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <img alt="product_image" src={CameraIcon} style={{width: '100px', height: '100px', maxWidth: '100px', maxHeight: '100px'}}/>
            </div>
            <div
                style={{
                    display: 'flex',
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                Datos
            </div>
        </Card>
    )
}

export default ProductCard;