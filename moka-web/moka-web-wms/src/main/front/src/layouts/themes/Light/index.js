import { createMuiTheme } from '@material-ui/core/styles';
import palette from './palette';
import overrides from './overrides';

const Light = createMuiTheme({
    breakpoints: {
        keys: ['xs', 'sm', 'md', 'lg', 'xl'],
        values: {
            sm: 1280,
            md: 1470,
            lg: 1920
        }
    },
    palette,
    overrides
});

export default Light;
