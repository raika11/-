import React, { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';
import produce from 'immer';
import Button from 'react-bootstrap/Button';
import { NativeTypes } from 'react-dnd-html5-backend';
import { useDrop } from 'react-dnd';
import moment from 'moment';
import { IMAGE_PROXY_API, ACCEPTED_IMAGE_TYPES } from '@/constants';
import toast from '@utils/toastUtil';
import imageEditer from '@utils/imageEditorUtil';
import { MokaIcon } from '@components';
import ThumbCard, { ItemTypes } from './ThumbCard';
import MakeGifModal from '../MakeGifModal';

moment.locale('ko');

/**
 * Gif를 생성하기 위한 이미지 드롭존
 */
const GifDropzone = (props) => {
    const { collapse, setCollapse, showPhotoDetail, setRepImg, repImg, cropWidth, cropHeight } = props;
    const [imgList, setImgList] = useState([]);
    const [addIndex, setAddIndex] = useState(-1);
    const [modalShow, setModalShow] = useState(false);
    const cardRef = useRef(null);
    const fileRef = useRef(null);

    /**
     * 로컬 이미지 추가
     * @param {object} item file의 target
     */
    const addLocalImg = useCallback(
        (item) => {
            let imageFiles = [];
            Array.from(item.files).forEach((f, idx) => {
                if (ACCEPTED_IMAGE_TYPES.includes(f.type)) {
                    const id = `${moment().format('YYYYMMDDsss')}_${idx}`;
                    const preview = URL.createObjectURL(f);
                    // thumbPath: preview, imageOnlnPath: `${IMAGE_PROXY_API}${encodeURIComponent(preview)}`
                    const imageData = { id: id, File: f, preview, dataType: 'local' };
                    imageFiles.push(imageData);
                } else {
                    // 이미지 파일이 아닌경우
                    toast.warning('이미지 파일만 등록할 수 있습니다.');
                }
            });

            const arr = imgList.concat(imageFiles);
            setImgList(arr);
        },
        [imgList],
    );

    /**
     * 드롭존으로 사용하기 위한 hook
     */
    const [{ isOver }, drop] = useDrop({
        // 지정된 유형 소스에 의해 생성된 항목에만 반응
        accept: [ItemTypes.GIF, NativeTypes.FILE],
        drop: (item, monitor) => {
            // 새 아이템만 등록
            if (item.move) return;

            if (imgList.findIndex((img) => img.id === item.id) > -1) {
                toast.warning('이미 드롭된 이미지 입니다.');
                return;
            }

            if (item.type === 'gif') {
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
            } else {
                addLocalImg(item);
            }
            setAddIndex(-1);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    /**
     * move card
     */
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
     * 이미지 편집
     * @param {*} data
     */
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
            { cropWidth, cropHeight },
        );
    };

    /**
     * 드롭 목록에 있는 아이템 삭제
     */
    const handleDeleteDropCard = useCallback(
        (data, e) => {
            e.stopPropagation();
            setImgList(
                produce(imgList, (draft) => {
                    draft.splice(
                        imgList.findIndex((list) => list.id === data.id),
                        1,
                    );
                }),
            );
        },
        [imgList],
    );

    /**
     * 파일 변경
     * @param {object} e 이벤트
     */
    const handleChangeFile = (e) => addLocalImg(e.target);

    /**
     * gif 생성 -> 저장
     * @param {string} gifImage 생성된 gif 이미지 링크
     */
    const handleSaveGif = (gifImage) => {
        setRepImg({
            dataType: 'local',
            id: `${moment().format('YYYYMMDDsss')}_gif`,
            preview: gifImage,
        });
    };

    React.useEffect(() => {
        return () => {
            setImgList([]);
            setModalShow(false);
            setAddIndex(-1);
        };
    }, []);

    return (
        <div className="d-flex flex-column overflow-hidden" style={{ width: 998 }}>
            {/* 버튼 그룹 */}
            <div className="w-100 d-flex align-items-center justify-content-between py-2 px-3">
                <div>{imgList.length > 0 && <p className="m-0">총 : {imgList.length} 건</p>}</div>
                <div className="d-flex align-items-center">
                    {/* 내 PC */}
                    <Button variant="searching" className="mr-1" onClick={() => fileRef.current.click()}>
                        내 PC 사진
                    </Button>
                    <input type="file" ref={fileRef} onChange={handleChangeFile} className="d-none" accept="image/*" />

                    {/* GIF 생성 */}
                    <Button variant="searching" className="mr-1" onClick={() => setModalShow(true)} disabled={imgList.length < 2}>
                        GIF 생성
                    </Button>
                    <MakeGifModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        cropWidth={cropWidth}
                        cropHeight={cropHeight}
                        onSave={handleSaveGif}
                        gifWidth={cropWidth}
                        gifHeight={cropHeight}
                        imgList={imgList.map((image) =>
                            image.imageOnlnPath.startsWith('blob:') ? image.imageOnlnPath : `${IMAGE_PROXY_API}${encodeURIComponent(image.imageOnlnPath)}`,
                        )}
                    />

                    {/* 영역 확장 */}
                    <Button variant="searching" className="px-2" onClick={() => setCollapse(!collapse)}>
                        <MokaIcon iconName={!collapse ? 'fal-compress-arrows-alt' : 'fal-expand-arrows'} />
                    </Button>
                </div>
            </div>

            {/* 드롭한 사진 리스트 */}
            <div className="flex-fill px-3 is-file-dropzone pb-3 overflow-hidden">
                <div ref={drop} className={clsx('w-100 h-100 position-relative p-1', { 'dropzone-dragover': isOver })}>
                    <div className="d-flex flex-wrap h-100 align-content-start custom-scroll position-relative">
                        {/* default text */}
                        {imgList.length === 0 && (
                            <span className="absolute-top w-100 h-100 d-flex align-items-center justify-content-center pointer-events-none p-3" style={{ whiteSpace: 'pre-wrap' }}>
                                <MokaIcon iconName="fal-cloud-upload" className="mr-2" />
                                Drop files to attach, or browse
                            </span>
                        )}
                        {imgList.map((data, idx) => (
                            <ThumbCard
                                ref={cardRef}
                                width={'calc(20% - 8px)'}
                                height={125}
                                className={clsx('flex-shrink-0 mr-2', { 'mb-2': imgList.length > 5 })}
                                key={idx}
                                dataType="drop"
                                data={{ ...data, move: true, index: idx, dataType: 'drop' }}
                                img={data.thumbPath}
                                moveCard={moveCard}
                                setAddIndex={setAddIndex}
                                showPhotoDetail={showPhotoDetail}
                                onDeleteClick={handleDeleteDropCard}
                                setRepImg={setRepImg}
                                isRep={data.id === repImg?.id}
                                onEditClick={handleEditClick}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GifDropzone;
