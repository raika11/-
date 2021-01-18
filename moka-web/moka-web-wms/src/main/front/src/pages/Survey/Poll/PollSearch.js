import React, { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import Button from 'react-bootstrap/Button';
import commonUtil from '@utils/commonUtil';
import produce from 'immer';

const PollSearch = ({ searchOptions, codes, onSearch, onAdd }) => {
    const [options, setOptions] = useState({});
    const handleChangeValue = ({ target: { name, value } }) => {
        setOptions(
            produce(options, (draft) => {
                draft[name] = value;
            }),
        );
    };

    useEffect(() => {
        if (!commonUtil.isEmpty(searchOptions)) {
            setOptions(searchOptions);
        }
    }, [searchOptions]);

    return (
        <Form className="pb-2">
            <Form.Row className="mb-2">
                <Col xs={2} className="p-0 pr-2">
                    <MokaInputLabel name="group" label="그룹" as="select" labelWidth={25} onChange={handleChangeValue} value={options.group}>
                        {codes.group.map((option) => (
                            <option key={option.key} value={option.key}>
                                {option.value}
                            </option>
                        ))}
                    </MokaInputLabel>
                </Col>
                <Col xs={3} className="p-0 pr-2">
                    <MokaInputLabel name="status" label="투표 상태" as="select" labelWidth={55} onChange={handleChangeValue} value={options.status}>
                        <option key="0" value="0"></option>
                        {codes.status.map((option) => (
                            <option key={option.key} value={option.key}>
                                {option.value}
                            </option>
                        ))}
                    </MokaInputLabel>
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInputLabel name="section" label="분류" as="select" labelWidth={25} onChange={handleChangeValue} value={options.section}>
                        <option key="0" value="0"></option>
                        {codes.category.map((option) => (
                            <option key={option.key} value={option.key}>
                                {option.value}
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
            <Form.Row className="justify-content-between mb-2">
                <Col xs={7}>
                    <Form.Row>
                        <Col xs={3} className="p-0 pr-2">
                            <MokaInput as="select" name="searchType" value={options.searchType} onChange={handleChangeValue}>
                                <option value="1">투표 ID</option>
                                <option value="2">투표 제목</option>
                                <option value="3">투표 답변</option>
                            </MokaInput>
                        </Col>
                        <Col xs={7} className="p-0 pr-2">
                            <MokaSearchInput name="keyword" value={options.keyword} onChange={handleChangeValue} />
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
