import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MokaTable } from '@/components';
import { changeSearchOption, getInternalApiList, GET_INTERNAL_API_LIST } from '@store/internalApi';
import columnDefs from './InternalApiAgGridColumns';

/**
 * API 관리 > API 목록 > AgGrid
 */
const InternalApiAgGrid = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_INTERNAL_API_LIST]);
    const { total, search, list, internalApi } = useSelector(({ internalApi }) => internalApi);
    const [rowData, setRowData] = useState([]);

    /**
     * row clicked
     * @param {object} data RowData
     */
    const handleRowClicked = (data) => {
        history.push(`${match.path}/${data.seqNo}`);
    };

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(changeSearchOption(temp));
        dispatch(getInternalApiList({ search: temp }));
    };

    useEffect(() => {
        setRowData(list);
    }, [list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(row) => row.seqNo}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            selected={internalApi.seqNo}
            onChangeSearchOption={handleChangeSearchOption}
        />
    );
};

export default InternalApiAgGrid;
