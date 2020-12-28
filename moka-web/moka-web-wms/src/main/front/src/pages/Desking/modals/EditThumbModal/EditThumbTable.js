import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { MokaLoader, MokaPagination } from '@components';
import EditThumbCard from './EditThumbCard';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';

/**
 * 포토아카이브 테이블
 */
const EditThumbTable = (props) => {
    const { page, size, total, loading, archiveList, onThumbClick, onRepClick, onChangeSearchOption } = props;
    const PHOTO_ARCHIVE_URL = useSelector((store) => store.app.PHOTO_ARCHIVE_URL);
    const [renderList, setRenderList] = useState([]);

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
            <div className="border w-100 custom-scroll flex-fill overflow-hidden overflow-y-scroll mb-2 position-relative">
                <div className="d-flex flex-wrap align-content-start p-1 overflow-hidden">
                    {loading && <MokaLoader />}
                    {renderList.map((data) => (
                        <EditThumbCard
                            width={226}
                            height={188}
                            key={data.nid}
                            img={data.thumbPath}
                            data={data}
                            onThumbClick={onThumbClick}
                            onRepClick={onRepClick}
                            dataType={data.dataType}
                        />
                    ))}
                </div>
            </div>
            <MokaPagination page={page} total={total} size={size} onChangeSearchOption={onChangeSearchOption} pageSizes={PAGESIZE_OPTIONS} displayPageNum={DISPLAY_PAGE_NUM} />
        </React.Fragment>
    );
};

export default EditThumbTable;
