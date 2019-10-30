import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { bHistory } from '../App';
import { execute } from '../utils/graphql';
import Loading from '../components/Loading';
const MeContext = React.createContext({
    me:{},
    updateMe: null
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
            }
        }
    }
`;

const Me = ({children}) => {
    const client = useApolloClient();
    const [me, setMe] = React.useState({});
    const [loading, setLoading] = React.useState(false);

    const updateMe = (newMe) => {
        setMe(newMe);
    }

    const getMe = async() => {
        try{
            setLoading(true);
            let variables = {};

            const response = await execute(client, "query", ME, variables);
            if(response && response.data && response.data.me){
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
        console.info('ME');
        const token = sessionStorage.getItem('token');
        if(token && !me.id){
            getMe();
        } 

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
                            updateMe: updateMe
                        }}
                    >
                        {children}
                    </MeContext.Provider>
            }
        </>
    )
}
export default Me;