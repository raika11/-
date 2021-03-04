import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MokaModal, MokaCardTabs } from '@components';
import { clearStore } from '@store/photoArchive';
import ArchiveSearch from './ArchiveSearch';
import ArchiveTable from './ArchiveTable';
import ArticleImageList from './ArticleImageList';
import GifDropzone from './GifDropzone';
import ThumbCard from './ThumbCard';
import ThumbViewModal from './ThumbViewModal';
import toast from '@utils/toastUtil';
import commonUtil from '@utils/commonUtil';
import imageEditer from '@utils/imageEditorUtil';
import { IMAGE_PROXY_API } from '@/constants';

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
 * 포토아카이브 + 대표이미지 편집 모달
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
            setRepImg(defaultRepImg);
        }
    };

    /**
     * 카드 안의 대표사진 지정 버튼 클릭
     */
    const handleRepClick = (data) => {
        if (repImg.id === data.id) {
            toast.warning('대표 이미지로 지정된 사진입니다.');
        }

        // 데이터 타입에 따라 분기하여 repImg Data에 매핑한다 (필드가 다 다름)
        if (data.dataType === 'archive') {
            setRepImg({
                ...repImg,
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
                ...repImg,
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
                ...repImg,
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
    };

    /**
     * 카드 안의 편집기능 실행
     */
    const handleEditClick = () => {
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
     * 모달의 적용 버튼
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
                if (repImg.dataType === 'archive') {
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
     * 모달의 취소 버튼
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
            footerClassName="d-flex justify-content-center"
            draggable
        >
            <DndProvider backend={HTML5Backend}>
                <MokaCardTabs
                    height={480}
                    className="shadow-none w-100"
                    tabs={[
                        // 아카이브 탭
                        <div className="d-flex h-100 flex-column">
                            <ArchiveSearch />
                            <ArchiveTable onThumbClick={handleThumbClick} onRepClick={handleRepClick} />
                        </div>,

                        // 본문 소재 탭
                        totalId && (
                            <div className="d-flex h-100 flex-column">
                                <ArticleImageList totalId={totalId} onThumbClick={handleThumbClick} onRepClick={handleRepClick} />
                            </div>
                        ),
                    ].filter((a) => a)}
                    tabNavs={['아카이브', totalId && '본문 소재 리스트'].filter((a) => a)}
                    fill
                />
                <div className={clsx('deskthumb-gif-list d-flex justify-content-between overflow-hidden', { collapse: collapse })} style={{ backgroundColor: 'F4F5F6' }}>
                    {/* 대표사진 */}
                    <div className="deskthumb-main d-flex justify-content-center align-items-center" style={{ width: 202 }}>
                        <ThumbCard
                            className="p-2"
                            img={repImg.thumbPath}
                            dataType={repImg.dataType}
                            onThumbClick={handleThumbClick}
                            onDeleteClick={handleDeleteClick}
                            onEditClick={handleEditClick}
                            represent
                        />
                    </div>

                    {/* GIF 생성 드롭존 */}
                    <GifDropzone
                        cropWidth={cropWidth}
                        cropHeight={cropHeight}
                        collapse={collapse}
                        setCollapse={setCollapse}
                        onThumbClick={handleThumbClick}
                        onDeleteClick={handleDeleteClick}
                        onRepClick={handleRepClick}
                        setRepImg={setRepImg}
                    />
                </div>
            </DndProvider>

            {/* 사진 크게 보기 */}
            <ThumbViewModal show={showViewModal} onHide={() => setShowViewModal(false)} data={cardData} />
        </MokaModal>
    );
};

EditThumbModal.propTypes = propTypes;
EditThumbModal.defaultProps = defaultProps;

export default EditThumbModal;
