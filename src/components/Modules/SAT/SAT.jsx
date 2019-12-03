import React from 'react';
import { makeStyles, BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
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
                type {
                    mounting
                    maintenance
                    repair
                    others
                }
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

const ADD_PART = gql`
    mutation addPart($part: PartInput!) {
        addPart(part: $part) {
            id
            partId
        }
    }
`;

const UPDATE_PART = gql`
    mutation updatePart($part: PartInputUpdate!) {
        updatePart(part: $part) {
            id
            partId
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

const TECHNICIANS = gql`
    query technicians {
        technicians {
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
    const [part, setPart] = React.useState({});
    const [openModal, setOpenModal] = React.useState(false);
    const [tab, setTab] = React.useState('parts');
    const [loadingMore, setLoadingMore] = React.useState(false);
    const { loading, data, refetch, fetchMore } = useQuery(PARTS, {
		fetchPolicy: "network-only",
		variables: filters
	});
    const [ addPart, {loading: addingPart} ] = useMutation(ADD_PART, {
        refetchQueries: [{query: PARTS, variables: filters}],
        awaitRefetchQueries: true
    });
    const [ updatePart, {loading: updatingPart} ] = useMutation(UPDATE_PART, {
        refetchQueries: [{query: PARTS, variables: filters}],
        awaitRefetchQueries: true
    });
    const { loading: loadingCustomers, data: dataCustomers } = useQuery(CUSTOMERS);
    const { loading: loadingTechnicians, data: dataTechnicians } = useQuery(TECHNICIANS);

    const handleOpen = part => {
        const {__typename, ...selectedPart} = part;
        setPart(selectedPart);
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const handleSave = async part => {
        if(!!part.id){
            const {__typename, ...partType} = part.type;
            const partToUpdate = {
                ...part,
                type: partType
            }
            await updatePart({variables:{part:partToUpdate}});
        }
        else{
            await addPart({variables:{part:part}});
        }
        setOpenModal(false);
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
                    handleAdd={(employee.role !== ROLES.TECHNICIAN) ? handleOpen : null}
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
                        height: isMobile ? "calc(100% - 240px)"  : "calc(100% - 150px)",
                        width: "calc(100% - 20px)",
                        display: "flex",
                        padding: "10px",
                        backgroundColor: "white",
                        borderRadius: "6px"
                    }}
                >
                    {(loading || loadingCustomers || loadingTechnicians) ?
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
                                            tab={tab}
                                            parts={data.parts.rows}
                                            handleOpen={handleOpen}
                                            loadingMore={loadingMore}
                                            onScrollYReachEnd={onScrollYReachEnd}
                                        />
                                }
                            </React.Fragment>
                    }
                </div>

                {isMobile &&
                    <BottomNavigation
                        value={tab}
                        onChange={(event, newValue) => {
                            setTab(newValue);
                        }}
                        showLabels
                        style={{
                            position: 'absolute',
                            bottom: '0px',
                            right: '0px',
                            left: '0px'
                        }}
                    >
                        <BottomNavigationAction label={translations.parts} value="parts" icon={<i className="fas fa-tasks"></i>} />
                        <BottomNavigationAction label={translations.map} value="map" icon={<i className="fas fa-map-marked-alt"></i>} />
                    </BottomNavigation>
                }
            </div>

            {openModal &&
                <PartModal 
                    open={openModal}
                    handleClose={handleCloseModal}
                    handleSave={handleSave}
                    adding={false}
                    updating={false}
                    part={part}
                    customers={dataCustomers.customers}
                    employees={dataTechnicians.technicians}
                    isTechnician={employee.role === ROLES.TECHNICIAN}
                />
            }
        </div>
    )
}

export default SAT;