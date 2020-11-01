import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaSearchInput, MokaInputLabel } from '@components';
import { changeSearchHistOption, getHistoryList, historyState } from '@store/page';

const defaultSearchType = [
    { id: 'all', name: '전체' },
    { id: 'regDt', name: '날짜' },
    { id: 'regId', name: '작업자' },
];

const PageHistorySearch = ({ show }) => {
    const dispatch = useDispatch();
    const { page, search: storeSearch } = useSelector(
        (store) => ({
            page: store.page.page,
            search: store.pageHistory.search,
        }),
        shallowEqual,
    );
    const [search, setSearch] = useState(historyState.search);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    /**
     * 검색 버튼
     */
    const handleSearch = () => {
        dispatch(
            getHistoryList(
                changeSearchHistOption({
                    ...search,
                    page: 0,
                }),
            ),
        );
    };

    useEffect(() => {
        if (show && page.pageSeq) {
            dispatch(
                getHistoryList(
                    changeSearchHistOption({
                        ...search,
                        pageSeq: page.pageSeq,
                        page: 0,
                    }),
                ),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, page]);

    return (
        <Form>
            <Form.Group as={Row}>
                <Form.Label column xs={1} className="px-0">
                    구분
                </Form.Label>
                <Col xs={3} className="px-0 pl-3">
                    <Form.Control as="select" custom>
                        <option>전체</option>
                    </Form.Control>
                </Col>
                <Col xs={8} className="px-0 pl-2">
                    <MokaSearchInput />
                </Col>
            </Form.Group>
        </Form>
    );
};

export default PageHistorySearch;
