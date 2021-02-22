import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';
import { initialState } from '@store/special';
import { changeSearchOption, getSpecialList } from '@store/special';
import { getPt } from '@store/codeMgt';

const SpecialSearch = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const ptRows = useSelector((store) => store.codeMgt.ptRows);
    const storeSearch = useSelector((store) => store.special.search);
    const [search, setSearch] = useState(initialState.search);

    /**
     * input 변경
     * @param {object} e event
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
    };

    /**
     * 페이지등록 버튼
     */
    const handleClickAdd = () => {
        history.push(`${match.path}/add`);
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        dispatch(
            getSpecialList(
                changeSearchOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    };

    useEffect(() => {
        if (!ptRows) {
            dispatch(getPt());
        }
    }, [dispatch, ptRows]);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        dispatch(getSpecialList());
    }, [dispatch]);

    return (
        <Form.Row className="mb-14">
            <Col xs={12} className="p-0 d-flex">
                <div className="flex-shrink-0 mr-2">
                    <MokaInput as="select" name="pageCd" value={search.pageCd} onChange={handleChangeValue}>
                        <option value="all">페이지 코드 전체</option>
                        {ptRows &&
                            ptRows.map((cd) => (
                                <option key={cd.id} value={cd.id}>
                                    {cd.name}
                                </option>
                            ))}
                    </MokaInput>
                </div>

                <div className="flex-shrink-0 mr-2">
                    <MokaInput as="select" className="m-0" name="searchType" value={search.searchType} onChange={handleChangeValue}>
                        {initialState.searchTypeList.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </MokaInput>
                </div>

                <MokaSearchInput className="flex-fill mr-1" name="keyword" value={search.keyword} onChange={handleChangeValue} onSearch={handleSearch} />

                <Button variant="positive" className="flex-shrink-0" onClick={handleClickAdd}>
                    페이지 등록
                </Button>
            </Col>
        </Form.Row>
    );
};

export default SpecialSearch;
