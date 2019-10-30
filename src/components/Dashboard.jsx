import React from "react";
import { Grid, Card, CardActionArea, CardContent, Typography, makeStyles } from '@material-ui/core';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { TranslatorContext } from '../contextProviders/Translator';
import { MeContext } from '../contextProviders/Me';
import * as mainStyles from '../styles';
import Bar from './Bar';
import Loading  from './Loading';
import employeesIcon from '../assets/group.svg';
import crmIcon from '../assets/crm.svg';
import productsIcon from '../assets/barcode.svg';
import posIcon from '../assets/pos.svg';
import accountingIcon from '../assets/wealth.svg';
import satIcon from '../assets/maintenance.svg';

const useStyles = makeStyles(theme => ({
    ...mainStyles
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
            }
        }
    }
`;

const GridCard = ({title, img, action}) => (
    <Card>
        <CardActionArea onClick={action}>
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
                <img alt="Employees" src={img} style={{ width: 'auto', height: '150px' }} />
            </div>
            <CardContent style={{textAlign: 'center'}}>
                <Typography variant="h5">
                    {title}
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card>
)

const Dashboard = () => {
    const classes = useStyles();
    const { translations } = React.useContext(TranslatorContext);
    const { updateMe } = React.useContext(MeContext);
    const { loading, data } = useQuery(ME);

    React.useEffect(() => {
        if(!!data && data.me) updateMe(data.me);
    }, [data]);

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
                            <Grid container spacing={3} style={{maxWidth: '800px', maxHeight: 'calc(100% - 120px)', overflow: 'auto'}}>
                                <Grid className={classes.centered} item xs={12} sm={6} md={4}>
                                    <GridCard title={translations.employees} img={employeesIcon} action={() => {}}/>
                                </Grid>

                                <Grid className={classes.centered}  item xs={12} sm={6} md={4}>
                                    <GridCard title={translations.crm} img={crmIcon} action={() => {}}/>
                                </Grid>

                                <Grid className={classes.centered}  item xs={12} sm={6} md={4}>
                                    <GridCard title={translations.products} img={productsIcon} action={() => {}}/>
                                </Grid>

                                <Grid className={classes.centered}  item xs={12} sm={6} md={4}>
                                    <GridCard title={translations.accounting} img={accountingIcon} action={() => {}}/>
                                </Grid>

                                <Grid className={classes.centered}  item xs={12} sm={6} md={4}>
                                    <GridCard title={translations.pos} img={posIcon} action={() => {}}/>
                                </Grid>

                                <Grid className={classes.centered}  item xs={12} sm={6} md={4}>
                                    <GridCard title={translations.sat} img={satIcon} action={() => {}}/>
                                </Grid>
                            </Grid>
                        </div>
                    </>
            }
        </div>
	);
};

export default Dashboard;
