import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import * as colors from '../styles/colors';
const darkTheme = "dark";
const lightTheme = "light";
const defaultTheme = lightTheme;
const ThemeContext = React.createContext({theme: null});
export {ThemeContext};

const getTheme = (type) => {
    const theme = {
        typography: {
            fontFamily: "'Montserrat Alternates', sans-serif !important",
            useNextVariants: true
        },
        palette: {
            primary: { main: colors.primary },
            secondary: { main: colors.secondary }
        },
        overrides: {
            MuiDrawer: {
                paper: {
                    zIndex: 999
                },
                modal: {
                    zIndex: 999
                }
            },
            MuiTooltip: {
                tooltip: {
                    fontSize: "0.8rem !important"
                }
            },
            MuiButton: {
                root: {
                    outline: "0 !important"
                }
            },
            MuiIconButton: {
                root: {
                    outline: "0 !important"
                }
            }
        }
    }
    theme.palette.type = type;
    return theme;
}

const themeDefault = getTheme(defaultTheme);
const themeDark =  getTheme(darkTheme);
const themeLight =  getTheme(lightTheme);

const themes = {
    default: createMuiTheme(themeDefault),
    light: createMuiTheme(themeLight),
    dark: createMuiTheme(themeDark)
}


const ThemeContainer = ({children}) => {
    const [theme, setTheme] = React.useState(themes.default);
    const [name, setName] = React.useState('default');

    const setLightTheme = () => {
        setTheme(themes.light);
        setName('light');
    };

    const setDarkTheme = () => {
        setTheme(themes.dark);
        setName('dark');
    };

    const setDefaultTheme = () => {
        setTheme(themes.default);
        setName('default');
    };

    return (
        <ThemeContext.Provider value={{theme:theme, name:name, setLightTheme:setLightTheme, setDarkTheme:setDarkTheme, setDefaultTheme:setDefaultTheme}}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    )
};


export default ThemeContainer;