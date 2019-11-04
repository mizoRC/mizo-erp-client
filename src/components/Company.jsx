import React from 'react';
import { FormControl, InputLabel, Select, Grid, Button, Input, CircularProgress, makeStyles } from '@material-ui/core';
import { useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import jwt_decode from 'jwt-decode';
import { withRouter } from 'react-router-dom';
import { execute } from '../utils/graphql';
import { TranslatorContext } from '../contextProviders/Translator';
import { MeContext } from '../contextProviders/Me';
import { mainCountries, countries } from '../datasheets/countries';
import { CustomCard, CustomCardHeader, CustomCardBody, CustomCardFooter } from '../displayComponents/CustomCard';
import { error } from '../styles/colors';
import * as mainStyles from '../styles';
import Bar from './Bar';

const useStyles = makeStyles(theme => ({
    ...mainStyles,
    formPaper: {
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        minWidth: '400px'
    },
    formContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: '20px',
        marginBottom: '20px'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    }
}));

const Company = ({history}) => {
    const classes = useStyles();
    const client = useApolloClient();
    const { translations, updateLanguage } = React.useContext(TranslatorContext);
    const { me } = React.useContext(MeContext);
    console.info('ME_COMPANY', me);
    const [name, setName] = React.useState(me.company.name);
    const [country, setCountry] = React.useState(me.company.country);
    const [address, setAddress] = React.useState(me.company.address);
    const [phone, setPhone] = React.useState(me.company.phone);
    const [updateFailed, setUpdateFailed] = React.useState();
    const [errorEmptyName, setErrorEmptyName] = React.useState(false);
    const [errorEmptyCountry, setErrorEmptyCountry] = React.useState(false);
    const [errorEmptyAddress, setErrorEmptyAddress] = React.useState(false);
    const [errorEmptyPhone, setErrorEmptyPhone] = React.useState(false);
    const [updating, setUpdating] = React.useState(false);

    const handleChangeName = event => {
        setName(event.target.value);
    };

    const handleChangeCountry = event => {
        setCountry(event.target.value);
    };

    const handleChangeAddress = event => {
        setAddress(event.target.value);
    };

    const handleChangePhone = event => {
        setPhone(event.target.value);
    };

    const handleEnterKey = event => {
        if (event.nativeEvent.keyCode === 13) {
            update();
            event.preventDefault();
        }
    };

    const update = async() => {
        const hasErrors = checkErrors();

        if(!hasErrors){
            try {
                setUpdating(true);
                setUpdateFailed(false);
                const mutation = gql`
                    mutation updateCompany(
                        $updateInfo: UpdateCompanyInfo!
                    ) {
                        updateCompany(
                            updateInfo:$updateInfo
                        ) {
                            token
                        }
                    }
                `;
                const updateInfo = {
                    name: name,
                    country: country,
                    address: address,
                    phone: phone
                };

                let variables = {
                    updateInfo: updateInfo
                };

                const response = await execute(client, "mutation", mutation, variables);

                if(!!response && !!response.data && !!response.data.updateCompany && !!response.data.updateCompany.token){
                    const token = response.data.updateCompany.token;
                    sessionStorage.setItem("token", token);
                    setUpdating(false);
                    let decodedToken = jwt_decode(response.data.updateCompany.token);
                    updateLanguage(decodedToken.employee.language);
                    history.replace(`/dashboard/${decodedToken.employee.id}`);
                }
                else{
                    setUpdating(false);
                    setUpdateFailed(true);
                }
            } catch (error) {
                setUpdateFailed(true);
                setUpdating(false);
            }
            
        }
    }

    const checkErrors = () => {
        let hasErrors = false;

        const isEmptyName = (!name || name === "" || name === null) ? true : false;
        const isEmptyCountry = (!country || country === "" || country === null) ? true : false;
        const isEmptyAddress = (!address || address === "" || address === null) ? true : false;
        const isEmptyPhone = (!phone || phone === "" || phone === null) ? true : false;

        setErrorEmptyName(isEmptyName);
        setErrorEmptyCountry(isEmptyCountry);
        setErrorEmptyAddress(isEmptyAddress);
        setErrorEmptyPhone(isEmptyPhone);

        hasErrors = isEmptyName || isEmptyCountry || isEmptyAddress || isEmptyPhone;

        return hasErrors;
    };

    return(
        <div className={classes.containerBG}>
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Bar/>
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <CustomCard style={{maxWidth: "800px", maxHeight: '100%', marginTop: '35px', marginBottom: '35px'}}>
                        <CustomCardHeader color="primary" textColor="white">
                            <div
                                style={{
                                    textAlign: 'center',
                                    fontSize: '30px'
                                }}
                            >
                                {translations.company}
                            </div>
                        </CustomCardHeader>
                        <CustomCardBody
                            style={{height: '100%', overflowY: 'auto'}}
                        >
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={4} md={4}>
                                    <FormControl fullWidth={true}>
                                        <InputLabel htmlFor="input-name">
                                            {translations.name}
                                        </InputLabel>
                                        <Input
                                            id="input-name"
                                            type={'text'}
                                            value={name}
                                            onChange={handleChangeName}
                                            error={errorEmptyName}
                                            fullWidth={true}
                                            onKeyPress={handleEnterKey}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4}>
                                    <FormControl error={errorEmptyCountry} fullWidth={true}>
                                        <InputLabel htmlFor="country-select">
                                            {translations.country}
                                        </InputLabel>
                                        <Select
                                            native
                                            value={country}
                                            onChange={handleChangeCountry}
                                            inputProps={{
                                                name: 'country',
                                                id: 'country-select',
                                            }}
                                        >
                                            <option value="" />
                                            <optgroup label={translations.featured}>
                                                {mainCountries.map(mainCountry => (
                                                    <option 
                                                        key={mainCountry.code}
                                                        value={mainCountry.code}
                                                    >
                                                        {mainCountry.name}
                                                    </option>
                                                ))}
                                            </optgroup>

                                            <optgroup label={translations.all}>
                                                {countries.map(selectCountry => (
                                                    <option 
                                                        key={selectCountry.code}
                                                        value={selectCountry.code}
                                                    >
                                                        {selectCountry.name}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4}>
                                    <FormControl fullWidth={true}>
                                        <InputLabel htmlFor="input-phone">
                                            {translations.phone}
                                        </InputLabel>
                                        <Input
                                            id="input-phone"
                                            type={'tel'}
                                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{3}"
                                            value={phone}
                                            onChange={handleChangePhone}
                                            error={errorEmptyPhone}
                                            fullWidth={true}
                                            onKeyPress={handleEnterKey}
                                        />
                                    </FormControl>
                                </Grid>
                                
                                <Grid item xs={12} sm={6} md={6}>
                                    <FormControl fullWidth={true}>
                                        <InputLabel htmlFor="input-address">
                                            {translations.address}
                                        </InputLabel>
                                        <Input
                                            id="input-address"
                                            type={'text'}
                                            value={address}
                                            onChange={handleChangeAddress}
                                            error={errorEmptyAddress}
                                            onKeyPress={handleEnterKey}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid> 
                        </CustomCardBody>
                        <CustomCardFooter
                            style={{
                                height: '70px', 
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {updateFailed &&
                                <div
                                    style={{
                                        marginBottom: '10px',
                                        color: error
                                    }}
                                >
                                    {translations.updateFailed}
                                </div>
                            }

                            <Button 
                                variant="contained" 
                                color="primary"
                                disabled={updating}
                                onClick={update}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection:' row',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {translations.update}
                                    {updating &&
                                        <div style={{marginLeft: '6px', display: 'flex', alignItems: 'center'}}>
                                            <CircularProgress size={20} color="secondary" />
                                        </div>
                                    }
                                </div>
                            </Button>
                        </CustomCardFooter>
                    </CustomCard>
                </div>
            </div>
        </div>
    )
};

export default withRouter(Company);