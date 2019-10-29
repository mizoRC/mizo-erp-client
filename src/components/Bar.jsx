import React from "react";
import { AppBar, Toolbar, IconButton, MenuList, MenuItem, Popper, Grow, Paper, ClickAwayListener, Typography, Hidden, makeStyles } from "@material-ui/core";
import { withRouter } from 'react-router-dom';
import logoComplete from '../assets/logo_complete_white.svg';
import logo from '../assets/logo_white.svg';

const useStyles = makeStyles(theme => ({
	appBarTransparent: {
		backgroundColor: "transparent",
		boxShadow: "none"
	},
	toolbar: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between"
	},
    toolbarItemStart: {
        width: '32%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    toolbarItemCenter: {
        width: '32%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    toolbarItemUser: {
        width: '32%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    }
}));

const Bar = ({history, title, transparent}) => {
    const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const anchorRef = React.useRef(null);

	const handleToggle = () => {
		setOpen(prevOpen => !prevOpen);
	};

	const handleClose = event => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}

		setOpen(false);
	};

	const handleListKeyDown = event => {
		if (event.key === "Tab") {
			event.preventDefault();
			setOpen(false);
		}
	}

    const logout = () => {
        sessionStorage.clear();
        history.replace('/login');
    };

	// return focus to the button when we transitioned from !open -> open
	const prevOpen = React.useRef(open);
	React.useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current.focus();
		}

		prevOpen.current = open;
	}, [open]);
	return (
		<AppBar position="static" className={transparent ? classes.appBarTransparent : ''}>
			<Toolbar className={classes.toolbar}>
                <div className={classes.toolbarItemStart}>
                    <Hidden only={['sm', 'md', 'lg', 'xl']}>
                        <img alt="logo" src={logo} style={{maxHeight: '40px'}}/>
                    </Hidden>
                    
                    <Hidden only="xs">
                        <img alt="logo_complete" src={logoComplete} style={{maxHeight: '40px'}}/>
                    </Hidden>
                </div>

                <div className={classes.toolbarItemCenter}>
                    <div
                        style={{
                            whiteSpace: 'nowrap',
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textAlign: 'center'
                        }}
                    >
                        <Typography noWrap variant="h4">{title}</Typography>
                    </div>
                    
                </div>

				<div className={classes.toolbarItemUser}>
					<IconButton
						ref={anchorRef}
						aria-controls="menu-list-grow"
						aria-haspopup="true"
						onClick={handleToggle}
                        color="inherit"
					>
						<i className="fas fa-user-circle"></i>
					</IconButton>
					<Popper
						open={open}
						anchorEl={anchorRef.current}
						transition
						disablePortal
					>
						{({ TransitionProps, placement }) => (
							<Grow
								{...TransitionProps}
								style={{
									transformOrigin:
										placement === "bottom" ? "center top" : "center bottom"
								}}
							>
								<Paper id="menu-list-grow">
									<ClickAwayListener onClickAway={handleClose}>
										<MenuList
											autoFocusItem={open}
											onKeyDown={handleListKeyDown}
										>
											<MenuItem onClick={handleClose}>Profile</MenuItem>
											<MenuItem onClick={handleClose}>My account</MenuItem>
											<MenuItem onClick={logout}>Logout</MenuItem>
										</MenuList>
									</ClickAwayListener>
								</Paper>
							</Grow>
						)}
					</Popper>
				</div>
			</Toolbar>
		</AppBar>
	);
};

export default withRouter(Bar);
