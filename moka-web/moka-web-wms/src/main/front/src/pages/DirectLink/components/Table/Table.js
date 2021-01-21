import React from 'react';
import { MokaPagination, MokaLoader } from '@components';
import Row from './Row';

const Table = (props) => {
    const { total, page, size, onChangeSearchOption, onRowClicked, list, loading, selected } = props;

    return (
        <React.Fragment>
            <div className="overflow-hidden flex-fill">
                <div className="custom-scroll h-100 pr-2">
                    {loading && <MokaLoader />}
                    {list.map((data, idx) => (
                        <Row key={data.linkSeq} data={data} onRowClicked={onRowClicked} selected={String(selected) === String(data.linkSeq)} lastRow={list.length === idx + 1} />
                    ))}
                </div>
            </div>
            <div className="mt-3">
                <MokaPagination total={total} page={page} size={size} onChangeSearchOption={onChangeSearchOption} />
            </div>
        </React.Fragment>
    );
};

export default Table;
