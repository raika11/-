import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

/**
 * WMS Grid
 * @param {object} props
 */
const WmsGrid = (props) => {
    const { children, container, spacing, grid } = props;

    if (container) {
        return (
            <Grid container spacing={spacing}>
                {children}
            </Grid>
        );
    }
    return (
        <Grid item xs={grid}>
            {children}
        </Grid>
    );
};

WmsGrid.propTypes = {
    children: PropTypes.node,
    item: PropTypes.bool,
    spacing: PropTypes.number,
    grid: PropTypes.number
};

WmsGrid.defaultProps = {
    children: undefined,
    item: undefined,
    spacing: undefined,
    grid: undefined
};

export default WmsGrid;
