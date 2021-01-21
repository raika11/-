import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInputLabel, MokaInput, MokaSearchInput } from '@components';
import { initialState, getDirectLinkList, changeSearchOption } from '@store/directLink';

/**
 * 사이트 바로가기 검색창
 */
const DirectLinkSearch = () => {
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
    const handleSearch = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getDirectLinkList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getDirectLinkList());
    }, [dispatch]);

    return (
        <Form.Row className="mb-2">
            {/* 사용여부 */}
            <Col xs={2} className="p-0 pr-2">
                <MokaInput as="select" name="usedYn" value={search.usedYn} onChange={handleChangeValue} className="mb-0">
                    <option hidden>사용여부 선택</option>
                    <option value="Y">사용</option>
                    <option value="N">미사용</option>
                </MokaInput>
            </Col>

            {/* 노출고정 */}
            <Col xs={3} className="p-0 pr-2">
                <MokaInputLabel label="노출고정" labelWidth={47} as="select" name="fixYn" value={search.fixYn} onChange={handleChangeValue}>
                    <option value="N">검색시만 노출</option>
                    <option value="Y">항상노출</option>
                </MokaInputLabel>
            </Col>

            {/* 검색조건 */}
            <Col xs={2} className="p-0 pr-2">
                <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                    {initialState.searchTypeList.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </MokaInput>
            </Col>

            {/* 키워드 */}
            <Col xs={5} className="p-0">
                <MokaSearchInput name="keyword" value={search.keyword} onChange={handleChangeValue} onSearch={handleSearch} />
            </Col>
        </Form.Row>
    );
};

export default DirectLinkSearch;
