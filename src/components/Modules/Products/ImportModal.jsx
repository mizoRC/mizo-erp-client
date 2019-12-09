import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Typography, TextField } from '@material-ui/core';
import readXlsxFile from 'read-excel-file'
import { TranslatorContext } from '../../../contextProviders/Translator';
import ImportImg from '../../../assets/import.svg';
import template from '../../../datasheets/productsTemplate.xlsx';
import { error } from '../../../styles/colors';

const ImportModal = ({open, handleClose, handleImport, importing}) => {
	const { translations } = React.useContext(TranslatorContext);
	const [file, setFile] = React.useState();
    const [errorEmptyFile, setErrorEmptyFile] = React.useState(false);

    const handleChangeFile = event => {
        const newFile = event.target.files[0];
        setFile(newFile);
    }
    const handleProcessExcel = async() => {
        return new Promise((resolve, reject) => {
            return readXlsxFile(file).then((rows) => {
                rows.shift();
                resolve(rows);
            });
        });
    }

    const checkErrors = () => {
        let hasErrors = false;

        const isEmptyFile = (!file || file === "" || file === null) ? true : false;

        setErrorEmptyFile(isEmptyFile);

        hasErrors = isEmptyFile;

        return hasErrors;
    };

    const getProductsTemplateFromExcelRows = (rows) => {
        let products = [];
        
        rows.forEach(row => {
            const newProduct = {
                name: row[0],
                brand: row[1],
                barcode: row[2],
                price: row[3],
                image: row[5],
                vat: row[4]
            }
            products.push(newProduct);
        })

        return products;
    }

    const importProducts = async() => {
        const hasErrors = checkErrors();

        if(!hasErrors && !!handleImport){
            const rows = await handleProcessExcel();
            const products = getProductsTemplateFromExcelRows(rows);
            handleImport(products);
        }
    }

	return (
		<div>
			<Dialog 
				open={open} 
				onClose={handleClose}
				disableBackdropClick={true}
				disableEscapeKeyDown={true}
				fullWidth={true}
				maxWidth="xs"
			>
				<DialogTitle style={{textAlign: 'center'}}>
					{translations.importProducts}
				</DialogTitle>
				<DialogContent>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <img
                            src={ImportImg}
                            alt="import_image"
                            style={{
                                maxWidth: '300px'
                            }}
                        />
                        
                        <Button color="secondary" style={{marginTop: '20px', marginBottom: '10px'}}>
                            <a href={template} download={`${translations.template}.xlsx`} style={{color: 'inherit', textDecoration: 'none'}}>
                                <i className="fas fa-download" style={{marginRight: '8px'}}></i> {translations.downloadTemplate}
                            </a>
                        </Button>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row'
                            }}                        
                        >
                            <div>
                                <input
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    style={{display: 'none'}}
                                    id="contained-button-file"
                                    multiple
                                    type="file"
                                    onChange={handleChangeFile}
                                />
                                <label htmlFor="contained-button-file">
                                    <Button variant="contained" color="primary" component="span" style={{marginTop: '10px', marginBottom: '20px'}}>
                                        <i className="fas fa-upload" style={{marginRight: '8px'}}></i> {translations.uploadFile}
                                    </Button>
                                </label>
                            </div>

                            {(!!file && !!file.name) &&
                                <TextField 
                                    label={translations.file}
                                    value={file.name}
                                    disabled={true}
                                    style={{
                                        marginLeft: '15px'
                                    }}
                                />
                            }
                        </div>

                        {errorEmptyFile &&
                            <Typography variant="subtitle1" style={{color: error}}>
                                {translations.uploadFileRequired}
                            </Typography>
                        }
                    </div>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} disabled={importing} color="default">
						{translations.cancel}
					</Button>
					<Button onClick={importProducts} disabled={importing} color="primary">
                        <div
                            style={{
                                display: 'flex',
                                flexDirection:' row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {translations.import}
                            {importing &&
                                <div style={{marginLeft: '6px', display: 'flex', alignItems: 'center'}}>
                                    <CircularProgress size={20} color="secondary" />
                                </div>
                            }
                        </div>
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default ImportModal;