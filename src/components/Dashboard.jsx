import React from "react";
import { Grid, Card, CardActionArea, CardContent, Typography, makeStyles } from '@material-ui/core';
import { gql } from 'apollo-boost';
import { withRouter } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { TranslatorContext } from '../contextProviders/Translator';
import useDisplayBreakpoints from '../contextProviders/useDisplayBreakpoints';
import { ROLES } from '../constants';
import * as mainStyles from '../styles';
import Bar from './Segments/Bar';
import Loading  from './Segments/Loading';
import employeesIcon from '../assets/group.svg';
import crmIcon from '../assets/crm.svg';
import productsIcon from '../assets/barcode.svg';
import posIcon from '../assets/pos.svg';
import accountingIcon from '../assets/wealth.svg';
import satIcon from '../assets/maintenance.svg';

const useStyles = makeStyles(theme => ({
    ...mainStyles,
    cardSlim: {
        width: '200px', 
        height: '200px'
    },
    cardXL: {
        width: '300px', 
        height: '300px'
    },
    cardSlimImg: {
        width: '100px', 
        height: '100px'
    },
    cardXLImg: {
        width: '200px', 
        height: '200px'
    }
}));

const ME = gql`
    query me {
        me {
            id
            name
            surname
            email
            language
            role
            company {
                id
                name
                country
                address
                phone
                logo
            }
        }
    }
`;

const GridCard = ({title, img, action}) => {
    const classes = useStyles();
    const breakpoint = useDisplayBreakpoints();

    return(
        <Card className={(breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md" || breakpoint === "lg") ? classes.cardSlim : classes.cardXL}>
            <CardActionArea onClick={action} style={{height: '100%', width: '100%'}}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '15px',
                        paddingLeft: '15px',
                        paddingRight: '15px'
                    }}
                >
                    <img 
                        alt="card_img" 
                        src={img} 
                        className={(breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md" || breakpoint === "lg") ? classes.cardSlimImg : classes.cardXLImg}
                    />
                </div>
                <CardContent style={{textAlign: 'center'}}>
                    <Typography variant="h5">
                        {title}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

const Dashboard = ({history}) => {
    const classes = useStyles();
    const { translations, updateLanguage } = React.useContext(TranslatorContext);
    // const { loading, data } = useQuery(ME);
    const { loading, data } = useQuery(ME, {
        fetchPolicy: "network-only"
    });

    const goToModule = route => {
        history.push(route);
    }

    React.useEffect(() => {
        if(!!data && !!data.me){
            updateLanguage(data.me.language);
        }
    },[data])

	return (
        <div className={classes.containerBG}>
            {loading ? 
                    <div
                        style={{
                            display: 'flex',
                            height: '100%',
                            width: '100%'
                        }}
                    >
                        <Loading />
                    </div>
                :
                    <>
                        <Bar/>
                        <div
                            style={{
                                height: '100%',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Grid 
                                container 
                                spacing={3} 
                                style={{
                                    maxWidth: '800px', 
                                    maxHeight: 'calc(100% - 120px)', 
                                    overflow: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {(data.me.role === ROLES.MANAGER) &&
                                    <Grid className={classes.centered} item xs={12} sm={6} md={4}>
                                        <GridCard title={translations.employees} img={employeesIcon} action={() => {goToModule(`/employees/${data.me.company.id}`)}}/>
                                    </Grid>
                                }

                                {((data.me.role === ROLES.MANAGER) || (data.me.role === ROLES.SELLER)) &&
                                    <Grid className={classes.centered}  item xs={12} sm={6} md={4}>
                                        <GridCard title={translations.crm} img={crmIcon} action={() => {goToModule(`/crm/${data.me.company.id}`)}}/>
                                    </Grid>
                                }

                                {((data.me.role === ROLES.MANAGER) || (data.me.role === ROLES.SELLER)) &&
                                    <Grid className={classes.centered}  item xs={12} sm={6} md={4}>
                                        <GridCard title={translations.products} img={productsIcon} action={() => {goToModule(`/products/${data.me.company.id}`)}}/>
                                    </Grid>
                                }

                                {(data.me.role === ROLES.MANAGER) &&
                                    <Grid className={classes.centered}  item xs={12} sm={6} md={4}>
                                        <GridCard title={translations.accounting} img={accountingIcon} action={() => {goToModule(`/accounting/${data.me.company.id}`)}}/>
                                    </Grid>
                                }

                                {((data.me.role === ROLES.MANAGER) || (data.me.role === ROLES.SELLER)) &&
                                    <Grid className={classes.centered}  item xs={12} sm={6} md={4}>
                                        <GridCard title={translations.pos} img={posIcon} action={() => {goToModule(`/pos/${data.me.id}`)}}/>
                                    </Grid>
                                }

                                {((data.me.role === ROLES.MANAGER) || (data.me.role === ROLES.SELLER) || (data.me.role === ROLES.TECHNICIAN)) &&
                                    <Grid className={classes.centered}  item xs={12} sm={6} md={4}>
                                        <GridCard title={translations.sat} img={satIcon} action={() => {goToModule(`/sat/${data.me.company.id}`)}}/>
                                    </Grid>
                                }
                            </Grid>
                        </div>
                    </>
            }
        </div>
	);
};

export default withRouter(Dashboard);
