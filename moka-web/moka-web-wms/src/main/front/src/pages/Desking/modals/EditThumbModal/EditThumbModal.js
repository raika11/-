import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MokaModal, MokaCardTabs } from '@components';
import { clearStore } from '@store/photoArchive';
import EditThumbSearch from './EditThumbSearch';
import EditThumbTable from './EditThumbTable';
import EditThumbImageInputTable from './EditThumbImageInputTable';
import EditThumbArticleImageListTable from './EditThumbArticleImageListTable';
import EditThumbDropzone from './EditThumbDropzone';
import EditThumbCard from './EditThumbCard';
import ThumbViewModal from './ThumbViewModal';
import toast from '@utils/toastUtil';
import util from '@utils/commonUtil';

const defaultValue = {
    id: '',
    dataType: 'represent',
    thumbPath: '',
    imageOnlnPath: '',
    path: {
        orgPath: '',
        articleImgPath: '',
        localImgPath: '',
    },
    imgProps: {},
};

/**
 * 대표이미지 편집 모달
 */
const EditThumbModal = (props) => {
    const { show, onHide, deskingWorkData, cropHeight, cropWidth } = props; // modal props
    const { setFileValue, thumbFileName, setThumbFileName } = props; // 대표 이미지 props
    const dispatch = useDispatch();

    const [collapse, setCollapse] = useState(true);
    const [cardData, setCardData] = useState({});
    const [repPhoto, setRepPhoto] = useState(defaultValue);
    const [showViewModal, setShowViewModal] = useState(false);
    /**
     * 썸네일 클릭
     * @param {object} data 썸네일 클릭 팝업 데이터
     */
    const handleThumbClick = (data) => {
        setCardData(data);
        setShowViewModal(true);
    };

    /**
     * 대표사진 삭제
     */
    const handleDeleteClick = (data, e) => {
        e.stopPropagation();
        if (!data.index) {
            setRepPhoto(defaultValue);
        }
    };

    /**
     * 카드의 대표사진 지정 버튼 클릭
     */
    const handleRepClick = (data, e) => {
        e.stopPropagation();

        if (repPhoto.id === data.id) {
            toast.warning('대표 이미지로 지정된 사진입니다.');
        }

        if (data.dataType === 'archive') {
            setRepPhoto({
                ...repPhoto,
                dataType: 'archive',
                id: data.id,
                thumbPath: data.imageThumPath,
                imageOnlnPath: data.imageOnlnPath,
                path: {
                    imageOnlnPath: data.imageOnlnPath,
                    imageThumPath: data.imageThumPath,
                },
            });
        } else if (data.dataType === 'article') {
            setRepPhoto({
                ...repPhoto,
                dataType: 'article',
                id: data.id,
                thumbPath: data.compFileUrl,
                imageOnlnPath: data.compFileUrl,
                path: {
                    compFileUrl: data.compFileUrl,
                },
            });
        } else if (data.dataType === 'local') {
            setRepPhoto({
                ...repPhoto,
                dataType: 'local',
                id: data.id,
                thumbPath: data.preview,
                imageOnlnPath: data.preview,
                path: {
                    preview: data.preview,
                },
                imgProps: data,
            });
        } else {
            setRepPhoto(data);
        }
    };

    /**
     * 카드의 이미지 편집 버튼 클릭
     */
    const handleEditClick = () => {};

    /**
     * 이미지 편집 등록 버튼 클릭
     */
    const handleClickSave = () => {
        if (repPhoto.dataType === 'local') {
            (async () => {
                await fetch(repPhoto.thumbPath)
                    .then((r) => r.blob())
                    .then((blobFile) => {
                        const file = util.blobToFile(blobFile, deskingWorkData.seq);
                        setFileValue(file);
                        setThumbFileName(repPhoto.thumbPath);
                    });
            })();
        } else {
            setThumbFileName(repPhoto.thumbPath);
        }
        handleHide();
    };

    /**
     * 취소 버튼 클릭
     */
    const handleHide = () => {
        setRepPhoto(defaultValue);
        setCardData({});
        dispatch(clearStore());
        onHide();
    };

    useEffect(() => {
        // 이미지 필드 thumbPath로 통일
        if (show && thumbFileName) {
            setRepPhoto({
                ...defaultValue,
                thumbPath: thumbFileName,
            });
        }
    }, [show, thumbFileName]);

    return (
        <MokaModal
            title="대표 이미지 편집"
            id="image-edit"
            show={show}
            onHide={handleHide}
            width={1200}
            height={841}
            size="xl"
            buttons={[
                { text: '등록', variant: 'positive', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleHide },
            ]}
            dialogClassName="fixed-modal"
            bodyClassName="p-0 overflow-x-hidden custom-scroll"
            footerClassName="d-flex justify-content-center"
            draggable
        >
            <DndProvider backend={HTML5Backend}>
                <MokaCardTabs
                    height={481}
                    className="shadow-none w-100"
                    tabs={[
                        // 아카이브 탭
                        <div className="px-card py-2 d-flex h-100 flex-column">
                            <EditThumbSearch />
                            <EditThumbTable onThumbClick={handleThumbClick} onRepClick={handleRepClick} onEditClick={handleEditClick} />
                        </div>,

                        // 본문 소재 리스트 탭
                        <div className="px-card py-2 d-flex h-100 flex-column">
                            <EditThumbArticleImageListTable deskingWorkData={deskingWorkData} onRepClick={handleRepClick} />
                        </div>,

                        // 내 PC 탭
                        <div className="px-card py-2 d-flex h-100 flex-column">
                            <EditThumbImageInputTable onRepClick={handleRepClick} onEditClick={handleEditClick} />
                        </div>,
                    ]}
                    tabNavs={['아카이브', '본문 소재 리스트', '내 PC']}
                    fill
                />
                <div className={clsx('deskthumb-gif-list d-flex justify-content-between overflow-hidden', { collapse: collapse })} style={{ backgroundColor: 'F4F5F6' }}>
                    {/* 대표사진 */}
                    <div className="deskthumb-main d-flex pt-3 justify-content-center" style={{ width: 202 }}>
                        {repPhoto.thumbPath && repPhoto.thumbPath !== '' && (
                            <EditThumbCard
                                img={repPhoto.thumbPath}
                                dataType={repPhoto.dataType}
                                onThumbClick={handleThumbClick}
                                onDeleteClick={handleDeleteClick}
                                onEditClick={handleEditClick}
                                represent
                            />
                        )}
                    </div>

                    {/* GIF 생성 드롭존 */}
                    <EditThumbDropzone
                        cropWidth={cropWidth}
                        cropHeight={cropHeight}
                        collapse={collapse}
                        setCollapse={setCollapse}
                        onThumbClick={handleThumbClick}
                        onDeleteClick={handleDeleteClick}
                        onRepClick={handleRepClick}
                        onEditClick={handleEditClick}
                        setRepPhoto={setRepPhoto}
                    />
                </div>
            </DndProvider>

            {/* 사진 크게 보기 */}
            <ThumbViewModal show={showViewModal} onHide={() => setShowViewModal(false)} data={cardData} />
        </MokaModal>
    );
};

export default EditThumbModal;
