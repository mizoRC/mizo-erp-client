import React from "react";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import Login from '../components/Login';
import Home from "../components/Home";

const AppRouter = () => {
    const redirectToRoot = () => {
		return <Redirect to="/" />
	};

	return (
		<Switch>
			<Route exact path="/home" component={Home} />
            <Route exact path="/" component={Login} />
            <Route path="*" component={redirectToRoot} />
		</Switch>
	);
};

export default withRouter(AppRouter);
