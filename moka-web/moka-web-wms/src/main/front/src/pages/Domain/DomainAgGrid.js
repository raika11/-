import { AgGridReact } from 'ag-grid-react';
import { columnDefs } from './DomainAgGridColumns';
import React, { useCallback, useEffect, useState } from 'react';
import { MokaTable } from '@components';
import { rowData } from '@pages/Page/relations/PageChildContainerAgGridColumns';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { changeSearchOption, getDomains } from '@store/domain';
import { useHistory } from 'react-router-dom';

/**
 * 도메인 AgGrid 목록
 */
const DomainAgGrid = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [domainRows, setDomainRows] = useState([]);
    const { detail, list, total, search, error, loading, latestMediaId } = useSelector(
        (store) => ({
            detail: store.domain.detail,
            list: store.domain.list,
            total: store.domain.total,
            search: store.domain.search,
            error: store.domain.error,
            latestMediaId: store.auth.latestMediaId,
        }),
        shallowEqual,
    );

    useEffect(() => {
        dispatch(
            getDomains(
                changeSearchOption({
                    key: 'mediaId',
                    value: latestMediaId,
                }),
            ),
        );
    }, [latestMediaId, dispatch]);

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
            dispatch(getDomains(changeSearchOption(search)));
        },
        [dispatch],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback((params) => history.push(params.link), []);

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
