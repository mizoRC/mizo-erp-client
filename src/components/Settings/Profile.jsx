import React from 'react';
import { FormControl, InputLabel, Select, Grid, Button, Input, InputAdornment, FormHelperText, CircularProgress, IconButton, makeStyles } from '@material-ui/core';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import jwt_decode from 'jwt-decode';
import { withRouter } from 'react-router-dom';
import { execute } from '../../utils/graphql';
import { TranslatorContext} from '../../contextProviders/Translator';
import { languages } from '../../datasheets/languages';
import { CustomCard, CustomCardHeader, CustomCardBody, CustomCardFooter } from '../../displayComponents/CustomCard';
import { error } from '../../styles/colors';
import * as mainStyles from '../../styles';
import Bar from '../Segments/Bar';
import Loading from '../Segments/Loading';

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

const ME = gql`
    query me {
        me {
            id
            name
            surname
            email
            language
            role
            company {
                id
                name
                country
                address
                phone
                logo
            }
        }
    }
`;

const Profile = ({history}) => {
    const classes = useStyles();
    const client = useApolloClient();
    const { translations, updateLanguage } = React.useContext(TranslatorContext);
    const { loading, data } = useQuery(ME, {
        fetchPolicy: "network-only"
    });
    const [name, setName] = React.useState('');
    const [surname, setSurname] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [language, setLanguage] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [newPassword, setNewPassword] = React.useState('');
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [newPasswordRepeated, setNewPasswordRepeated] = React.useState('');
    const [showNewPasswordRepeated, setShowNewPasswordRepeated] = React.useState(false);
    const [updateFailed, setUpdateFailed] = React.useState();
    const [errorEmptyName, setErrorEmptyName] = React.useState(false);
    const [errorEmptySurname, setErrorEmptySurname] = React.useState(false);
    const [errorEmptyEmail, setErrorEmptyEmail] = React.useState(false);
    const [errorEmptyPassword, setErrorEmptyPassword] = React.useState(false);
    const [errorEmptyNewPassword, setErrorEmptyNewPassword] = React.useState(false);
    const [errorEmptyNewPasswordRepeated, setErrorEmptyNewPasswordRepeated] = React.useState(false);
    const [errorEmptyLanguage, setErrorEmptyLanguage] = React.useState(false);
    const [validEmail, setValidEmail] = React.useState(true);
    const [validPassword, setValidPassword] = React.useState(true);
    const [validNewPassword, setValidNewPassword] = React.useState(true);
    const [validNewPasswordRepeated, setValidNewPasswordRepeated] = React.useState(true);
    const [newPasswordsMatch, setNewPasswordsMatch] = React.useState(true);
    const [updating, setUpdating] = React.useState(false);
    const [incorrectPassword, setIncorrectPassword] = React.useState(false);

    React.useEffect(() => {
        if(data && data.me){
            setName(data.me.name);
            setSurname(data.me.surname);
            setEmail(data.me.email);
            setLanguage(data.me.language);
        }
    },[data]);

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

    const handleChangeNewPassword = event => {
        const newPassword = event.target.value;
        const isValidPassword = newPassword.length >= 8;
        setValidNewPassword(isValidPassword);
        setNewPassword(newPassword);
    };

    const handleChangeNewPasswordRepeated = event => {
        const newPassword = event.target.value;
        const isValidPassword = newPassword.length >= 8;
        setValidNewPasswordRepeated(isValidPassword);
        setNewPasswordRepeated(newPassword);
    };

    const handleChangeLanguage = event => {
        setLanguage(event.target.value);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };

    const handleClickShowNewPasswordRepeated = () => {
        setShowNewPasswordRepeated(!showNewPasswordRepeated);
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
                setUpdateFailed(false);
                const mutation = gql`
                    mutation updateEmployeeMe(
                        $updateInfo: UpdateEmployeeMeInfo!
                    ) {
                        updateEmployeeMe(
                            updateInfo:$updateInfo
                        ) {
                            token
                        }
                    }
                `;
                const updateInfo = {
                    name: name,
                    surname: surname,
                    email: email,
                    password: password,
                    language: language
                };
                const isEmptyNewPassword = (!newPassword || newPassword === "" || newPassword === null) ? true : false;
                const isEmptyNewPasswordRepeated = (!newPasswordRepeated || newPasswordRepeated === "" || newPasswordRepeated === null) ? true : false;
                if(!isEmptyNewPassword && !isEmptyNewPasswordRepeated){
                    updateInfo.newPassword = newPassword;
                    updateInfo.newPasswordRepeated = newPasswordRepeated;
                }

                let variables = {
                    updateInfo: updateInfo
                };

                const response = await execute(client, "mutation", mutation, variables);

                if(!!response && !!response.data && !!response.data.updateEmployeeMe && !!response.data.updateEmployeeMe.token){
                    const token = response.data.updateEmployeeMe.token;
                    sessionStorage.setItem("token", token);
                    setUpdating(false);
                    let decodedToken = jwt_decode(response.data.updateEmployeeMe.token);
                    updateLanguage(decodedToken.employee.language);
                    history.replace(`/dashboard/${decodedToken.employee.id}`);
                }
                else{
                    setUpdating(false);
                    setUpdateFailed(true);
                }
            } catch (error) {
                if(error.includes('Password not match')){
                    setIncorrectPassword(true);
                }
                else{
                    setUpdateFailed(true);
                }
                setUpdating(false);
            }
            
        }
    }

    const checkErrors = () => {
        let hasErrors = false;

        const isEmptyName = (!name || name === "" || name === null) ? true : false;
        const isEmptySurname = (!surname || surname === "" || surname === null) ? true : false;
        const isEmptyEmail = (!email || email === "" || email === null) ? true : false;
        const isEmptyPassword = (!password || password === "" || password === null) ? true : false;
        const isEmptyNewPassword = (!newPassword || newPassword === "" || newPassword === null) ? true : false;
        const isEmptyNewPasswordRepeated = (!newPasswordRepeated || newPasswordRepeated === "" || newPasswordRepeated === null) ? true : false;
        const matchNewPwd = newPassword === newPasswordRepeated;
        const isEmptyLanguage = (!language || language === "" || language === null) ? true : false;

        setErrorEmptyName(isEmptyName);
        setErrorEmptySurname(isEmptySurname);
        setErrorEmptyEmail(isEmptyEmail);
        setErrorEmptyPassword(isEmptyPassword);
        setErrorEmptyLanguage(isEmptyLanguage);

        if(!isEmptyNewPassword || !isEmptyNewPasswordRepeated){
            if(!isEmptyNewPassword && !isEmptyNewPasswordRepeated){
                setNewPasswordsMatch(matchNewPwd);
            }

            setErrorEmptyNewPassword(isEmptyNewPassword);
            setErrorEmptyNewPasswordRepeated(isEmptyNewPasswordRepeated);

            hasErrors = isEmptyName || isEmptySurname || isEmptyEmail || isEmptyPassword || isEmptyNewPassword || isEmptyNewPasswordRepeated || isEmptyLanguage || !validEmail || !validPassword || !validNewPassword || !validNewPasswordRepeated || !matchNewPwd;
        }
        else{
            hasErrors = isEmptyName || isEmptySurname || isEmptyEmail || isEmptyPassword || isEmptyLanguage || !validEmail || !validPassword;
        }

        return hasErrors;
    };

    return(
        <div className={classes.containerBG}>
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
                                                <FormControl fullWidth={true} disabled>
                                                    <InputLabel htmlFor="input-email">
                                                        {translations.email}
                                                    </InputLabel>
                                                    <Input
                                                        id="input-email"
                                                        type={'text'}
                                                        value={email}
                                                        onChange={handleChangeEmail}
                                                        error={errorEmptyEmail || !validEmail}
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
                                                        {translations.currentPassword}
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

                                            <Grid item xs={12} sm={6} md={6}>
                                                <FormControl fullWidth={true}>
                                                    <InputLabel htmlFor="adornment-newpassword">
                                                        {translations.newPassword}
                                                    </InputLabel>
                                                    <Input
                                                        id="adornment-newpassword"
                                                        type={showNewPassword ? 'text' : 'password'}
                                                        value={newPassword}
                                                        onChange={handleChangeNewPassword}
                                                        error={errorEmptyNewPassword || !validNewPassword}
                                                        onKeyPress={handleEnterKey}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={handleClickShowNewPassword}
                                                                    onMouseDown={handleMouseDownPassword}
                                                                >
                                                                    {showNewPassword ? 
                                                                            <i className="far fa-eye"></i>
                                                                        : 
                                                                            <i className="far fa-eye-slash"></i>
                                                                    }
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                    />
                                                    {!validNewPassword &&
                                                        <FormHelperText id="invalid-email-helper-text">{translations.passwordMinLength}</FormHelperText>
                                                    }
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={6}>
                                                <FormControl fullWidth={true}>
                                                    <InputLabel htmlFor="adornment-newpasswordrepeat">
                                                        {translations.newPasswordRepeated}
                                                    </InputLabel>
                                                    <Input
                                                        id="adornment-newpasswordrepeat"
                                                        type={showNewPasswordRepeated ? 'text' : 'password'}
                                                        value={newPasswordRepeated}
                                                        onChange={handleChangeNewPasswordRepeated}
                                                        error={errorEmptyNewPasswordRepeated || !validNewPasswordRepeated}
                                                        onKeyPress={handleEnterKey}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={handleClickShowNewPasswordRepeated}
                                                                    onMouseDown={handleMouseDownPassword}
                                                                >
                                                                    {showNewPasswordRepeated ? 
                                                                            <i className="far fa-eye"></i>
                                                                        : 
                                                                            <i className="far fa-eye-slash"></i>
                                                                    }
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                    />
                                                    {!validNewPasswordRepeated &&
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
                                        {!newPasswordsMatch &&
                                            <div
                                                style={{
                                                    marginBottom: '10px',
                                                    color: error
                                                }}
                                            >
                                                {translations.passwordsDontMatch}
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

                                        {incorrectPassword &&
                                            <div
                                                style={{
                                                    marginBottom: '10px',
                                                    color: error
                                                }}
                                            >
                                                {translations.incorrectPassword}
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
            }
        </div>
    )
};

export default withRouter(Profile);