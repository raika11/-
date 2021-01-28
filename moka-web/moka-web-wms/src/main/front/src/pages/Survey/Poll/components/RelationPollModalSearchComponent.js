import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaSearchInput } from '@components';
import produce from 'immer';

const RelationPollModalSearchComponent = ({ searchOptions, onSearch }) => {
    const [search, setSearch] = useState(searchOptions);

    const handleChangeValue = (name, value) => {
        setSearch(
            produce(search, (draft) => {
                draft[name] = value;
            }),
        );
    };

    const handleClickSearch = () => {
        onSearch(search);
    };

    return (
        <>
            <Form.Row style={{ border: '1px solid #ddd' }} className="p-2 mb-2">
                <Col xs={4} className="d-flex align-items-center">
                    <MokaInput
                        as="select"
                        name="searchType"
                        value={search.searchType}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            handleChangeValue(name, value);
                        }}
                    >
                        <option value="">분류</option>
                        <option value="title">투표 제목</option>
                        <option value="itemTitle">투표 보기</option>
                        <option value="pollSeq">투표 ID</option>
                    </MokaInput>
                </Col>
                <Col xs={8} className="d-flex align-items-center">
                    <MokaSearchInput
                        className="flex-fill"
                        name="keyword"
                        value={search.keyword}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            handleChangeValue(name, value);
                        }}
                        onSearch={handleClickSearch}
                    />
                </Col>
            </Form.Row>
        </>
    );
};

export default RelationPollModalSearchComponent;
