import React, { useEffect, useState } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { MokaInput, MokaSearchInput } from '@components';
import commonUtil from '@utils/commonUtil';
import produce from 'immer';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import toast from '@utils/toastUtil';

const SearchLogSearch = ({ searchOptions, onSearch, onReset }) => {
    const [dateType, setDateType] = useState('today');
    const [disabled, setDisabled] = useState({ date: true });
    //TODO: options default 정의 필요
    /**
     * {
     *     deviceType: '',
     *     startDt: new Date(),
     *     endDt: new Date(),
     *     keyword: ''
     * }
     */
    const [options, setOptions] = useState({});

    const handleChangeValue = (name, value) => {
        if (name === 'dateType') {
            setDateType(value);
        } else {
            setOptions(
                produce(options, (draft) => {
                    draft[name] = value;
                }),
            );
        }
    };

    const handleClickSearch = () => {
        toast.info(`검색 ${JSON.stringify(options)}`);
        if (onSearch instanceof Function) {
            onSearch(options);
        }
    };

    const handleClickReset = () => {
        toast.info('초기화');
        if (onReset instanceof Function) {
            onReset();
        }
    };

    useEffect(() => {
        if (dateType === 'direct') {
            setDisabled({ ...disabled, date: false });
        } else {
            const { startDt, endDt } = commonUtil.toRangeDateForDateType(dateType);
            commonUtil.validateForDateRange(startDt, endDt);
            setOptions({ ...options, startDt, endDt });
            setDisabled({ ...disabled, date: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateType]);

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
                        as="select"
                        name="deviceType"
                        onChange={(e) => {
                            const { name, value } = e.target;
                            handleChangeValue(name, value);
                        }}
                        value={options.deviceType}
                    >
                        <option value="">구분 전체</option>
                        <option value="pc">PC</option>
                        <option value="mobile">Mobile</option>
                    </MokaInput>
                </Col>
                <Col xs={3}>
                    <MokaInput
                        as="select"
                        name="dateType"
                        onChange={(e) => {
                            const { name, value } = e.target;
                            handleChangeValue(name, value);
                        }}
                        value={dateType}
                    >
                        <option value="today">오늘</option>
                        <option value="thisWeek">이번주</option>
                        <option value="thisMonth">이번달</option>
                        <option value="thisYear">올해</option>
                        <option value="direct">올해</option>
                    </MokaInput>
                </Col>
                <Col xs={3}>
                    <MokaInput
                        as="dateTimePicker"
                        className="mb-0"
                        name="startDt"
                        placeholder="YYYY-MM-DD"
                        inputProps={{ timeFormat: null, inputClassName: 'ft-12' }}
                        value={options.startDt}
                        disabled={disabled.date}
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
                        disabled={disabled.date}
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
            </Form.Row>
            <Form.Row className="mb-2">
                <Col xs={11}>
                    <MokaSearchInput
                        buttonClassName="ft-12"
                        inputClassName="ft-12"
                        name="keyword"
                        onChange={(e) => {
                            const { name, value } = e.target;
                            handleChangeValue(name, value);
                        }}
                        value={options.keyword}
                        onSearch={handleClickSearch}
                    />
                </Col>
                <Col xs={1} className="text-right">
                    <Button variant="negative" onClick={handleClickReset}>
                        초기화
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default SearchLogSearch;
