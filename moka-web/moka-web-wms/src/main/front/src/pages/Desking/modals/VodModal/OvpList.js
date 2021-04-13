import React, { useEffect, useState, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { initialState, getOvpList, GET_OVP_LIST } from '@store/bright';
import { MokaTable, MokaSearchInput } from '@components';
import { DB_DATEFORMAT } from '@/constants';
import { GRID_ROW_HEIGHT } from '@/style_constants';
import OvpOptionRenderer from './OvpOptionRenderer';
import columnDefs from './OvpListColumns';

moment.locale('ko');

/**
 * ovp 리스트
 */
const OvpList = ({ show, resultVId, setResultVId }) => {
    const dispatch = useDispatch();
    const ovpList = useSelector(({ bright }) => bright.ovp.list);
    const loading = useSelector(({ loading }) => loading[GET_OVP_LIST]);
    const [search, setSearch] = useState(initialState.ovp.search);
    const [rowData, setRowData] = useState([]);
    const [, setGridInstance] = useState(null);

    /**
     * input 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
    };

    /**
     * 검색
     */
    const handleSearch = useCallback(
        (type) => {
            let ns = { ...search, page: 0 };
            if (type === 'more') {
                ns = { ...search, page: search.page + 1 };
            }
            dispatch(getOvpList({ search: ns }));
            setSearch(ns);
        },
        [dispatch, search],
    );

    /**
     * 테이블 row select 시
     */
    const handleSelectionChanged = useCallback(
        (params) => {
            if (params.length < 1 || !params[0].data) return;
            const { id } = params[0].data;
            setResultVId(id);
        },
        [setResultVId],
    );

    useEffect(() => {
        if (show) {
            handleSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    useEffect(() => {
        setRowData(
            show
                ? ovpList.map((ovp) => ({
                      ...ovp,
                      stateText: ovp.state === 'ACTIVE' ? '정상' : '대기',
                      regDt: moment(ovp.regDt, DB_DATEFORMAT).format('YYYY-MM-DD\nLTS'),
                  }))
                : [],
        );
    }, [ovpList, show]);

    return (
        <div className="d-flex flex-column overflow-hidden h-100">
            <div className="mb-2 d-flex">
                <MokaSearchInput
                    placeholder="검색어를 입력하세요"
                    className="flex-fill mr-2"
                    name="keyword"
                    value={search.keyword}
                    onChange={handleChangeValue}
                    onSearch={handleSearch}
                />
                <Button variant="negative" className="flex-shrink-0" onClick={() => setSearch(initialState.ovp.search)}>
                    초기화
                </Button>
            </div>

            <MokaTable
                loading={loading}
                rowData={rowData}
                headerHeight={GRID_ROW_HEIGHT.C[0]}
                rowHeight={GRID_ROW_HEIGHT.C[2]}
                className="overflow-hidden flex-fill"
                onRowNodeId={(data) => data.id}
                selected={resultVId}
                columnDefs={columnDefs}
                paging={false}
                frameworkComponents={{ optionRenderer: OvpOptionRenderer }}
                setGridInstance={setGridInstance}
                onSelectionChanged={handleSelectionChanged}
            />

            <Button variant="white" className="border p-2 rounded-0 shadow-none flex-shrink-0 mb-3" block onClick={() => handleSearch('more')} disabled={loading}>
                더보기
            </Button>
        </div>
    );
};

export default OvpList;
