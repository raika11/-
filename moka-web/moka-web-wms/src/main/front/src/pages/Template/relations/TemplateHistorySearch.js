import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaSearchInput, MokaInputLabel } from '@components';
import { changeSearchHistOption, getHistoryList } from '@store/template';

const defaultSearchType = [
    { id: 'all', name: '전체' },
    { id: 'regDt', name: '날짜' },
    { id: 'regId', name: '작업자' },
];

const TemplateHistorySearch = ({ show }) => {
    const dispatch = useDispatch();
    const { template, search } = useSelector(
        (store) => ({
            template: store.template.template,
            search: store.templateHistory.search,
        }),
        shallowEqual,
    );

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
        if (show && template.templateSeq) {
            dispatch(
                getHistoryList(
                    changeSearchHistOption({
                        ...search,
                        templateSeq: template.templateSeq,
                        page: 0,
                    }),
                ),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, template]);

    return (
        <Form>
            <Form.Row className="mb-2">
                <Col xs={4} className="p-0 pr-2">
                    <MokaInputLabel
                        label="구분"
                        as="select"
                        labelWidth={28}
                        className="mb-0"
                        value={search.searchType || undefined}
                        onChange={(e) => {
                            dispatch(
                                changeSearchHistOption({
                                    ...search,
                                    searchType: e.target.value,
                                }),
                            );
                        }}
                    >
                        {defaultSearchType.map((searchType) => (
                            <option value={searchType.id} key={searchType.id}>
                                {searchType.name}
                            </option>
                        ))}
                    </MokaInputLabel>
                </Col>
                <Col xs={8} className="p-0 mb-0">
                    <MokaSearchInput
                        value={search.keyword}
                        onChange={(e) => {
                            dispatch(
                                changeSearchHistOption({
                                    ...search,
                                    keyword: e.target.value,
                                }),
                            );
                        }}
                        onSearch={handleSearch}
                    />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default TemplateHistorySearch;
