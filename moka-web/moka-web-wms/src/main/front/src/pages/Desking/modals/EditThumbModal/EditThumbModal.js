import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import clsx from 'clsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MokaModal, MokaCardTabs } from '@components';
import { initialState, getPhotoList, changeSearchOption, clearStore } from '@store/photoArchive';
import EditThumbSearch from './EditThumbSearch';
import EditThumbTable from './EditThumbTable';
import EditThumbDropzone from './EditThumbDropzone';
import EditThumbCard from './EditThumbCard';
import ThumbViewModal from './ThumbViewModal';
import EditThumbImageInputTable from './EditThumbImageInputTable';
import toast from '@utils/toastUtil';

/**
 * 대표이미지 편집 모달 ====> 데스킹워크 저장 후 나중에 작업
 */
const EditThumbModal = (props) => {
    // modal props
    const { show, onHide } = props;
    // 대표 이미지 props
    const { setFileValue, thumbFileName, setThumbFileName } = props;
    const dispatch = useDispatch();
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
    const [repPhoto, setRepPhoto] = useState({
        type: '',
        id: '',
        path: {
            orgPath: '',
            thumbPath: '',
            localImgPath: '',
        },
        imgProps: {},
    });
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
     * 대표 사진, 드롭존 카드 아이템 삭제 버튼 클릭
     */
    const handleDeleteClick = (data, e) => {
        e.stopPropagation();

        // 대표사진 삭제
        if (!data.index) {
            setRepPhoto({ ...repPhoto, path: { thumbPath: '' } });
        }
    };

    /**
     * 카드의 대표사진 지정 버튼 클릭
     */
    const handleRepClick = (data, e) => {
        e.stopPropagation();

        debugger;
        if (thumbFileName === data.imageThumPath || thumbFileName === data.preview) {
            toast.warning('이미 등록된 대표 사진입니다.');
        } else if (repPhoto.path.thumbPath === data.imageThumPath || repPhoto.path.localImgPath === data.preview) {
            toast.warning('이미 대표 이미지 영역에 설정된 사진입니다.');
        }

        setRepPhoto({
            ...repPhoto,
            id: data.nid || data.id,
            path: {
                orgPath: data.imageOnlnPath,
                thumbPath: data.imageThumPath,
                localImgPath: data.preview,
            },
            // imgProps: imgData,
        });
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
     * 등록 버튼 클릭
     */
    const handleClickSave = () => {
        setThumbFileName(repPhoto.path.thumbPath);
        // setFileValue(repPhoto);
        handleHide();
    };

    /**
     * 취소 버튼 클릭
     */
    const handleHide = () => {
        setRepPhoto(repPhoto);
        setCardData({});
        onHide();
    };

    useEffect(() => {
        // 스토어의 search 객체 변경시 로컬의 search 변경
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        // 모달 show 포토아카이브 목록 셋팅
        if (show) {
            dispatch(getPhotoList());
        } else if (onHide) {
            dispatch(clearStore());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    useEffect(() => {
        if (show && thumbFileName) {
            setRepPhoto({
                ...repPhoto,
                path: {
                    thumbPath: thumbFileName,
                },
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, thumbFileName]);

    return (
        <>
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
                        height={503}
                        className="shadow-none w-100"
                        tabs={[
                            <React.Fragment>
                                <div className="px-3 py-2">
                                    <EditThumbSearch search={search} setSearch={setSearch} />
                                    <EditThumbTable
                                        total={total}
                                        page={search.page}
                                        size={search.pageCount}
                                        list={list}
                                        setRepPhoto={setRepPhoto}
                                        onChangeSearchOption={handleChangeSearchOption}
                                        onThumbClick={handleThumbClick}
                                        onRepClick={handleRepClick}
                                        onEditClick={handleEditClick}
                                    />
                                </div>
                            </React.Fragment>,
                            <React.Fragment></React.Fragment>,
                            <React.Fragment>
                                <div className="px-3 py-2">
                                    <EditThumbImageInputTable
                                        setRepPhoto={setRepPhoto}
                                        onThumbClick={handleThumbClick}
                                        onRepClick={handleRepClick}
                                        onEditClick={handleEditClick}
                                        // className="w-100"
                                        // height={416}
                                    />
                                </div>
                            </React.Fragment>,
                        ]}
                        tabNavs={['아카이브', '본문 소재 리스트', '내 PC']}
                        fill
                    />
                    <div
                        className={clsx('deskthumb-gif-list', 'd-flex', 'justify-content-between', 'overflow-hidden', { collapse: collapse })}
                        style={{ backgroundColor: 'F4F5F6' }}
                    >
                        <div className="deskthumb-main d-flex align-items-center justify-content-center" style={{ width: 202 }}>
                            {repPhoto.path.thumbPath !== '' && (
                                <EditThumbCard
                                    img={repPhoto.path.localImgPath ? repPhoto.path.localImgPath : repPhoto.path.thumbPath}
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
            </MokaModal>
            <ThumbViewModal show={showViewModal} onHide={() => setShowViewModal(false)} data={cardData} />
        </>
    );
};

export default EditThumbModal;
