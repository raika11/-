import React, { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import Button from 'react-bootstrap/Button';

const vote = {
    groups: [
        { key: '1', value: '관리자' },
        { key: '2', value: '자동차' },
        { key: '3', value: '중국연구소' },
        { key: '4', value: '디지털썰전' },
        { key: '5', value: '강남통신' },
        { key: '6', value: 'JES_골든' },
        { key: '7', value: '헬스케어' },
        { key: '8', value: '일간' },
        { key: '9', value: '포탈 life' },
        { key: '10', value: '마프' },
        { key: '11', value: '매거진' },
        { key: '12', value: 'Mr.alfflxjfl' },
        { key: '13', value: '헬스-정신건강' },
        { key: '14', value: '조인스2006' },
        { key: '15', value: '중앙일보' },
        { key: '16', value: '시민마이크' },
        { key: '17', value: '포털news' },
    ],
    statuses: [
        { key: '0', value: '' },
        { key: '1', value: '종료' },
        { key: '2', value: '서비스중' },
        { key: '3', value: '일시중지' },
    ],
    sections: [
        { key: '0', value: '' },
        { key: '1', value: '정치' },
        { key: '2', value: '사회/경제' },
        { key: '3', value: '문화/방송연예' },
        { key: '4', value: '국제' },
        { key: '5', value: '스포츠' },
        { key: '6', value: '기타' },
        { key: '7', value: '자동차' },
        { key: '8', value: '건강' },
        { key: '9', value: '인물' },
        { key: '10', value: '중국연구소' },
        { key: '11', value: 'Life' },
    ],
};

const PollSearch = ({ searchOptions, onChange, onAdd }) => {
    const handleChangeValue = ({ target: { name, value } }) => {
        onChange({ ...searchOptions, [name]: value });
        console.log({ name, value });
    };

    return (
        <Form className="pb-2">
            <Form.Row>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInputLabel name="group" label="그룹" as="select" labelWidth={25} onChange={handleChangeValue} value={searchOptions.group}>
                        {vote.groups.map((group) => (
                            <option key={group.key} value={group.key}>
                                {group.value}
                            </option>
                        ))}
                    </MokaInputLabel>
                </Col>
                <Col xs={3} className="p-0 pr-2">
                    <MokaInputLabel name="status" label="투표 상태" as="select" labelWidth={55} onChange={handleChangeValue} value={searchOptions.status}>
                        {vote.statuses.map((status) => (
                            <option key={status.key} value={status.key}>
                                {status.value}
                            </option>
                        ))}
                    </MokaInputLabel>
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInputLabel name="section" label="분류" as="select" labelWidth={25} onChange={handleChangeValue} value={searchOptions.section}>
                        {vote.sections.map((section) => (
                            <option key={section.key} value={section.key}>
                                {section.value}
                            </option>
                        ))}
                    </MokaInputLabel>
                </Col>

                <Col xs={3} className="p-0 pr-2">
                    <MokaInputLabel
                        label="기간"
                        labelWidth={57}
                        labelClassName="text-right"
                        as="dateTimePicker"
                        className="mb-0"
                        name="startDt"
                        onChange={(param) => {
                            const selectDate = param._d;
                            const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                            //handleChangeValue('startDt', date);
                        }}
                        inputProps={{ timeFormat: null }}
                    />
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput
                        as="dateTimePicker"
                        className="mb-0"
                        name="endDt"
                        onChange={(param) => {
                            const selectDate = param._d;
                            const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                            //handleChangeValue('startDt', date);
                        }}
                        inputProps={{ timeFormat: null }}
                    />
                </Col>
            </Form.Row>
            <Form.Row className="justify-content-between">
                <Col xs={7}>
                    <Form.Row>
                        <Col xs={3} className="p-0 pr-2">
                            <MokaInput as="select" name="searchType" value={searchOptions.searchType} onChange={handleChangeValue}>
                                <option value="1">투표 ID</option>
                                <option value="2">투표 제목</option>
                                <option value="3">투표 답변</option>
                            </MokaInput>
                        </Col>
                        <Col xs={7} className="p-0 pr-2">
                            <MokaSearchInput name="keyword" value={searchOptions.keyword} onChange={handleChangeValue} />
                        </Col>
                        <Col xs={1} className="p-0">
                            <Button variant="negative">초기화</Button>
                        </Col>
                    </Form.Row>
                </Col>
                <Col xs={5} className="p-0  pr-2 text-right">
                    <Button variant="positive" onClick={onAdd}>
                        투표 등록
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default PollSearch;
