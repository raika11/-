import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import moment from 'moment';
import { KeyboardDatePicker } from '@material-ui/pickers';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { DB_DATE_FORMAT } from '~/constants';
import {
    WmsPickersUtilsProvider,
    WmsSelect,
    WmsTextField,
    WmsButton,
    WmsAutocomplete
} from '~/components';
import { changeSearchOption, getArticles } from '~/stores/article/articleStore';
import { changeSearchOption as changeCodeSearchOption, getCodes } from '~/stores/code/codeStore';

export const defaultSearchType = [
    { id: 'all', name: '전체' },
    { id: 'title', name: '제목' },
    { id: 'contentsId', name: '기사키' }
];

/**
 * 기사 검색
 * @param {object} param0.classes 스타일
 */
const ArticleListSearch = ({ classes }) => {
    const dispatch = useDispatch();
    const { search, codes } = useSelector((store) => ({
        search: store.articleStore.search,
        codes: store.codeStore.codes
    }));
    // 검색조건
    const [distStartYmdt, setDistStartYmdt] = useState(undefined);
    const [distEndYmdt, setDistEndYmdt] = useState(undefined);
    const [keyword, setKeyword] = useState('');
    // 자동 완성
    const [autocompleteOpen, setAutocompleteOpen] = useState(false);
    const [codeRows, setCodeRows] = useState([]);
    const [autocompleteCodeId, setAutocompleteCodeId] = useState(null);
    // 카운트
    const [callCnt, setCallCnt] = useState(0);

    useEffect(() => {
        // 분류코드 조회
        if (callCnt < 1) {
            dispatch(getCodes(changeCodeSearchOption({ key: 'codeLevel', value: 3 })));
            setCallCnt(callCnt + 1);
        }
    }, [dispatch, callCnt]);

    useEffect(() => {
        // api 데이터 => state 변경
        if (search.keyword) {
            setKeyword(search.keyword);
        }
        if (search.distStartYmdt && search.distStartYmdt !== '') {
            setDistStartYmdt(moment(search.distStartYmdt, DB_DATE_FORMAT));
        }
        if (search.distEndYmdt && search.distEndYmdt !== '') {
            setDistEndYmdt(moment(search.distEndYmdt, DB_DATE_FORMAT));
        }
        if (search.codeId && codeRows.length > 0) {
            let codeData = codeRows.find((c) => c.codeId === search.codeId);
            setAutocompleteCodeId({
                ...codeData,
                title: ''
            });
        } else {
            setAutocompleteCodeId(null);
        }
    }, [search, codeRows]);

    useEffect(() => {
        // autocomplete codeRows 생성
        if (codes.length > 0) {
            const rows = codes.map((c) => ({
                seq: c.codeId, // DB의 seq 필드 아님
                codeId: c.codeId,
                tagTitle: c.codeName,
                optionTitle: c.codePath,
                title: c.codePath
            }));
            setCodeRows(rows);
        }
    }, [codes]);

    /**
     * 시작일 변경
     * @param {object} date 선택한 날짜 데이터
     */
    const handleDistStartYmdt = (date) => {
        dispatch(
            changeSearchOption({
                key: 'distStartYmdt',
                value: moment(date).format(DB_DATE_FORMAT)
            })
        );
        // 시작일이 종료일 보다 크면 종료일을 시작일로 설정한다
        if (moment(date) > moment(distEndYmdt)) {
            dispatch(
                changeSearchOption({
                    key: 'distEndYmdt',
                    value: moment(date).format(DB_DATE_FORMAT)
                })
            );
        }
    };

    /**
     * 종료일 변경
     * @param {object} date 선택한 날짜 데이터
     */
    const handleDistEndYmdt = (date) => {
        dispatch(
            changeSearchOption({
                key: 'distEndYmdt',
                value: moment(date).format(DB_DATE_FORMAT)
            })
        );
    };

    /**
     * 검색조건 변경
     * @param {object} e 이벤트
     */
    const handleSearchType = (e) => {
        dispatch(changeSearchOption({ key: 'searchType', value: e.target.value }));
    };

    /**
     * 검색어 변경
     * @param {object} e 이벤트
     */
    const handleKeyword = (e) => {
        setKeyword(e.target.value);
    };

    /**
     * autocomplete 값 변경 시 실행
     * @param {object} e Event
     * @param {object} newValue { seq, codeId, tagTitle, optionTitle, title }
     * @param {string} targetName 속성 name값
     */
    const onChangeSearchId = (e, newValue, targetName) => {
        if (newValue !== null) {
            dispatch(changeSearchOption({ key: 'codeId', value: newValue.codeId }));
        } else {
            dispatch(changeSearchOption({ key: 'codeId', value: '' }));
        }
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        dispatch(
            getArticles(
                changeSearchOption({ key: 'page', value: 0 }),
                changeSearchOption({ key: 'keyword', value: keyword })
            )
        );
    };

    return (
        <WmsPickersUtilsProvider>
            <div className={clsx(classes.inLine, classes.mb8)}>
                {/* 시작일 */}
                <KeyboardDatePicker
                    inputVariant="outlined"
                    value={distStartYmdt}
                    format="YYYY-MM-DD"
                    keyboardIcon={<DateRangeIcon />}
                    onChange={handleDistStartYmdt}
                    KeyboardButtonProps={{
                        'aria-label': 'change date'
                    }}
                    invalidDateMessage=""
                    okLabel="설정"
                    cancelLabel="취소"
                    className={clsx(classes.dateBox, classes.mr8)}
                />

                {/* 종료일 */}
                <KeyboardDatePicker
                    inputVariant="outlined"
                    value={distEndYmdt}
                    format="YYYY-MM-DD"
                    keyboardIcon={<DateRangeIcon />}
                    onChange={handleDistEndYmdt}
                    KeyboardButtonProps={{
                        'aria-label': 'change date'
                    }}
                    invalidDateMessage=""
                    minDate={distStartYmdt}
                    okLabel="설정"
                    cancelLabel="취소"
                    className={clsx(classes.dateBox, classes.mr8)}
                />

                {/* 분류(컴포넌트의 분류) */}
                <WmsAutocomplete
                    name="searchCodeId"
                    width={189}
                    options={codeRows}
                    value={autocompleteCodeId}
                    onChange={onChangeSearchId}
                    open={autocompleteOpen}
                    icon="arrow_drop_down"
                    onSearchBtnClick={() => setAutocompleteOpen(!autocompleteOpen)}
                    onChangeOpen={(val) => setAutocompleteOpen(val)}
                    overrideClassName={classes.mr8}
                />

                {/* 부서 => Autocomplete 변경 */}
                <WmsSelect overrideClassName={classes.mr8} width={114} placeholder="부서" />

                {/* 검색조건 */}
                <WmsSelect
                    rows={defaultSearchType}
                    overrideClassName={classes.mr8}
                    width={114}
                    currentId={search.searchType}
                    name="searchType"
                    onChange={handleSearchType}
                />

                {/* 검색어 */}
                <WmsTextField
                    overrideClassName={classes.mr8}
                    width={255}
                    value={keyword}
                    name="keyword"
                    onChange={handleKeyword}
                    onEnter={handleSearch}
                />

                {/* 검색버튼 */}
                <WmsButton
                    color="primary"
                    overrideClassName={classes.articleListSearchButton}
                    onClick={handleSearch}
                >
                    검색
                </WmsButton>
            </div>
        </WmsPickersUtilsProvider>
    );
};

export default ArticleListSearch;
