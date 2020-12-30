import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import { MokaInputLabel, MokaInput, MokaSearchInput } from '@components';
import { initialState, getDirectLinkList, changeSearchOption } from '@store/directLink';

const DirectLinkSearch = () => {
    const dispatch = useDispatch();

    const { search: storeSearch } = useSelector(
        (store) => ({
            search: store.directLink.search,
        }),
        shallowEqual,
    );
    const [search, setSearch] = useState(initialState.search);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;

        if (name === 'usedYn') {
            setSearch({ ...search, usedYn: value });
        } else if (name === 'fixYn') {
            setSearch({ ...search, fixYn: value });
        } else if (name === 'searchType') {
            setSearch({ ...search, searchType: value });
        } else if (name === 'keyword') {
            setSearch({ ...search, keyword: value });
        }
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
        // 스토어의 search 객체 변경 시 로컬 state에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        // 첫화면 로딩 시 리스트 조회
        dispatch(getDirectLinkList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form.Row className="mb-2">
            {/* 사용여부 */}
            <Col xs={2} className="p-0 pr-2">
                <MokaInputLabel
                    label="사용여부"
                    labelWidth={56}
                    as="select"
                    name="usedYn"
                    value={search.usedYn}
                    onChange={handleChangeValue}
                    className="mb-0"
                    inputClassName="ft-12"
                >
                    <option value="Y">사용</option>
                    <option value="N">미사용</option>
                </MokaInputLabel>
            </Col>

            {/* 노출고정 */}
            <Col xs={3} className="p-0 pr-2">
                <MokaInputLabel label="노출고정" as="select" name="fixYn" value={search.fixYn} onChange={handleChangeValue} className="mb-0" inputClassName="ft-12">
                    <option value="N">검색시만 노출</option>
                    <option value="Y">항상노출</option>
                </MokaInputLabel>
            </Col>

            {/* 검색조건 */}
            <Col xs={2} className="p-0 pr-2">
                <MokaInput as="select" name="searchType" value={search.searchType} onChange={handleChangeValue} className="ft-12">
                    {initialState.searchTypeList.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </MokaInput>
            </Col>

            {/* 키워드 */}
            <Col xs={5} className="p-0">
                <MokaSearchInput name="keyword" value={search.keyword} onChange={handleChangeValue} onSearch={handleSearch} inputClassName="ft-12" buttonClassName="ft-12" />
            </Col>
        </Form.Row>
    );
};

export default DirectLinkSearch;
