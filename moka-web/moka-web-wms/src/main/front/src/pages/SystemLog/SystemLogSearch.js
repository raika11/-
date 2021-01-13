import React, { useEffect, useState } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { MokaInput, MokaSearchInput } from '@components';
import commonUtil from '@utils/commonUtil';
import produce from 'immer';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';

const SystemLogSearch = ({ searchOptions }) => {
    const [options, setOptions] = useState({});

    const handleChangeValue = (name, value) => {
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
                <Col xs={3}>
                    <MokaInput
                        as="dateTimePicker"
                        className="mb-0"
                        name="startDt"
                        placeholder="YYYY-MM-DD"
                        inputProps={{ timeFormat: null, inputClassName: 'ft-12' }}
                        value={options.startDt}
                        onChange={(param) => {
                            const selectDate = param._d;
                            const date = moment()
                                .set('year', selectDate.getFullYear())
                                .set('month', selectDate.getMonth())
                                .set('date', selectDate.getDate())
                                .set('hour', 0)
                                .set('minute', 0)
                                .set('seconds', 0)
                                .format(DB_DATEFORMAT);
                            handleChangeValue('startDt', date);
                        }}
                    />
                </Col>
                <Col xs={3}>
                    <MokaInput
                        as="dateTimePicker"
                        className="mb-0"
                        name="endDt"
                        placeholder="YYYY-MM-DD"
                        inputProps={{ timeFormat: null, inputClassName: 'ft-12' }}
                        value={options.endDt}
                        onChange={(param) => {
                            const selectDate = param._d;
                            const date = moment()
                                .set('year', selectDate.getFullYear())
                                .set('month', selectDate.getMonth())
                                .set('date', selectDate.getDate())
                                .set('hour', 23)
                                .set('minute', 59)
                                .set('seconds', 59)
                                .format(DB_DATEFORMAT);
                            handleChangeValue('endDt', date);
                        }}
                    />
                </Col>
                <Col xs={3}>
                    <MokaInput
                        as="select"
                        name="successYn"
                        value={options.successYn}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            handleChangeValue(name, value);
                        }}
                    >
                        <option value="">성공 여부</option>
                        <option value="Y">성공</option>
                        <option value="N">실패</option>
                    </MokaInput>
                </Col>
                <Col xs={3}>
                    <Button variant="negative">초기화</Button>
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col xs={2}>
                    <MokaInput
                        as="select"
                        name="searchType"
                        value={options.searchType}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            handleChangeValue(name, value);
                        }}
                    >
                        <option value="">전체</option>
                        <option value="memId">사용자ID</option>
                        <option value="regIp">사용자IP</option>
                        <option value="menuName">메뉴명</option>
                    </MokaInput>
                </Col>
                <Col xs={8} className="ml-0">
                    <MokaSearchInput
                        name="keyword"
                        value={options.keyword}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            handleChangeValue(name, value);
                        }}
                    />
                </Col>
            </Form.Row>
        </Form>
    );
};

export default SystemLogSearch;
