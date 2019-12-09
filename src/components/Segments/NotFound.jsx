import React from 'react';
import { Typography } from '@material-ui/core';
import { TranslatorContext } from '../../contextProviders/Translator';
import NotFoundImg from '../../assets/notFound.svg';
import { primary } from '../../styles/colors';

const NotFound = () => {
    const { translations } = React.useContext(TranslatorContext);

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}
        >
            <div
                style={{
                    height: '90%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <img 
                    src={NotFoundImg} 
                    alt="NOT FOUND" 
                    style={{
                        height: '80%'
                    }}
                />
            </div>

            <div
                style={{
                    height: '10%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Typography variant="h5" style={{color: primary}}>
                    {translations.withoutResults}
                </Typography>
            </div>
        </div>
    )
}

export default NotFound;