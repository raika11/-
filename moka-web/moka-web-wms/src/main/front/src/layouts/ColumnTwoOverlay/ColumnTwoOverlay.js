import React, { useState, cloneElement, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { WmsGrid } from '~/components';

/**
 * ColumnTwoOverlay
 * @param {object} props
 */
const ColumnTwoOverlay = (props) => {
    const { children, sidebarSize, setColumn, setSidebarMini } = props;
    const theme = useTheme();
    const [hiddenOpen, setHiddenOpen] = useState(false);

    // @media (min-width:1470px) 체크
    const isUpMd = useMediaQuery(theme.breakpoints.up('md'), {
        defaultMatches: true
    });

    /**
     * 히든 영역 컨트롤 함수
     * @param {boolean} state true or false
     */
    const handleHidden = (state) => {
        setHiddenOpen(state);
    };

    /**
     * 메인 영역 dom을 생성하는 함수
     */
    const createMain = () => {
        if (isUpMd) {
            // @media (min-width:1470px) 이면 8:4
            return (
                <WmsGrid container>
                    <WmsGrid grid={8}>{children[0]}</WmsGrid>
                    <WmsGrid grid={4}>{children[1]}</WmsGrid>
                </WmsGrid>
            );
        }
        // 그외 12, Drawer 오픈
        return (
            <WmsGrid container>
                <WmsGrid grid={12}>
                    {cloneElement(children[0], { hiddenOpen, handleHidden })}
                </WmsGrid>
                <Drawer anchor="right" open={hiddenOpen} onClose={() => handleHidden(false)}>
                    {children[1]}
                </Drawer>
            </WmsGrid>
        );
    };

    // 기본 셋팅
    useEffect(() => {
        setColumn('ColumnTwoOverlay');
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

    return <>{createMain()}</>;
};

ColumnTwoOverlay.propTypes = {
    children: PropTypes.node.isRequired,
    setColumn: PropTypes.func.isRequired,
    setSidebarMini: PropTypes.func.isRequired,
    sidebarSize: PropTypes.string
};

ColumnTwoOverlay.defaultProps = {
    sidebarSize: 'default'
};

export default ColumnTwoOverlay;
