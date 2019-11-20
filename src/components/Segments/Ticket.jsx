import React from 'react';
import ReactBarcode from 'react-barcode';
import { TranslatorContext } from '../../contextProviders/Translator';

const Ticket = ({order, company}) => {
    const barcodeRef = React.useRef();
    const { translations } = React.useContext(TranslatorContext);

    React.useEffect(() => {
		if(!!barcodeRef && !!barcodeRef.current && !!barcodeRef.current.refs && !!barcodeRef.current.refs.renderElement){
			barcodeRef.current.refs.renderElement.setAttribute('width','100%');
		}
	},[order]);

    const pad = (number) => {
        return (number < 10) ? '0' + number : number;
    }

    const getCurrentDate = () => {
        let date = new Date();
        let dateString = [pad(date.getDate()), pad(date.getMonth()+1), date.getFullYear()].join('/');
        return dateString;
    }

    const getCurrentTime = () => {
        let date = new Date();
        let timeString = [pad(date.getHours()), pad(date.getMinutes())].join(':');
        return timeString;
    }

    const calculateTaxBase = (total) => {
        let vat_percentage = 0.21;
        let taxBase = 0;
        let quota = total * vat_percentage;
        taxBase = total - quota;
        taxBase = taxBase.toFixed(2);
        return taxBase;
    }

    const calculateTaxCuota = (total) => {
        let vat_percentage_quota = 0.21;
        let quota = 0;
        quota = total * vat_percentage_quota;
        quota = quota.toFixed(2);
        return quota;
    }

    return(
        <div 
            id="mizo-erp-pos-ticket"
            style={{
                height: '100%',
                width: 'calc(100% - 16px)',
                fontSize:'10px', 
                padding: '8px'
            }}
        >
            {/*LOGO*/}
            <div style={{textAlign:'center', marginTop: '10px', marginBottom: '10px'}}>
                <img src={company.logo} alt="logo" style={{maxWidth:'250px', maxHeight:'40px'}}/>
            </div>

            {/*ENCABEZADO*/}
            <div style={{textAlign: 'center', marginBottom: '5px'}}>
                <div id="companyName" style={{marginBottom:'4px', fontSize: '12px'}}>{company.name}</div>
                <div style={{marginBottom:'4px'}}>{translations.address}: {company.address}</div>
                <div style={{marginBottom:'4px'}}>{translations.phone}: {company.phone}</div>
                <div style={{marginBottom:'4px'}}>{translations.srpVatIncluded}</div>
                {order.ticketId &&
                    <div>
                        {translations.simplifiedInvoice}: {order.ticketId}
                    </div>
                }
            </div>

            <div 
                style={{
                    width: '100%', 
                    maxWidth: '100%', 
                    marginBottom: '10px',
                    maxHeight: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <ReactBarcode 
                    ref={barcodeRef} 
                    value={order.ticketId} 
                    format={"CODE128"} 
                    height={100}
                    displayValue={false}
                />
            </div>

            {/*FECHA*/}
            <div style={{textAlign:'right', marginBottom: '20px'}}>
                <div>
                    {getCurrentDate()}
                </div>
                <div>
                    {getCurrentTime()}
                </div>
            </div>

            {/*LISTADO*/}
            <table style={{fontSize:'12px', marginBottom: '20px'}}>
                <colgroup>
                    <col width='60%' />
                    <col width='10%' />
                    <col width='30%' />
                </colgroup>
                <tbody>
                    <tr>
                        <th style={{textAlign: 'left'}}>
                            {translations.productUC}
                        </th>
                        <th style={{textAlign: 'right'}}>
                            {translations.unitsUC}
                        </th>
                        <th style={{textAlign: 'right'}}>
                            {translations.priceUC}
                        </th>
                    </tr>

                    {order && order.lines.map((line, index) =>
                        <tr style={{marginBottom: '2px'}} key={index}>
                            <td style={{textOverflow: 'ellipsis'}}>
                                {line.name} {line.brand}
                            </td>
                            <td style={{textAlign: 'right'}}>
                                {line.units}
                            </td>
                            <td style={{textAlign: 'right'}}>
                                {line.price} €
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/*TOTAL*/}
            <div style={{fontSize:'18px', fontWeight: 'bold', marginBottom: '20px'}}>
                <span>
                    {translations.totalUC}
                </span>
                {order && 
                    <span style={{float: 'right'}}>
                        {order.total} €
                    </span>
                }
            </div>

            <table style={{textAlign: 'center', fontSize: '12px', margin: '0 auto'}}>
                <colgroup>
                    <col width='33%' />
                    <col width='33%' />
                    <col width='33%' />
                </colgroup>

                <tbody>
                    <tr>
                        <td>
                            {translations.vatUC}
                        </td>

                        <td>
                            {translations.taxBase}
                        </td>

                        <td>
                            {translations.fee}
                        </td>
                    </tr>

                    <tr>
                        <td>
                            21 %
                        </td>

                        {order && 
                            <React.Fragment>
                                <td>
                                    {calculateTaxBase(order.total)}
                                </td>

                                <td>
                                    {calculateTaxCuota(order.total)}
                                </td>
                            </React.Fragment>
                        }
                    </tr>

                    <tr>
                        <td>
                            {translations.total}:
                        </td>

                        {order && 
                            <React.Fragment>
                                <td>
                                    {calculateTaxBase(order.total)}
                                </td>

                                <td>
                                    {calculateTaxCuota(order.total)}
                                </td>
                            </React.Fragment>
                        }
                    </tr>
                </tbody>
            </table>

            {/*PIE*/}
            <div style={{marginTop: '20px'}}>
                <div style={{textAlign: 'center', marginBottom: '10px'}}>
                    {translations.thanksForYourVisit}
                </div>
                <div style={{textAlign: 'justify'}}>
                    {translations.ticketChangeReturnMessage} <span style={{fontWeight: 'bold'}}>{translations.ticketChangeReturnDaysMessage}</span>.
                </div>
            </div>

        </div>
    )
}

export default Ticket;