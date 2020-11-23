import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import BSImage from 'react-bootstrap/Image';

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
    data: PropTypes.shape({
        name: PropTypes.string,
        dt: PropTypes.string,
    }),
    /**
     * 선택 여부
     */
    selected: PropTypes.bool,
};

const defaultProps = {
    width: 191,
    height: 168,
    alt: '썸네일이미지',
    data: {
        templateName: '',
        templateGroup: '',
        templateWidth: '',
    },
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
    const { onClick, width, height, data, img, alt, selected, className, dropCard, moveCard, setAddIndex } = props;
    const imgRef = useRef(null);
    const wrapperRef = useRef(null);
    const cardRef = useRef(null);

    // return ref 설정
    useImperativeHandle(
        ref,
        () => ({
            cardRef: cardRef.current,
            hoverIndex: data.index,
        }),
        [data],
    );

    const [, drop] = useDrop({
        accept: ItemTypes.GIF,
        hover: (item, monitor) => {
            if (!cardRef.current) return;
            const dragIndex = item.index;
            const hoverIndex = data.index;

            if (dragIndex === hoverIndex) return;

            // Determine rectangle on screen
            const hoverBoundingRect = cardRef.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            if (item.move) {
                // Time to actually perform the action
                moveCard(dragIndex, hoverIndex);

                // Note: we're mutating the monitor item here!
                // Generally it's better to avoid mutations,
                // but it's good here for the sake of performance
                // to avoid expensive index searches.
                item.index = hoverIndex;
            } else {
                if (setAddIndex) setAddIndex(hoverIndex);
            }
        },
    });

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.GIF, ...data },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    // 이미지 landscape, portrait 설정
    useEffect(() => {
        if (imgRef.current !== null) {
            let image = new Image();
            image.src = imgRef.current.src;
            image.onload = (imgProps) => {
                let w = imgProps.path[0].width;
                let h = imgProps.path[0].height;
                let rate = 1;
                if (wrapperRef.current) {
                    rate = wrapperRef.current.innerWidth / wrapperRef.current.innerHeight;
                }
                if (w / h > rate) {
                    imgRef.current.className = 'landscape';
                } else {
                    imgRef.current.className = 'portrait';
                }
                imgRef.current.style.visibility = 'visible';
            };
            image.onerror = () => {
                imgRef.current.style.visibility = 'visible';
            };
        }
    }, []);

    /**
     * 썸네일 카드 클릭 시
     */
    const handleThumbClick = (e) => {
        if (onClick) {
            onClick(data, e);
        }
    };

    return (
        <div className={clsx('p-2', className, { dropCard })} style={{ width, height, opacity: isDragging ? 0.5 : 1 }}>
            <div ref={drag(drop(cardRef))} className={clsx('d-flex flex-direction-column h-100 w-100', { 'thumb-card-selected': selected, border: !dropCard, rounded: !dropCard })}>
                <div className="position-relative overflow-hidden flex-fill cursor-pointer">
                    <div className="w-100 h-100 absolute-top">
                        <div
                            ref={wrapperRef}
                            className={clsx('w-100 h-100 d-flex align-item-centers justify-content-center overflow-hidden', { 'rounded-top': !dropCard })}
                            onClick={handleThumbClick}
                        >
                            {img && <BSImage src={img} alt={alt} ref={imgRef} style={{ visibility: 'hidden' }} />}
                            {!img && <div className="w-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: data.color }}></div>}
                        </div>
                    </div>
                </div>

                {/* 드롭 카드는 텍스트영역 필요없음 필요없음 */}
                {!dropCard && (
                    <div className="p-03 border-top" style={{ minHeight: 48 }}>
                        <div className="d-flex justify-content-between" style={{ height: 20 }}>
                            <p className="pt-05 pl-05 mb-0 flex-fill h5 text-truncate" title={data.templateName}>
                                {data.name}
                            </p>
                        </div>
                        <p className="pt-0 pl-05 mb-0 text-truncate">{data.templateGroupName}</p>
                    </div>
                )}
            </div>
        </div>
    );
});

EditThumbCard.propTypes = propTypes;
EditThumbCard.defaultProps = defaultProps;

export default EditThumbCard;
