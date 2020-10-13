import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { CARD_DEFAULT_HEIGHT, CARD_FOLDING_WIDTH } from '@/constants';
import { MokaIcon } from '@components';

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * width
     */
    width: PropTypes.number,
    /**
     * height
     */
    height: PropTypes.number,
    /**
     * title
     */
    title: PropTypes.string,
    /**
     * children
     */
    children: PropTypes.element.isRequired,
    /**
     * 컴포넌트를 접고 펼 수 있을 때,
     * 확장여부를 직접 제어하려는 경우 사용한다.
     * 확장여부 state(true | false)
     */
    expansion: PropTypes.bool,
    /**
     * 컴포넌트를 접고 펼 수 있을 때,
     * 확장 여부를 직접 제어하려는 경우 사용한다.
     */
    onExpansion: PropTypes.func,
};

const defaultProps = {
    width: 410,
    height: CARD_DEFAULT_HEIGHT,
    expansion: true,
    onExpansion: null,
};

const MokaFoldableCard = (props) => {
    const { className, width, height, title, children, expansion, onExpansion } = props;
    const [localExpandState, setLocalExpandState] = useState(true);

    useEffect(() => {
        setLocalExpandState(expansion);
    }, [expansion]);

    /**
     * 카드 확장
     */
    const handleExpansion = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (onExpansion) {
            onExpansion(!localExpandState);
        } else {
            setLocalExpandState(!localExpandState);
        }
    };

    return (
        <Card className={clsx('flex-shrink-0', className, { fold: !localExpandState })} style={{ width: localExpandState ? width : CARD_FOLDING_WIDTH, height }}>
            <Card.Header className="d-flex justify-content-between align-item-center">
                {/* 타이틀 */}
                <Card.Title className={clsx({ 'd-none': !localExpandState })}>{title}</Card.Title>
                {/* 접는 버튼 */}
                <div className="d-flex align-items-center">
                    <Button variant="white" className="p-0 float-right" onClick={handleExpansion}>
                        <MokaIcon iconName="fal-angle-double-left" rotation={localExpandState ? 0 : 180} />
                    </Button>
                </div>
            </Card.Header>

            <Card.Body className={clsx({ 'd-none': !localExpandState })}>{children}</Card.Body>
        </Card>
    );
};

MokaFoldableCard.propTypes = propTypes;
MokaFoldableCard.defaultProps = defaultProps;

export default MokaFoldableCard;
