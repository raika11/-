import React, { useState, useCallback, useRef } from 'react';
import clsx from 'clsx';
import produce from 'immer';
import Button from 'react-bootstrap/Button';
import { useDrop } from 'react-dnd';
import { MokaInputLabel, MokaIcon } from '@components';
import EditThumbCard, { ItemTypes } from './EditThumbCard';

const EditThumbDropzone = ({ collapse, setCollapse }) => {
    const [imgList, setImgList] = useState([]);
    const cardRef = useRef(null);

    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.GIF,
        drop: (item, monitor) => {
            // 새 아이템만 등록
            if (item.move) return;
            if (imgList.findIndex((img) => img.id === item.id) > -1) return;

            setImgList(
                produce(imgList, (draft) => {
                    draft.push(item);
                }),
            );
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    const addCard = useCallback(
        (item, hoverIndex) => {
            setImgList(
                produce(imgList, (draft) => {
                    draft.splice(hoverIndex, 0, item);
                }),
            );
        },
        [imgList],
    );

    const moveCard = useCallback(
        (dragIndex, hoverIndex) => {
            const dragImg = imgList[dragIndex];
            setImgList(
                produce(imgList, (draft) => {
                    draft.splice(dragIndex, 1);
                    draft.splice(hoverIndex, 0, dragImg);
                }),
            );
        },
        [imgList],
    );

    return (
        <div className="d-flex flex-column overflow-hidden" style={{ width: 998 }}>
            {/* 버튼 영역 */}
            <div className="w-100 d-flex align-items-center justify-content-end py-2 px-3">
                <Button variant="searching" className="ft-12">
                    GIF 생성
                </Button>
                <div style={{ width: 120 }} className="mr-1">
                    <MokaInputLabel label="간격" labelWidth={45} className="mb-0" disabled />
                </div>
                <p className="mb-0 mr-3">sce</p>
                <Button
                    variant="searching"
                    className="px-2"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCollapse(!collapse);
                    }}
                >
                    <MokaIcon iconName={!collapse ? 'fal-compress-arrows-alt' : 'fal-expand-arrows'} />
                </Button>
            </div>

            {/* 드롭 영역 */}
            <div ref={drop} className={clsx('flex-fill', 'custom-scroll', 'px-3', { isOver: isOver })}>
                <div className="d-flex flex-wrap align-content-start pb-2">
                    {imgList.map((data, idx) => (
                        <EditThumbCard
                            ref={cardRef}
                            width={191}
                            height={135}
                            className="flex-shrink-0"
                            key={idx}
                            data={{ ...data, move: true, index: idx }}
                            moveCard={moveCard}
                            addCard={addCard}
                            dropCard
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EditThumbDropzone;
