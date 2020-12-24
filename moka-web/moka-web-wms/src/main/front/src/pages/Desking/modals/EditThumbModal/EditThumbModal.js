import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import clsx from 'clsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MokaModal, MokaCardTabs } from '@components';
import { GET_PHOTO_LIST, initialState, getPhotoList, changeSearchOption, clearStore } from '@store/photoArchive';
import { GET_ARTICLE_IMAGE_LIST } from '@store/article';
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
    type: 'represent',
    thumbPath: '',
    path: {
        orgPath: '',
        articleImgPath: '',
        localImgPath: '',
    },
    imgProps: {},
};

/**
 * 대표이미지 편집 모달 ====> 데스킹워크 저장 후 나중에 작업
 */
const EditThumbModal = (props) => {
    // modal props
    const { show, onHide, deskingWorkData } = props;
    // 대표 이미지 props
    const { setFileValue, thumbFileName, setThumbFileName } = props;

    const dispatch = useDispatch();
    const loading = useSelector((store) => store.loading[GET_PHOTO_LIST] || store.loading[GET_ARTICLE_IMAGE_LIST]);
    const { total, list, storeSearch, photo } = useSelector(
        (store) => ({
            total: store.photoArchive.total,
            list: store.photoArchive.list,
            storeSearch: store.photoArchive.search,
            photo: store.photoArchive.photo,
        }),
        shallowEqual,
    );

    const [search, setSearch] = useState(initialState.search);
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
        debugger;

        if (repPhoto.id === data.id) {
            toast.warning('대표 이미지로 지정된 사진입니다.');
        }

        if (data.type === 'archive') {
            setRepPhoto({
                ...repPhoto,
                type: 'archive',
                id: data.id,
                thumbPath: data.imageThumPath,
                path: {
                    imageOnlnPath: data.imageOnlnPath,
                    imageThumPath: data.imageThumPath,
                },
            });
        } else if (data.type === 'article') {
            setRepPhoto({
                ...repPhoto,
                type: 'article',
                id: data.id,
                thumbPath: data.compFileUrl,
                path: {
                    compFileUrl: data.compFileUrl,
                },
            });
        } else if (data.type === 'local') {
            setRepPhoto({
                ...repPhoto,
                type: 'local',
                id: data.id,
                thumbPath: data.preview,
                path: {
                    preview: data.preview,
                },
                imgProps: data,
            });
        }
    };

    /**
     * 카드의 이미지 편집 버튼 클릭
     */
    const handleEditClick = () => {};

    /**
     * 테이블에서 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(getPhotoList(changeSearchOption(temp)));
    };

    /**
     * 이미지 편집 등록 버튼 클릭
     */
    const handleClickSave = () => {
        if (repPhoto.type === 'local') {
            (async () => {
                await fetch(repPhoto.imgProps.preview)
                    .then((r) => r.blob())
                    .then((blobFile) => {
                        const file = util.blobToFile(blobFile, `${deskingWorkData.seq}.jpeg`, blobFile.type);
                        setFileValue(file);
                        setThumbFileName(repPhoto.imgProps.preview);
                    });
            })();
        } else {
            setThumbFileName(repPhoto.path.thumbPath || repPhoto.path.articleImgPath);
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
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        // 모달 show => 포토아카이브 목록 셋팅
        if (show) {
            dispatch(getPhotoList());
        }
    }, [dispatch, show]);

    useEffect(() => {
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
            show={show}
            onHide={handleHide}
            width={1200}
            height={860}
            size="xl"
            buttons={[
                { text: '등록', variant: 'positive', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleHide },
            ]}
            bodyClassName="p-0 overflow-x-hidden custom-scroll"
            footerClassName="d-flex justify-content-center"
            draggable
        >
            <DndProvider backend={HTML5Backend}>
                <MokaCardTabs
                    height={481}
                    className="shadow-none w-100"
                    tabs={[
                        <div className="px-card py-2 d-flex h-100 flex-column">
                            <EditThumbSearch search={search} setSearch={setSearch} />
                            <EditThumbTable
                                total={total}
                                page={search.page}
                                size={search.pageCount}
                                loading={loading}
                                archiveList={list}
                                onChangeSearchOption={handleChangeSearchOption}
                                onThumbClick={handleThumbClick}
                                onRepClick={handleRepClick}
                                onEditClick={handleEditClick}
                            />
                        </div>,
                        <div className="px-card py-2 d-flex h-100 flex-column">
                            <EditThumbArticleImageListTable deskingWorkData={deskingWorkData} loading={loading} onRepClick={handleRepClick} />
                        </div>,
                        <div className="px-card py-2 d-flex h-100 flex-column">
                            <EditThumbImageInputTable onRepClick={handleRepClick} onEditClick={handleEditClick} />
                        </div>,
                    ]}
                    tabNavs={['아카이브', '본문 소재 리스트', '내 PC']}
                    fill
                />
                <div className={clsx('deskthumb-gif-list d-flex justify-content-between overflow-hidden', { collapse: collapse })} style={{ backgroundColor: 'F4F5F6' }}>
                    <div className="deskthumb-main d-flex pt-3 justify-content-center" style={{ width: 202 }}>
                        {repPhoto.thumbPath && repPhoto.thumbPath !== '' && (
                            <EditThumbCard
                                img={repPhoto.thumbPath}
                                type={repPhoto.type}
                                onThumbClick={handleThumbClick}
                                onDeleteClick={handleDeleteClick}
                                onEditClick={handleEditClick}
                                represent
                            />
                        )}
                    </div>
                    <EditThumbDropzone
                        collapse={collapse}
                        setCollapse={setCollapse}
                        onThumbClick={handleThumbClick}
                        onDeleteClick={handleDeleteClick}
                        onRepClick={handleRepClick}
                        onEditClick={handleEditClick}
                    />
                </div>
            </DndProvider>
            <ThumbViewModal show={showViewModal} onHide={() => setShowViewModal(false)} data={cardData} />
        </MokaModal>
    );
};

export default EditThumbModal;
