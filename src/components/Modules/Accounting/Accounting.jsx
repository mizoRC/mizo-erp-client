import React from "react";
import { makeStyles, Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import PerfectScrollbar from "react-perfect-scrollbar";
import { TranslatorContext } from "../../../contextProviders/Translator";
import { PAYMENT_METHODS } from '../../../constants';
import { formatDate } from '../../../utils/format';
import * as mainStyles from "../../../styles";
import Bar from "../../Segments/Bar";
import Loading from "../../Segments/Loading";
import ActionsBar from "./ActionsBar";
import OrderModal from "./OrderModal";

import loadingWhiteSVG from "../../../assets/loading_white.svg";
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

const ORDERS = gql`
	query orders($filters: [Filter]!, $options: Options!) {
		orders(filters: $filters, options: $options) {
			rows {
				id
				ticketId
				total
				customer{
                    id
                    name
                }
				employee{
                    name
                    surname
                }
				paymentMethod
				creationDate
			}
			count
		}
	}
`;

const COMPANY = gql`
    query company {
        company {
            id
            name
            country
            address
            phone
            logo
        }
    }
`;

const Accounting = () => {
	const classes = useStyles();
	const { translations } = React.useContext(TranslatorContext);
	const [open, setOpen] = React.useState(false);
	const [order, setOrder] = React.useState();
	const [filters, setFilters] = React.useState(defaultFilters);
	const [loadingMore, setLoadingMore] = React.useState(false);
	const { loading, data, refetch, fetchMore } = useQuery(ORDERS, {
		fetchPolicy: "network-only",
		variables: filters
	});
    const { loading: loadingCompany, data: dataCompany } = useQuery(COMPANY, {
        fetchPolicy: "network-only"
    });

	const handleOpen = order => {
		const { __typename, ...selectedOrder } = order;
		setOrder(selectedOrder);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleChangeFilters = newFilters => {
		try {
			setFilters(newFilters);
			if (!!refetch) refetch(newFilters);
		} catch (error) {
			console.warn(error);
		}
	};

	const onScrollYReachEnd = () => {
		if (data.orders.rows.length < data.orders.count && !loadingMore) {
			loadMore();
		}
	};

	const loadMore = async () => {
		setLoadingMore(true);
		await fetchMore({
			variables: {
				options: {
					offset: data.orders.rows.length,
					limit: limit
				}
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				if (!fetchMoreResult) {
					return prev;
				}
				return {
					...prev,
					orders: {
						...prev.orders,
						rows: [...prev.orders.rows, ...fetchMoreResult.orders.rows],
						count: fetchMoreResult.orders.count
					}
				};
			}
		});
		setLoadingMore(false);
	};

	return (
		<div className={classes.containerBG}>
			<Bar />
			<div
				style={{
					height: "calc(100% - 84px)",
					width: "calc(100% - 20px)",
					padding: "10px 10px 10px 10px"
				}}
			>
				<div
					style={{
						height: "100%",
						width: "100%",
						display: "flex",
						flexDirection: "column"
					}}
				>
					<ActionsBar
						height={100}
						handleChangeFilters={handleChangeFilters}
						loading={loading}
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
						{!loading && (
							<>
								{" "}
								{translations.showing} {data.orders.rows.length}{" "}
								{translations.of} {data.orders.count}{" "}
							</>
						)}
					</div>

					<div
						style={{
							height: "calc(100% - 150px)",
							width: "calc(100% - 20px)",
							display: "flex",
							padding: "10px",
							backgroundColor: "white",
							borderRadius: "6px"
						}}
					>
						{(loading || loadingCompany) ? (
							<div
								style={{
									display: "flex",
									height: "100%",
									width: "100%"
								}}
							>
								<Loading />
							</div>
						) : (
							<PerfectScrollbar
								onYReachEnd={onScrollYReachEnd}
								style={{ width: "100%" }}
							>
								<Table stickyHeader aria-label="sticky table">
									<TableHead>
										<TableRow>
                                            {/* <TableCell
                                                align="center"
                                            >
                                                {translations.actions}
                                            </TableCell> */}
                                            <TableCell
                                                align="center"
                                            >
                                                {translations.invoice}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                            >
                                                {translations.date}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                            >
                                                {translations.total}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                            >
                                                {translations.paymentMethod}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                            >
                                                {translations.customer}
                                            </TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{data.orders.rows.map(order => (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={order.id}
                                                onClick={() => {handleOpen(order)}}
                                            >
                                                {/* <TableCell align="center">
                                                    <IconButton 
                                                        onClick={() => {print(order)}}
                                                        color="primary"
                                                    >
                                                        <i className="fas fa-print"></i>
                                                    </IconButton>
                                                </TableCell> */}
                                                <TableCell align="center">
                                                    {order.ticketId}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {formatDate(order.creationDate)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {order.total}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {(order.paymentMethod === PAYMENT_METHODS.CASH) ?
                                                        <i className="far fa-money-bill-alt" style={{marginRight: '10px'}}></i>
                                                        :
                                                        <i className="far fa-credit-card" style={{marginRight: '10px'}}></i>
                                                    }
                                                </TableCell>
                                                <TableCell align="center">
                                                    {(!!order.customer && !!order.customer.name) ? order.customer.name : ""}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {loadingMore && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginTop: "5px"
                                                }}
                                            >
                                                <img
                                                    src={loadingWhiteSVG}
                                                    alt="loadingIcon"
                                                    style={{ maxWidth: "80px" }}
                                                />
                                            </div>
                                        )}
									</TableBody>
								</Table>
							</PerfectScrollbar>
						)}
					</div>
				</div>
			</div>

			{open && !!order && !!order.id && (
				<OrderModal open={open} handleClose={handleClose} ticketId={order.ticketId} company={dataCompany.company} customerId={(!!order && !!order.customer && order.customer.id) ? order.customer.id : null} />
			)}
		</div>
	);
};

export default Accounting;
