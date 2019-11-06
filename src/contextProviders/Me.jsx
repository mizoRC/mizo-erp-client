import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { TranslatorContext } from './Translator';
import { bHistory } from '../App';
import { execute } from '../utils/graphql';
import Loading from '../components/Segments/Loading';
const MeContext = React.createContext({
    me:{},
    updateMe: null,
    refreshMe: null,
    clearMe: null
});

export { MeContext };

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

const getCurrentRouteNotLogged = () => {
    const currentRoute = bHistory.location.pathname;
    const route = (currentRoute !== "/" && currentRoute !== "/signup" && !currentRoute.includes("/register/")) ? "/" : currentRoute;
    return route;
}

const Me = ({children}) => {
    const token = sessionStorage.getItem('token');
    const client = useApolloClient();
    const [me, setMe] = React.useState({});
    const { updateLanguage } = React.useContext(TranslatorContext);
    const [loading, setLoading] = React.useState(false);

    const updateMe = (newMe) => {
        setMe(newMe);
    }

    const refreshMe = () => {
        getMe();
    }

    const clearMe = () => {
        setMe();
    }

    const getMe = async() => {
        try{
            setLoading(true);
            let variables = {};

            const response = await execute(client, "query", ME, variables);
            if(response && response.data && response.data.me){
                updateLanguage(response.data.me.language);
                setMe(response.data.me);
                setLoading(false);
            }
            else{
                setLoading(false);
                bHistory.replace('/');
            }
        }catch(error){
            setLoading(false);
            bHistory.replace('/');
        }
    }

    React.useEffect(() => {
        if(token && (!me || !me.id)) getMe();
        if(token && !!me && me.id) setLoading(false);
        
        if(!token){
            const currentRoute = getCurrentRouteNotLogged();
            bHistory.replace(currentRoute);
        }
    });

    return(
        <>
            {loading ?
                    <Loading />
                :
                    <MeContext.Provider 
                        value={{
                            me:me,
                            updateMe: updateMe,
                            refreshMe: refreshMe,
                            clearMe: clearMe
                        }}
                    >
                        {children}
                    </MeContext.Provider>
            }
        </>
    )
}
export default Me;