import React from "react";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../components/Dashboard';

const AppRouter = () => {
    const redirectToRoot = () => {
		return <Redirect to="/" />
	};

	return (
		<Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/signup" component={Register} />
            <Route exact path="/dashboard/:userID" component={Dashboard} />

            {/* Mantener como ultima para que sepa cuales son las rutas que si son validas */}
            <Route path="*" component={redirectToRoot} />
		</Switch>
	);
};

export default withRouter(AppRouter);
