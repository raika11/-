import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * ColumnNoFrame Layout
 * @param {object} props
 */
const ColumnNoFrame = (props) => {
    const { children, sidebarSize, setColumn, setSidebarMini } = props;

    useEffect(() => {
        setColumn('ColumnNoFrame');
        return () => {
            setColumn('');
        };
    }, [setColumn]);

    useEffect(() => {
        if (sidebarSize === 'mini') {
            setSidebarMini(true);
        } else {
            setSidebarMini(false);
        }
    }, [sidebarSize, setSidebarMini]);

    return <>{children}</>;
};

ColumnNoFrame.propTypes = {
    children: PropTypes.node.isRequired,
    setColumn: PropTypes.func.isRequired,
    setSidebarMini: PropTypes.func.isRequired,
    sidebarSize: PropTypes.string
};

ColumnNoFrame.defaultProps = {
    sidebarSize: 'default'
};

export default ColumnNoFrame;
