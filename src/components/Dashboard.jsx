import React from "react";
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import Bar from './Bar';
import Loading  from './Loading';

const ME = gql`
    query me {
        me {
            name
            surname
            email
            language
            role
            companies {
                name
                country
                address
                phone
            }
        }
    }
`;

const Dashboard = () => {
    const { loading, data } = useQuery(ME);

	return (
		<div
			style={{
				height: "100%",
				width: "100%",
				backgroundColor: "#364d6f",
				backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400'%3E%3Cdefs%3E%3CradialGradient id='a' cx='396' cy='281' r='514' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%2300c1c7'/%3E%3Cstop offset='1' stop-color='%23364d6f'/%3E%3C/radialGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='400' y1='148' x2='400' y2='333'%3E%3Cstop offset='0' stop-color='%2374fac8' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%2374fac8' stop-opacity='0.5'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23a)' width='800' height='400'/%3E%3Cg fill-opacity='0.5'%3E%3Ccircle fill='url(%23b)' cx='267.5' cy='61' r='300'/%3E%3Ccircle fill='url(%23b)' cx='532.5' cy='61' r='300'/%3E%3Ccircle fill='url(%23b)' cx='400' cy='30' r='300'/%3E%3C/g%3E%3C/svg%3E")`,
				backgroundAttachment: "fixed",
				backgroundSize: "cover"
			}}
		>
            {loading ? 
                    <div
                        style={{
                            display: 'flex',
                            height: '100%',
                            width: '100%'
                        }}
                    >
                        <Loading />
                    </div>
                :
                    <>
                        <Bar title={data.me.companies[0].name}/>
                        <div
                            style={{
                                display: 'flex',
                                height: '100%',
                                width: '100%'
                            }}
                        >
                            DASHBOARD
                        </div>
                    </>
            }
		</div>
	);
};

export default Dashboard;
