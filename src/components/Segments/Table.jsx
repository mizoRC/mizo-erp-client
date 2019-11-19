import React from 'react';
import MaterialTable from 'material-table';
import { TranslatorContext } from '../../contextProviders/Translator';

const Table = ({title, columns, data, editable, ...props}) => {
    const { translations } = React.useContext(TranslatorContext);
    const localization = {
        header: { 
            actions: translations.actions
        },
        body: {
            emptyDataSourceMessage: translations.noRecords,
            addTooltip: translations.add,
            editTooltip: translations.edit,
            deleteTooltip: translations.delete,
            editRow: {
                cancelTooltip: translations.cancel,
                saveTooltip: translations.save,
                deleteText: translations.sureDelete
            }
        },
        toolbar: {
            searchPlaceholder: translations.search,
            searchTooltip: translations.search
        },
        pagination: {
            labelRowsSelect: translations.rowsLowercase,
            labelDisplayedRows: translations.labelDisplayedRows || "{from}-{to} de {count}",
            firstAriaLabel: translations.firstPage,
            firstTooltip: translations.firstPage,
            previousAriaLabel: translations.previousPage,
            previousTooltip: translations.previousPage,
            nextAriaLabel: translations.nextPage,
            nextTooltip: translations.nextPage,
            lastAriaLabel: translations.lastPage,
            lastTooltip: translations.lastPage,
        }
    };

    return(
        <MaterialTable
            title={title}
            columns={columns}
            data={data} 
            editable={editable}
            localization={localization}
            {...props}
        />
    )
}

export default Table;