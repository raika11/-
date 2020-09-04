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
        main: white
    },
    /**
     * BASIC 색상 SSC 테마 메인 컬러
     */
    basic: {
        contrastText: white,
        dark: '#540F3F',
        main: '#7B165C',
        light: '#8B1968',
        etc: ['#8B1968', '#7B165C', '#4E0D3A', '#540F3F', '#71135c']
    },
    /**
     * DEFALT 색상
     */
    default: {
        contrastText: white,
        dark: 'rgb(144, 144, 144)',
        main: '#9E9E9E'
    },
    /**
     * WOLF 색상 템플릿 정보 컨텐츠에서 사용
     */
    wolf: {
        contrastText: white,
        main: '#5C5C6A',
        dark: '#44444F'
    },
    /**
     * DEL 색상 템플릿 정보 삭제에서 사용
     */
    del: {
        contrastText: white,
        main: '#6D4661',
        dark: '#4E0D3A'
    },
    /**
     * PRIMARY 색상
     */
    primary: {
        contrastText: white,
        dark: '#0273C8',
        main: '#2196F3',
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
        dark: '#0273C8',
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
    grey: {
        contrastText: black,
        dark: 'rgb(209, 208, 208)',
        main: '#E0E0E0'
    },
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
    divider: grey[700],
    /**
     * border 색상
     */
    border: {
        main: 'rgba(0, 0, 0, 0.23)'
    },
    /**
     * 테이블 색상
     */
    table: {
        box: '#C4C4C4',
        thead: {
            background: '#F5F5F5',
            color: '#5C5C5C'
        },
        tbody: {
            color: '#5C5C5C',
            notUseColor: '#9E9E9E',
            selectedBackColor: 'rgba(96, 96, 96, 0.1)',
            radioColor: '#757575',
            radioSelectedColor: '#71265C'
        }
    },
    /**
     * 페이징 색상
     */
    paging: {
        rowPerPages: {
            color: '#757575'
        },
        number: {
            color: '#9E9E9E',
            selectedColor: '#37006D'
        },
        total: {
            color: '#424242'
        }
    },
    /**
     * 트리 색상
     */
    tree: {
        selected: {
            bgColor: 'rgba(0, 0, 0, 0.08)'
        },
        hover: {
            bgColor: 'rgba(78, 13, 58, 0.1)'
        },
        icon: '#757575',
        dash: 'rgba(0, 0, 0, 0.54)'
    }
};
