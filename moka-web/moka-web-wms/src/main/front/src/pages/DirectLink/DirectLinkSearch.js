import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';
import { initialState, getDirectLinkList, changeSearchOption } from '@store/directLink';

/**
 * 사이트 바로가기 검색창
 */
const DirectLinkSearch = ({ match, history }) => {
    const dispatch = useDispatch();
    const storeSearch = useSelector(({ directLink }) => directLink.search);
    const [search, setSearch] = useState(initialState.search);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
    };

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        dispatch(
            getDirectLinkList(
                changeSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    }, [dispatch, search]);

    /**
     * 신규 등록
     */
    const handleClickAdd = () => history.push(`${match.path}/add`);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getDirectLinkList());
    }, [dispatch]);

    return (
        <Form.Row className="mb-14">
            {/* 사용여부 */}
            <div className="flex-shrink-0 mr-2">
                <MokaInput as="select" name="usedYn" value={search.usedYn} onChange={handleChangeValue} className="mb-0">
                    <option value="Y">사용</option>
                    <option value="N">미사용</option>
                </MokaInput>
            </div>

            {/* 노출고정 */}
            <div className="flex-shrink-0 mr-2">
                <MokaInput as="select" name="fixYn" value={search.fixYn} onChange={handleChangeValue}>
                    <option value="N">검색시만 노출</option>
                    <option value="Y">항상노출</option>
                </MokaInput>
            </div>

            {/* 검색조건 */}
            <div className="flex-shrink-0 mr-2">
                <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                    {initialState.searchTypeList.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </MokaInput>
            </div>

            {/* 키워드 */}
            <MokaSearchInput className="mr-40 flex-fill" name="keyword" value={search.keyword} onChange={handleChangeValue} onSearch={handleSearch} />

            {/* 신규등록 버튼 */}
            <div className="d-flex flex-fill justify-content-end h-100">
                <Button variant="positive" onClick={handleClickAdd}>
                    등록
                </Button>
            </div>
        </Form.Row>
    );
};

export default DirectLinkSearch;
