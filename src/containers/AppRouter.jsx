import React from "react";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import Login from '../components/Login/Login';
import Register from '../components/Login/Register';
import Dashboard from '../components/Dashboard';
import Profile from '../components/Settings/Profile';
import Company from '../components/Settings/Company';
import Employees from '../components/Modules/Employees/Employees';
import Customers from '../components/Modules/Customers/Customers';
import Products from '../components/Modules/Products/Products';
import POS from '../components/Modules/POS/POS';
import Accounting from '../components/Modules/Accounting/Accounting';
import SAT from '../components/Modules/SAT/SAT';

const AppRouter = () => {
    const redirectToRoot = () => {
		return <Redirect to="/" />
	};

	return (
		<Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/signup" component={Register} />
            <Route exact path="/dashboard/:userID" component={Dashboard} />
            <Route exact path="/profile/:userID" component={Profile} />
            <Route exact path="/company/:companyID" component={Company} />
            <Route exact path="/employees/:companyID" component={Employees} />
            <Route exact path="/crm/:companyID" component={Customers} />
            <Route exact path="/products/:companyID" component={Products} />
            <Route exact path="/pos/:userID" component={POS} />
            <Route exact path="/accounting/:companyID" component={Accounting} />
            <Route exact path="/sat/:companyID" component={SAT} />

            {/* Mantener como ultima para que sepa cuales son las rutas que si son validas */}
            <Route path="*" component={redirectToRoot} />
		</Switch>
	);
};

export default withRouter(AppRouter);
