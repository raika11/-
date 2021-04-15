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
     * 영상 기사만 조회
     */
    movie: PropTypes.bool,
    /**
     * 선택한 컴포넌트의 데이터
     * @default
     */
    selectedComponent: PropTypes.object,
    /**
     * drag&drop 타겟 ag-grid
     */
    dropTargetAgGrid: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    /**
     * row drop시 실행
     */
    onDragStop: PropTypes.func,
    /**
     * 네이버채널 유무 (기사매체 & 기사리스트 별도 api 사용)
     * @default
     */
    isNaverChannel: PropTypes.bool,
    /**
     * 편집그룹 변경 기능 막기 (네이버채널, 영상탭일 경우 막음)
     * @default
     */
    suppressChangeArtGroup: PropTypes.bool,
    /**
     * 제목 수정 기능 막기
     * @default
     */
    suppressChangeArtTitle: PropTypes.bool,
    /**
     * columnDefs 추가
     */
    addColumnDefs: PropTypes.arrayOf(
        PropTypes.shape({
            /**
             * 추가할 위치
             */
            index: PropTypes.number,
        }),
    ),
};

const defaultProps = {
    show: true,
    movie: false,
    selectedComponent: {},
    dropTargetAgGrid: null,
    isNaverChannel: false,
    suppressChangeArtGroup: false,
    suppressChangeArtTitle: false,
};

/**
 * 페이지편집 > 기사 목록
 * @desc 네이버 채널 => 벌크기사 리스트 조회
 * @desc 네이버 채널X => 서비스기사 리스트 조회
 */
const ArticleList = ({
    className,
    selectedComponent,
    dropTargetAgGrid,
    onDragStop,
    isNaverChannel,
    show,
    movie,
    suppressChangeArtGroup,
    suppressChangeArtTitle,
    addColumnDefs,
}) => {
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_ARTICLE_LIST_MODAL]);

    // initial setting
    const sourceList = useSelector(({ articleSource }) => (isNaverChannel ? articleSource.typeSourceList.BULK : articleSource.deskingSourceList));
    const initialSearch = isNaverChannel ? initialState.bulk.search : initialState.service.search;

    const [type, setType] = useState('DESKING');
    const [period, setPeriod] = useState([2, 'days']);
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
            const needCallSource = !ns.sourceList; // 매체 api 호출해야하는지

            setSearch(ns);
            dispatch(
                getArticleListModal({
                    getSourceList: needCallSource,
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
            sourceList: (sourceList || []).map((s) => s.sourceCode).join(','),
            page: search.page,
            masterCode: selectedComponent.schCodeId || null,
            startServiceDay: moment(nd).subtract(2, 'days').startOf('day'),
            endServiceDay: moment(nd).endOf('day'),
        });
    }, [initialSearch, search.page, selectedComponent.schCodeId, sourceList]);

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
        <div className={clsx('d-flex flex-column h-100', className)} key={movie ? 'movie' : 'article'}>
            <Search
                search={search}
                period={period}
                error={error}
                onChangeSearchOption={handleSearchOption}
                onSearch={handleSearch}
                onReset={handleReset}
                // 그룹넘버 변경 후 실행함수
                onChangeGroupNumber={handleSearch}
                // 매체 목록
                sourceList={sourceList}
                // 편집그룹 변경 막기
                suppressChangeArtGroup={suppressChangeArtGroup || isNaverChannel || movie}
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
                movie={movie}
                suppressChangeArtTitle={suppressChangeArtTitle}
                addColumnDefs={addColumnDefs}
            />
        </div>
    );
};

ArticleList.propTypes = propTypes;
ArticleList.defaultProps = defaultProps;

export default ArticleList;
