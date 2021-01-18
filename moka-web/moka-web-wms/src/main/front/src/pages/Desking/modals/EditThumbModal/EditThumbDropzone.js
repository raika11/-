import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import produce from 'immer';
import Button from 'react-bootstrap/Button';
import { useDrop } from 'react-dnd';
import { MokaIcon, MokaInputLabel } from '@components';
import EditThumbCard, { ItemTypes } from './EditThumbCard';
import toast from '@utils/toastUtil';
import gifshot from 'gifshot';
import moment from 'moment';
import commonUtil from '@utils/commonUtil';
import { IMAGE_PROXY_API } from '@/constants';
import imageEditer from '@utils/imageEditorUtil';

moment.locale('ko');

const EditThumbDropzone = (props) => {
    const { collapse, setCollapse } = props;
    const { onThumbClick, onRepClick, setRepPhoto } = props;
    const { cropWidth, cropHeight } = props;
    const [imgList, setImgList] = useState([]);
    const [addIndex, setAddIndex] = useState(-1);
    const cardRef = useRef(null);
    const [gifInterval, setGifInterval] = useState(0.5);
    const [btnDisabled, setBtnDisabled] = useState('disabled');
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

    const handleEditClick = (data) => {
        imageEditer.create(
            data.imageOnlnPath,
            (imageSrc) => {
                data.imageOnlnPath = imageSrc;
                data.preview = imageSrc;
                data.thumbPath = imageSrc;

                setImgList(
                    produce(imgList, (draft) => {
                        draft.splice(data.index + 1, 0, data);
                        draft.splice(data.index, 1);
                    }),
                );
            },
            { cropWidth: 300, cropHeight: 300 },
        );
    };

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

    const handleMakeGif = () => {
        let images = [];
        // eslint-disable-next-line array-callback-return
        imgList.map((image) => {
            if (image.dataType !== 'local') {
                images.push(`${IMAGE_PROXY_API}${encodeURIComponent(image.imageOnlnPath)}`);
            } else {
                images.push(image.imageOnlnPath);
            }
        });

        gifshot.createGIF(
            {
                images: images,
                crossOrigin: 'Anonymous',
                gifWidth: 300,
                gifHeight: 300,
                interval: gifInterval,
            },
            (obj) => {
                if (!obj.error) {
                    const gifImage = URL.createObjectURL(commonUtil.base64ToBlob(obj.image));
                    setRepPhoto({
                        dataType: 'local',
                        id: moment().format('YYYYMMDDsss'),
                        thumbPath: gifImage,
                        path: {
                            preview: gifImage,
                        },
                    });
                } else {
                    toast.error('GIF이미지 생성에 실패했습니다.');
                }
            },
        );
    };

    const handleChangeValue = ({ target }) => {
        const { name, value } = target;
        if (name === 'gifInterval') {
            setGifInterval(value);
        }
    };

    useEffect(() => {
        if (imgList.length > 1) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    }, [imgList.length]);

    return (
        <div className="d-flex flex-column overflow-hidden" style={{ width: 998 }}>
            {/* 버튼 영역 */}
            <div className="w-100 d-flex align-items-center justify-content-between py-2 px-3">
                <div>{imgList.length > 0 && <p className="m-0 ft-12">총 : {imgList.length} 건</p>}</div>
                <div className="d-flex align-items-center">
                    <Button variant="searching" className="ft-12 mr-2" onClick={handleMakeGif} disabled={btnDisabled}>
                        GIF 생성
                    </Button>
                    <div style={{ width: 120 }} className="mr-1">
                        <MokaInputLabel label="간격" labelWidth={45} className="mb-0" name="gifInterval" value={gifInterval} onChange={handleChangeValue} />
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
            <div className={clsx('flex-fill', 'px-3', 'is-file-dropzone', 'pb-3', 'overflow-hidden', 'pt-10')}>
                <div ref={drop} className={clsx('w-100 h-100 position-relative custom-scroll ', { 'dropzone-dragover': isOver })}>
                    <div className="d-flex flex-wrap align-content-start position-relative pb-1">
                        <div className="" style={{ minHeight: 139 }}></div>
                        {imgList.map((data, idx) => (
                            <EditThumbCard
                                ref={cardRef}
                                width={191}
                                height={135}
                                className="flex-shrink-0"
                                key={idx}
                                dataType="drop"
                                data={{ ...data, move: true, index: idx, dataType: 'drop' }}
                                img={data.thumbPath}
                                moveCard={moveCard}
                                setAddIndex={setAddIndex}
                                onThumbClick={onThumbClick}
                                onDeleteClick={handleDeleteDropCard}
                                onRepClick={onRepClick}
                                onEditClick={handleEditClick}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditThumbDropzone;
