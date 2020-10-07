import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft } from '@moka/fontawesome-pro-light-svg-icons';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { CARD_DEFAULT_HEIGHT, CARD_FOLDING_WIDTH } from '@/constants';

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
     * 확장 여부
     */
    expansion: PropTypes.bool,
    /**
     * 확장 버튼 클릭 콜백
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
    const [isExpand, setIsExpand] = useState(true);

    useEffect(() => {
        setIsExpand(expansion);
    }, [expansion]);

    /**
     * 카드 확장
     */
    const handleExpansion = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (onExpansion) {
            onExpansion(!isExpand);
        } else {
            setIsExpand(!isExpand);
        }
    };

    return (
        <Card className={clsx('flex-shrink-0', className, { fold: !isExpand })} style={{ width: isExpand ? width : CARD_FOLDING_WIDTH, height }}>
            {/* 카드 헤더 */}
            <Card.Header className="d-flex justify-content-between align-item-center">
                <Card.Title className={clsx({ 'd-none': !isExpand })}>{title}</Card.Title>
                <div className="d-flex align-items-center">
                    <Button variant="light" className="p-0 float-right" onClick={handleExpansion}>
                        <FontAwesomeIcon icon={faAngleDoubleLeft} rotation={isExpand ? 0 : 180} />
                    </Button>
                </div>
            </Card.Header>

            {/* 카드 본문 */}
            <Card.Body className={clsx({ 'd-none': !isExpand })}>{children}</Card.Body>
        </Card>
    );
};

MokaFoldableCard.propTypes = propTypes;
MokaFoldableCard.defaultProps = defaultProps;

export default MokaFoldableCard;
