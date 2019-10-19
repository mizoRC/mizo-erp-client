import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import Home from "../components/Home";

const AppRouter = () => {
	return (
		<Switch>
			<Route exact path="/" component={Home} />
		</Switch>
	);
};

export default withRouter(AppRouter);
