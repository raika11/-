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
    const { represent, setFileValue, setThumbFileName, repPhoto, setRepPhoto, setShowRep } = props;
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
    }, [PHOTO_ARCHIVE_URL]);

    /**
     * 썸네일 클릭
     */
    const handleThumb = (data, e) => {
        e.stopPropagation();

        if (onThumbClick) {
            onThumbClick(data);
        }
    };

    /**
     * 삭제 버튼 클릭
     */
    const handleDelete = (e) => {
        e.stopPropagation();

        if (onDeleteClick) {
            setShowRep(false);
        }
    };

    /**
     * 대표 이미지 설정
     */
    const handleRepImg = (e) => {
        e.stopPropagation();

        if (onRepClick) {
            setRepButtonColor('yellow');
            setRepPhoto({
                ...repPhoto,
                id: data.nid,
                path: {
                    orgPath: data.imageOnlnPath,
                    thumbPath: data.imageThumPath,
                },
                // imgProps: imgData,
            });
            setShowRep(true);
            // setThumbFileName(data.imageOnlnPath);
        }
    };

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
                                onClick={handleThumb}
                                onMouseOver={() => setMouseOver(true)}
                                onMouseLeave={() => {
                                    setMouseOver(false);
                                    setRepButtonColor('');
                                }}
                            >
                                {/* 카드의 마우스 오버 버튼 생성 */}
                                {mouseOver && !represent && (
                                    <Button
                                        variant="searching"
                                        className="border-0 p-0 moka-table-button"
                                        style={{ position: 'absolute', top: '5px', left: '5px', opacity: '0.8', color: repButtonColor }}
                                        onClick={handleRepImg}
                                    >
                                        <MokaIcon iconName="fas-star" />
                                    </Button>
                                )}

                                {/* 테이블 카드의 버튼 */}
                                {!dropCard && !represent && (
                                    <>
                                        <Button
                                            variant="searching"
                                            className="border-0 p-0 moka-table-button"
                                            style={{ position: 'absolute', top: '5px', right: '5px', opacity: '0.8' }}
                                        >
                                            <MokaIcon iconName="fal-eye-slash" />
                                        </Button>
                                        <Button
                                            variant="searching"
                                            className="border-0 p-0 moka-table-button"
                                            style={{ position: 'absolute', bottom: '5px', right: '5px', opacity: '0.8' }}
                                        >
                                            <MokaIcon iconName="fal-search-plus" />
                                        </Button>
                                    </>
                                )}
                                {/* <Button
                                        variant="searching"
                                        className="border-0 p-0 moka-table-button"
                                        style={{ position: 'absolute', top: '5px', left: '5px', opacity: '0.7' }}
                                        onClick={handleRepImg}
                                    >
                                        <MokaIcon iconName="fal-exclamation-triangle" />
                                    </Button> */}

                                {/* 드롭 카드 버튼 */}
                                {dropCard && !represent && (
                                    <>
                                        <Button
                                            variant="searching"
                                            className="border-0 p-0 moka-table-button"
                                            style={{ position: 'absolute', top: '5px', right: '5px', opacity: '0.7' }}
                                            onClick={handleDelete}
                                        >
                                            <MokaIcon iconName="fas-times" />
                                        </Button>
                                        <Button
                                            variant="searching"
                                            className="border-0 p-0 moka-table-button"
                                            style={{ position: 'absolute', bottom: '5px', right: '5px', opacity: '0.7' }}
                                            onClick={handleEdit}
                                        >
                                            <MokaIcon iconName="fas-pencil" />
                                        </Button>
                                    </>
                                )}

                                {/* 대표 사진 버튼 */}
                                {represent && (
                                    <>
                                        <Button
                                            variant="searching"
                                            className="border-0 p-0 moka-table-button"
                                            style={{ position: 'absolute', top: '5px', right: '5px', opacity: '0.7' }}
                                            onClick={handleDelete}
                                        >
                                            <MokaIcon iconName="fas-times" />
                                        </Button>
                                        <Button
                                            variant="searching"
                                            className="border-0 p-0 moka-table-button"
                                            style={{ position: 'absolute', bottom: '5px', right: '5px', opacity: '0.7' }}
                                            onClick={handleEdit}
                                        >
                                            <MokaIcon iconName="fas-pencil" />
                                        </Button>
                                        <Button style={{ position: 'absolute', bottom: '1px', left: '1px' }} as="div">
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
