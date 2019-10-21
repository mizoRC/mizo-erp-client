import React from 'react';
import { gql } from 'apollo-boost';
import { client } from '../App';
import Loading from '../components/Loading';
const TranslatorContext = React.createContext({
    translations: []
});

export { TranslatorContext };


const Translator = ({children}) => {
    const [loading, setLoading] = React.useState(true);
    const [language, setLanguage] = React.useState('en');
    const [translations, setTranslations] = React.useState([]);

    const getTranslations = async(language) => {
        const getTranslationsQuery = gql`
            query getTranslations{
                translations{
                    label
                    ${language}
                }
            }
        `;
        
        /* EXPRESS API QUERY 
        const response = await fetch(`//${process.env.REACT_APP_API_URL}/translations/all`);
        const translationsArray = await response.json(); */
        const response = await client.query({query: getTranslationsQuery});
        const translationsArray = response.data.translations;
        let translations = {};

        translationsArray.forEach(translation => {
            translations[translation.label] = translation[language];
        });

        return translations;
    };

    const updateLanguage = async(newLanguage) => {
        if(newLanguage !== language){
            try {
                setLoading(true);
                setLanguage(newLanguage);

                const updatedTranslations = await getTranslations(newLanguage);

                setLoading(false);
                setTranslations(updatedTranslations);
            } catch (error) {
                setLoading(false);
            }
        }
    }

    const loadTranslations = async () => {
        try {
            setLoading(true);
            const updatedTranslations = await getTranslations(language);
            setLoading(false);
            setTranslations(updatedTranslations); 
        } catch (error) {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        loadTranslations();
    },[]);

    return(
        <>
            {loading ?
                    <Loading />
                :
                    <TranslatorContext.Provider 
                        value={{
                            language: language,
                            loading: loading,
                            translations: translations,
                            updateLanguage: updateLanguage
                        }}
                    >
                        {children}
                    </TranslatorContext.Provider>
            }
        </>
    )
}
export default Translator;