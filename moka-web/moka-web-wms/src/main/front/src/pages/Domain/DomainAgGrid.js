import { columnDefs } from './DomainAgGridColumns';
import React, { useCallback, useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { changeSearchOption, getDomainList } from '@store/domain';
import { useHistory } from 'react-router-dom';

/**
 * 도메인 AgGrid 목록
 */
const DomainAgGrid = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [domainRows, setDomainRows] = useState([]);
    const { list, total, search, loading } = useSelector(
        (store) => ({
            list: store.domain.list,
            total: store.domain.total,
            search: store.domain.search,
        }),
        shallowEqual,
    );

    useEffect(() => {
        dispatch(getDomainList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (list.length > 0) {
            setDomainRows(
                list.map((d) => ({
                    id: String(d.domainId),
                    domainId: d.domainId,
                    domainName: d.domainName,
                    domainUrl: d.domainUrl,
                    link: `/domain/${d.domainId}`,
                    useYn: d.useYn,
                })),
            );
        }
        //console.log(domainRows);
    }, [list]);
    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback(
        (search) => {
            dispatch(getDomainList(changeSearchOption(search), search.key === 'size' && changeSearchOption({ key: 'page', value: 0 })));
        },
        [dispatch],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((params) => history.push(params.link), [history]);

    return (
        <>
            {/* 간단한 Table */}
            <MokaTable
                columnDefs={columnDefs}
                rowData={domainRows}
                onRowNodeId={(params) => params.domainId}
                agGridHeight={600}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['delete']}
            />
            {/* 설정 변경가능한 Table */}
            {/* <div className="ag-theme-moka-grid mb-3" style={{ height: '550px' }}>
                <AgGridReact columnDefs={columnDefs} rowData={rowData} getRowNodeId={(params) => params.containerSeq} immutableData animateRows />
            </div>
            <MokaPagination total={total} page={search.page} size={search.size} onChangeSearchOption={handleChangeSearchOption} /> */}
        </>
    );
};

export default DomainAgGrid;
