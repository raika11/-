import React, { useState, useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { initialState, getIssueListModal, GET_ISSUE_LIST_MODAL } from '@store/issue';
import { messageBox } from '@utils/toastUtil';
import Search from './Search';
import AgGrid from './AgGrid';

moment.locale('ko');

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * drag&drop 타겟 ag-grid
     */
    dropTargetAgGrid: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    /**
     * row를 drop하였을 때 실행하는 함수
     */
    onDragStop: PropTypes.func,
    /**
     * show 일 때만 데이터를 로드한다
     * @default
     */
    show: PropTypes.bool,
};
const defaultProps = {
    show: false,
};
const defaultPeriod = [0, 'days'];

/**
 * 홈 섹션편집 > 패키지 목록
 */
const IssueList = (props) => {
    const { className, dropTargetAgGrid, onDragStop, show } = props;
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_ISSUE_LIST_MODAL]);
    const pkgDiv = useSelector(({ app }) => app.PACKAGE_DIV); // packageDiv 종류 (서버에서 내려줌)
    const [period, setPeriod] = useState(defaultPeriod);
    const [search, setSearch] = useState(initialState.search);
    const [list, setList] = useState([]); // api 결과 담는 리스트
    const [total, setTotal] = useState(0);
    const [rowData, setRowData] = useState([]); // ag-grid 그리는 rowData
    const cntRef = useRef(0);

    /**
     * 패키지 목록 조회
     */
    const getIssueList = useCallback(
        ({ search: appendSearch, getServiceCodeList = false }) => {
            const ns = { ...search, usedYn: 'Y,E', ...appendSearch }; // 노출 중이거나 종료한 것만
            setSearch(ns);

            // 실검색에 쓰는 날짜 text
            const startDt = ns.startDt && ns.startDt.isValid() ? moment(ns.startDt).format(DB_DATEFORMAT) : null;
            const endDt = ns.endDt && ns.endDt.isValid() ? moment(ns.endDt).format(DB_DATEFORMAT) : null;

            dispatch(
                getIssueListModal({
                    search: { ...ns, startDt, endDt },
                    getServiceCodeList,
                    callback: ({ header, body, search }) => {
                        if (header.success) {
                            setList(body.list);
                            setTotal(body.totalCnt);
                            setSearch({ ...ns, category: search.category });
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        },
        [dispatch, search],
    );

    /**
     * 검색조건 변경
     */
    const handleSearchOption = useCallback(
        ({ key, value, number, date }) => {
            if (key === 'period') {
                // 기간 설정
                setPeriod([Number(number), date]);
                const nd = new Date();
                const startDt = moment(nd).subtract(Number(number), date).startOf('day');
                const endDt = moment(nd).endOf('day');
                setSearch({ ...search, startDt, endDt });
            } else {
                setSearch({ ...search, [key]: value });
            }
        },
        [search],
    );

    /**
     * 테이블에서 검색조건 변경
     */
    const changeTableSearchOption = useCallback(
        ({ key, value }) => {
            let ns = { [key]: value };
            if (key !== 'page') ns['page'] = 0;
            getIssueList({ search: ns });
        },
        [getIssueList],
    );

    /**
     * 검색조건 초기화
     */
    const handleReset = useCallback(() => {
        const nd = new Date();
        setPeriod(defaultPeriod);
        setSearch({
            ...initialState.search,
            page: search.page,
            startDt: moment(nd).subtract(defaultPeriod[0], defaultPeriod[1]).startOf('day'),
            endDt: moment(nd).endOf('day'),
        });
    }, [search.page]);

    /**
     * validate
     */
    const validate = useCallback(() => {
        let isInvalid = false;
        return !isInvalid;
    }, []);

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        let ns = { page: 0 };
        if (validate()) {
            getIssueList({ search: ns });
        }
    }, [getIssueList, validate]);

    useEffect(() => {
        if (show) {
            // 패키지 목록 로딩 (최초)
            if (cntRef.current === 0) {
                const nd = new Date();
                getIssueList({
                    search: {
                        startDt: moment(nd).subtract(defaultPeriod[0], defaultPeriod[1]).startOf('day'),
                        endDt: moment(nd).endOf('day'),
                    },
                    getServiceCodeList: true,
                });
                cntRef.current += 1;
            }
        }
    }, [show, getIssueList]);

    useEffect(() => {
        if (list.length > 0) {
            setRowData(
                list.map((data) => {
                    // 기자명 replace
                    let repName = '';
                    const rep = (data.repList || '').split(',').map((r) => r.replace(/(.*\|)(.*)/, '$2'));
                    if (rep.length > 1) repName = `${rep[0]} 외 ${rep.length - 1}명`;
                    else if (rep.length === 1) repName = rep[0];
                    const fullRepName = rep.join(',');

                    // 카테고리
                    let catName = '';
                    catName = (data.catList || '')
                        .split(',')
                        .map((t) => t.replace(/(.*\|)(.*)/, '$2'))
                        .join(',');

                    return {
                        ...data,
                        catName,
                        repName,
                        fullRepName,
                        divName: pkgDiv.find((d) => d.code === data.pkgDiv)?.name || '',
                        regDt: (data.regDt || '').slice(0, 10),
                    };
                }),
            );
        }
    }, [list, pkgDiv]);

    return (
        <div className={clsx('d-flex flex-column h-100', className)}>
            <Search search={search} period={period} onChangeSearchOption={handleSearchOption} onSearch={handleSearch} onReset={handleReset} loading={loading} pkgDiv={pkgDiv} />

            <AgGrid
                search={search}
                list={rowData}
                total={total}
                loading={loading}
                dropTargetAgGrid={dropTargetAgGrid}
                onDragStop={onDragStop}
                // onSearch={handleSearch}
                onChangeSearchOption={changeTableSearchOption}
            />
        </div>
    );
};

IssueList.propTypes = propTypes;
IssueList.defaultProps = defaultProps;

export default IssueList;
