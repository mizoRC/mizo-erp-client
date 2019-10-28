import React from 'react';
import { Paper, TextField, FormControl, InputLabel, Select, Grid, Divider, Button, Input, InputAdornment, IconButton, makeStyles } from '@material-ui/core';
import { useApolloClient } from '@apollo/react-hooks';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-boost';
import jwt_decode from 'jwt-decode';
import { execute } from '../utils/graphql';
import { TranslatorContext } from '../contextProviders/Translator';
import useDisplayBreakpoints from '../contextProviders/useDisplayBreakpoints';
import { mainCountries, countries } from '../datasheets/countries';
import { languages } from '../datasheets/languages';
import { CustomCard, CustomCardHeader, CustomCardBody, CustomCardFooter } from '../displayComponents/CustomCard';
import { primary, tertiary, error } from '../styles/colors';
import * as mainStyles from '../styles';
import bgImage from '../assets/fondo.png';
import logoComplete from '../assets/logo_complete_white.svg';

const useStyles = makeStyles(theme => ({
    ...mainStyles,
    mainPaperContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `url(${bgImage})`, 
        backgroundRepeat: 'no-repeat', 
        backgroundSize: 'cover'
    },
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
    },
    link: {
        color: primary,
        cursor: 'pointer'
    }
}));

