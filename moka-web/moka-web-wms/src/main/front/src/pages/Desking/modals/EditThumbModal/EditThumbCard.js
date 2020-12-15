import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import BSImage from 'react-bootstrap/Image';
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
    width: PropTypes.number,
    /**
     * height 이미지의 세로 사이즈
     */
    height: PropTypes.number,
    /**
     * img 이미지 경로
     */
    img: PropTypes.string,
    /**
     * alt 이미지 alt
     */
    alt: PropTypes.string,
    /**
     * 썸네일 데이터
     */
    data: PropTypes.object,
    /**
     * 선택 여부
     */
    selected: PropTypes.bool,
    /**
     * 대표 이미지 정보 오브젝트
     */
    repPhoto: PropTypes.object,
};

const defaultProps = {
    width: 191,
    height: 168,
    alt: '썸네일이미지',
    data: {},
    selected: false,
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
    const { width, height, data, img, alt, selected, className, dropCard, moveCard, setAddIndex } = props;
    // 대표 사진 설정 props
    const { represent } = props;
    const { onThumbClick, onDeleteClick, onRepClick, onEditClick } = props;

    const PHOTO_ARCHIVE_URL = useSelector((store) => store.app.PHOTO_ARCHIVE_URL);

    const imgRef = useRef(null);
    const wrapperRef = useRef(null);
    const cardRef = useRef(null);

    // state
    const [mouseOver, setMouseOver] = useState(false);
    const [repButtonColor, setRepButtonColor] = useState('');
    const [thumbSrc, setThumbSrc] = useState('');

    // return ref 설정
    useImperativeHandle(
        ref,
        () => ({
            cardRef: cardRef.current,
            hoverIndex: data.index,
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

    useEffect(() => {
        // 썸네일 카드 경로 셋팅
        if (img) {
            let thumb = img ? `${PHOTO_ARCHIVE_URL}${img}` : undefined;
            setThumbSrc(thumb);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [img]);

    const handleEdit = (e) => {
        e.stopPropagation();

        if (onEditClick) {
            console.log('edit click');
        }
    };

    // 이미지 landscape, portrait 설정
    useEffect(() => {
        if (imgRef.current !== null) {
            util.makeImgPreview(
                imgRef.current.src,
                imgRef.current,
                wrapperRef.current,
                () => {
                    imgRef.current.style.visibility = 'visible';
                },
                () => {
                    imgRef.current.style.visibility = 'visible';
                },
            );
        }
    }, []);

    return (
        <>
            <div className={clsx('p-2', className, { dropCard })} style={{ width, height, opacity: isDragging ? 0.5 : 1 }}>
                <div
                    ref={drag(drop(cardRef))}
                    className={clsx('d-flex flex-direction-column h-100 w-100', { 'thumb-card-selected': selected, border: !dropCard, rounded: !dropCard })}
                >
                    <div className="position-relative overflow-hidden flex-fill cursor-pointer">
                        <div className="w-100 h-100 absolute-top">
                            <div
                                ref={wrapperRef}
                                className={clsx('w-100 h-100 bg-gray600 d-flex align-item-center justify-content-center overflow-hidden', { 'rounded-top': !dropCard })}
                                onMouseOver={() => setMouseOver(true)}
                                onMouseLeave={() => {
                                    setMouseOver(false);
                                    setRepButtonColor('');
                                }}
                            >
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
                                {!dropCard && !represent && (
                                    <>
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
                                        <Button
                                            variant="searching"
                                            className="border-0 p-0 moka-table-button"
                                            style={{ position: 'absolute', bottom: '5px', right: '5px', opacity: '0.8' }}
                                            onClick={() => onThumbClick(data)}
                                        >
                                            <MokaIcon iconName="fal-search-plus" />
                                        </Button>
                                    </>
                                )}

                                {/* 드롭된 카드의 버튼 */}
                                {dropCard && !represent && (
                                    <>
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
                                            onClick={handleEdit}
                                        >
                                            <MokaIcon iconName="fas-pencil" />
                                        </Button>
                                    </>
                                )}

                                {/* 대표 사진의 버튼 */}
                                {represent && (
                                    <>
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
                                            onClick={handleEdit}
                                        >
                                            <MokaIcon iconName="fas-pencil" />
                                        </Button>
                                        <Button className="ft-12" style={{ position: 'absolute', bottom: '1px', left: '1px' }} as="a">
                                            대표 이미지
                                        </Button>
                                    </>
                                )}
                                {img && <BSImage src={thumbSrc} alt={alt} ref={imgRef} />}
                            </div>
                        </div>
                    </div>

                    {/* 드롭 카드, 대표 이미지는 텍스트영역 필요없음 */}
                    {!dropCard && !represent && (
                        <div className="p-03 border-top" style={{ minHeight: 48 }}>
                            <div className="d-flex justify-content-between" style={{ height: 20 }}>
                                <p className="pt-05 pl-05 mb-0 flex-fill h5 text-truncate">{data.text}</p>
                            </div>
                            <p className="pt-0 pl-05 mb-0 text-truncate">{data.date}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
});

EditThumbCard.propTypes = propTypes;
EditThumbCard.defaultProps = defaultProps;

export default EditThumbCard;
