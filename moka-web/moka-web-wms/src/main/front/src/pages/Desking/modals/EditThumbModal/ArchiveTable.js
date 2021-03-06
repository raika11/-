import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { MokaLoader, MokaPagination } from '@components';
import ThumbCard from './ThumbCard';
import { S_MODAL_PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';
import { GET_PHOTO_LIST, GET_ARCHIVE_DATA, getPhotoList, changeSearchOption } from '@store/photoArchive';

/**
 * 포토아카이브 테이블
 */
const ArchiveTable = (props) => {
    const { showPhotoDetail, setRepImg, repImg } = props;
    const dispatch = useDispatch();
    const PHOTO_ARCHIVE_URL = useSelector((store) => store.app.PHOTO_ARCHIVE_URL);
    const loading = useSelector(({ loading }) => loading[GET_PHOTO_LIST] || loading[GET_ARCHIVE_DATA]);
    const { total, list: archiveList, search } = useSelector(({ photoArchive }) => photoArchive);
    const [renderList, setRenderList] = useState([]);

    /**
     * 테이블에서 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = search;

        // 포토아카이브는 size 대신 pageCount라는 명칭 사용
        if (key === 'size') {
            temp = { ...temp, pageCount: value };
        } else {
            temp = { ...temp, [key]: value };
        }
        if (key !== 'page') temp['page'] = 0;

        dispatch(getPhotoList(changeSearchOption(temp)));
    };

    useEffect(() => {
        setRenderList(
            archiveList.map((archive) => ({
                ...archive,
                dataType: 'archive',
                id: archive.nid,
                date: moment(archive.date).format('YYYY-MM-DD'),
                imageThumPath: `${PHOTO_ARCHIVE_URL}${archive.imageThumPath}`,
                imageOnlnPath: `${PHOTO_ARCHIVE_URL}${archive.imageOnlnPath}`,
                thumbPath: `${PHOTO_ARCHIVE_URL}${archive.imageThumPath}`,
            })),
        );
    }, [PHOTO_ARCHIVE_URL, archiveList]);

    return (
        <React.Fragment>
            <div className="input-border w-100 overflow-hidden flex-fill mb-2 position-relative">
                {loading && <MokaLoader />}
                <div className="h-100 custom-scroll">
                    <div className="d-flex flex-wrap align-content-start pt-10 pl-10 overflow-hidden">
                        {renderList.map((data) => (
                            <ThumbCard
                                className="mb-10 mr-10"
                                width={'calc(20% - 10px)'}
                                height={180}
                                key={data.nid}
                                img={data.thumbPath}
                                data={data}
                                showPhotoDetail={showPhotoDetail}
                                setRepImg={setRepImg}
                                isRep={data.id === repImg?.id}
                                cardType="archive"
                                boxShadow="0px 8px 10px -1px #bbb"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* 페이지네이션 */}
            <MokaPagination
                page={search.page}
                total={total}
                size={search.pageCount}
                onChangeSearchOption={handleChangeSearchOption}
                pageSizes={S_MODAL_PAGESIZE_OPTIONS}
                displayPageNum={DISPLAY_PAGE_NUM}
            />
        </React.Fragment>
    );
};

export default ArchiveTable;
