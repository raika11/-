import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { DB_DATEFORMAT } from '@/constants';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import articleStore from '@store/article';
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
};

const defaultProps = {
    selectedComponent: {},
    isNaverChannel: false,
    show: true,
};

const ArticleMediaList = (props) => {
    const { className, selectedComponent, dropTargetAgGrid, onDragStop, isNaverChannel } = props;
    const dispatch = useDispatch();

    // initial setting
    const initialSearch = isNaverChannel ? articleStore.initialState.bulk.search : articleStore.initialState.service.search;

    const [type, setType] = useState('service');
    const [sourceOn, setSourceOn] = useState(false);
    const [period, setPeriod] = useState([2, 'days']);
    const loading = useSelector(({ loading }) => loading[articleStore.GET_ARTICLE_LIST_MODAL]);
    const [search, setSearch] = useState(initialSearch);
    const [error, setError] = useState({});
    const [rowData, setRowData] = useState([]);
    const [total, setTotal] = useState(0);

    /**
     * 기사조회하는 함수
     */
    const getArticleList = ({ type, search }) => {
        setSearch(search);
        dispatch(
            articleStore.getArticleListModal({
                type,
                search: {
                    ...search,
                    startServiceDay: moment(search.startServiceDay).format(DB_DATEFORMAT),
                    endServiceDay: moment(search.endServiceDay).format(DB_DATEFORMAT),
                },
                callback: ({ header, body }) => {
                    if (header.success) {
                        setRowData(body.list);
                        setTotal(body.totalCnt);
                        setError({});
                    } else {
                        messageBox.alert(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 검색조건 변경
     */
    const handleSearchOption = ({ key, value, number, date }) => {
        if (key === 'period') {
            // 기간 설정
            setPeriod([Number(number), date]);
            const nd = new Date();
            const startServiceDay = moment(nd).subtract(Number(number), date).startOf('day');
            const endServiceDay = moment(nd).endOf('day');
            setSearch({ ...search, startServiceDay, endServiceDay });
        } else {
            if (key === 'sourceList') {
                setError({ ...error, sourceList: false });
                !!value ? setSourceOn(true) : setSourceOn(false);
            }
            setSearch({ ...search, [key]: value });
        }
    };

    /**
     * 검색조건 초기화
     */
    const handleReset = () => {
        const nd = new Date();
        setPeriod([2, 'days']);
        setSearch({
            ...initialSearch,
            masterCode: selectedComponent.schCodeId || null,
            startServiceDay: moment(nd).subtract(2, 'days').startOf('day'),
            endServiceDay: moment(nd).endOf('day'),
            page: 0,
            contentType: 'M',
        });
    };

    /**
     * validate
     */
    const validate = (ns) => {
        let isInvalid = false;

        if (!REQUIRED_REGEX.test(ns.sourceList)) {
            isInvalid = isInvalid || true;
            setError({ ...error, sourceList: true });
        }

        return !isInvalid;
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        let ns = {
            ...search,
            startServiceDay: moment(search.startServiceDay),
            endServiceDay: moment(search.endServiceDay),
            page: 0,
        };

        if (validate(ns)) {
            getArticleList({ type, search: ns });
        }
    };

    /**
     * 테이블 검색조건 변경
     */
    const changeTableSearchOption = ({ key, value }) => {
        let ns = { ...search, [key]: value };
        if (key !== 'page') {
            ns['page'] = 0;
        }
        getArticleList({ type, search: ns });
    };

    useEffect(() => {
        const tp = !!isNaverChannel ? 'bulk' : 'service';
        const nt = new Date();
        const startServiceDay = search.startServiceDay || moment(nt).subtract(period[0], period[1]).startOf('day');
        const endServiceDay = search.endServiceDay || moment(nt).endOf('day');
        let ns = {
            ...search,
            masterCode: selectedComponent.schCodeId || null,
            startServiceDay: moment(startServiceDay),
            endServiceDay: moment(endServiceDay),
            page: 0,
            contentType: 'M',
        };
        setSearch(ns);
        setType(tp);
        if (sourceOn) {
            getArticleList({ type: tp, search: ns });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent.schCodeId, isNaverChannel]);

    useEffect(() => {
        // 기사 목록 최초 로딩
        if (sourceOn) {
            getArticleList({ type, search });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceOn]);

    return (
        <div className={clsx('d-flex flex-column h-100 py-3 px-card', className)}>
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
                media
            />

            <AgGrid
                search={search}
                list={rowData}
                total={total}
                loading={loading}
                dropTargetAgGrid={dropTargetAgGrid}
                onDragStop={onDragStop}
                onChangeSearchOption={changeTableSearchOption}
                media
            />
        </div>
    );
};

ArticleMediaList.propTypes = propTypes;
ArticleMediaList.defaultProps = defaultProps;

export default ArticleMediaList;
