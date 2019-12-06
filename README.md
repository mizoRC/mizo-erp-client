# Mizo ERP - Client
MizoERP es un ERP CLOUD de código abierto desarrollado por Miguel Rodríguez Crespo para el proyecto de CS DAW a distancia.

Este proyecto es la parte de cliente desarrollada en React JS.

## Requisitos
- Tener instalado [yarn](https://yarnpkg.com/lang/en/)
- Ejecutar la parte de [servidor](https://github.com/miguelrcDEV/mizo-erp-api) hecha en nodejs antes de proceder a la ejecución del cliente

## Preparar ejecución
- Instalamos las librerías del proyecto ejecutando `yarn install` en la raíz del proyecto.
- Creamos un archivo .env en la raíz del proyecto con las variables necesarias:    
    - REACT_APP_API_URL=<backend_graphql_url>
    - REACT_APP_GOOGLE_MAPS_APIKEY=<tu_apikey_de_google_maps_api>
- Por último ejecutamos el proyecto con `yarn start` en la raíz del proyecto.

Puedes acceder a [localhost:3000](http://localhost:3000) para ver el cliente ejecutandose.