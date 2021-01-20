import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import util from '@utils/commonUtil';
import { MokaIcon } from '@components';

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * onClick 썸네일 카드 onClick 이벤트
     */
    onClick: PropTypes.func,
    /**
     * width 컴포넌트의 가로 사이즈
     */
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * height 이미지의 세로 사이즈
     */
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
     */
    alt: PropTypes.string,
    /**
     * 렌더링 데이터
     */
    data: PropTypes.object,
    /**
     * 선택 여부
     */
    selected: PropTypes.bool,
    /**
     * 데이터타입
     */
    dataType: PropTypes.oneOf(['archive', 'article', 'local', 'represent', 'drop']),
};

const defaultProps = {
    width: 188,
    height: 168,
    alt: '',
    data: {},
    selected: false,
    dataType: 'archive',
};

export const ItemTypes = {
    GIF: 'gif', // gif 간의 이동
};

/**
 * 페이지편집 대표이미지편집 팝업의 썸네일카드
 * (드래그 가능)
 * https://github.com/react-dnd/react-dnd/issues/1550
 */
const EditThumbCard = forwardRef((props, ref) => {
    const { width, height, data, img, alt, selected, className, moveCard, setAddIndex, dataType, boxShadow } = props;
    // 대표 사진 설정 props
    const { represent } = props;
    const { onThumbClick, onDeleteClick, onRepClick, onEditClick } = props;

    const imgRef = useRef(null);
    const wrapperRef = useRef(null);
    const cardRef = useRef(null);
    const [mouseOver, setMouseOver] = useState(false);
    const [repButtonColor, setRepButtonColor] = useState('');

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
                moveCard(dragIndex, hoverIndex);
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

    return (
        <div className={className} style={{ width, height, boxShadow, opacity: isDragging ? 0.5 : 1 }}>
            <div ref={drag(drop(cardRef))} className={clsx('d-flex flex-direction-column h-100 w-100 border rounded', { 'thumb-card-selected': selected })}>
                <div className="position-relative overflow-hidden flex-fill cursor-pointer">
                    <div
                        ref={wrapperRef}
                        className={clsx('w-100 h-100 d-inline-flex align-items-center justify-content-center position-relative bg-gray600 overflow-hidden', {
                            'rounded-top': dataType === 'archive',
                            rounded: dataType !== 'archive',
                        })}
                        onMouseOver={() => setMouseOver(true)}
                        onMouseLeave={() => {
                            setMouseOver(false);
                            setRepButtonColor('');
                        }}
                    >
                        <img src={img} className="center-image" alt={alt} ref={imgRef} />

                        <div className="w-100 h-100 absolute-top">
                            {/* 마우스 오버 -> 대표 사진 등록 버튼 생성 */}
                            {mouseOver && !represent && (
                                <Button
                                    variant="searching"
                                    className="border-0 p-0 moka-table-button"
                                    style={{ position: 'absolute', top: '5px', left: '5px', opacity: '0.8', color: repButtonColor }}
                                    onClick={(e) => {
                                        setRepButtonColor('yellow');
                                        onRepClick(data, e);
                                    }}
                                >
                                    <MokaIcon iconName="fas-star" />
                                </Button>
                            )}

                            {/* 테이블 카드의 버튼 */}
                            {dataType !== 'drop' && !represent && (
                                <React.Fragment>
                                    {/* 초상권 주의 */}
                                    {data.atpnPoriatentYn === 'Y' && (
                                        <Button
                                            variant="searching"
                                            className="border-0 p-0 moka-table-button"
                                            style={{ position: 'absolute', top: '5px', right: '5px', opacity: '0.8' }}
                                        >
                                            <MokaIcon iconName="fal-eye-slash" />
                                        </Button>
                                    )}
                                    {data.atpnReusprhibtYn === 'Y' && (
                                        <Button
                                            variant="searching"
                                            className="border-0 p-0 moka-table-button"
                                            style={{ position: 'absolute', top: '5px', right: '5px', opacity: '0.8' }}
                                        >
                                            <MokaIcon iconName="fal-exclamation-triangle" />
                                        </Button>
                                    )}
                                    {/* 상세 조회 */}
                                    {!data.preview && (
                                        <Button
                                            variant="searching"
                                            className="border-0 p-0 moka-table-button"
                                            style={{ position: 'absolute', bottom: '5px', right: '5px', opacity: '0.8' }}
                                            onClick={() => onThumbClick(data)}
                                        >
                                            <MokaIcon iconName="fal-search-plus" />
                                        </Button>
                                    )}
                                </React.Fragment>
                            )}

                            {/* 드롭된 카드의 버튼 */}
                            {dataType === 'drop' && !represent && (
                                <React.Fragment>
                                    {/* 삭제 */}
                                    <Button
                                        variant="searching"
                                        className="border-0 p-0 moka-table-button"
                                        style={{ position: 'absolute', top: '5px', right: '5px', opacity: '0.8' }}
                                        onClick={(e) => onDeleteClick(data, e)}
                                    >
                                        <MokaIcon iconName="fas-times" />
                                    </Button>
                                    {/* 사진 편집 */}
                                    <Button
                                        variant="searching"
                                        className="border-0 p-0 moka-table-button"
                                        style={{ position: 'absolute', bottom: '5px', right: '5px', opacity: '0.8' }}
                                        onClick={(e) => onEditClick(data)}
                                    >
                                        <MokaIcon iconName="fas-pencil" />
                                    </Button>
                                </React.Fragment>
                            )}

                            {/* 대표 사진의 버튼 */}
                            {represent && (
                                <React.Fragment>
                                    {/* 삭제 */}
                                    <Button
                                        variant="searching"
                                        className="border-0 p-0 moka-table-button"
                                        style={{ position: 'absolute', top: '5px', right: '5px', opacity: '0.8' }}
                                        onClick={(e) => onDeleteClick(data, e)}
                                    >
                                        <MokaIcon iconName="fas-times" />
                                    </Button>
                                    {/* 사진 편집 */}
                                    <Button
                                        variant="searching"
                                        className="border-0 p-0 moka-table-button"
                                        style={{ position: 'absolute', bottom: '5px', right: '5px', opacity: '0.8' }}
                                        onClick={(e) => {
                                            onEditClick(data);
                                        }}
                                    >
                                        <MokaIcon iconName="fas-pencil" />
                                    </Button>
                                    <Button size="sm" style={{ position: 'absolute', bottom: '5px', left: '5px' }} as="a">
                                        대표 이미지
                                    </Button>
                                </React.Fragment>
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

EditThumbCard.propTypes = propTypes;
EditThumbCard.defaultProps = defaultProps;

export default EditThumbCard;
