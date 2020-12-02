import React, { useCallback, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';

const GroupChildSearchMemberHeader = ({ onSearch, onClick }) => {
    const [values, setValues] = useState({ searchType: 'all', keyword: '' });

    const handleChangeValue = useCallback(
        ({ name, value }) => {
            setValues({ ...values, [name]: value });
        },
        [values],
    );

    const handleSearch = () => {
        onSearch(values);
    };

    return (
        <Form>
            <Form.Row style={{ marginLeft: 0, marginRight: 0 }}>
                <Col xs={3} className="p-0 pr-2">
                    <div className="mb-3 d-flex align-items-center">
                        <Button variant="dark" onClick={onClick}>
                            선택 추가
                        </Button>
                    </div>
                </Col>
                <Col xs={2} className="p-0">
                    <MokaInput
                        as="select"
                        name="searchType"
                        value={values.searchType}
                        onChange={(event) => {
                            handleChangeValue(event.target);
                        }}
                    >
                        <option value="all">선택</option>
                        <option value="memberId">ID</option>
                        <option value="memberNm">이름</option>
                    </MokaInput>
                </Col>
                <Col xs={7}>
                    <MokaSearchInput
                        name="keyword"
                        value={values.keyword}
                        onChange={(event) => {
                            handleChangeValue(event.target);
                        }}
                        onSearch={handleSearch}
                    />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default GroupChildSearchMemberHeader;
