import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';

import { CARD_DEFAULT_HEIGHT } from '@/constants';
import MokaFoldableCard from './MokaFoldableCard';

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
     * 컴포넌트를 접을 수 있는지 없는지 설정한다.
     * (true | false)
     */
    foldable: PropTypes.bool,
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
    const { className, width, height, title, children, foldable } = props;

    return foldable ? (
        <MokaFoldableCard {...props}>{children}</MokaFoldableCard>
    ) : (
        <Card className={clsx('flex-shrink-0', className)} style={{ width, height }}>
            <Card.Header className="d-flex justify-content-between align-item-center">
                {/* 카드 타이틀 */}
                <Card.Title>{title}</Card.Title>
            </Card.Header>

            {/* 카드 본문 */}
            <Card.Body>{children}</Card.Body>
        </Card>
    );
};

MokaCard.propTypes = propTypes;
MokaCard.defaultProps = defaultProps;

export default MokaCard;
