import React, { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaInput, MokaInputLabel, MokaSearchInput } from '@components';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import Button from 'react-bootstrap/Button';
import commonUtil from '@utils/commonUtil';
import produce from 'immer';
import { initialState } from '@store/survey/poll/pollReducer';

const PollSearch = ({ searchOptions, codes, onSearch, onAdd }) => {
    const [options, setOptions] = useState(initialState.search);
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
                    <MokaInput name="group" as="select" labelWidth={25} onChange={handleChangeValue} value={options.group}>
                        {codes.group.map((option) => (
                            <option key={option.key} value={option.key}>
                                {option.value}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput name="status" as="select" labelWidth={55} onChange={handleChangeValue} value={options.status}>
                        <option key="0" value="">
                            상태 전체
                        </option>
                        {codes.status.map((option) => (
                            <option key={option.key} value={option.key}>
                                {option.value}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput name="section" as="select" labelWidth={25} onChange={handleChangeValue} value={options.section}>
                        <option key="0" value="">
                            분류 전체
                        </option>
                        {codes.category.map((option) => (
                            <option key={option.key} value={option.key}>
                                {option.value}
                            </option>
                        ))}
                    </MokaInput>
                </Col>

                <Col xs={3} className="p-0  pr-2">
                    <MokaInput
                        labelWidth={57}
                        labelClassName="text-right"
                        as="dateTimePicker"
                        className="mb-0"
                        name="startDt"
                        onChange={(param) => {
                            let selectDate = param._d;
                            if (selectDate) {
                                selectDate = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                            }
                            //handleChangeValue('startDt', date);
                        }}
                        inputProps={{ timeFormat: null }}
                    />
                </Col>
                <Col xs={3} className="p-0 pr-2">
                    <MokaInput
                        as="dateTimePicker"
                        className="mb-0"
                        name="endDt"
                        onChange={(param) => {
                            const selectDate = param._d;
                            console.log(param._d);
                            const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                            //handleChangeValue('startDt', date);
                        }}
                        inputProps={{ timeFormat: null }}
                    />
                </Col>
            </Form.Row>
            <Form.Row className="justify-content-between mb-2">
                <Col xs={7} className="p-0">
                    <Form.Row>
                        <Col xs={2} className="p-0 pr-2">
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
