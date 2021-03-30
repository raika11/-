import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { MokaIcon } from '@components';

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * width 컴포넌트의 가로 사이즈
     * @default
     */
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * height 이미지의 세로 사이즈
     * @default
     */
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * 컴포넌트 그림자 style
     */
    boxShadow: PropTypes.string,
    /**
     * card 이동 시 실행하는 함수
     */
    moveCard: PropTypes.func,
    /**
     * img 경로
     */
    img: PropTypes.string,
    /**
     * alt 이미지 alt
     * @default
     */
    alt: PropTypes.string,
    /**
     * 렌더링 데이터
     * @default
     */
    data: PropTypes.shape({}),
    /**
     * 데이터타입
     * @default
     */
    dataType: PropTypes.oneOf(['archive', 'article', 'local', 'represent', 'drop']),
    /**
     * (이미지리스트에서) 대표사진과 동일 여부
     */
    isRep: PropTypes.bool,
};

const defaultProps = {
    width: 188,
    height: 168,
    alt: '',
    data: {},
    dataType: 'archive',
    isRep: false,
};

export const ItemTypes = {
    GIF: 'gif', // gif 간의 이동
};

/**
 * 드래그가능한 썸네일 카드
 * @see https://github.com/react-dnd/react-dnd/issues/1550
 */
