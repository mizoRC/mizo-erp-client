import React from 'react';
import { Paper, TextField, Button, Typography, makeStyles } from '@material-ui/core';
import { useApolloClient } from '@apollo/react-hooks';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { execute } from '../utils/graphql';
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

const Login = ({history}) => {
    const classes = useStyles();
    const client = useApolloClient();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loginFailed, setLoginFailed] = React.useState(false);
    const [errorEmptyUsername, setErrorEmptyUsername] = React.useState(false);
    const [errorEmptyPassword, setErrorEmptyPassword] = React.useState(false);

    const handleChangeUserName = event => {
        setUsername(event.target.value);
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

    const goToDashboard = () => {
        history.replace(`/admin/panel`);
    };

    const login = async() => {
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
                                    label="Username"
                                    value={username}
                                    onChange={handleChangeUserName}
                                    margin="normal"
                                    variant="outlined"
                                    error={errorEmptyUsername}
                                    fullWidth={true}
                                    onKeyPress={handleEnterKey}
                                />

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
                                            Usuario no válido
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
                                <Button variant="contained" color="primary">
                                    Enter
                                </Button>
                            </div>
                        </CustomCardBody>
                    </CustomCard>
                </div>
            </Paper>
        </Paper>
    )
};

export default withRouter(Login);