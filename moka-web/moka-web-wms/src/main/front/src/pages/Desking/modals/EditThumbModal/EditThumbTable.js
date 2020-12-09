import React from 'react';
import moment from 'moment';
import { MokaPagination } from '@components';
import EditThumbCard from './EditThumbCard';
import { PAGESIZE_OPTIONS, DISPLAY_PAGE_NUM } from '@/constants';

const EditThumbTable = (props) => {
    const { page, size, total, data, onChangeSearchOption } = props;
    // 대표 사진 props
    const { setFileValue, setThumbFileName, setRepPhoto } = props;

    return (
        <React.Fragment>
            <div className="border w-100 custom-scroll mb-2" style={{ height: 346 }}>
                <div className="d-flex flex-wrap align-content-start p-1 overflow-hidden">
                    {data.map((p) => (
                        <EditThumbCard
                            key={p.nid}
                            img={p.imageOnlnPath}
                            data={{ ...p, id: p.nid, date: moment(p.date).format('YYYY-MM-DD') }}
                            onClick={(p) => console.log(p)}
                            setRepPhoto={setRepPhoto}
                            setThumbFileName={setThumbFileName}
                        />
                    ))}
                </div>
            </div>
            <MokaPagination page={page} total={total} size={size} onChangeSearchOption={onChangeSearchOption} pageSizes={PAGESIZE_OPTIONS} displayPageNum={DISPLAY_PAGE_NUM} />
        </React.Fragment>
    );
};

export default EditThumbTable;
