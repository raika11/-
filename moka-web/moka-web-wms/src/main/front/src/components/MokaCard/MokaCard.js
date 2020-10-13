import React, { useEffect, useState, forwardRef } from 'react';
import clsx from 'clsx';
import produce from 'immer';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';

import { CARD_DEFAULT_HEIGHT, CARD_FOLDING_WIDTH } from '@/constants';
import Button from 'react-bootstrap/Button';
import { MokaIcon } from '@components';

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
     * custom element type for this component (Card.Header)
     */
    headerAs: PropTypes.node,
    /**
     * buttons
     */
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            variant: PropTypes.string,
            icon: PropTypes.node,
            text: PropTypes.string,
            style: PropTypes.object,
            onClick: PropTypes.func,
            ref: PropTypes.ref,
        }),
    ),
    /**
     * children
     */
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
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
    buttons: [],
};

/**
 * 카드 컴포넌트
 */
const MokaCard = forwardRef((props, ref) => {
    const { className, headerClassName, bodyClassName, titleClassName, width, height, title, headerAs, children, expansion, onExpansion, buttons, foldable } = props;
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

    /**
     * 헤더의 버튼 생성 함수
     */
    const createButtons = () => {
        const headerButtons = produce(buttons, (draft) => {
            if (foldable) {
                draft.push({
                    variant: 'white',
                    icon: <MokaIcon iconName="fal-angle-double-left" rotation={localExpandState ? 0 : 180} />,
                    onClick: handleExpansion,
                    foldIcon: true,
                });
            }
        });

        if (headerButtons.length > 0) {
            return (
                <div className="d-flex align-items-center">
                    {headerButtons.map((btn, idx) => (
                        <Button
                            key={idx}
                            ref={btn.ref}
                            variant={btn.variant || 'white'}
                            className={clsx('p-0', btn.className, { 'd-none': foldable && !localExpandState && !btn.foldIcon, 'mr-1': idx < headerButtons.length - 1 })}
                            style={btn.style}
                            onClick={btn.onClick}
                        >
                            {btn.icon || btn.text}
                        </Button>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <Card
            ref={ref}
            className={clsx('flex-shrink-0', className, { fold: foldable && !localExpandState })}
            style={{ width: foldable && !localExpandState ? CARD_FOLDING_WIDTH : width, height }}
        >
            <Card.Header className={clsx({ 'd-flex': foldable, 'justify-content-between': foldable, 'align-item-center': foldable }, headerClassName)}>
                {/* 카드 타이틀 */}
                {headerAs ? (
                    headerAs
                ) : (
                    <React.Fragment>
                        <Card.Title className={clsx({ 'd-none': foldable && !localExpandState }, titleClassName)}>{title}</Card.Title>
                        {createButtons()}
                    </React.Fragment>
                )}
            </Card.Header>

            {/* 카드 본문 */}
            <Card.Body className={clsx({ 'd-none': foldable && !localExpandState }, bodyClassName)}>{children}</Card.Body>
        </Card>
    );
});

MokaCard.propTypes = propTypes;
MokaCard.defaultProps = defaultProps;

export default MokaCard;
