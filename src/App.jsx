import React from "react";
import {ApolloClient, ApolloLink, InMemoryCache, HttpLink} from "apollo-boost";
import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./containers/AppRouter";
import ThemeContainer from './containers/ThemeContainer';

console.info('REACT_APP_API_URL', process.env.REACT_APP_API_URL);

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

const client = new ApolloClient({
	link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

function App() {
	return (
		<ApolloProvider client={client}>
            <ThemeContainer>
                <BrowserRouter>
                    <AppRouter />
                </BrowserRouter>
            </ThemeContainer>
		</ApolloProvider>
	);
}

export default App;
