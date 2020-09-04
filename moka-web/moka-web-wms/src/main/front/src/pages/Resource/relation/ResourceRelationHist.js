import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { WmsSelect, WmsTextFieldIcon, WmsTable } from '~/components';
// import { getHistories, changeSearchOption } from '~/stores/component/componentHistoryStore';
import style from '~/assets/jss/pages/RelationStyle';
import { historyColumns } from '../components/tableColumns';
// import { defaultFormat } from '~/utils/dateUtil';

const useStyles = makeStyles(style);
const defaultSearchType = [
    { id: 'all', name: '전체' },
    { id: 'createYmdt', name: '날짜' },
    { id: 'creator', name: '작업자' }
];

/**
 * 템플릿 히스토리 컴포넌트
 */
const ResourceRelationHist = () => {
    const classes = useStyles();
    // const dispatch = useDispatch();
    let { componentSeq: currentSeq } = useParams();
    // const { search, history, total, error, loading } = useSelector(
    //     ({ componentHistoryStore, loadingStore }) => ({
    //         search: componentHistoryStore.search,
    //         history: componentHistoryStore.list,
    //         total: componentHistoryStore.total,
    //         error: componentHistoryStore.error,
    //         loading: loadingStore['componentHistoryStore/GET_HISTORIES']
    //     })
    // );
    const [callCnt, setCallCnt] = useState(0);
    const [histRows, setHistRows] = useState([]);
    const [keyword, setKeyword] = useState('');

    // // 템플릿 rows 생성
    // useEffect(() => {
    //     if (history) {
    //         setHistRows(
    //             history.map((t) => ({
    //                 id: String(t.seq),
    //                 seq: t.seq,
    //                 createYmdt: defaultFormat(t.createYmdt),
    //                 creator: t.creator
    //             }))
    //         );
    //     }
    // }, [history]);

    /**
     * row 클릭 콜백
     * @param {object} e 클릭이벤트
     * @param {object} row row정보
     */
    const handleRowClick = (e, row) => {};

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = (payload) => {
        // dispatch(getHistories([changeSearchOption(payload)]));
    };

    /**
     * 키워드 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeKeyword = (e) => {
        setKeyword(e.target.value);
    };

    /**
     * 검색 조건 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeSearchType = (e) => {
        // dispatch(
        //     changeSearchOption({
        //         key: 'searchType',
        //         value: e.target.value
        //     })
        // );
    };

    /**
     * 히스토리 검색
     * @param {object} e click이벤트
     */
    const onSearch = (e) => {
        // dispatch(
        //     getHistories([
        //         changeSearchOption({
        //             key: 'keyword',
        //             value: keyword
        //         }),
        //         changeSearchOption({
        //             key: 'page',
        //             value: 0
        //         })
        //     ])
        // );
    };

    // 데이터 로딩(최초 1번)
    // useEffect(() => {
    //     if (currentSeq) {
    //         if (callCnt < 1 || search.componentSeq !== currentSeq) {
    //             dispatch(
    //                 getHistories([
    //                     changeSearchOption({
    //                         key: 'componentSeq',
    //                         value: currentSeq
    //                     })
    //                 ])
    //             );
    //             setCallCnt(callCnt + 1);
    //         }
    //     }
    // }, [dispatch, currentSeq, search, callCnt]);

    // search.keyword로 state keyword 변경
    // useEffect(() => {
    //     setKeyword(search.keyword);
    // }, [search.keyword]);

    return (
        <>
            <div className={classes.mb8}>
                <WmsSelect
                    rows={defaultSearchType}
                    label="구분"
                    labelWidth="50"
                    width="170"
                    currentId=""
                    onChange={onChangeSearchType}
                    overrideClassName={classes.mr8}
                />
                <WmsTextFieldIcon
                    placeholder="검색어를 입력하세요"
                    value={keyword}
                    width="calc(100% - 178px)"
                    icon="search"
                    onChange={onChangeKeyword}
                    onIconClick={onSearch}
                    onEnter={onSearch}
                />
            </div>
            <div className={classes.histTable}>
                <WmsTable
                    columns={historyColumns}
                    rows={histRows}
                    total={0}
                    page={0}
                    size={0}
                    onRowClick={handleRowClick}
                    onChangeSearchOption={handleChangeSearchOption}
                    loading={false}
                    // error={false}
                />
            </div>
        </>
    );
};

export default ResourceRelationHist;
