import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { ColumnFourStyle } from '~/assets/jss/layouts';

/**
 * ColumnFour Style
 */
const useStyles = makeStyles(ColumnFourStyle);

/**
 * ColumnFour
 * @param {object} props
 */
const ColumnFour = (props) => {
    const {
        children,
        setColumn,
        setSidebarMini,
        setFixed,
        setResized,
        classes,
        setClasses,
        setToggleOpen
    } = props;
    const layoutStyle = Object.assign(classes, useStyles());

    useEffect(() => {
        setColumn('ColumnFour');
    }, [setColumn]);

    useEffect(() => {
        setClasses(layoutStyle);
    }, [setClasses, layoutStyle]);

    useEffect(() => {
        setSidebarMini(true);
        setFixed(true);
        setResized(false);
        setToggleOpen(false);
    }, [setSidebarMini, setFixed, setResized, setToggleOpen]);

    useEffect(() => {
        return () => {
            setColumn('');
        };
    }, [setColumn]);

    return (
        <>
            <div className={classes.containerChild1}>{children[0]}</div>
            <div className={classes.containerChild2}>{children[1]}</div>
            <div className={classes.containerChild3}>{children[2]}</div>
            <div className={classes.containerChild4}>{children[3]}</div>
        </>
    );
};

ColumnFour.propTypes = {
    children: PropTypes.node.isRequired,
    setColumn: PropTypes.func.isRequired,
    setSidebarMini: PropTypes.func.isRequired,
    setFixed: PropTypes.func.isRequired,
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
    setClasses: PropTypes.func.isRequired,
    setToggleOpen: PropTypes.func.isRequired
};

ColumnFour.defaultProps = {};

export default ColumnFour;
