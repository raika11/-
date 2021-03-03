import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { MokaLoader, MokaPagination } from '@components';
import ThumbCard from './ThumbCard';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';
import { GET_PHOTO_LIST, GET_ARCHIVE_DATA, getPhotoList, changeSearchOption } from '@store/photoArchive';

/**
 * 포토아카이브 테이블
 */
const ArchiveTable = (props) => {
    const { onThumbClick, onRepClick } = props;
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
        if (key !== 'page') {
            temp['page'] = 0;
        }
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
            <div className="input-border w-100 custom-scroll flex-fill mb-2 position-relative">
                <div className="d-flex flex-wrap align-content-start pt-10 pl-10 overflow-hidden">
                    {loading && <MokaLoader />}
                    {renderList.map((data) => (
                        <ThumbCard
                            className="mb-10 mr-10"
                            width={'calc(20% - 10px)'}
                            height={180}
                            key={data.nid}
                            img={data.thumbPath}
                            data={data}
                            onThumbClick={onThumbClick}
                            onRepClick={onRepClick}
                            dataType={data.dataType}
                            boxShadow="0px 8px 10px -1px #bbb"
                        />
                    ))}
                </div>
            </div>

            {/* 페이지네이션 */}
            <MokaPagination
                page={search.page}
                total={total}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                pageSizes={PAGESIZE_OPTIONS}
                displayPageNum={DISPLAY_PAGE_NUM}
            />
        </React.Fragment>
    );
};

export default ArchiveTable;
