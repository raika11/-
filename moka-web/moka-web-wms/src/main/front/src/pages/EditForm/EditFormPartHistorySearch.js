import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaSearchInput } from '@components';
import { changeSearchOption, getEditFormHistoryList, initialState } from '@store/editForm';

const EditFormPartHistorySearch = () => {
    const dispatch = useDispatch();
    const { historySearch: storeSearch } = useSelector((store) => ({
        historySearch: store.editForm.historySearch,
    }));

    const [search, setSearch] = useState(initialState.search);

    useEffect(() => {
        // 스토어의 search 객체 변경 시 로컬 state에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    const doSearch = useCallback(() => {
        dispatch(
            getEditFormHistoryList(
                changeSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    }, [dispatch, search]);

    /**
     * 검색
     */
    const handleSearch = useCallback(() => {
        doSearch();
    }, [doSearch]);

    /**
     * 검색 옵션 변경
     * @param {*} e 이벤트
     */
    const handleChangeSearchOption = (e) => {
        setSearch({
            ...search,
            keyword: e.target.value,
        });
    };

    /**
     * dataApiListPopup 저장 이벤트 핸들러
     * @param {Object} selectApi 선택한 API
     * @param {function} hideCallback 숨김 함수
     */
    const handleClicktListModalSave = (data, hideCallback) => {
        if (data) {
            setSearch({
                ...search,
                keyword: data.repName,
            });
            hideCallback();
        }
    };

    return (
        <Form>
            <Form.Row>
                <Col xs={7} className="p-0 mb-2">
                    <MokaSearchInput value={storeSearch.searchKeyword} onChange={handleChangeSearchOption} onSearch={handleSearch} placeholder="검색어를 입력하세요" />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default EditFormPartHistorySearch;
