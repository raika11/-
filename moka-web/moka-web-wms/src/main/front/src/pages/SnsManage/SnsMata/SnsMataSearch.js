import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel, MokaInput, MokaSearchInput } from '@components';

const SnsMataSearch = () => {
    const handleSearchReset = () => {
        console.log('handleSearchReset');
    };

    const handleChangeValue = () => {
        console.log('handleChangeValue');
    };

    const handleChangeDate = () => {
        console.log('handleChangeDate');
    };

    return (
        <Form>
            <Form.Row className="mb-3">
                <Col xs={2} className="p-0 pr-2">
                    <MokaInputLabel label="날짜" labelWidth={56} as="select" value="tempvalue1" className="m-0" name="tag" onChange={handleChangeValue}>
                        <option value="tempvalue1">오늘</option>
                        <option value="tempvalue2">이번주</option>
                        <option value="tempvalue3">이번달</option>
                        <option value="tempvalue4">직접입력</option>
                    </MokaInputLabel>
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="dateTimePicker" className="mb-0" name="viewSDate" value={null} onChange={handleChangeDate} inputProps={{ timeFormat: null }} disabled={null} />
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput as="dateTimePicker" className="mb-0" name="viewEDate" value={null} onChange={handleChangeDate} inputProps={{ timeFormat: null }} disabled={null} />
                </Col>
                <Col xs={1} className="p-0 pr-2">
                    <MokaInput as="select" value="title1" className="m-0" name="type" onChange={handleChangeValue}>
                        <option value="title1">제목</option>
                        <option value="title2">기사ID</option>
                    </MokaInput>
                </Col>
                <Col xs={4} className="p-0 pr-2">
                    <MokaSearchInput name="keyword" value={''} onChange={handleChangeValue} onSearch={handleChangeValue} />
                </Col>
                {/* 초기화 버튼 */}
                <Col xs={1} className="p-0">
                    <Button variant="outline-neutral" onClick={handleSearchReset}>
                        초기화
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default SnsMataSearch;
