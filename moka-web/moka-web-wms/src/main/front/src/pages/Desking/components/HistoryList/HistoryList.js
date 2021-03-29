import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import moment from 'moment';
import { MokaCard } from '@components';
import { DB_DATEFORMAT } from '@/constants';
import ComponentWorkHistoryList from './ComponentWorkHistoryList';
import DeskingWorkHistoryList from './DeskingWorkHistoryList';
import toast, { messageBox } from '@utils/toastUtil';
import {
    initialState,
    clearHistoryList,
    clearDeskingHistoryList,
    GET_COMPONENT_WORK_HISTORY,
    GET_DESKING_WORK_HISTORY,
    getComponentWorkHistory,
    putDeskingWorkHistory,
    getDeskingWorkHistory,
} from '@store/desking';

moment.locale('ko');
const initialSearch = {
    ...initialState.history.componentWorkHistory.search,
    regDt: moment().startOf('day'),
};

/**
 * 컴포넌트워크 히스토리
 */
const HistoryList = (props) => {
    const { show, isNaverChannel, componentList } = props;
    const dispatch = useDispatch();
    const { componentWorkLoading, deskingWorkLoading } = useSelector(({ loading }) => ({
        componentWorkLoading: loading[GET_COMPONENT_WORK_HISTORY],
        deskingWorkLoading: loading[GET_DESKING_WORK_HISTORY],
    }));
    const selectedComponent = useSelector(({ desking }) => desking.selectedComponent);
    const area = useSelector(({ desking }) => desking.area);
    const { total, HistoryList, deskingWorkHistoryList } = useSelector(
        ({ desking }) => ({
            total: desking.history.componentWorkHistory.total,
            HistoryList: desking.history.componentWorkHistory.list,
            deskingWorkHistoryList: desking.history.deskingWorkHistory.list,
        }),
        shallowEqual,
    );

    // state
    const [search, setSearch] = useState(initialSearch);
    const [selectedComponentHistSeq, setSelectedComponentHistSeq] = useState();
    const [rowData, setRowData] = useState([]);
    const [loadCnt, setLoadCnt] = useState(0);

    /**
     * search 검색 => 컴포넌트 워크 조회
     * @param {object} newSearch override할 검색조건
     */
    const handleSearch = useCallback(
        (newSearch) => {
            let ns = { ...search, ...newSearch };
            const regDt = ns.regDt && ns.regDt.isValid() ? moment(ns.regDt).format(DB_DATEFORMAT) : null;
            setSearch(ns);
            dispatch(
                getComponentWorkHistory({
                    search: { ...ns, regDt },
                    callback: ({ header }) => {
                        if (header.success) {
                            dispatch(clearDeskingHistoryList());
                        }
                    },
                }),
            );
        },
        [dispatch, search],
    );

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            handleSearch(temp);
        },
        [handleSearch],
    );

    /**
     * 컴포넌트 워크 히스토리 클릭 => 편집기사 목록 조회
     * @param {object} row row data
     */
    const handleRowClicked = (row) => {
        dispatch(
            getDeskingWorkHistory({
                componentHistSeq: row.seq,
            }),
        );
        setSelectedComponentHistSeq(row.seq);
    };

    /**
     * 컴포넌트 워크 히스토리 테이블 로드
     * @param {object} data row data
     */
    const handleClickLoad = useCallback(
        (data) => {
            messageBox.confirm(
                '현재 작업 중인 목록이 히스토리 목록으로 변경됩니다.\n변경하시겠습니까?',
                () => {
                    let compWork = componentList.find((c) => String(c.componentSeq) === String(search.componentSeq));
                    if (!compWork) return;

                    // 컴포넌트 히스토리의 데스킹 기사를 편집기사 워크로 등록
                    dispatch(
                        putDeskingWorkHistory({
                            componentWorkSeq: compWork.seq,
                            componentHistSeq: data.seq,
                            updateTemplateYn: isNaverChannel ? 'Y' : 'N',
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
                () => {},
            );
        },
        [componentList, dispatch, isNaverChannel, search.componentSeq],
    );

    useEffect(() => {
        // area 변경 => search, table clear
        dispatch(clearHistoryList());
        setSearch(initialSearch);
        setSelectedComponentHistSeq(null);
        setLoadCnt(0);
    }, [dispatch, area.areaSeq]);

    useEffect(() => {
        // 컴포넌트 히스토리 => rowData
        setRowData(
            HistoryList.map((arr) => ({
                ...arr,
                regId: `${arr.regNm}(${arr.regId})`,
                handleClickLoad,
            })),
        );
    }, [handleClickLoad, HistoryList]);

    useEffect(() => {
        // selectedComponent의 seq를 셋팅
        if (selectedComponent?.componentSeq && show && loadCnt < 1) {
            handleSearch({
                componentSeq: selectedComponent.componentSeq,
            });
            setLoadCnt(loadCnt + 1);
            setSelectedComponentHistSeq(null);
        }
    }, [selectedComponent.componentSeq, show, handleSearch, loadCnt]);

    return (
        <MokaCard title="히스토리" className="w-100 h-100" bodyClassName="d-flex">
            {/* 컴포넌트워크 히스토리 */}
            <ComponentWorkHistoryList
                search={search}
                setSearch={setSearch}
                componentList={componentList}
                onSearch={handleSearch}
                selectedComponent={selectedComponent}
                selectedComponentHistSeq={selectedComponentHistSeq}
                show={show}
                loading={componentWorkLoading}
                total={total}
                rowData={rowData}
                onChange={handleChangeSearchOption}
                onRowClick={handleRowClicked}
                onLoad={handleClickLoad}
                isNaverChannel={isNaverChannel}
            />
            <div className="flex-fill">
                {/* 편집기사 히스토리 */}
                <DeskingWorkHistoryList loading={deskingWorkLoading} search={search} setSearch={setSearch} total={total} rowData={deskingWorkHistoryList} />
            </div>
        </MokaCard>
    );
};

export default HistoryList;
