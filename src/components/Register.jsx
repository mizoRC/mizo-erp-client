import React from 'react';
import { Paper, TextField, Grid, makeStyles } from '@material-ui/core';
import { useApolloClient } from '@apollo/react-hooks';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { execute } from '../utils/graphql';
import { TranslatorContext } from '../contextProviders/Translator';
import CustomCard from '../displayComponents/CustomCard/Card';
import CustomCardHeader from '../displayComponents/CustomCard/CardHeader';
import CustomCardBody from '../displayComponents/CustomCard/CardBody';
import bgImage from '../assets/fondo.png';
import logo from '../assets/logo_white.svg';


const useStyles = makeStyles(theme => ({
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

const Register = ({history}) => {
    const classes = useStyles();
    const client = useApolloClient();
    const [name, setName] = React.useState('');
    const [surname, setSurname] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [companyName, setCompanyName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [country, setCountry] = React.useState('');
    const [language, setLanguage] = React.useState('');

    const handleChangeName = event => {
        setName(event.target.value);
    };

    const handleChangeSurname = event => {
        setSurname(event.target.value);
    };

    const handleChangeEmail = event => {
        setEmail(event.target.value);
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

    const handleChangeLanguage = event => {
        setLanguage(event.target.value);
    };

    const handleEnterKey = event => {
        if (event.nativeEvent.keyCode === 13) {
            register();
            event.preventDefault();
        }
    };

    const goToDashboard = () => {
        history.replace(`/dashboard/userID`);
    };

    const register = async() => {
        const hasErrors = checkErrors();

        if(!hasErrors){
            try {
                const mutation = gql`
                    mutation login(
                        $user: String!
                        $apikey: String!
                    ) {
                        login(
                            credentials:{
                                user: $user
                                apikey: $apikey
                            }
                        ) {
                            token
                        }
                    }
                `;
                let variables = {
                    username: username,
                    password: password
                };

                const response = await execute(client, "mutation", mutation, variables);

                if(!!response && !!response.data && !!response.data.login && !!response.data.login.token){
                    const token = response.data.login.token;
                    sessionStorage.setItem("token", token);
                    setLoginFailed(false);
                    goToDashboard();
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

        const isEmptyUsername = (!username || username === "" || username === null) ? true : false;
        setErrorEmptyUsername(isEmptyUsername);
        const isEmptyPassword = (!password || password === "" || password === null) ? true : false;
        setErrorEmptyPassword(isEmptyPassword);

        hasErrors = isEmptyUsername || isEmptyPassword;

        return hasErrors;
    };

    return(
        <TranslatorContext.Consumer>
            {({translations}) => (
                <Paper className={classes.mainPaperContainer} square={true}>
                    <Paper className={classes.container} square={true}>
                        <div className={classes.centered}>
                            <div 
                                style={{
                                    display: 'flex',
                                    padding: '10px'
                                }}
                            >
                                <CustomCard style={{maxWidth: "800px"}}>
                                    <CustomCardHeader color="primary" textColor="white">
                                        <div
                                            style={{
                                                textAlign: 'center',
                                                fontSize: '30px'
                                            }}
                                        >
                                            Registro
                                        </div>
                                    </CustomCardHeader>
                                    <CustomCardBody>
                                        <form noValidate autoComplete="off">
                                            <Grid container spacing={6}>
                                                <Grid item xs={12} sm={12}>
                                                    <TextField
                                                        id="outlined-username"
                                                        label="Username"
                                                        value={username}
                                                        onChange={handleChangeUserName}
                                                        margin="normal"
                                                        variant="outlined"
                                                        error={errorEmptyUsername}
                                                        fullWidth={true}
                                                        onKeyPress={handleEnterKey}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        id="outlined-password"
                                                        label="Password"
                                                        value={password}
                                                        onChange={handleChangePassword}
                                                        margin="normal"
                                                        variant="outlined"
                                                        type="password"
                                                        error={errorEmptyPassword}
                                                        fullWidth={true}
                                                        onKeyPress={handleEnterKey}
                                                    />
                                                </Grid>
                                            </Grid>                                        
                                        </form>
                                    </CustomCardBody>
                                </CustomCard>
                            </div>
                        </div>
                    </Paper>
                </Paper>
            )}
        </TranslatorContext.Consumer>
    )
};

export default withRouter(Register);