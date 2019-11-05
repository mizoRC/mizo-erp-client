import React from 'react';
import { Paper, TextField, Button, Typography, makeStyles } from '@material-ui/core';
import { useApolloClient } from '@apollo/react-hooks';
import { withRouter, Link } from 'react-router-dom';
import { gql } from 'apollo-boost';
import jwt_decode from 'jwt-decode';
import { execute } from '../../utils/graphql';
import { TranslatorContext } from '../../contextProviders/Translator';
import CustomCard from '../../displayComponents/CustomCard/Card';
import CustomCardHeader from '../../displayComponents/CustomCard/CardHeader';
import CustomCardBody from '../../displayComponents/CustomCard/CardBody';
import * as mainStyles from '../../styles';
import bgImage from '../../assets/fondo.png';
import logo from '../../assets/logo_white.svg';


const useStyles = makeStyles(theme => ({
    ...mainStyles,
    mainPaperContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    container: {
        display: 'flex',
        height: '100%',
        width: '100%',
        background: `url(${bgImage})`, 
        backgroundRepeat: 'no-repeat', 
        backgroundSize: 'cover',
    },
    centered: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
}));

const Login = ({history}) => {
    const classes = useStyles();
    const client = useApolloClient();
    const { translations } = React.useContext(TranslatorContext);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loginFailed, setLoginFailed] = React.useState(false);
    const [errorEmptyEmail, setErrorEmptyEmail] = React.useState(false);
    const [errorEmptyPassword, setErrorEmptyPassword] = React.useState(false);

    const handleChangeEmail = event => {
        setEmail(event.target.value);
    };

    const handleChangePassword = event => {
        setPassword(event.target.value);
    };

    const handleEnterKey = event => {
        if (event.nativeEvent.keyCode === 13) {
            login();
            event.preventDefault();
        }
    };

    const login = async() => {
        const hasErrors = checkErrors();

        if(!hasErrors){
            try {
                const mutation = gql`
                    mutation login(
                        $email: String!
                        $password: String!
                    ) {
                        login(
                            email: $email,
                            password: $password
                        ) {
                            token
                        }
                    }
                `;
                let variables = {
                    email: email,
                    password: password
                };

                const response = await execute(client, "mutation", mutation, variables);

                if(!!response && !!response.data && !!response.data.login && !!response.data.login.token){
                    const token = response.data.login.token;
                    sessionStorage.setItem("token", token);
                    setLoginFailed(false);
                    let decodedToken = jwt_decode(response.data.login.token);
                    history.replace(`/dashboard/${decodedToken.employee.id}`);
                }
                else{
                    setLoginFailed(true);
                }
            } catch (error) {
                console.error(error);
                setLoginFailed(true);
            }
            
        }
    }

    const checkErrors = () => {
        let hasErrors = false;

        const isEmptyEmail = (!email || email === "" || email === null) ? true : false;
        setErrorEmptyEmail(isEmptyEmail);
        const isEmptyPassword = (!password || password === "" || password === null) ? true : false;
        setErrorEmptyPassword(isEmptyPassword);

        hasErrors = isEmptyEmail || isEmptyPassword;

        return hasErrors;
    };

    return(
        <Paper className={classes.mainPaperContainer} square={true}>
            <Paper className={classes.container} square={true}>
                <div className={classes.centered}>
                    <CustomCard style={{width: "20rem"}}>
                        <CustomCardHeader color="primary" textColor="white">
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <div>
                                    <img src={logo} alt="logo" style={{maxWidth: '80px'}} />
                                </div>
                                <div style={{fontSize: '30px'}}>
                                    MizoERP
                                </div>
                            </div>
                        </CustomCardHeader>
                        <CustomCardBody>
                            <form noValidate autoComplete="off">
                                <TextField
                                    id="outlined-username"
                                    label={translations.email}
                                    value={email}
                                    onChange={handleChangeEmail}
                                    margin="normal"
                                    variant="outlined"
                                    error={errorEmptyEmail}
                                    fullWidth={true}
                                    onKeyPress={handleEnterKey}
                                />

                                <TextField
                                    id="outlined-password"
                                    label={translations.password}
                                    value={password}
                                    onChange={handleChangePassword}
                                    margin="normal"
                                    variant="outlined"
                                    type="password"
                                    error={errorEmptyPassword}
                                    fullWidth={true}
                                    onKeyPress={handleEnterKey}
                                />

                                {loginFailed &&
                                    <div
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Typography variant="h6" style={{color: 'red'}}>
                                            {translations.invalidUser}
                                        </Typography>
                                    </div>
                                }
                            </form>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: '30px',
                                    marginBottom: '10px'
                                }}
                            >
                                <Button variant="contained" color="primary" onClick={login}>
                                    {translations.login}
                                </Button>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: '20px',
                                    marginBottom: '5px',
                                    fontSize: '10px',
                                    textAlign: 'center'
                                }}
                            >
                                <Link to="/signup" className="link">
                                    {translations.dontHaveAccount}
                                </Link>
                            </div>
                        </CustomCardBody>
                    </CustomCard>
                </div>
            </Paper>
        </Paper>
    )
};

export default withRouter(Login);