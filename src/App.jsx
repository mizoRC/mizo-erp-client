import React from "react";
import {ApolloClient, ApolloLink, InMemoryCache, HttpLink} from "apollo-boost";
import { ApolloProvider } from '@apollo/react-hooks';
import { onError } from 'apollo-link-error';
import { BrowserRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import Translator from './contextProviders/Translator';
import ThemeContainer from './containers/ThemeContainer';
import { ToastContainer, toast } from 'react-toastify';
import AppRouter from "./containers/AppRouter";

let toastId;
export const bHistory = createBrowserHistory();

const httpLink = new HttpLink({
    uri: process.env.REACT_APP_API_URL
});

const authLink = new ApolloLink((operation, forward) => {
	// get the authentication token from local storage if it exists
	const token = sessionStorage.getItem('token');
	
	// Use the setContext method to set the HTTP headers.
	operation.setContext({
		headers: {
            authorization: token ? `Bearer ${token}` : "",
            "x-mizo-erp-token": token
        }
	});

	// Call the next link in the middleware chain.
	return forward(operation);
});

const printSessionExpiredError = () => {
	const messages = {
		es: "Su sesión ha caducado",
		en: "Session expired"
	};
	const selectedLanguage = sessionStorage.getItem("language");
    return (selectedLanguage && messages[selectedLanguage]) ? messages[selectedLanguage] : messages["es"];
};

const errorLink = onError(({ graphQLErrors, networkError, operation, response, forward}) => {
    console.error('ERROR_LINK');
	console.error(graphQLErrors);
	console.error(networkError);

    if(!!graphQLErrors && !!graphQLErrors[0] && ((!graphQLErrors[0].code && graphQLErrors[0].code === 401) || (!!graphQLErrors[0].message && !!graphQLErrors[0].message.includes("Invalid token")))){
        console.info('SESSION EXPIRED');
        const message = printSessionExpiredError();
        if (!toast.isActive(toastId)) {
            toastId = toast.error(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
        sessionStorage.removeItem('token');
        bHistory.replace('/');
    }
});

const client = new ApolloClient({
	link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache()
});

function App() {
	return (
		<ApolloProvider client={client}>
            <ThemeContainer>
                <Translator>
                    <ToastContainer/>
                    <BrowserRouter>
                        <AppRouter />
                    </BrowserRouter>
                </Translator>
            </ThemeContainer>
		</ApolloProvider>
	);
}

export default App;