const ThumbCard = forwardRef((props, ref) => {
    const {
        width,
        height,
        data,
        img,
        alt,
        className,
        moveCard,
        setAddIndex,
        dataType,
        editPhoto,
        // 대표사진과 관련된 props
        boxShadow,
        represent,
        showPhotoDetail,
        onDeleteClick,
        isRep,
        setRepImg,
    } = props;

    const imgRef = useRef(null);
    const wrapperRef = useRef(null);
    const cardRef = useRef(null);
    const [mouseOver, setMouseOver] = useState(false);

    /**
     * 드롭존 hook
     */
    const [, drop] = useDrop({
        // 아이템 타입 정의
        accept: ItemTypes.GIF,
        hover: (item, monitor) => {
            if (!cardRef.current) return;
            const dragIndex = item.index;
            const hoverIndex = data.index;

            if (dragIndex === hoverIndex) return;

            // 스크린에서 위치를 가져옴
            const hoverBoundingRect = cardRef.current?.getBoundingClientRect();
            // hover되는 element의 수직적 중간 위치
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // 마우스 위치 가져오기
            const clientOffset = monitor.getClientOffset();
            // 사용자의 마우스 위치에서
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // 마우스가 항목 높이의 절반을 넘었을 때만 이동
            // 아래쪽 (커서가 50% 미만일 때 이동) 위쪽 (커서가 50% 이상일 때 이동)

            // index, 마우스의 위치가 모두 hover된 것의 이전이면 그대로
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            // index, 마우스의 위치가 모두 hover된 것의 이후면 그대로
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            if (item.move) {
                // moveCard 함수 실행
                if (moveCard) {
                    moveCard(dragIndex, hoverIndex);
                }
                item.index = hoverIndex;
            } else {
                if (setAddIndex) setAddIndex(hoverIndex);
            }
        },
    });

    /**
     * 드래그 요소로 사용하기 위한 hook
     */
    const [{ isDragging }, drag] = useDrag({
        // 드래그 되는 element 정보
        item: { type: ItemTypes.GIF, ...data },
        // 드래그 되고 있는지를 확인
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    // return ref 설정
    useImperativeHandle(
        ref,
        () => ({
            cardRef: cardRef.current,
            hoverIndex: data.index,
            wrapperRef: wrapperRef.current,
            imgRef: imgRef.current,
        }),
        [data],
    );

    return (
        <div className={className} style={{ width, height, opacity: isDragging ? 0.5 : 1 }}>
            <div ref={drag(drop(cardRef))} className={clsx('d-flex flex-direction-column h-100 w-100 border rounded')} style={{ boxShadow }}>
                <div className="position-relative overflow-hidden flex-fill">
                    <div
                        ref={wrapperRef}
                        className={clsx('w-100 h-100 d-inline-flex align-items-center justify-content-center position-relative bg-gray-600 overflow-hidden', {
                            'rounded-top': dataType === 'archive',
                            rounded: dataType !== 'archive',
                        })}
                        onMouseOver={() => setMouseOver(true)}
                        onMouseLeave={() => setMouseOver(false)}
                    >
                        <img src={img} className="center-image" alt={alt} ref={imgRef} />

                        <div className="w-100 h-100 absolute-top">
                            {/* 마우스 오버 -> 대표 사진 등록 */}
                            {mouseOver && !represent && (
                                <Button
                                    variant={isRep ? 'positive' : 'negative'}
                                    size="sm"
                                    style={{ position: 'absolute', top: '5px', left: '5px' }}
                                    onClick={(e) => setRepImg(data, e)}
                                >
                                    대표
                                </Button>
                            )}

                            {/* 초상권 주의 */}
                            {dataType !== 'drop' && !represent && data.atpnPoriatentYn === 'Y' && (
                                <Button variant="searching" className="border-0 p-0 moka-table-button" style={{ position: 'absolute', top: '5px', right: '5px', opacity: '0.8' }}>
                                    <MokaIcon iconName="fal-eye-slash" />
                                </Button>
                            )}

                            {/* 재사용 금지 */}
                            {dataType !== 'drop' && !represent && data.atpnReusprhibtYn === 'Y' && (
                                <Button variant="searching" className="border-0 p-0 moka-table-button" style={{ position: 'absolute', top: '5px', right: '5px', opacity: '0.8' }}>
                                    <MokaIcon iconName="fal-exclamation-triangle" />
                                </Button>
                            )}

                            {/* 상세 조회 */}
                            {dataType !== 'drop' && !represent && !data.preview && (
                                <Button
                                    variant="searching"
                                    className="border-0 p-0 moka-table-button"
                                    style={{ position: 'absolute', bottom: '5px', right: '5px', opacity: '0.8' }}
                                    onClick={() => showPhotoDetail(data)}
                                >
                                    <MokaIcon iconName="fal-search-plus" />
                                </Button>
                            )}

                            {/* 삭제 */}
                            {(dataType === 'drop' || represent) && (
                                <Button
                                    variant="searching"
                                    className="border-0 p-0 moka-table-button"
                                    style={{ position: 'absolute', top: '5px', right: '5px', opacity: '0.8' }}
                                    onClick={(e) => onDeleteClick(data, e)}
                                >
                                    <MokaIcon iconName="fas-times" />
                                </Button>
                            )}

                            {/* 수정 */}
                            {(dataType === 'drop' || represent) && (
                                <Button
                                    variant="searching"
                                    className="border-0 p-0 moka-table-button"
                                    style={{ position: 'absolute', bottom: '5px', right: '5px', opacity: '0.8' }}
                                    onClick={() => editPhoto(data)}
                                >
                                    <MokaIcon iconName="fas-pencil" />
                                </Button>
                            )}

                            {/* 대표이미지 마크 */}
                            {represent && (
                                <Badge variant="positive" style={{ position: 'absolute', bottom: '5px', left: '5px' }}>
                                    대표 이미지
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* 아카이브만 텍스트영역 노출 필요없음 */}
                {dataType === 'archive' && !represent && (
                    <div className="p-03 border-top" style={{ minHeight: 48 }}>
                        <div className="d-flex justify-content-between" style={{ height: 20 }}>
                            <p className="pt-05 pl-05 mb-0 flex-fill ft-12 h5 text-truncate">{data.text}</p>
                        </div>
                        <p className="pt-0 pl-05 mb-0 ft-12 text-truncate">{data.date}</p>
                    </div>
                )}
            </div>
        </div>
    );
});

ThumbCard.propTypes = propTypes;
ThumbCard.defaultProps = defaultProps;

export default ThumbCard;
