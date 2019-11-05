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
    refreshMe: null
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

const Me = ({children}) => {
    const token = sessionStorage.getItem('token');
    const client = useApolloClient();
    const [me, setMe] = React.useState({});
    const { updateLanguage } = React.useContext(TranslatorContext);
    const [loading, setLoading] = React.useState(true);

    const updateMe = (newMe) => {
        setMe(newMe);
    }

    const refreshMe = () => {
        getMe();
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
        if(token && !me.id) getMe();
        if(token && me.id) setLoading(false);
        
        if(!token) bHistory.replace('/');
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
                            refreshMe: refreshMe
                        }}
                    >
                        {children}
                    </MeContext.Provider>
            }
        </>
    )
}
export default Me;