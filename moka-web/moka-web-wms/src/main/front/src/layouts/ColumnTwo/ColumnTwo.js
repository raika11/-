import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { ColumnTwoStyle } from '~/assets/jss/layouts';

/**
 * ColumnTwo Style
 */
const useStyles = makeStyles(ColumnTwoStyle);

/**
 * ColumnTwo Layout
 * @param {object} props
 */
const ColumnTwo = (props) => {
    const {
        children,
        sidebarSize,
        setColumn,
        setSidebarMini,
        classes,
        setClasses,
        widthOne,
        widthTwo
    } = props;

    const layoutStyle = Object.assign(classes, useStyles({ widthOne, widthTwo }));

    useEffect(() => {
        setColumn('ColumnTwo');
        return () => {
            setColumn('');
        };
    }, [setColumn]);

    useEffect(() => {
        setClasses(layoutStyle);
    }, [setClasses, layoutStyle]);

    useEffect(() => {
        if (sidebarSize === 'mini') {
            setSidebarMini(true);
        } else {
            setSidebarMini(false);
        }
    }, [sidebarSize, setSidebarMini]);

    return (
        <>
            <div className={clsx(classes.child, classes.containerChild1)}>{children[0]}</div>
            <div className={clsx(classes.child, classes.containerChild2)}>{children[1]}</div>
        </>
    );
};

ColumnTwo.propTypes = {
    children: PropTypes.node.isRequired,
    setColumn: PropTypes.func.isRequired,
    setSidebarMini: PropTypes.func.isRequired,
    sidebarSize: PropTypes.string,
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
    setClasses: PropTypes.func.isRequired
};

ColumnTwo.defaultProps = {
    sidebarSize: 'default'
};

export default ColumnTwo;
