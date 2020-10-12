import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';

import { CARD_DEFAULT_HEIGHT, CARD_FOLDING_WIDTH } from '@/constants';
import MokaFoldableCard from './MokaFoldableCard';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft } from '@moka/fontawesome-pro-light-svg-icons';

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * headerClassName
     */
    headerClassName: PropTypes.string,
    /**
     * bodyClassName
     */
    bodyClassName: PropTypes.string,
    /**
     * titleClassName
     */
    titleClassName: PropTypes.string,
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
     * buttons
     */
    buttons: PropTypes.element,
    /**
     * children
     */
    children: PropTypes.element.isRequired,
    /**
     * 컴포넌트를 접을 수 있는지 없는지 설정한다.
     * (true | false)
     */
    foldable: PropTypes.bool,
    /**
     * 컴포넌트를 접고 펼 수 있을 때,
     * 확장 여부를 직접 제어하려는 경우 사용한다.
     */
    onExpansion: PropTypes.func,
};
const defaultProps = {
    width: 410,
    height: CARD_DEFAULT_HEIGHT,
    foldable: false,
};

/**
 * 카드 컴포넌트
 */
const MokaCard = (props) => {
    const { className, headerClassName, bodyClassName, titleClassName, width, height, title, children, expansion, onExpansion, buttons, foldable } = props;
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
        <Card
            className={foldable ? clsx('flex-shrink-0', className, { fold: !localExpandState }) : className}
            style={{ width: foldable ? (localExpandState ? width : CARD_FOLDING_WIDTH) : width, height }}
        >
            <Card.Header className={foldable ? 'd-flex justify-content-between align-item-center' : headerClassName}>
                {/* 카드 타이틀 */}
                <Card.Title className={foldable ? clsx({ 'd-none': !localExpandState }, titleClassName) : titleClassName}>{title}</Card.Title>
                {foldable ? (
                    <div className="d-flex align-items-center">
                        <Button variant="white" className="p-0 float-right" onClick={handleExpansion}>
                            <FontAwesomeIcon icon={faAngleDoubleLeft} rotation={localExpandState ? 0 : 180} />
                        </Button>
                    </div>
                ) : (
                    buttons
                )}
            </Card.Header>

            {/* 카드 본문 */}
            <Card.Body className={foldable ? clsx({ 'd-none': !localExpandState }) : bodyClassName}>{children}</Card.Body>
        </Card>
    );
};

MokaCard.propTypes = propTypes;
MokaCard.defaultProps = defaultProps;

export default MokaCard;
