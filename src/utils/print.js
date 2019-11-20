export const printTicket = () => {
    let mywindow = window.open('', 'IMPRIMIR TICKET', "fullscreen=yes");
    let content = (document.getElementById('mizo-erp-pos-ticket')) ? (document.getElementById('mizo-erp-pos-ticket')).innerHTML : '';

    var htmlToPrint = `
        <style type="text/css">
            html,body {
                font-size: 12px !important;
                font-family: 'Lucida Console'
            }
            table {
                border-spacing:6px;
                table-layout: fixed;
            }
            table th{
                border-bottom:2px solid #000;
            }
            #companyName {
                fontSize: 14px !important;
            }
        </style>
        ${content}
    `;


    mywindow.document.write('<html>');
    mywindow.document.write('<body >');
    mywindow.document.write(htmlToPrint);
    mywindow.document.write('</body></html>');

    setTimeout(function() {
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/
        mywindow.print();
        mywindow.close();
    }, 250);
}