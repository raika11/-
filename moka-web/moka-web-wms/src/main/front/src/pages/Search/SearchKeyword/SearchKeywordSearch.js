import React, { useEffect, useState } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { MokaInput, MokaSearchInput } from '@components';
import commonUtil from '@utils/commonUtil';
import toast from '@utils/toastUtil';

moment.locale('ko');

/**
 * 검색 로그 검색
 */
const SearchKeywordSearch = ({ match }) => {
    const [dateType, setDateType] = useState('today');
    const [disabled, setDisabled] = useState({ date: true });
    const [search, setSearch] = useState({});

    const handleChangeValue = (name, value) => {
        if (name === 'dateType') {
            setDateType(value);
        } else {
            setSearch({ ...search, [name]: value });
        }
    };

    const handleClickSearch = () => {
        // toast.info(`검색 ${JSON.stringify(options)}`);
        // if (onSearch instanceof Function) {
        //     onSearch(options);
        // }
    };

    const handleClickReset = () => {
        // toast.info('초기화');
        // if (onReset instanceof Function) {
        //     onReset();
        // }
    };

    useEffect(() => {
        if (dateType === 'direct') {
            setDisabled({ ...disabled, date: false });
        } else {
            const { startDt, endDt } = commonUtil.toRangeDateForDateType(dateType);
            commonUtil.validateForDateRange(startDt, endDt);
            // setOptions({ ...options, startDt, endDt });
            setDisabled({ ...disabled, date: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateType]);

    return (
        <Form className="mb-2">
            <Form.Row className="mb-2">
                <Col xs={3} className="p-0">
                    <MokaInput as="select" name="deviceType" className="mr-2" onChange={handleChangeValue} value={search.deviceType}>
                        <option value="">구분 전체</option>
                        <option value="pc">PC</option>
                        <option value="mobile">Mobile</option>
                    </MokaInput>
                    <MokaInput as="select" name="dateType" onChange={handleChangeValue} value={dateType}>
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
                        className="mr-1"
                        name="startDt"
                        inputProps={{ timeFormat: null }}
                        value={search.startDt}
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
                    <MokaInput
                        as="dateTimePicker"
                        className="ml-1"
                        name="endDt"
                        inputProps={{ timeFormat: null }}
                        value={search.endDt}
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
            <Form.Row>
                {/* <Col xs={11}>
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
                </Col> */}
            </Form.Row>
        </Form>
    );
};

export default SearchKeywordSearch;
