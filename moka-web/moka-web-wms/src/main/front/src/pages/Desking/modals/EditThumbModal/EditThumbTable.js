import React from 'react';
import moment from 'moment';
import { MokaPagination } from '@components';
import EditThumbCard from './EditThumbCard';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';

const EditThumbTable = (props) => {
    const { page, size, total, list, onThumbClick, onRepClick, onChangeSearchOption } = props;
    // 대표 사진 props
    const { setRepPhoto } = props;

    return (
        <React.Fragment>
            <div className="border w-100 custom-scroll mb-2" style={{ height: 346 }}>
                <div className="d-flex flex-wrap align-content-start p-1 overflow-hidden">
                    {list.map((data) => (
                        <EditThumbCard
                            key={data.nid}
                            img={data.imageThumPath}
                            data={{ ...data, id: data.nid, date: moment(data.date).format('YYYY-MM-DD') }}
                            setRepPhoto={setRepPhoto}
                            onThumbClick={onThumbClick}
                            onRepClick={onRepClick}
                        />
                    ))}
                </div>
            </div>
            <MokaPagination page={page} total={total} size={size} onChangeSearchOption={onChangeSearchOption} pageSizes={PAGESIZE_OPTIONS} displayPageNum={DISPLAY_PAGE_NUM} />
        </React.Fragment>
    );
};

export default EditThumbTable;
