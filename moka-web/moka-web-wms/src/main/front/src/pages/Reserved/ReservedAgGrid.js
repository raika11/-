import React, { useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaTable } from '@components';
import { columnDefs } from './ReservedAgGridColumns';
import { changeSearchOption, getReservedList, GET_RESERVED_LIST } from '@store/reserved';

/**
 * 예약어 AgGrid 컴포넌트
 */
const ReservedAgGrid = ({ match, onDelete }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [rowData, setRowData] = useState([]);
    const { total, list, search, reserved, loading } = useSelector((store) => ({
        total: store.reserved.total,
        list: store.reserved.list,
        search: store.reserved.search,
        reserved: store.reserved.reserved,
        loading: store.loading[GET_RESERVED_LIST],
    }));

    /**
     * 테이블에서 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getReservedList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((reserved) => history.push(`${match.path}/${reserved.reservedSeq}`), [history, match.path]);

    /**
     * 예약어 등록 버튼 클릭
     */
    const handleAddClick = useCallback(() => history.push(`${match.path}/add`), [history, match.path]);

    useEffect(() => {
        setRowData(
            list.map((data) => ({
                ...data,
                onDelete,
            })),
        );
    }, [list, onDelete]);

    return (
        <>
            <div className="d-flex justify-content-end mb-2">
                <Button variant="positive" onClick={handleAddClick}>
                    예약어 등록
                </Button>
            </div>
            {/* table */}
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(reserved) => reserved.reservedSeq}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                displayPageNum={3}
                selected={reserved.reservedSeq}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['delete']}
            />
        </>
    );
};

export default ReservedAgGrid;
