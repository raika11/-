import React, { useState } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { MokaLoader, MokaCard } from '@components';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import { selectItem } from '@pages/Boards/BoardConst';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';

const SearchBox = (props) => {
    const tempEvent = (e) => {};

    return (
        <Form>
            <Form.Row className="d-flex mb-3">
                <Col xs={2.5}>
                    <MokaInput
                        as="dateTimePicker"
                        className="mb-0"
                        name="startDt"
                        id="startDt"
                        value={null}
                        // onChange={(e) => handleDateChange('startDt', e)}
                        onChange={(param) => {
                            const selectDate = param._d;
                            const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                            tempEvent(date);
                        }}
                        inputProps={{ timeFormat: null }}
                    />
                </Col>
                <Col xs={2.5}>
                    <MokaInput
                        as="dateTimePicker"
                        className="mb-0"
                        name="endDt"
                        id="endDt"
                        value={null}
                        onChange={(param) => {
                            const selectDate = param._d;
                            const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                            tempEvent(date);
                        }}
                        inputProps={{ timeFormat: null }}
                    />
                </Col>
                <Col xs={2}>
                    <MokaInput as="select" name="searchType" id="searchType" value={null} onChange={(e) => tempEvent(e)}>
                        {selectItem.usedYn.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col>
                    <MokaInput placeholder={'말머리1'} value={null} onChange={() => tempEvent()}></MokaInput>
                </Col>
                <Col>
                    <Button variant="outline-neutral" onClick={() => tempEvent()}>
                        초기화
                    </Button>
                </Col>
            </Form.Row>
            <Form.Row className="d-flex mb-3">
                <Col xs={2}>
                    <MokaInput as="select" name="searchType" id="searchType" value={null} onChange={(e) => tempEvent(e)}>
                        {selectItem.channelType.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col xs={9} className="p-0">
                    <MokaSearchInput name="keyword" placeholder={'제목, 내용, 등록자 명'} value={null} onChange={() => tempEvent()} onSearch={() => tempEvent()} />
                </Col>
                <Col xs={1}>
                    <Button variant="positive" onClick={() => tempEvent()}>
                        등록
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default SearchBox;
