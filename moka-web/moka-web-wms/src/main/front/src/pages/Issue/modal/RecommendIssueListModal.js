import React, { useCallback, useEffect, useState } from 'react';
import { MokaModal } from '@components';
import { useDispatch, useSelector } from 'react-redux';
import { GET_RECOMMEND_ISSUE_MODAL_LIST, getIssueListModal, getRecommendIssueModalList, initialState } from '@store/issue';
import RecommendIssueModalAgGridComponent from '@pages/Issue/components/RecommendIssueModalAgGridComponent';
import { toIssueListData } from '@store/issue/issueSaga';
import { RecommedIssueModalSearch } from '@pages/Issue/components/RecommendIssueModalSearch';

import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';

const defaultPeriod = [''];
const RecommendIssueListModal = ({ show, onHide, onAdd }) => {
    const loading = useSelector(({ loading }) => loading[GET_RECOMMEND_ISSUE_MODAL_LIST]);
    const [tableLoading, setTableLoading] = useState(false);
    const [search, setSearch] = useState(initialState.search);
    const [total, setTotal] = useState(0);
    const [rowData, setRowData] = useState([]);
    const dispatch = useDispatch();
    //검색
    const [period, setPeriod] = useState(defaultPeriod);

    /**
     * 검색조건 변경
     */
    const handleSearchOption = useCallback(
        ({ key, value, number, date }) => {
            if (key === 'period') {
                // 기간 설정
                if (!value) {
                    setPeriod(defaultPeriod);
                    setSearch({ ...search, startDt: null, endDt: null });
                } else {
                    setPeriod([Number(number), date]);
                    const nd = new Date();
                    const startDt = moment(nd).subtract(Number(number), date).startOf('day');
                    const endDt = moment(nd).endOf('day');
                    setSearch({ ...search, startDt, endDt });
                }
            } else {
                setSearch({ ...search, [key]: value });
            }
        },
        [search],
    );

    const handleClickAdd = useCallback(
        (row) => {
            console.log(row);
            if (onAdd instanceof Function) {
                onAdd(row.pkgSeq);
            }
        },
        [onAdd],
    );

    const loadList = useCallback(
        (searchObj) => {
            setTableLoading(true);

            const startDt = searchObj.startDt && searchObj.startDt.isValid() ? moment(searchObj.startDt).format(DB_DATEFORMAT) : null;
            const endDt = searchObj.endDt && searchObj.endDt.isValid() ? moment(searchObj.endDt).format(DB_DATEFORMAT) : null;
            dispatch(
                getRecommendIssueModalList({
                    search: { ...searchObj, startDt, endDt, usedYn: 'Y,E' },
                    callback: ({ header, body }) => {
                        if (header.success) {
                            const list = toIssueListData(
                                body.list.map((row) => {
                                    return { ...row, onAdd: handleClickAdd };
                                }),
                            );
                            setRowData(list);
                            setTotal(body.totalCnt);
                        }
                        setTableLoading(false);
                    },
                }),
            );
        },
        [dispatch, rowData],
    );

    const handleSearch = () => {
        loadList({ ...search, page: 0 });
    };

    const handleReset = () => {
        setSearch(initialState.search);
    };

    const changeTableSearchOption = ({ key, value }) => {
        let searchObj = { ...search, [key]: value };
        if (key !== 'page') searchObj['page'] = 0;
        setSearch(searchObj);
        loadList(searchObj);
    };

    useEffect(() => {
        if (show) {
            loadList(search);
        } else {
            setSearch(initialState.search);
        }
    }, [show]);

    return (
        <MokaModal show={show} onHide={onHide} size="lg" width={1000} bodyClassName="d-flex flex-column" loading={loading} draggable>
            <RecommedIssueModalSearch
                search={search}
                period={period}
                onChangeSearchOption={handleSearchOption}
                onSearch={handleSearch}
                onReset={handleReset}
                loading={loading}
                //pkgDiv={pkgDiv}
            />
            <RecommendIssueModalAgGridComponent
                total={total}
                onRowClicked={() => {
                    console.log('onRowClick');
                }}
                searchOptions={search}
                rowData={rowData}
                onChangeSearch={changeTableSearchOption}
                loading={tableLoading}
            />
        </MokaModal>
    );
};

export default RecommendIssueListModal;
