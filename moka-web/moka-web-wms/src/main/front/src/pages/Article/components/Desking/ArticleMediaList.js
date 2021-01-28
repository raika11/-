import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { DB_DATEFORMAT } from '@/constants';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import articleStore from '@store/article';
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
    const clearList = isNaverChannel ? articleStore.clearBulkList : articleStore.clearServiceList;
    const changeSearchOption = isNaverChannel ? articleStore.changeBulkSearchOption : articleStore.changeServiceSearchOption;
    const getArticleList = isNaverChannel ? articleStore.getBulkArticleList : articleStore.getServiceArticleList;
    const { storeSearch, list, total } = useSelector(({ article }) => ({
        storeSearch: isNaverChannel ? article.bulk.search : article.service.search,
        list: isNaverChannel ? article.bulk.list : article.service.list,
        total: isNaverChannel ? article.bulk.total : article.service.total,
    }));

    const [sourceOn, setSourceOn] = useState(false);
    const [period, setPeriod] = useState([2, 'days']);
    const loading = useSelector(({ loading }) => loading[articleStore.GET_BULK_ARTICLE_LIST] || loading[articleStore.GET_SERVICE_ARTICLE_LIST]);
    const [search, setSearch] = useState(initialSearch);
    const [error, setError] = useState({});

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
                setSourceOn(true);
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
        dispatch(
            changeSearchOption({
                ...initialSearch,
                masterCode: selectedComponent.schCodeId || null,
                startServiceDay: moment(nd).subtract(2, 'days').startOf('day').format(DB_DATEFORMAT),
                endServiceDay: moment(nd).endOf('day').format(DB_DATEFORMAT),
                page: 0,
                contentType: 'M',
            }),
        );
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
            startServiceDay: moment(search.startServiceDay).format(DB_DATEFORMAT),
            endServiceDay: moment(search.endServiceDay).format(DB_DATEFORMAT),
            page: 0,
        };

        if (validate(ns)) {
            dispatch(changeSearchOption(ns));
            dispatch(getArticleList({ search: ns }));
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
        dispatch(changeSearchOption(ns));
        dispatch(getArticleList({ search: ns }));
    };

    useEffect(() => {
        let ssd = moment(storeSearch.startServiceDay, DB_DATEFORMAT);
        if (!ssd.isValid()) ssd = null;
        let esd = moment(storeSearch.endServiceDay, DB_DATEFORMAT);
        if (!esd.isValid()) esd = null;

        setSearch({
            ...storeSearch,
            startServiceDay: ssd,
            endServiceDay: esd,
        });
    }, [storeSearch]);

    useEffect(() => {
        return () => {
            // unmount
            dispatch(clearList());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // 기사 목록 최초 로딩
        const nt = new Date();
        const startServiceDay = search.startServiceDay || moment(nt).subtract(period[0], period[1]).startOf('day');
        const endServiceDay = search.endServiceDay || moment(nt).endOf('day');
        let ns = {
            ...search,
            masterCode: selectedComponent.schCodeId || null,
            startServiceDay: moment(startServiceDay).format(DB_DATEFORMAT),
            endServiceDay: moment(endServiceDay).format(DB_DATEFORMAT),
            page: 0,
            contentType: 'M',
        };

        dispatch(changeSearchOption(ns));
        if (sourceOn) {
            dispatch(getArticleList({ search: ns }));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent.schCodeId, sourceOn]);

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
                search={storeSearch}
                list={list}
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
