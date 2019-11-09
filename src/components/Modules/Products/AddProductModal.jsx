import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, MenuItem, Card, CardActionArea, Tooltip, Fab } from '@material-ui/core';
import ReactBarcode from 'react-barcode';
import { TranslatorContext } from '../../../contextProviders/Translator';
import { toBase64 } from '../../../utils/files';
import CameraIcon from '../../../assets/camera.svg'

const AddProductModal = ({open, handleClose, handleSave, product, categories}) => {
	const barcodeRef = React.useRef();
	const fileInput = React.useRef();
	const { translations } = React.useContext(TranslatorContext);
	const [name, setName] = React.useState();
	const [barcode, setBarcode] = React.useState();
	const [price, setPrice] = React.useState();
	const [vat, setVat] = React.useState(21);
	const [category, setCategory] = React.useState();
	const [image, setImage] = React.useState((!!product && !!product.image) ? product.image : CameraIcon);
	const [base64Image, setBase64Image] = React.useState();
	const [showAddCategory, setShowAddCategory] = React.useState(false);
	const [newCategory, setNewCategory] = React.useState('');

	React.useEffect(() => {
		if(!!barcodeRef && !!barcodeRef.current && !!barcodeRef.current.refs && !!barcodeRef.current.refs.renderElement){
			barcodeRef.current.refs.renderElement.setAttribute('width','100%');
		}
	},[barcode]);

	const handleChangeName = event => {
		setName(event.target.value);		
	}
	
	const handleChangeBarcode = event => {
		setBarcode(event.target.value);
	}

	const handleChangePrice = event => {
		setPrice(event.target.value);
	}

	const handleChangeVat = event => {
		setVat(event.target.value);
	}

	const handleChangeCategory = event => {

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

	const handleChangeNewCategory = event => {
		setNewCategory(event.target.value);
	}

	const handleSaveNewCategory = () => {
		setShowAddCategory(false);
	}

	const handleShowNewCategory = () => {
		setShowAddCategory(!showAddCategory);
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
											<img alt="product_image" src={image} style={{width: '100%'}}/>
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
										<MenuItem value="">
										</MenuItem>
										{categories.map(category => {
											return(
												<MenuItem value={category.id}>
													{category.name}
												</MenuItem>
											)
										})}
									</TextField>

									<Tooltip title={(showAddCategory) ? translations.cancel : translations.addCategory}>
										<Fab 
											color="primary" 
											size="small" 
											onClick={handleShowNewCategory}
											style={{
												marginLeft: '6px',
												height: '40px',
												width: '40px',
												minWidth: '40px',
												minHeight: '40px',
												marginTop: '8px'
											}}
										>
											{showAddCategory ?
													<i className="fas fa-chevron-up"></i>
												:
													<i className="fas fa-plus"></i>
											}
										</Fab>
									</Tooltip>
								</div>

								{showAddCategory &&
									<div
										style={{
											width: '80%',
											display: 'flex',
											flexDirection: 'row',
											marginLeft: '20px'
										}}
									>
										<TextField
											margin="dense"
											id="newCategory"
											label={translations.newCategory}
											type="text"
											value={newCategory}
											fullWidth
											onChange={handleChangeNewCategory}
										/>

										<Fab 
											color="primary" 
											size="small" 
											onClick={handleSaveNewCategory}
											style={{
												marginLeft: '6px',
												height: '40px',
												width: '40px',
												minWidth: '40px',
												minHeight: '40px',
												marginTop: '8px'
											}}
										>
											<i className="far fa-save"></i>
										</Fab>
									</div>
								}
							</div>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="default">
						{translations.cancel}
					</Button>
					<Button onClick={handleSave} color="primary">
						{translations.save}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default AddProductModal;