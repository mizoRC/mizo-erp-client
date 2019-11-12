import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, MenuItem, Card, CardActionArea, Tooltip, CircularProgress, InputAdornment } from '@material-ui/core';
import ReactBarcode from 'react-barcode';
import { TranslatorContext } from '../../../contextProviders/Translator';
import { toBase64 } from '../../../utils/files';
import CameraIcon from '../../../assets/camera.svg'

const AddProductModal = ({open, handleClose, handleSave, adding, updating, product, categories}) => {
	const barcodeRef = React.useRef();
	const fileInput = React.useRef();
	const { translations } = React.useContext(TranslatorContext);
	const [name, setName] = React.useState();
    const [brand, setBrand] = React.useState();
	const [barcode, setBarcode] = React.useState();
	const [price, setPrice] = React.useState();
	const [vat, setVat] = React.useState();
	const [category, setCategory] = React.useState();
	const [image, setImage] = React.useState();
	const [base64Image, setBase64Image] = React.useState();
    const [errorEmptyName, setErrorEmptyName] = React.useState(false);
    const [errorEmptyBarcode, setErrorEmptyBarcode] = React.useState(false);
    const [errorEmptyPrice, setErrorEmptyPrice] = React.useState(false);
    const [errorEmptyVat, setErrorEmptyVat] = React.useState(false);

	React.useEffect(() => {
		if(!!barcodeRef && !!barcodeRef.current && !!barcodeRef.current.refs && !!barcodeRef.current.refs.renderElement){
			barcodeRef.current.refs.renderElement.setAttribute('width','100%');
		}
	},[barcode]);

    React.useEffect(() => {
        setName(product.name);
        setBrand(product.brand);
        setBarcode(product.barcode);
        setPrice((!!product && !!product.price) ? product.price : 0);
        setVat((!!product && !!product.vat) ? product.vat : 21);
        setCategory(product.categoryId);
        setImage((!!product && !!product.image) ? product.image : CameraIcon);
        setBase64Image((!!product && !!product.image) ? product.image : null);
    }, [product]);

	const handleChangeName = event => {
		setName(event.target.value);		
	}

    const handleChangeBrand = event => {
		setBrand(event.target.value);		
	}
	
	const handleChangeBarcode = event => {
		setBarcode(event.target.value);
	}

	const handleChangePrice = event => {
		setPrice(parseFloat(event.target.value));
	}

	const handleChangeVat = event => {
		setVat(parseFloat(event.target.value));
	}

	const handleChangeCategory = event => {
        setCategory(event.target.value);
	}

	const handleChangeImage = async event => {
        if(!!event && !!event.target && !!event.target.files && !!event.target.files[0]){
            const loadedFile = URL.createObjectURL(event.target.files[0]);
            const b64File = await toBase64(event.target.files[0]); 
            setImage(loadedFile);
            setBase64Image(b64File);
        }
    }

	const handleImageClick = () => {
        if(!!fileInput && !!fileInput.current) fileInput.current.click();
    }

    const checkErrors = () => {
        let hasErrors = false;

        const isEmptyName = (!name || name === "" || name === null) ? true : false;
        const isEmptyBarcode = (!barcode || barcode === "" || barcode === null) ? true : false;
        const isEmptyPrice = (price === "" || price === null || Number.isNaN(price)) ? true : false;
        const isEmptyVat = (!vat || vat === "" || vat === null) ? true : false; 

        setErrorEmptyName(isEmptyName);
        setErrorEmptyBarcode(isEmptyBarcode);
        setErrorEmptyPrice(isEmptyPrice);
        setErrorEmptyVat(isEmptyVat);

        hasErrors = isEmptyName || isEmptyBarcode || isEmptyPrice || isEmptyVat;

        return hasErrors;
    };

    const save = () => {
        const hasErrors = checkErrors();

        if(!hasErrors){
            if(!!handleSave){
                let productSave = {
                    name: name,
                    brand: brand,
                    barcode: barcode,
                    price: price,
                    vat: vat,
                    categoryId: category,
                    image: base64Image
                };
                if(product.id) productSave.id = product.id;

                handleSave(productSave);
            }
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
				maxWidth="sm"
			>
				<DialogTitle style={{textAlign: 'center'}}>
					{translations.product}
				</DialogTitle>
				<DialogContent>
					<Grid container spacing={4}>
						<Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									padding: '4px',
    								height: '100%'
								}}
							>
								<Tooltip title={translations.changeImage}>
									<Card
										style={{
											display: 'flex',
											width: '100%'
										}}
									>
										<CardActionArea onClick={handleImageClick} style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
											<img alt="product_image" src={image} style={{width: '100%', maxHeight: '210px'}}/>
										</CardActionArea>
										<input ref={fileInput} type="file" onChange={handleChangeImage} style={{position: 'absolute', width: '0px', height: '0px', left: '-999999px'}}/>
									</Card>
								</Tooltip>

								{barcode && (barcode !== '') &&
									<div style={{width: '100%', maxWidth: '100%'}}>
										<ReactBarcode 
											ref={barcodeRef} 
											value={barcode} 
											format={"EAN13"} 
											height={40}
										/>
									</div>
								}
							</div>
						</Grid>

						<Grid item xs={12} sm={6} md={8} lg={8} xl={9}>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									width: '100%',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								<TextField
									autoFocus
									margin="dense"
									id="name"
									label={translations.name}
									type="text"
									value={name}
									fullWidth
									variant="outlined"
									onChange={handleChangeName}
                                    error={errorEmptyName}
								/>
                                <TextField
									autoFocus
									margin="dense"
									id="name"
									label={translations.brand}
									type="text"
									value={brand}
									fullWidth
									variant="outlined"
									onChange={handleChangeBrand}
								/>
								<TextField
									margin="dense"
									id="barcode"
									label={translations.barcode}
									type="text"
									value={barcode}
									fullWidth
									variant="outlined"
									onChange={handleChangeBarcode}
                                    error={errorEmptyBarcode}
								/>
								<TextField
									margin="dense"
									id="price"
									label={translations.price}
									type="number" 
									inputProps={{ min: "0", step: "0.01" }}
									value={price}
									fullWidth
									variant="outlined"
									onChange={handleChangePrice}
                                    error={errorEmptyPrice}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">€</InputAdornment>
                                    }}
								/>
								<TextField
									margin="dense"
									id="vat"
									label={translations.vat}
									type="number" 
									inputProps={{ min: "0", step: "0.1" }}
									value={vat}
									fullWidth
									variant="outlined"
									onChange={handleChangeVat}
                                    error={errorEmptyVat}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}
								/>
								<div
									style={{
										width: '100%',
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center'
									}}
								>
									<TextField
										id="outlined-select-currency"
										select
										label={translations.category}
										value={category}
										onChange={handleChangeCategory}
										margin="normal"
										variant="outlined"
										fullWidth={true}
										disabled={categories.length === 0}
									>
										<MenuItem key={0} value={null}>
                                            {translations.neither}
										</MenuItem>
										{categories.map(category => {
											return(
												<MenuItem key={category.id} value={category.id}>
													{category.name}
												</MenuItem>
											)
										})}
									</TextField>
								</div>
							</div>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} disabled={(adding || updating)} color="default">
						{translations.cancel}
					</Button>
					<Button onClick={save} disabled={(adding || updating)} color="primary">
						<div
                            style={{
                                display: 'flex',
                                flexDirection:' row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {translations.save}
                            {(adding || updating) &&
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

export default AddProductModal;