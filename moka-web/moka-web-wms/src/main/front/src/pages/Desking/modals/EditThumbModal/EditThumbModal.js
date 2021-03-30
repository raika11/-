import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { clearStore } from '@store/photoArchive';
import toast from '@utils/toastUtil';
import commonUtil from '@utils/commonUtil';
import imageEditer from '@utils/imageEditorUtil';
import { MokaModal, MokaCardTabs } from '@components';
import ArchiveSearch from './ArchiveSearch';
import ArchiveTable from './ArchiveTable';
import ArticleImageList from './ArticleImageList';
import GifDropzone from './GifDropzone';
import ThumbCard from './ThumbCard';
import ThumbViewModal from './ThumbViewModal';
import { IMAGE_PROXY_API } from '@/constants';

const propTypes = {
    /**
     * 기사ID, 기사ID가 있으면 본문 소재도 조회한다
     */
    totalId: PropTypes.string,
    /**
     * 크롭Height 기본값
     * @default
     */
    cropHeight: PropTypes.number,
    /**
     * 크롭Width 기본값
     * @default
     */
    cropWidth: PropTypes.number,
    /**
     * 저장 시 파일명
     */
    saveFileName: PropTypes.string,
    /**
     * 대표이미지 썸네일 링크
     */
    thumbFileName: PropTypes.string,
    /**
     * 대표이미지 적용 시 실행되는 함수
     * @param {string} imageSrc 이미지경로
     * @param {any} file 파일데이터
     */
    apply: PropTypes.func,
};
const defaultProps = {
    cropHeight: 300,
    cropWidth: 300,
};

/**
 * 대표사진 초기 데이터
 */
