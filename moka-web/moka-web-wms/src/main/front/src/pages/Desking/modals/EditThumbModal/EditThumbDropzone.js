import React, { useState, useCallback, useRef } from 'react';
import clsx from 'clsx';
import produce from 'immer';
import Button from 'react-bootstrap/Button';
import { useDrop } from 'react-dnd';
import { MokaInputLabel, MokaIcon } from '@components';
import EditThumbCard, { ItemTypes } from './EditThumbCard';
import toast from '@utils/toastUtil';

const EditThumbDropzone = (props) => {
    const { collapse, setCollapse } = props;
    const { onThumbClick, onRepClick, onEditClick } = props;
    const [imgList, setImgList] = useState([]);
    const [addIndex, setAddIndex] = useState(-1);
    const cardRef = useRef(null);

    /**
     * 드롭존으로 사용하기 위한 hook
     */
    const [{ isOver }, drop] = useDrop({
        // 지정된 유형 소스에 의해 생성된 항목에만 반응
        accept: ItemTypes.GIF,
        drop: (item, monitor) => {
            // 새 아이템만 등록
            if (item.move) return;
            if (imgList.findIndex((img) => img.id === item.id) > -1) {
                toast.warning('이미 드롭된 이미지 입니다.');
                return;
            }

            if (addIndex > -1) {
                setImgList(
                    produce(imgList, (draft) => {
                        draft.splice(addIndex, 0, item);
                    }),
                );
            } else {
                setImgList(
                    produce(imgList, (draft) => {
                        draft.push(item);
                    }),
                );
            }

            setAddIndex(-1);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

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

    /**
     * 드롭 카드 아이템 삭제 버튼 클릭
     */
    const handleDeleteDropCard = (data, e) => {
        e.stopPropagation();

        setImgList(
            produce(imgList, (draft) => {
                draft.splice(imgList.findIndex((list) => list.index === data.index, 1));
            }),
        );
    };

    React.useEffect(() => {
        console.log(addIndex);
    }, [addIndex]);

    return (
        <div className="d-flex flex-column overflow-hidden" style={{ width: 998 }}>
            {/* 버튼 영역 */}
            <div className="w-100 d-flex align-items-center justify-content-between py-2 px-3">
                <div>{imgList.length > 0 && <p className="m-0 ft-12">총 : {imgList.length} 건</p>}</div>
                <div className="d-flex align-items-center">
                    <Button variant="searching" className="ft-12 mr-2">
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
            </div>

            {/* 드롭 영역 */}
            <div className={clsx('flex-fill', 'custom-scroll', 'px-3', 'is-file-dropzone', { 'dropzone-dragover': isOver })}>
                <div ref={drop} className="w-100 h-100">
                    <div className="d-flex flex-wrap align-content-start position-relative pb-1">
                        <div className="dropzone-dragover-mask" style={{ minHeight: 139 }}></div>
                        {imgList.map((data, idx) => (
                            <EditThumbCard
                                ref={cardRef}
                                width={191}
                                height={135}
                                className="flex-shrink-0"
                                key={idx}
                                data={{ ...data, move: true, index: idx }}
                                img={data.imageThumPath || data.compFileUrl || data.preview}
                                moveCard={moveCard}
                                dropCard
                                setAddIndex={setAddIndex}
                                onThumbClick={onThumbClick}
                                onDeleteClick={handleDeleteDropCard}
                                onRepClick={onRepClick}
                                onEditClick={onEditClick}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditThumbDropzone;
