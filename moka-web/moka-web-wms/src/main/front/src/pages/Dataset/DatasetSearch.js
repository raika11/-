import React, { useCallback, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaSearchInput, MokaInput } from '@components';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getApi } from '@store/codeMgt';
import { changeSearchOption, getDatasetList, initialState } from '@store/dataset';
import { getTemplateList } from '@store/template';
import { useHistory } from 'react-router-dom';

const defaultAutoCreateYn = [
    { id: 'all', name: '데이터 전체' },
    { id: 'Y', name: '자동' },
    { id: 'N', name: '수동' },
];
const defaultSearchType = [
    { id: 'all', name: '데이터셋 전체' },
    { id: 'datasetSeq', name: '데이터셋ID' },
    { id: 'datasetName', name: '데이터셋명' },
];

/**
 * 데이터셋 검색 컴포넌트
 */
const DatasetSearch = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { apiRows, search: storeSearch } = useSelector(
        (store) => ({
            apiRows: store.codeMgt.apiRows,
            search: store.dataset.search,
        }),
        shallowEqual,
    );

    const [search, setSearch] = useState(initialState.search);

    const handleChangeSearchValue = ({ target }) => {
        const { value, name } = target;
        console.log(name);
        console.log(value);
        setSearch({
            ...search,
            [name]: value,
        });
    };

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

    const handleClickAddDataSet = (event) => {
        event.preventDefault();
        event.stopPropagation();

        history.push('/dataset');
    };

    useEffect(() => {
        dispatch(getApi());
    }, [dispatch]);

    useEffect(() => {
        // 스토어의 search 객체 변경 시 로컬 state에 셋팅
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        let apiCodeId = search.apiCodeId;
        if (apiRows.length > 0 && apiCodeId !== apiRows[0].dtlCd) {
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
        <Form className="mb-10">
            <Form.Row className="m-0 mb-2">
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
                        {defaultAutoCreateYn &&
                            defaultAutoCreateYn.map((autoCreateYn) => (
                                <option key={autoCreateYn.id} value={autoCreateYn.id}>
                                    {autoCreateYn.name}
                                </option>
                            ))}
                    </MokaInput>
                </Col>
            </Form.Row>
            <Form.Row className="m-0 mb-2">
                <Col xs={5} className="p-0 pr-2">
                    <MokaInput as="select" name="searchType" onChange={handleChangeSearchValue} value={search.searchType}>
                        {defaultSearchType &&
                            defaultSearchType.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                    </MokaInput>
                </Col>
                <Col xs={7} className="p-0">
                    <MokaSearchInput name="keyword" value={search.keyword} onChange={handleChangeSearchValue} onSearch={handleClickSearch} />
                </Col>
            </Form.Row>
            <div className="d-flex justify-content-end mb-2">
                <Button variant="dark" onClick={handleClickAddDataSet}>
                    데이터셋 추가
                </Button>
            </div>
        </Form>
    );
};

export default DatasetSearch;
