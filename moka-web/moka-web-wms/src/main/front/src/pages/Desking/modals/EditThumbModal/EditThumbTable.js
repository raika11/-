import React from 'react';
import moment from 'moment';
import { MokaLoader, MokaPagination } from '@components';
import EditThumbCard from './EditThumbCard';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';

const EditThumbTable = (props) => {
    const { page, size, total, loading, list, onThumbClick, onRepClick, onChangeSearchOption } = props;

    return (
        <React.Fragment>
            <div className="border w-100 custom-scroll flex-fill overflow-hidden overflow-y-scroll mb-2">
                <div className="d-flex flex-wrap align-content-start p-1 overflow-hidden">
                    {loading && <MokaLoader />}
                    {list.map((data) => (
                        <EditThumbCard
                            key={data.nid}
                            img={data.imageThumPath}
                            data={{ ...data, id: data.nid, date: moment(data.date).format('YYYY-MM-DD') }}
                            onThumbClick={onThumbClick}
                            onRepClick={onRepClick}
                            rounded={false}
                        />
                    ))}
                </div>
            </div>
            <MokaPagination page={page} total={total} size={size} onChangeSearchOption={onChangeSearchOption} pageSizes={PAGESIZE_OPTIONS} displayPageNum={DISPLAY_PAGE_NUM} />
        </React.Fragment>
    );
};

export default EditThumbTable;
