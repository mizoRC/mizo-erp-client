import React from 'react';
import MaterialTable from 'material-table';
import { TranslatorContext } from '../../contextProviders/Translator';

const Table = ({title, columns, data, editable}) => {
    const { translations } = React.useContext(TranslatorContext);
    const localization = {
        body: {
            addTooltip: "Añadir",
            editTooltip: "Editar",
            deleteTooltip: "Borrar",
            editRow: {
                cancelTooltip: "Cancelar",
                saveTooltip: "Guardar",
                deleteText: "¿Estás seguro de que quieres borrarla?"
            }
        },
        toolbar: {
            searchPlaceholder: "Buscar",
            searchTooltip: "Buscar"
        },
        pagination: {
            labelRowsSelect: 'filas',
            labelDisplayedRows: "{from}-{to} de {count}",
            firstAriaLabel: "Primera página",
            firstTooltip: "Primera página",
            previousAriaLabel: "Página anterior",
            previousTooltip: "Página anterior",
            nextAriaLabel: "Siguiente página",
            nextTooltip: "Siguiente página",
            lastAriaLabel: "Última página",
            lastTooltip: "Última página",
        }
    };

    return(
        <MaterialTable
            title={title}
            columns={columns}
            data={data} 
            editable={editable}
            localization={localization}
        />
    )
}

export default Table;