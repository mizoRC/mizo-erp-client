import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";
import PerfectScrollbar from "react-perfect-scrollbar";
import { TranslatorContext } from "../../../contextProviders/Translator";
import { formatDate } from '../../../utils/format';
import loadingWhiteSVG from "../../../assets/loading_white.svg";
import { primary } from '../../../styles/colors';

const Manager = ({parts, handleOpen, loadingMore, onScrollYReachEnd}) => {
    const { translations } = React.useContext(TranslatorContext);

    return (
        <PerfectScrollbar
            onYReachEnd={onScrollYReachEnd}
            style={{ width: "100%" }}
        >
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell
                            align="center"
                        >
                            {translations.customer}
                        </TableCell>
                        <TableCell
                            align="center"
                        >
                            {translations.technician}
                        </TableCell>
                        <TableCell
                            align="center"
                        >
                            {translations.date}
                        </TableCell>
                        <TableCell
                            align="center"
                        >
                            {translations.reason}
                        </TableCell>
                        <TableCell
                            align="center"
                        >
                            {translations.finishedAssistance}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {parts.map(part => (
                        <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={part.id}
                            onClick={() => {handleOpen(part)}}
                        >
                            <TableCell align="center">
                                {part.customer.name}
                            </TableCell>
                            <TableCell align="center">
                                {part.employee.name} {part.employee.surname}
                            </TableCell>
                            <TableCell align="center">
                                {formatDate(part.date)}
                            </TableCell>
                            <TableCell align="center">
                                {part.reason}
                            </TableCell>
                            <TableCell align="center">
                                {part.finished &&
                                    <i className="fas fa-check" style={{color: primary}}></i>
                                }
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
    )
}

export default Manager;