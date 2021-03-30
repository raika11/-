import React, { useCallback, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaSearchInput, MokaInput } from '@components';
import { useDispatch, useSelector } from 'react-redux';
import { getApi } from '@store/codeMgt';
import { changeSearchOption, getDatasetList, initialState } from '@store/dataset';

/**
 * 데이터셋 관리 > 데이터셋 목록 > 검색
 */
const DatasetSearch = ({ match }) => {
    const dispatch = useDispatch();
    const apiRows = useSelector(({ codeMgt }) => codeMgt.apiRows);
    const storeSearch = useSelector(({ dataset }) => dataset.search);
    const [search, setSearch] = useState(initialState.search);

    /**
     * 입력 값 변경
     */
    const handleChangeSearchValue = ({ target }) => {
        const { value, name } = target;
        setSearch({
            ...search,
            [name]: value,
        });
    };

    /**
     * 검색
     */
    const handleClickSearch = useCallback(() => {
        dispatch(
            getDatasetList(
                changeSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    }, [dispatch, search]);

    useEffect(() => {
        dispatch(getApi());
    }, [dispatch]);

    useEffect(() => {
        // 스토어의 search 객체 변경 시 로컬 state에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        let apiCodeId = search.apiCodeId;
        if (apiRows && apiRows.length > 0 && apiCodeId !== apiRows[0].dtlCd) {
            apiCodeId = apiRows[0].dtlCd;
            dispatch(
                getDatasetList(
                    changeSearchOption({
                        ...search,
                        page: 0,
                        apiCodeId,
                    }),
                ),
            );
        }
    }, [apiRows, dispatch, search]);

    return (
        <Form className="mb-14">
            <Form.Row className="mb-2">
                <Col xs={8} className="p-0 pr-2">
                    <MokaInput as="select" name="apiCodeId" onChange={handleChangeSearchValue} value={search.apiCodeId}>
                        {apiRows &&
                            apiRows.map((api) => (
                                <option key={api.id} value={api.dtlCd}>
                                    {api.name}
                                </option>
                            ))}
                    </MokaInput>
                </Col>
                <Col xs={4} className="p-0">
                    <MokaInput as="select" name="autoCreateYn" onChange={handleChangeSearchValue} value={search.autoCreateYn}>
                        {initialState.autoCreateYnSearchTypeList.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
            </Form.Row>
            <Form.Row>
                <div className="mr-2 flex-shrink-0">
                    <MokaInput as="select" name="searchType" onChange={handleChangeSearchValue} value={search.searchType}>
                        {initialState.searchTypeList.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>
                <MokaSearchInput className="flex-fill" name="keyword" value={search.keyword} onChange={handleChangeSearchValue} onSearch={handleClickSearch} />
            </Form.Row>
        </Form>
    );
};

export default DatasetSearch;
