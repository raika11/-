import { createMuiTheme } from '@material-ui/core/styles';
import palette from './palette';
import overrides from './overrides';
import typography from './typography';

const SSC = createMuiTheme({
    breakpoints: {
        keys: ['xs', 'sm', 'md', 'lg', 'xl'],
        values: {
            sm: 1280,
            md: 1470,
            lg: 1920
        }
    },
    palette,
    overrides,
    typography
});

export default SSC;
