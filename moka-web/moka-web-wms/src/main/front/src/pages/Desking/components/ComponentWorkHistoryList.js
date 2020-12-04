import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import moment from 'moment';
import { MokaCard } from '@components';
import { DB_DATEFORMAT } from '@/constants';
import Search from './ComponentWorkHistorySearch';
import ComponentWorkAgGrid from './ComponentWorkHistoryAgGrid';
import DeskingWorkAgGrid from './DeskingWorkHistoryAgGrid';
import toast from '@utils/toastUtil';
import {
    initialState,
    clearHistoryList,
    clearSelectedComponent,
    GET_COMPONENT_WORK_HISTORY,
    GET_DESKING_WORK_HISTORY,
    getComponentWorkHistory,
    changeSearchOption,
    putDeskingWorkHistory,
    getDeskingWorkHistory,
} from '@store/desking';

const ComponentWorkHistoryList = (props) => {
    const { show } = props;
    const dispatch = useDispatch();
    const { area, search: storeSearch, loading, total, componentList, componentWorkHistoryList, deskingWorkHistoryList, selectedComponent } = useSelector(
        (store) => ({
            area: store.desking.area,
            search: store.desking.history.search,
            loading: store.loading[GET_COMPONENT_WORK_HISTORY] || store.loading[GET_DESKING_WORK_HISTORY],
            total: store.desking.history.total,
            componentList: store.desking.list,
            componentWorkHistoryList: store.desking.history.componentWorkHistory.list,
            deskingWorkHistoryList: store.desking.history.deskingWorkHistory.list,
            selectedComponent: store.desking.selectedComponent,
        }),
        shallowEqual,
    );

    // state
    const [search, setSearch] = useState(initialState.history.search);
    const [rowData, setRowData] = useState([]);

    const date = new Date();
    const regDt = search.regDt || moment(date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format(DB_DATEFORMAT);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(getComponentWorkHistory(changeSearchOption(temp)));
    };

    /**
     * search 검색 버튼
     */
    const handleSearch = () => {
        dispatch(
            getComponentWorkHistory(
                changeSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    };

    /**
     * 컴포넌트 워크 히스토리 클릭 시 데스킹 워크 목록 조회
     * @param {object} row row data
     */
    const handleRowClicked = (row) => {
        setSearch({ ...search, componentHistorySeq: row.seq });
        dispatch(getDeskingWorkHistory(row.seq));
    };

    /**
     * 컴포넌트 워크 히스토리 테이블 로드 버튼 클릭
     * @param {object} data row data
     */
    const handleClickLoad = useCallback(
        (data) => {
            let compWork = componentList.find((c) => String(c.componentSeq) === search.componentSeq);

            if (!compWork) return;

            // 컴포넌트 히스토리의 데스킹 기사를 편집기사 워크로 등록
            dispatch(
                putDeskingWorkHistory({
                    componentWorkSeq: compWork.seq,
                    componentHistSeq: data.seq,
                    callback: (response) => {
                        if (response.header) {
                            toast.success(response.header.message);
                        } else {
                            toast.fail(response.header.message);
                        }
                    },
                }),
            );
        },
        [componentList, dispatch, search.componentSeq],
    );

    useEffect(() => {
        // local state => store search
        setSearch(storeSearch);
    }, [storeSearch]);

    /**
     * 기본 날짜 셋팅
     */
    useEffect(() => {
        dispatch(
            changeSearchOption({
                ...search,
                areaSeq: area.areaSeq,
                page: 0,
                regDt,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // 컴포넌트 히스토리 rowData 셋팅
        setRowData(
            componentWorkHistoryList.map((arr) => ({
                ...arr,
                handleClickLoad,
            })),
        );
    }, [handleClickLoad, componentWorkHistoryList]);

    useEffect(() => {
        // area 변경시 search, table, selectedComponent clear
        if (search.areaSeq !== area.areaSeq) {
            if (selectedComponent.componentSeq) dispatch(clearSelectedComponent());
            dispatch(
                changeSearchOption({
                    ...search,
                    areaSeq: area.areaSeq,
                    componentSeq: null,
                    regDt,
                }),
            );
            dispatch(clearHistoryList());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search.areaSeq, area.areaSeq]);

    useEffect(() => {
        // 컴포넌트 선택시 컴포넌트 워크 히스토리 목록 조회
        if (selectedComponent?.componentSeq && show) {
            dispatch(
                getComponentWorkHistory(
                    changeSearchOption({
                        ...search,
                        areaSeq: area.areaSeq,
                        componentSeq: selectedComponent.componentSeq,
                    }),
                ),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent, show]);

    return (
        <MokaCard title="히스토리" className="w-100" bodyClassName="d-flex">
            <div style={{ width: '456px' }} className="pr-3">
                <Search search={search} setSearch={setSearch} list={componentList} onSearch={handleSearch} selectedComponent={selectedComponent} show={show} />
                {/* search의 테이블 */}
                <ComponentWorkAgGrid
                    loading={loading}
                    search={search}
                    setSearch={setSearch}
                    total={total}
                    rowData={rowData}
                    onChange={handleChangeSearchOption}
                    onRowClick={handleRowClicked}
                    onLoad={handleClickLoad}
                />
            </div>
            <div className="flex-fill">
                {/* 데스킹 히스토리 목록 테이블 */}
                <DeskingWorkAgGrid loading={loading} search={search} setSearch={setSearch} total={total} rowData={deskingWorkHistoryList} />
            </div>
        </MokaCard>
    );
};

export default ComponentWorkHistoryList;