const Register = ({history}) => {
    const classes = useStyles();
    const client = useApolloClient();
    const breakpoint = useDisplayBreakpoints();
    const [name, setName] = React.useState('');
    const [surname, setSurname] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [language, setLanguage] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [companyName, setCompanyName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [country, setCountry] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [registerFailed, setRegisterFailed] = React.useState();
    const [errorEmptyName, setErrorEmptyName] = React.useState(false);
    const [errorEmptySurname, setErrorEmptySurname] = React.useState(false);
    const [errorEmptyEmail, setErrorEmptyEmail] = React.useState(false);
    const [errorEmptyPassword, setErrorEmptyPassword] = React.useState(false);
    const [errorEmptyLanguage, setErrorEmptyLanguage] = React.useState(false);
    const [errorEmptyCompanyName, setErrorEmptyCompanyName] = React.useState(false);
    const [errorEmptyPhone, setErrorEmptyPhone] = React.useState(false);
    const [errorEmptyCountry, setErrorEmptyCountry] = React.useState(false);
    const [errorEmptyAddress, setErrorEmptyAddress] = React.useState(false);
    const [errorAlreadyRegisteredEmail, setErrorAlreadyRegisteredEmail] = React.useState(false);
    

    const handleChangeName = event => {
        setName(event.target.value);
    };

    const handleChangeSurname = event => {
        setSurname(event.target.value);
    };

    const handleChangeEmail = event => {
        setEmail(event.target.value);
    };

    const handleChangePassword = event => {
        setPassword(event.target.value);
    };

    const handleChangeLanguage = event => {
        setLanguage(event.target.value);
    };

    const handleChangeCompanyName = event => {
        setCompanyName(event.target.value);
    };

    const handleChangePhone = event => {
        setPhone(event.target.value);
    };

    const handleChangeCountry = event => {
        setCountry(event.target.value);
    };

    const handleChangeAddress = event => {
        setAddress(event.target.value);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    const handleEnterKey = event => {
        if (event.nativeEvent.keyCode === 13) {
            register();
            event.preventDefault();
        }
    };

    const register = async() => {
        const hasErrors = checkErrors();

        if(!hasErrors){
            try {
                const mutation = gql`
                    mutation register(
                        $registerInfo: RegisterInfo!
                    ) {
                        register(
                            registerInfo:$registerInfo
                        ) {
                            token
                        }
                    }
                `;
                let variables = {
                    registerInfo: {
                        name: name,
                        surname: surname,
                        email: email,
                        password: password,
                        language: language,
                        companyName: companyName,
                        phone: phone,
                        country: country,
                        address: address
                    }
                };

                const response = await execute(client, "mutation", mutation, variables);

                if(!!response && !!response.data && !!response.data.register && !!response.data.register.token){
                    const token = response.data.register.token;
                    sessionStorage.setItem("token", token);
                    setRegisterFailed(false);
                    setErrorAlreadyRegisteredEmail(false);
                    let decodedToken = jwt_decode(response.data.register.token);
                    history.replace(`/dashboard/${decodedToken.employee.id}`);
                }
                else{
                    setRegisterFailed(true);
                }
            } catch (error) {
                console.info('ERROR',error);
                if(error.includes("Email already registered")){
                    setErrorAlreadyRegisteredEmail(true);
                }
                setRegisterFailed(true);
            }
            
        }
    }

    const checkErrors = () => {
        let hasErrors = false;

        const isEmptyName = (!name || name === "" || name === null) ? true : false;
        const isEmptySurname = (!surname || surname === "" || surname === null) ? true : false;
        const isEmptyEmail = (!email || email === "" || email === null) ? true : false;
        const isEmptyPassword = (!password || password === "" || password === null) ? true : false;
        const isEmptyLanguage = (!language || language === "" || language === null) ? true : false;
        const isEmptyCompanyName = (!companyName || companyName === "" || companyName === null) ? true : false;
        const isEmptyPhone = (!phone || phone === "" || phone === null) ? true : false;
        const isEmptyCountry = (!country || country === "" || country === null) ? true : false;
        const isEmptyAddress = (!address || address === "" || address === null) ? true : false;
        

        setErrorEmptyName(isEmptyName);
        setErrorEmptySurname(isEmptySurname);
        setErrorEmptyEmail(isEmptyEmail);
        setErrorEmptyPassword(isEmptyPassword);
        setErrorEmptyLanguage(isEmptyLanguage);
        setErrorEmptyCompanyName(isEmptyCompanyName);
        setErrorEmptyPhone(isEmptyPhone);
        setErrorEmptyCountry(isEmptyCountry);
        setErrorEmptyAddress(isEmptyAddress);

        hasErrors = isEmptyName || isEmptySurname || isEmptyEmail || isEmptyPassword || isEmptyLanguage || isEmptyCompanyName || isEmptyPhone || isEmptyCountry || isEmptyAddress;

        return hasErrors;
    };

    return(
        <TranslatorContext.Consumer>
            {({translations, updateLanguage}) => (
                <Paper className={classes.mainPaperContainer} square={true}>
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div
                            style={{
                                height: '100px',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <img alt="mizo-erp-logo-complete" src={logoComplete} style={{maxWidth: '200px'}} />
                        </div>

                        <div
                            style={{
                                height: 'calc(100% - 100px)',
                                width: '100%',
                                display: 'flex'
                            }}
                        >
                            <div className={classes.centered}>
                                <div 
                                    style={{
                                        height: 'calc(100% - 100px)',
                                        padding: '10px'
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
                                                {translations.signUp}
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
                                                    <FormControl fullWidth={true}>
                                                        <InputLabel htmlFor="input-surname">
                                                            {translations.surname}
                                                        </InputLabel>
                                                        <Input
                                                            id="input-surname"
                                                            type={'text'}
                                                            value={surname}
                                                            onChange={handleChangeSurname}
                                                            error={errorEmptySurname}
                                                            fullWidth={true}
                                                            onKeyPress={handleEnterKey}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={4} md={4}>
                                                    <FormControl error={errorEmptyLanguage} fullWidth={true}>
                                                        <InputLabel htmlFor="language-select">
                                                            {translations.language}
                                                        </InputLabel>
                                                        <Select
                                                            native
                                                            value={language}
                                                            onChange={handleChangeLanguage}
                                                            inputProps={{
                                                                name: 'language',
                                                                id: 'language-select',
                                                            }}
                                                        >
                                                            <option value="" />
                                                            {languages.map(selectLanguage => (
                                                                <option 
                                                                    key={selectLanguage.code}
                                                                    value={selectLanguage.code}
                                                                >
                                                                    {selectLanguage.name}
                                                                </option>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <FormControl fullWidth={true}>
                                                        <InputLabel htmlFor="input-email">
                                                            {translations.email}
                                                        </InputLabel>
                                                        <Input
                                                            id="input-email"
                                                            type={'text'}
                                                            value={email}
                                                            onChange={handleChangeEmail}
                                                            error={errorEmptyEmail || errorAlreadyRegisteredEmail}
                                                            fullWidth={true}
                                                            onKeyPress={handleEnterKey}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <FormControl fullWidth={true}>
                                                        <InputLabel htmlFor="adornment-password">
                                                            {translations.password}
                                                        </InputLabel>
                                                        <Input
                                                            id="adornment-password"
                                                            type={showPassword ? 'text' : 'password'}
                                                            value={password}
                                                            onChange={handleChangePassword}
                                                            error={errorEmptyPassword}
                                                            onKeyPress={handleEnterKey}
                                                            endAdornment={
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        aria-label="toggle password visibility"
                                                                        onClick={handleClickShowPassword}
                                                                        onMouseDown={handleMouseDownPassword}
                                                                    >
                                                                        {showPassword ? 
                                                                                <i className="far fa-eye"></i>
                                                                            : 
                                                                                <i className="far fa-eye-slash"></i>
                                                                        }
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            }
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                

                                                <Grid item xs={12} sm={4} md={4} lg={6}>
                                                    <FormControl fullWidth={true}>
                                                        <InputLabel htmlFor="input-company-name">
                                                            {translations.companyName}
                                                        </InputLabel>
                                                        <Input
                                                            id="input-company-name"
                                                            type={'text'}
                                                            value={companyName}
                                                            onChange={handleChangeCompanyName}
                                                            error={errorEmptyCompanyName}
                                                            fullWidth={true}
                                                            onKeyPress={handleEnterKey}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={4} md={4} lg={6}>
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

                                                <Grid item xs={12} sm={2} md={2} lg={6}>
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
                                                            {mainCountries.map(mainCountry => (
                                                                <option 
                                                                    key={mainCountry.code}
                                                                    value={mainCountry.code}
                                                                >
                                                                    {mainCountry.name}
                                                                </option>
                                                            ))}

                                                            <Divider />

                                                            {countries.map(selectCountry => (
                                                                <option 
                                                                    key={selectCountry.code}
                                                                    value={selectCountry.code}
                                                                >
                                                                    {selectCountry.name}
                                                                </option>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={2} md={2} lg={6}>
                                                    <FormControl fullWidth={true}>
                                                        <InputLabel htmlFor="input-phone">
                                                            {translations.phone}
                                                        </InputLabel>
                                                        <Input
                                                            id="input-phone"
                                                            type={'text'}
                                                            value={phone}
                                                            onChange={handleChangePhone}
                                                            error={errorEmptyPhone}
                                                            fullWidth={true}
                                                            onKeyPress={handleEnterKey}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid> 
                                            
                                            <div
                                                style={{
                                                    marginTop: (breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md") ? '10px' : '40px',
                                                    padding: '10px',
                                                    borderRadius: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    textAlign: 'center',
                                                    backgroundColor: tertiary,
                                                    color: 'white'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row'
                                                    }}
                                                >
                                                    <i className="fas fa-info-circle" style={{marginTop: '2px'}}></i>
                                                    <div>
                                                        {translations.acceptTermsRegisterText}
                                                    </div>
                                                </div>
                                            </div>
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
                                            {errorAlreadyRegisteredEmail &&
                                                <div
                                                    style={{
                                                        marginBottom: '10px',
                                                        color: error
                                                    }}
                                                >
                                                    {translations.emailAlreadyRegistered}
                                                </div>
                                            }

                                            <Button 
                                                variant="contained" 
                                                color="primary"
                                                onClick={register}
                                            >
                                                {translations.startNow}
                                            </Button>
                                        </CustomCardFooter>
                                    </CustomCard>
                                </div>
                            </div>
                        </div>
                    </div>
                </Paper>
            )}
        </TranslatorContext.Consumer>
    )
};

export default withRouter(Register);