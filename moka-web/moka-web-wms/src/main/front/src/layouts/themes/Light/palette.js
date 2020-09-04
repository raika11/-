import { indigo, pink, green, blue, orange, red, grey } from '@material-ui/core/colors';

const white = '#FFFFFF';
const black = '#000000';

export default {
    black,
    white,
    /**
     * topbar 색상
     */
    topbar: {
        main: grey[200]
    },
    /**
     * PRIMARY 색상
     */
    basic: {
        contrastText: white,
        etc: ['#8B1968', '#7B165C', '#4E0D3A', '#540F3F']
    },
    primary: {
        contrastText: white,
        dark: indigo[900],
        main: indigo[500],
        light: indigo[100],
        etc: ['#00acc1', '#26c6da', '#00acc1', '#00d3ee']
    },
    /**
     * SECONDARY 색상
     */
    secondary: {
        contrastText: white,
        dark: pink[900],
        main: pink[400],
        light: pink[400]
    },
    /**
     * SUCCESS 색상
     */
    success: {
        contrastText: white,
        dark: green[900],
        main: green[600],
        light: green[400],
        etc: ['#4caf50', '#66bb6a', '#43a047', '#5cb860']
    },
    /**
     * INFO 색상
     */
    info: {
        contrastText: white,
        dark: blue[900],
        main: blue[600],
        light: blue[400],
        etc: ['#2196F3', '#48A2E9', '#0D80DC', '#53A5E6']
    },
    /**
     * WARNING 색상
     */
    warning: {
        contrastText: white,
        dark: orange[900],
        main: orange[600],
        light: orange[400],
        etc: ['#ff9800', '#ffa726', '#fb8c00', '#ffa21a']
    },
    /**
     * ERROR 색상
     */
    error: {
        contrastText: white,
        dark: red[900],
        main: red[600],
        light: red[400],
        etc: ['#f44336', '#ef5350', '#e53935', '#f55a4e']
    },
    /**
     * grey 색상
     */
    grey,
    /**
     * TEXT 색상
     */
    text: {
        primary: grey[900],
        secondary: indigo[700],
        subtitle: grey[700],
        link: blue[600]
    },
    /**
     * 기본 BACKGROUND 색상
     */
    background: {
        body: white,
        default: white,
        paper: white
    },
    /**
     * ICON 색상
     */
    icon: grey[500],
    /**
     * DIVIDER 색상
     */
    divider: grey[700]
};