const defaultRepImg = {
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
 * 포토아카이브 + 본문 내 사진 목록(기사 키가 있는 경우) + 대표이미지 편집 모달
 */
const EditThumbModal = (props) => {
    const {
        // modal props
        show,
        onHide,
        totalId,
        cropHeight,
        cropWidth,
        saveFileName,
        // 대표이미지 props
        thumbFileName,
        apply,
    } = props;
    const dispatch = useDispatch();
    const [collapse, setCollapse] = useState(true);
    const [cardData, setCardData] = useState({});
    const [repImg, setRepImg] = useState(defaultRepImg);
    const [showDetailModal, setShowDetailModal] = useState(false);

    /**
     * 사진 상세보기
     * @param {object} data 썸네일 클릭 팝업 데이터
     */
    const showPhotoDetail = (data) => {
        setCardData(data);
        setShowDetailModal(true);
    };

    /**
     * 대표사진에서 삭제
     */
    const handleDeleteClick = (data, e) => {
        e.stopPropagation();
        if (!data.index) {
            setRepImg(defaultRepImg);
        }
    };

    /**
     * 대표사진으로 지정
     * @param {object} data 대표사진으로 지정할 사진의 데이터
     */
    const setRepImgByDataType = useCallback(
        (data) => {
            if (repImg.id === data.id) {
                toast.warning('대표 이미지로 지정된 사진입니다.');
            }

            // 데이터 타입에 따라 분기하여 repImg Data에 매핑한다 (필드가 다 다름)
            if (data.dataType === 'archive') {
                setRepImg({
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
                setRepImg({
                    dataType: 'article',
                    id: data.id,
                    thumbPath: data.compFileUrl,
                    imageOnlnPath: data.compFileUrl,
                    path: {
                        compFileUrl: data.compFileUrl,
                    },
                });
            } else if (data.dataType === 'local') {
                setRepImg({
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
                setRepImg(data);
            }
        },
        [repImg.id],
    );

    /**
     * 카드 안의 편집기능 실행
     */
    const editPhoto = () => {
        imageEditer.create(
            repImg.imageOnlnPath ? repImg.imageOnlnPath : repImg.thumbPath,
            (imageSrc) => {
                setRepImg({
                    ...repImg,
                    dataType: 'local',
                    thumbPath: imageSrc,
                    imageOnlnPath: imageSrc,
                    path: {
                        preview: imageSrc,
                    },
                });
            },
            { cropWidth, cropHeight },
        );
    };

    /**
     * 적용 버튼
     */
    const handleClickSave = () => {
        if (repImg.dataType === 'article') {
            apply(repImg.imageOnlnPath);
            handleHide();
        } else {
            let imagePath = repImg.imageOnlnPath;

            if (imagePath === '') {
                // 이미지 없는 경우 => 이미지 제거
                apply('', null);
                handleHide();
            } else {
                // 이미지 프록시 추가 (jam.joins)
                if (!(repImg.imageOnlnPath || '').startsWith('blob:')) {
                    imagePath = `${IMAGE_PROXY_API}${encodeURIComponent(repImg.imageOnlnPath)}`;
                }
                (async () => {
                    await fetch(imagePath)
                        .then((r) => r.blob())
                        .then((blobFile) => {
                            const file = commonUtil.blobToFile(blobFile, saveFileName || new Date().getTime());
                            apply(repImg.thumbPath, file);
                            handleHide();
                        });
                })();
            }
        }
    };

    /**
     * 취소 버튼
     */
    const handleHide = () => {
        setRepImg(defaultRepImg);
        setCardData({});
        dispatch(clearStore());
        onHide();
    };

    useEffect(() => {
        // 이미지 필드 thumbPath로 통일
        if (show && thumbFileName) {
            setRepImg({
                ...defaultRepImg,
                thumbPath: thumbFileName,
            });
        }
    }, [show, thumbFileName]);

    return (
        <MokaModal
            title="대표 이미지 편집"
            show={show}
            onHide={handleHide}
            width={1200}
            height={820}
            size="xl"
            buttons={[
                { text: '적용', variant: 'positive', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleHide },
            ]}
            dialogClassName="fixed-modal"
            bodyClassName="p-0 overflow-x-hidden custom-scroll"
            draggable
        >
            <DndProvider backend={HTML5Backend}>
                {/* totalId가 있을 때에만 탭으로 노출 */}
                {!totalId ? (
                    <div className="d-flex px-card pb-card w-100 flex-column" style={{ height: 480 }}>
                        <ArchiveSearch />
                        <ArchiveTable showPhotoDetail={showPhotoDetail} repImg={repImg} setRepImg={setRepImgByDataType} />
                    </div>
                ) : (
                    <MokaCardTabs
                        height={480}
                        className="shadow-none w-100"
                        tabs={[
                            // 아카이브 탭
                            <div className="d-flex h-100 flex-column">
                                <ArchiveSearch />
                                <ArchiveTable showPhotoDetail={showPhotoDetail} repImg={repImg} setRepImg={setRepImgByDataType} />
                            </div>,

                            // 본문 소재 탭
                            <div className="d-flex h-100 flex-column">
                                <ArticleImageList totalId={totalId} repImg={repImg} showPhotoDetail={showPhotoDetail} setRepImg={setRepImgByDataType} />
                            </div>,
                        ]}
                        tabNavs={['아카이브', '본문 소재 리스트']}
                        fill
                    />
                )}
                <div className={clsx('deskthumb-gif-list d-flex justify-content-between overflow-hidden', { collapse: collapse })} style={{ backgroundColor: 'F4F5F6' }}>
                    {/* 대표사진 */}
                    <div className="deskthumb-main d-flex justify-content-center pt-3" style={{ width: 202 }}>
                        <ThumbCard
                            className="p-2"
                            img={repImg.thumbPath}
                            dataType={repImg.dataType}
                            onDeleteClick={handleDeleteClick}
                            editPhoto={editPhoto}
                            showPhotoDetail={showPhotoDetail}
                            represent
                        />
                    </div>

                    {/* GIF 생성 드롭존 */}
                    <GifDropzone
                        cropWidth={cropWidth}
                        cropHeight={cropHeight}
                        collapse={collapse}
                        setCollapse={setCollapse}
                        onDeleteClick={handleDeleteClick}
                        repImg={repImg}
                        setRepImg={setRepImgByDataType}
                        showPhotoDetail={showPhotoDetail}
                    />
                </div>
            </DndProvider>

            {/* 사진 크게 보기 */}
            <ThumbViewModal show={showDetailModal} onHide={() => setShowDetailModal(false)} data={cardData} />
        </MokaModal>
    );
};

EditThumbModal.propTypes = propTypes;
EditThumbModal.defaultProps = defaultProps;

export default EditThumbModal;
