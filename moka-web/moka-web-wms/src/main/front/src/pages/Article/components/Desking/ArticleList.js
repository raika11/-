import React, { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { DB_DATEFORMAT } from '@/constants';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { messageBox } from '@utils/toastUtil';
import { initialState, GET_ARTICLE_LIST_MODAL, getArticleListModal } from '@store/article';
import Search from './Search';
import AgGrid from './AgGrid';

moment.locale('ko');

const propTypes = {
    /**
     * className
     */
    className: PropTypes.string,
    /**
     * 선택한 컴포넌트의 데이터
     */
    selectedComponent: PropTypes.object,
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
    /**
     * 네이버채널일 경우 기사매체 & 기사리스트 api를 별도로 사용한다
     * @default
     */
    isNaverChannel: PropTypes.bool,
    /**
     * 영상 기사만 조회하는지
     */
    movie: PropTypes.bool,
};

const defaultProps = {
    selectedComponent: {},
    isNaverChannel: false,
    show: true,
    movie: false,
};

/**
 * 페이지편집 > 기사 목록
 * @desc 네이버 채널 => 벌크기사 리스트 조회
 * @desc 네이버 채널X => 서비스기사 리스트 조회
 */
const ArticleList = (props) => {
    const { className, selectedComponent, dropTargetAgGrid, onDragStop, isNaverChannel, show, movie } = props;
    const dispatch = useDispatch();

    // initial setting
    const initialSearch = isNaverChannel ? initialState.bulk.search : initialState.service.search;
    const [type, setType] = useState('DESKING');
    const [period, setPeriod] = useState([2, 'days']);
    const loading = useSelector(({ loading }) => loading[GET_ARTICLE_LIST_MODAL]);
    const [search, setSearch] = useState(initialSearch);
    const [error, setError] = useState({});
    const [rowData, setRowData] = useState([]);
    const [total, setTotal] = useState(0);
    const previous = useRef({ schCodeId: null, type: null });

    /**
     * 기사조회하는 함수
     */
    const getArticleList = useCallback(
        ({ type, search: appendSearch }) => {
            const nt = new Date();
            const startServiceDay = !search.startServiceDay ? moment(nt).subtract(period[0], period[1]).startOf('day') : search.startServiceDay;
            const endServiceDay = !search.endServiceDay ? moment(nt).endOf('day') : search.endServiceDay;
            const ns = { ...search, ...appendSearch, startServiceDay, endServiceDay };
            const isOk = ns.sourceList && (ns.sourceList || []).length > 0; // sourceList가 셋팅되어있는지

            setSearch(ns);
            dispatch(
                getArticleListModal({
                    getSourceList: !isOk,
                    type,
                    search: {
                        ...ns,
                        movieTab: movie ? 'Y' : null,
                        startServiceDay: moment(startServiceDay).format(DB_DATEFORMAT),
                        endServiceDay: moment(endServiceDay).format(DB_DATEFORMAT),
                    },
                    callback: ({ header, body, search }) => {
                        if (header.success) {
                            setRowData(body.list);
                            setTotal(body.totalCnt);
                            setError({});
                            setSearch({ ...ns, sourceList: search.sourceList });
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        },
        [dispatch, search, period, movie],
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
                const startServiceDay = moment(nd).subtract(Number(number), date).startOf('day');
                const endServiceDay = moment(nd).endOf('day');
                setSearch({ ...search, startServiceDay, endServiceDay });
            } else {
                if (key === 'sourceList' && error[key]) {
                    setError({ ...error, sourceList: false });
                }
                setSearch({ ...search, [key]: value });
            }
        },
        [error, search],
    );

    /**
     * 검색조건 초기화
     */
    const handleReset = useCallback(() => {
        const nd = new Date();
        setPeriod([2, 'days']);
        setSearch({
            ...initialSearch,
            page: search.page,
            masterCode: selectedComponent.schCodeId || null,
            startServiceDay: moment(nd).subtract(2, 'days').startOf('day'),
            endServiceDay: moment(nd).endOf('day'),
        });
    }, [initialSearch, search.page, selectedComponent.schCodeId]);

    /**
     * validate
     */
    const validate = useCallback(() => {
        let isInvalid = false;

        if (!search.sourceList || !REQUIRED_REGEX.test(search.sourceList)) {
            isInvalid = isInvalid || true;
            setError({ ...error, sourceList: true });
        }

        return !isInvalid;
    }, [error, search]);

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        let ns = { page: 0 };
        if (validate()) {
            getArticleList({ type, search: ns });
        }
    }, [getArticleList, type, validate]);

    /**
     * 테이블에서 검색조건 변경
     */
    const changeTableSearchOption = useCallback(
        ({ key, value }) => {
            let ns = { [key]: value };
            if (key !== 'page') ns['page'] = 0;
            getArticleList({ type, search: ns });
        },
        [getArticleList, type],
    );

    useEffect(() => {
        if (show) {
            const type = !!isNaverChannel ? 'BULK' : 'DESKING';
            const masterCode = selectedComponent.schCodeId || null;
            let ns = { ...initialSearch, ...search, masterCode };

            // 기사 로딩
            setType(type);
            if (previous.current.type !== type) ns.sourceList = null; // 타입이 바뀌면 매체 리로드해야함
            if (previous.current.type !== type || previous.current.schCodeId !== masterCode) {
                getArticleList({ type, search: ns });
                previous.current.type = type;
                previous.current.schCodeId = masterCode;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, isNaverChannel, selectedComponent.schCodeId]);

    return (
        <div className={clsx('d-flex flex-column h-100', className)}>
            <Search
                search={search}
                period={period}
                error={error}
                onChangeSearchOption={handleSearchOption}
                onSearch={handleSearch}
                onReset={handleReset}
                isNaverChannel={isNaverChannel}
                // 그룹넘버 변경 후 실행함수
                onChangeGroupNumber={handleSearch}
            />

            <AgGrid
                search={search}
                list={rowData}
                total={total}
                loading={loading}
                dropTargetAgGrid={dropTargetAgGrid}
                onDragStop={onDragStop}
                onSearch={handleSearch}
                onChangeSearchOption={changeTableSearchOption}
                getArticleList={() => getArticleList({ type, search })}
            />
        </div>
    );
};

ArticleList.propTypes = propTypes;
ArticleList.defaultProps = defaultProps;

export default ArticleList;
