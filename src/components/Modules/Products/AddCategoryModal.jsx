import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from '@material-ui/core';
import { TranslatorContext } from '../../../contextProviders/Translator';

const AddCategoryModal = ({open, handleClose, handleSave, saving}) => {
	const { translations } = React.useContext(TranslatorContext);
	const [name, setName] = React.useState();
    const [errorEmptyName, setErrorEmptyName] = React.useState(false);

	const handleChangeName = event => {
		setName(event.target.value);		
	}

    const checkErrors = () => {
        let hasErrors = false;

        const isEmptyName = (!name || name === "" || name === null) ? true : false;

        setErrorEmptyName(isEmptyName);

        hasErrors = isEmptyName;

        return hasErrors;
    };

    const save = () => {
        const hasErrors = checkErrors();

        if(!hasErrors && !!handleSave){
            handleSave(name);
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
					{translations.category}
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
                    </div>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} disabled={saving} color="default">
						{translations.cancel}
					</Button>
					<Button onClick={save} disabled={saving} color="primary">
                        <div
                            style={{
                                display: 'flex',
                                flexDirection:' row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {translations.save}
                            {saving &&
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

export default AddCategoryModal;