import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { MokaCard } from '@components';
import Search from './DeskingHistorySearch';
import ComponentWorkAgGrid from './ComponentWorkHistoryAgGrid';
import DeskingWorkAgGrid from './DeskingWorkHistoryAgGrid';
import { initialState, GET_COMPONENT_WORK_HISTORY, GET_DESKING_WORK_HISTORY, getComponentWorkHistory, changeSearchOption } from '@store/desking';

const DeskingHistoryList = (props) => {
    const { open, onLoad } = props;
    const dispatch = useDispatch();
    const { search: storeSearch, loading, total, componentlist, componentWorkHistoryList, deskingWorkHistoryList, selectedComponent } = useSelector(
        (store) => ({
            search: store.desking.history.search,
            loading: store.loading[GET_COMPONENT_WORK_HISTORY] || store.loading[GET_DESKING_WORK_HISTORY],
            total: store.desking.history.total,
            componentlist: store.desking.list,
            componentWorkHistoryList: store.desking.history.componentWorkHistory.list,
            deskingWorkHistoryList: store.desking.history.deskingWorkHistory.list,
            selectedComponent: store.desking.selectedComponent,
        }),
        shallowEqual,
    );

    // state
    const [search, setSearch] = useState(initialState.history.search);
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        if (selectedComponent?.componentSeq) {
            dispatch(
                getComponentWorkHistory(
                    changeSearchOption({
                        ...search,
                        componentSeq: selectedComponent.componentSeq,
                    }),
                ),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent, componentlist]);

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
     * 검색 버튼
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

    // useEffect(() => {
    //     // 컴포넌트 히스토리 rowData 셋팅
    //     setRowData(
    //         list.map((arr) => ({
    //             ...arr,
    //             handleClickLoad,
    //         })),
    //     );
    // }, [handleClickLoad, list]);

    /**
     * 로드 버튼 클릭
     * @param {object} data row data
     */
    // const handleClickLoad = useCallback(
    //     (data) => {
    //         // 컴포넌트의 데스킹 히스토리 상세 데이터를 조회
    //         dispatch(
    //             getHistory({
    //                 seq: data.seq,
    //                 search: {
    //                     seq,
    //                     seqType,
    //                 },
    //                 callback: (response) => {
    //                     if (onLoad) {
    //                         onLoad(response);
    //                     }
    //                 },
    //             }),
    //         );
    //     },
    //     [dispatch, onLoad],
    // );

    return (
        <MokaCard title="히스토리" className="w-100" bodyClassName="d-flex">
            <div style={{ width: '456px' }} className="pr-2">
                <Search search={search} setSearch={setSearch} list={componentlist} onSearch={handleSearch} />
                {/* search의 테이블 */}
                <ComponentWorkAgGrid loading={loading} search={search} setSearch={setSearch} total={total} rowData={componentWorkHistoryList} onChange={handleChangeSearchOption} />
            </div>
            <div className="flex-fill">
                {/* 데스킹 히스토리 목록 테이블 */}
                <DeskingWorkAgGrid loading={loading} search={search} setSearch={setSearch} total={total} rowData={deskingWorkHistoryList} />
            </div>
        </MokaCard>
    );
};

export default DeskingHistoryList;
