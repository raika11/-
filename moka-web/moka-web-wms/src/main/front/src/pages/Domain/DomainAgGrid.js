import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@components';
import { GET_DOMAIN_LIST, changeSearchOption, getDomainList, initialState } from '@store/domain';
import { columnDefs } from './DomainAgGridColumns';

/**
 * 도메인 AgGrid 목록
 */
const DomainAgGrid = ({ onDelete, match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [search, setSearch] = useState(initialState);
    const [domainRows, setDomainRows] = useState([]);
    const loading = useSelector(({ loading }) => loading[GET_DOMAIN_LIST]);
    const { domain, list, total, search: storeSearch } = useSelector(({ domain }) => domain);

    /**
     * 테이블에서 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getDomainList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((rowData) => history.push(`${match.path}/${rowData.domainId}`), [history, match.path]);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getDomainList());
    }, [dispatch]);

    useEffect(() => {
        setDomainRows(
            list.map((row) => ({
                id: String(row.domainId),
                domainId: row.domainId,
                domainName: row.domainName,
                domainUrl: row.domainUrl,
                usedYn: row.usedYn,
                onDelete,
            })),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={domainRows}
            onRowNodeId={(rowData) => rowData.domainId}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            selected={domain.domainId}
            onChangeSearchOption={handleChangeSearchOption}
            preventRowClickCell={['delete']}
        />
    );
};

export default DomainAgGrid;
