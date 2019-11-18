import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, MenuItem, Card, CardActionArea, Tooltip, CircularProgress, InputAdornment, makeStyles } from '@material-ui/core';
import { TranslatorContext } from '../../../contextProviders/Translator';

const useStyles = makeStyles(theme => ({
    deleteButton: {
        boxShadow: 'none',
        color: "#FF3232",
        '&:hover': {
            backgroundColor: "rgb(255,50,50,0.1)",
            borderColor: "rgb(255,50,50,0.1)",
            color: "#FF3232",
            boxShadow: 'none',
        },
        '&:active': {
            boxShadow: 'none',
        },
        '&:focus': {
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
        }
    }
}))

const CustomerModal = ({open, handleClose, handleSelect}) => {
    const classes = useStyles();
	const { translations } = React.useContext(TranslatorContext);
	const [customer, setCustomer] = React.useState();

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
					
				</DialogContent>
				<DialogActions>
                    <Button onClick={handleClose} color="default">
                        {translations.cancel}
                    </Button>

                    <Button onClick={handleSelect} color="primary">
                        <div
                            style={{
                                display: 'flex',
                                flexDirection:' row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {translations.select}
                        </div>
                    </Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default CustomerModal;