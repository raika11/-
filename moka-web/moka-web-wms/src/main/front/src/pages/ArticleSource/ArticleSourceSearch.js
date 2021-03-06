import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { MokaInput } from '@/components';
import { initialState, changeSearchOption, getSourceList } from '@store/articleSource';

/**
 * 수신 매체 검색
 */
const ArticleSourceSearch = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const storeSearch = useSelector((store) => store.articleSource.search);

    // local state
    const [search, setSearch] = useState(initialState.search);

    /**
     * 검색 keyword 변경
     * @param {object} e event
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
    };

    /**
     * 검색 버튼
     */
    const handleSearch = () => {
        dispatch(
            getSourceList(
                changeSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    };

    /**
     * 초기화 버튼
     */
    const handleClickInitialize = () => {
        setSearch(initialState.search);
    };

    /**
     * 등록 버튼
     */
    const handleClickAdd = () => {
        history.push(`${match.path}/add`);
    };

    useEffect(() => {
        // 스토어의 search 객체 변경 시 로컬 state에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getSourceList());
    }, [dispatch]);

    return (
        <>
            <div className="mb-14 d-flex">
                <div style={{ width: 100 }} className="mr-2">
                    <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                        <option value="all">전체</option>
                        <option value="sourceName">매체명</option>
                        <option value="sourceCode">매체코드</option>
                    </MokaInput>
                </div>
                <div className="mr-2 flex-fill">
                    <MokaInput className="mr-2" placeholder="검색어를 입력하세요" value={search.keyword} name="keyword" onChange={handleChangeValue} />
                </div>
                <div style={{ width: 150 }} className="mr-2">
                    <MokaInput as="select" name="rcvUsedYn" value={search.rcvUsedYn} onChange={handleChangeValue}>
                        <option value="all">CP수신여부(전체)</option>
                        <option value="Y">수신</option>
                        <option value="N">미수신</option>
                    </MokaInput>
                </div>
                <Button className="mr-1" variant="searching" onClick={handleSearch}>
                    검색
                </Button>
                <Button className="mr-1" variant="negative" onClick={handleClickInitialize}>
                    초기화
                </Button>
                <Button variant="positive" onClick={handleClickAdd}>
                    등록
                </Button>
            </div>
        </>
    );
};

export default ArticleSourceSearch;
