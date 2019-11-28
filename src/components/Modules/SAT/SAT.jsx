import React from 'react';
import { makeStyles } from "@material-ui/core";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import jwt_decode from 'jwt-decode';
import { isMobile } from "react-device-detect";
import { TranslatorContext } from "../../../contextProviders/Translator";
import { ROLES } from '../../../constants';
import * as mainStyles from "../../../styles";
import Bar from "../../Segments/Bar";
import Loading from "../../Segments/Loading";
import ActionsBar from "./ActionsBar";
import ManagerSeller from './Manager';
import Technician from './Technician';
import PartModal from './PartModal';
//import Map from '../../Segments/Map';
const limit = 16;

const defaultFilters = {
	filters: [
		{
			field: "search",
			value: ""
		}
	],
	options: {
		limit: limit,
		offset: 0
	}
};

const useStyles = makeStyles(theme => ({
	...mainStyles
}));

const PARTS = gql`
	query parts($filters: [Filter]!, $options: Options!) {
		parts(filters: $filters, options: $options) {
			rows {
				id
                partId
                date
                address
                reason
                type
                finished
                notFinishedReason
                employeeId
                customerId
				customer{
                    id
                    name
                }
				employee{
                    id
                    name
                    surname
                }
				creationDate
			}
			count
		}
	}
`;

const CUSTOMERS = gql`
    query customers {
        customers {
            id
            name
            phone
            email
            address
        }
    }
`;

const EMPLOYEES = gql`
    query employees {
        employees {
            id
            name
            surname
            email
            language
            role
            password
        }
    }
`;

const SAT = () => {
    const token = sessionStorage.getItem("token");
    const decodedToken = jwt_decode(token);
    const employee = decodedToken.employee;
    const classes = useStyles();
    const { translations } = React.useContext(TranslatorContext);
    const [filters, setFilters] = React.useState(defaultFilters);
    const [openModal, setOpenModal] = React.useState(false);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const { loading, data, refetch, fetchMore } = useQuery(PARTS, {
		fetchPolicy: "network-only",
		variables: filters
	});
    const { loading: loadingCustomers, data: dataCustomers } = useQuery(CUSTOMERS);
    const { loading: loadingEmployees, data: dataEmployees } = useQuery(EMPLOYEES);

    const handleOpenModal = () => {
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const handleOpen = () => {

    }

    const handleChangeFilters = newFilters => {
		try {
			setFilters(newFilters);
			if (!!refetch) refetch(newFilters);
		} catch (error) {
			console.warn(error);
		}
	};

	const onScrollYReachEnd = () => {
		if (data.parts.rows.length < data.parts.count && !loadingMore) {
			loadMore();
		}
	};

	const loadMore = async () => {
		setLoadingMore(true);
		await fetchMore({
			variables: {
				options: {
					offset: data.parts.rows.length,
					limit: limit
				}
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!fetchMoreResult) {
					return prev;
				}
				return {
					...prev,
					parts: {
						...prev.parts,
						rows: [...prev.parts.rows, ...fetchMoreResult.parts.rows],
						count: fetchMoreResult.parts.count
					}
				};
			}
		});
		setLoadingMore(false);
	};

    return(
        <div className={classes.containerBG}>
			<Bar />
			<div
				style={{
					height: "calc(100% - 84px)",
					width: "calc(100% - 20px)",
					padding: "10px 10px 10px 10px"
				}}
			>
                <ActionsBar
                    height={100}
                    handleChangeFilters={handleChangeFilters}
                    loading={loading}
                    handleAdd={(employee.role !== ROLES.TECHNICIAN) ? handleOpenModal : null}
                />

                <div
                    style={{
                        height: "30px",
                        minHeight: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white"
                    }}
                >
                    {(!loading )&&
                        <React.Fragment>
                            {" "}
                            {translations.showing} {data.parts.rows.length}{" "}
                            {translations.of} {data.parts.count}{" "}
                        </React.Fragment>
                    }
                </div>

                <div
                    style={{
                        height: isMobile ? "calc(100% - 180px)"  : "calc(100% - 150px)",
                        width: "calc(100% - 20px)",
                        display: "flex",
                        padding: "10px",
                        backgroundColor: "white",
                        borderRadius: "6px"
                    }}
                >
                    {(loading || loadingCustomers || loadingEmployees) ?
							<div
								style={{
									display: "flex",
									height: "100%",
									width: "100%"
								}}
							>
								<Loading />
							</div>
						: 
                            <React.Fragment>
                                {((employee.role === ROLES.MANAGER) || (employee.role === ROLES.SELLER)) ?
                                        <ManagerSeller 
                                            parts={data.parts.rows}
                                            handleOpen={handleOpen}
                                            loadingMore={loadingMore}
                                            onScrollYReachEnd={onScrollYReachEnd}
                                        />           
                                    :
                                        <Technician 
                                            parts={data.parts.rows}
                                            handleOpen={handleOpen}
                                            loadingMore={loadingMore}
                                            onScrollYReachEnd={onScrollYReachEnd}
                                        />
                                }
                            </React.Fragment>
                    }
                </div>
            </div>

            {openModal &&
                <PartModal 
                    open={openModal}
                    handleClose={handleCloseModal}
                    handleSave={handleCloseModal}
                    adding={false}
                    updating={false}
                    part={{}}
                    customers={dataCustomers.customers}
                    employees={dataEmployees.employees}
                />
            }
        </div>
    )
}

/* 
    <div>
        SAT
        <Map
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC_3n9LwBnYiF_Flak6JKB7FkbtjL0KHH8&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
        />
    </div>
*/

export default SAT;