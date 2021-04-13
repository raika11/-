import React, { useEffect, useState, forwardRef, useCallback } from 'react';
import clsx from 'clsx';
import produce from 'immer';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { CARD_DEFAULT_HEIGHT, CARD_FOLDING_WIDTH } from '@/style_constants';
import { MokaIcon, MokaLoader } from '@components';
import { AuthButton } from '@pages/Auth/AuthButton';

const buttonProps = PropTypes.shape({
    variant: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func,
    icon: PropTypes.node,
});

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
     * footerClassName
     */
    footerClassName: PropTypes.string,
    /**
     * titleClassName
     */
    titleClassName: PropTypes.string,
    /**
     * width
     * @default
     */
    width: PropTypes.number,
    /**
     * height
     * @default
     */
    height: PropTypes.number,
    /**
     * 헤더 여부 (false 이면 헤더가 나오지 않음)
     * @default
     */
    header: PropTypes.bool,
    /**
     * 푸터 여부 (false 이면 푸터가 나오지 않음)
     * @default
     */
    footer: PropTypes.bool,
    /**
     * title
     */
    title: PropTypes.string,
    /**
     * custom element type for this component (Card.Title)
     */
    titleAs: PropTypes.node,
    /**
     * custom element type for this component (Card.Footer)
     */
    footerAs: PropTypes.node,
    /**
     * title 영역에 들어가는 기능 버튼
     */
    titleButtons: PropTypes.arrayOf(buttonProps),
    /**
     * title 영역에 들어가는 버튼 (position-absolute-top)
     */
    titleIconButtons: PropTypes.arrayOf(buttonProps),
    /**
     * footer 영역에 들어가는 기능 버튼
     */
    footerButtons: PropTypes.arrayOf(buttonProps),
    /**
     * children
     */
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    /**
     * 컴포넌트를 접을 수 있는지 없는지 설정한다. (true | false)
     * @default
     */
    foldable: PropTypes.bool,
    /**
     * 컴포넌트를 접고 펼 수 있을 때,
     * 확장 여부를 직접 제어하려는 경우 사용한다.
     */
    onExpansion: PropTypes.func,
    /**
     * 로딩 여부
     * @default
     */
    loading: PropTypes.bool,
};
const defaultProps = {
    width: 410,
    height: CARD_DEFAULT_HEIGHT,
    foldable: false,
    expansion: true,
    titleIconButtons: [],
    titleButtons: [],
    footerButtons: [],
    loading: false,
    header: true,
    footer: false,
};

/**
 * 카드 컴포넌트
 */
const MokaCard = forwardRef((props, ref) => {
    const {
        header,
        footer,
        className,
        headerClassName,
        bodyClassName,
        footerClassName,
        titleClassName,
        width,
        height,
        title,
        titleAs,
        titleButtons,
        titleIconButtons,
        children,
        expansion,
        onExpansion,
        footerButtons,
        footerAs,
        foldable,
        loading,
    } = props;
    const [folded, setFolded] = useState(false); // 카드 확장 local변수

    /**
     * 카드 확장
     */
    const handleExpansion = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (onExpansion) {
                onExpansion(folded);
            } else {
                setFolded(!folded);
            }
        },
        [folded, onExpansion],
    );

    /**
     * 타이틀 아이콘 버튼 생성 함수
     */
    const renderTitleIconButtons = useCallback(
        (cx) => {
            const headerButtons = produce(titleIconButtons, (draft) => {
                if (foldable) {
                    draft.push({
                        variant: 'white',
                        icon: <MokaIcon iconName="fal-angle-double-left" rotation={folded ? 180 : 0} />,
                        onClick: handleExpansion,
                        foldIcon: true,
                    });
                }
            });

            if (headerButtons.length > 0) {
                return (
                    <div className="icon-btns d-flex absolute-top-right" style={{ marginTop: 17, marginRight: cx ? 4 : 20 }}>
                        {headerButtons.map((btnProps, idx) => {
                            const { ref: btnRef, variant: btnVariant, onClick: btnOnClick, text: btnText, icon: btnIcon, className: btnClassName, foldIcon, ...rest } = btnProps;
                            return (
                                <Button
                                    key={idx}
                                    ref={btnRef}
                                    variant={btnVariant || 'white'}
                                    className={clsx('p-0 align-items-center justify-content-center', btnClassName, {
                                        'd-flex': !cx,
                                        'd-none': cx && !foldIcon,
                                        'mr-1': idx < headerButtons.length - 1,
                                    })}
                                    onClick={btnOnClick}
                                    {...rest}
                                >
                                    {btnIcon || btnText}
                                </Button>
                            );
                        })}
                    </div>
                );
            }
            return null;
        },
        [foldable, handleExpansion, folded, titleIconButtons],
    );

    useEffect(() => {
        setFolded(foldable && !expansion);
    }, [expansion, foldable]);

    return (
        <Card ref={ref} className={clsx('flex-shrink-0', className, { fold: folded })} style={{ width: folded ? CARD_FOLDING_WIDTH : width, height }}>
            {loading && <MokaLoader />}

            {header && (
                <Card.Header className={clsx('justify-content-between', { 'd-flex': folded, 'position-relative': folded, 'pb-2': titleButtons.length > 0 }, headerClassName)}>
                    {/* 카드 타이틀 */}
                    {titleAs ? (
                        titleAs
                    ) : (
                        <React.Fragment>
                            <Card.Title as="h2" className={clsx({ 'd-none': folded }, titleClassName)}>
                                {title}
                            </Card.Title>
                            {renderTitleIconButtons(folded)}
                        </React.Fragment>
                    )}
                    <div>
                        {titleButtons.map((btnProps, idx) => (
                            <Button key={`title-btns-${idx}`} {...btnProps}>
                                {btnProps.text}
                            </Button>
                        ))}
                    </div>
                </Card.Header>
            )}

            {/* 카드 본문 */}
            <Card.Body className={clsx('custom-scroll', bodyClassName)}>{children}</Card.Body>

            {/* 푸터 */}
            {footerButtons.length > 0 ? (
                <Card.Footer className={clsx('d-flex align-items-center justify-content-center', footerClassName)}>
                    {footerButtons.map(({ variant, text, useAuth, ...rest }, idx) =>
                        useAuth ? (
                            <AuthButton key={`${text}-${idx}`} variant={variant} {...rest}>
                                {text}
                            </AuthButton>
                        ) : (
                            <Button key={`${text}-${idx}`} variant={variant} {...rest}>
                                {text}
                            </Button>
                        ),
                    )}
                </Card.Footer>
            ) : (
                footer && footerAs && <Card.Footer className={footerClassName}>{footerAs}</Card.Footer>
            )}
        </Card>
    );
});

MokaCard.propTypes = propTypes;
MokaCard.defaultProps = defaultProps;

export default MokaCard;
