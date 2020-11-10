import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaSearchInput } from '@components';
import { initialState } from '@store/reporter';

/**
 * 기자 검색 모달 검색
 */
const ReporterModalSearch = () => {
    const dispatch = useDispatch();
    // const { search: storeSearch } = useSelector((store) => ({
    //     search: store.report.search,
    // }));

    // const [search, setSearch] = useState(initialState.search);

    // useEffect(() => {
    //     // 스토어의 search 객체 변경 시 로컬 state에 셋팅
    //     setSearch(storeSearch);
    // }, [storeSearch]);

    /**
     * 검색
     */
    // const handleSearch = useCallback(() => {
    //     dispatch(
    //         getReporterList(
    //             changeSearchOption({
    //                 ...search,
    //                 page: 0,
    //             }),
    //         ),
    //     );
    // }, [dispatch]);

    /**
     * 검색 옵션 변경
     * @param {*} e 이벤트
     */
    // const handleChangeSearchOption = (e) => {
    //     if (e.target.name === 'searchType') {
    //         setSearch({
    //             ...search,
    //             searchType: e.target.value,
    //         });
    //     } else if (e.target.name === 'keyword') {
    //         setSearch({
    //             ...search,
    //             keyword: e.target.value,
    //         });
    //     }
    // };

    return (
        <Form>
            <Form.Row>
                <Col xs={5} className="p-0 mb-2">
                    <MokaSearchInput
                        // value={search.keyword}
                        // onChange={handleChangeSearchOption}
                        // onSearch={handleSearch}
                        placeholder="기자를 입력하세요"
                        name="keyword"
                    />
                </Col>
                <Col xs={1}>
                    <Button variant="gray150">초기화</Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default ReporterModalSearch;
