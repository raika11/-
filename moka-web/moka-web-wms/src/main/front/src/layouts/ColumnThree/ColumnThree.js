import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { ColumnThreeStyle } from '~/assets/jss/layouts';

/**
 * ColumnThree Style
 */
const useStyles = makeStyles(ColumnThreeStyle);

/**
 * ColumnThree
 * @param {object} props
 */
const ColumnThree = (props) => {
    const {
        children,
        sidebarSize,
        setColumn,
        setSidebarMini,
        classes,
        setClasses,
        widthOne,
        widthTwo,
        widthThree
    } = props;

    const layoutStyle = Object.assign(classes, useStyles({ widthOne, widthTwo, widthThree }));

    useEffect(() => {
        setColumn('ColumnThree');
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
            <div className={clsx(classes.child, classes.containerChild3)}>{children[2]}</div>
        </>
    );
};

ColumnThree.propTypes = {
    children: PropTypes.node.isRequired,
    setColumn: PropTypes.func.isRequired,
    setSidebarMini: PropTypes.func.isRequired,
    sidebarSize: PropTypes.string,
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
    setClasses: PropTypes.func.isRequired
};

ColumnThree.defaultProps = {
    sidebarSize: 'default'
};

export default ColumnThree;
