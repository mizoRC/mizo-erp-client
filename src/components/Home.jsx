import React from "react";
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import logo from "../assets/logo_secondary.svg";
//
const queryCompanies = gql`
    {
        companies{
            id
            name
            address
            phone
            tin
        }
    }
`;

const Home = () => {
    const {loading, error, data} = useQuery(queryCompanies);
    if (loading){
        return <p>Loading...</p>;
    }
    
    if (error){
        return <p>Error :(</p>;
    } 
            
    console.info(data.companies);

    return(
		<div style={{textAlign: "center"}}>
			<header 
                style={{
                    backgroundColor: "#282c34",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "calc(10px + 2vmin)",
                    color: "white"
                }}
            >
				<img src={logo} style={{height: '40vmin'}} alt="logo" />
                <p>
                    {data.companies.map(company => {
                        return(
                            <div>
                                {company.id} | {company.name} | {company.address} | {company.tin}
                            </div>
                        )
                    })}
                </p>
			</header>
		</div>
	);
};

export default Home;
