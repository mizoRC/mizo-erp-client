import React from 'react';
import { FormControl, InputLabel, Select, Grid, Button, Input, InputAdornment, FormHelperText, CircularProgress, IconButton, makeStyles } from '@material-ui/core';
import { useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import jwt_decode from 'jwt-decode';
import { withRouter } from 'react-router-dom';
import { execute } from '../utils/graphql';
import { TranslatorContext } from '../contextProviders/Translator';
import { MeContext } from '../contextProviders/Me';
import { languages } from '../datasheets/languages';
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

const Profile = ({history}) => {
    const classes = useStyles();
    const client = useApolloClient();
    const { translations } = React.useContext(TranslatorContext);
    const { me } = React.useContext(MeContext);
    const [name, setName] = React.useState(me.name);
    const [surname, setSurname] = React.useState(me.surname);
    const [email, setEmail] = React.useState(me.email);
    const [password, setPassword] = React.useState('');
    const [language, setLanguage] = React.useState(me.language);
    const [showPassword, setShowPassword] = React.useState(false);
    const [updateFailed, setUpdateFailed] = React.useState();
    const [errorEmptyName, setErrorEmptyName] = React.useState(false);
    const [errorEmptySurname, setErrorEmptySurname] = React.useState(false);
    const [errorEmptyEmail, setErrorEmptyEmail] = React.useState(false);
    const [errorEmptyPassword, setErrorEmptyPassword] = React.useState(false);
    const [errorEmptyLanguage, setErrorEmptyLanguage] = React.useState(false);
    const [errorAlreadyRegisteredEmail, setErrorAlreadyRegisteredEmail] = React.useState(false);
    const [validEmail, setValidEmail] = React.useState(true);
    const [validPassword, setValidPassword] = React.useState(true);
    const [updating, setUpdating] = React.useState(false);

    /* React.useEffect(() => {
        setName(me.name);
        setSurname(me.name);
        setEmail(me.name);
        setName(me.name);
        setName(me.name);
    }, [me]) */
    

    const handleChangeName = event => {
        setName(event.target.value);
    };

    const handleChangeSurname = event => {
        setSurname(event.target.value);
    };

    const handleChangeEmail = event => {
        const newEmail = event.target.value;
        const isValidEmail = (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(newEmail));
        setValidEmail(isValidEmail);
        setEmail(newEmail);
    };

    const handleChangePassword = event => {
        const newPassword = event.target.value;
        const isValidPassword = newPassword.length >= 8;
        setValidPassword(isValidPassword);
        setPassword(newPassword);
    };

    const handleChangeLanguage = event => {
        setLanguage(event.target.value);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = event => {
        event.preventDefault();
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
                const mutation = gql`
                    mutation updateEmployee(
                        $updateInfo: UpdateEmployeeInfo!
                    ) {
                        updateEmployee(
                            updateInfo:$updateInfo
                        ) {
                            token
                        }
                    }
                `;
                let variables = {
                    updateInfo: {
                        name: name,
                        surname: surname,
                        email: email,
                        password: password,
                        language: language
                    }
                };

                const response = await execute(client, "mutation", mutation, variables);

                if(!!response && !!response.data && !!response.data.updateEmployee && !!response.data.updateEmployee.token){
                    const token = response.data.updateEmployee.token;
                    sessionStorage.setItem("token", token);
                    setErrorAlreadyRegisteredEmail(false);
                    setUpdating(false);
                    let decodedToken = jwt_decode(response.data.register.token);
                    history.replace(`/dashboard/${decodedToken.employee.id}`);
                }
                else{
                    setUpdating(false);
                    setUpdateFailed(true);
                }
            } catch (error) {
                setUpdating(false);
                if(error.includes("Email already registered")){
                    setErrorAlreadyRegisteredEmail(true);
                }
                else{
                    setUpdateFailed(true);
                }
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

        setErrorEmptyName(isEmptyName);
        setErrorEmptySurname(isEmptySurname);
        setErrorEmptyEmail(isEmptyEmail);
        setErrorEmptyPassword(isEmptyPassword);
        setErrorEmptyLanguage(isEmptyLanguage);

        hasErrors = isEmptyName || isEmptySurname || isEmptyEmail || isEmptyPassword || isEmptyLanguage || !validEmail || !validPassword;

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
                                {translations.profile}
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
                                            error={errorEmptyEmail || errorAlreadyRegisteredEmail || !validEmail}
                                            fullWidth={true}
                                            onKeyPress={handleEnterKey}
                                        />
                                        {!validEmail &&
                                            <FormHelperText id="invalid-email-helper-text">{translations.invalidEmail}</FormHelperText>
                                        }
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
                                            error={errorEmptyPassword || !validPassword}
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
                                        {!validPassword &&
                                            <FormHelperText id="invalid-email-helper-text">{translations.passwordMinLength}</FormHelperText>
                                        }
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

export default withRouter(Profile);