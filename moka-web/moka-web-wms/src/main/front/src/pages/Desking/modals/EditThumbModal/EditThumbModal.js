import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import clsx from 'clsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MokaModal, MokaCardTabs } from '@components';
import { initialState, getPhotoList, getPhotoTypes, changeSearchOption, clearStore } from '@store/photoArchive';
import EditThumbSearch from './EditThumbSearch';
import EditThumbTable from './EditThumbTable';
import EditThumbDropzone from './EditThumbDropzone';
import EditThumbCard from './EditThumbCard';
import ThumbViewModal from './ThumbViewModal';

/**
 * 대표이미지 편집 모달 ====> 데스킹워크 저장 후 나중에 작업
 */
const EditThumbModal = (props) => {
    // modal props
    const { show, onHide } = props;
    // 대표 이미지 props
    const { setFileValue, thumbFileName, setThumbFileName } = props;
    const dispatch = useDispatch();
    const { total, list, storeSearch, imageTypeList, photo } = useSelector(
        (store) => ({
            total: store.photoArchive.total,
            list: store.photoArchive.list,
            storeSearch: store.photoArchive.search,
            imageTypeList: store.photoArchive.search.imageTypeList,
            photo: store.photoArchive.photo,
        }),
        shallowEqual,
    );

    const [search, setSearch] = useState(initialState.search);
    const [collapse, setCollapse] = useState(true);
    const [showRep, setShowRep] = useState(false);
    const [cardData, setCardData] = useState({});
    const [repPhoto, setRepPhoto] = useState({
        type: '',
        id: '',
        path: {
            orgPath: '',
            thumbPath: '',
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
    const handleDeleteClick = () => {};

    /**
     * 카드의 대표사진 지정 버튼 클릭
     */
    const handleRepClick = () => {};

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

    useEffect(() => {
        // 스토어의 search 객체 변경시 로컬의 search 변경
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        // 모달 show 포토아카이브 목록 셋팅
        if (show) {
            dispatch(getPhotoList());
            dispatch(getPhotoTypes());
        } else if (onHide) {
            dispatch(clearStore());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    useEffect(() => {
        if (thumbFileName) {
            setShowRep(true);
        }
    }, [thumbFileName]);

    return (
        <>
            <MokaModal
                title="대표 이미지 편집"
                show={show}
                onHide={onHide}
                width={1200}
                height={860}
                size="xl"
                buttons={[
                    { text: '등록', variant: 'positive' },
                    { text: '취소', variant: 'negative' },
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
                                    <EditThumbSearch search={search} setSearch={setSearch} imageTypeList={imageTypeList} />
                                    <EditThumbTable
                                        total={total}
                                        page={search.page}
                                        size={search.pageCount}
                                        list={list}
                                        setThumbFileName={setThumbFileName}
                                        setRepPhoto={setRepPhoto}
                                        setShowRep={setShowRep}
                                        onChangeSearchOption={handleChangeSearchOption}
                                        onThumbClick={handleThumbClick}
                                        onDeleteClick={handleDeleteClick}
                                        onRepClick={handleRepClick}
                                        onEditClick={handleEditClick}
                                    />
                                </div>
                            </React.Fragment>,
                        ]}
                        tabNavs={['아카이브', '본문 소재 리스트']}
                        fill
                    />
                    <div
                        className={clsx('deskthumb-gif-list', 'd-flex', 'justify-content-between', 'overflow-hidden', { collapse: collapse })}
                        style={{ backgroundColor: 'F4F5F6' }}
                    >
                        <div className="deskthumb-main d-flex align-items-center justify-content-center" style={{ width: 202 }}>
                            {showRep && (
                                <EditThumbCard
                                    img={thumbFileName}
                                    onDeleteClick={handleDeleteClick}
                                    onEditClick={handleEditClick}
                                    repPhoto={repPhoto}
                                    setRepPhoto={setRepPhoto}
                                    setShowRep={setShowRep}
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
