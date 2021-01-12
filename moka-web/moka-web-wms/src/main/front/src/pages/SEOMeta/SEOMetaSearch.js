import React, { useEffect, useState } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { MokaInput, MokaSearchInput } from '@components';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import produce from 'immer';
import commonUtil from '@utils/commonUtil';

const SEOMetaSearch = ({ searchOptions, onSearch, onReset }) => {
    const [dateType, setDateType] = useState('today');
    const [options, setOptions] = useState({});
    const [disabled, setDisabled] = useState({ date: true });

    const handleChangeDateType = (name, value) => {
        let startDt = options.startDt;
        let endDt = moment().format(DB_DATEFORMAT);
        let disable = true;

        switch (value) {
            case 'today':
                startDt = moment().format(DB_DATEFORMAT);
                break;
            case 'thisWeek':
                startDt = moment(new Date(new Date().getTime() - new Date().getDay() * 24 * 60 * 60 * 1000)).format(DB_DATEFORMAT);
                break;
            case 'thisMonth':
                startDt = moment(new Date(new Date().setDate(1))).format(DB_DATEFORMAT);
                break;
            case 'direct':
                disable = false;
                break;
            default:
                break;
        }

        setDateType(value);
        setDisabled({ ...disabled, date: disable });
        setOptions({ ...options, startDt, endDt });
    };

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
        if (onSearch instanceof Function) {
            onSearch(options);
        }
    };

    const handleClickReset = () => {
        setDateType('today');
        if (onReset instanceof Function) {
            onReset(setOptions);
        }
    };

    useEffect(() => {
        if (!commonUtil.isEmpty(searchOptions)) {
            setOptions(searchOptions);
        }
    }, [searchOptions]);

    useEffect(() => {
        if (dateType === 'direct') {
            setDisabled({ ...disabled, date: false });
        } else {
            const { startDt, endDt } = commonUtil.toRangeDateForDateType(dateType);
            setOptions({ ...options, startDt, endDt });
            setDisabled({ ...disabled, date: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateType]);

    return (
        <Form className="pb-2">
            <Form.Row className="mb-2">
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput
                        as="select"
                        name="dateType"
                        onChange={(e) => {
                            const { name, value } = e.target;
                            //handleChangeDateType(name, value);
                            handleChangeValue(name, value);
                        }}
                        value={dateType}
                    >
                        <option value="today">오늘</option>
                        <option value="thisWeek">이번주</option>
                        <option value="thisMonth">이번달</option>
                        <option value="direct">직접입력</option>
                    </MokaInput>
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput
                        as="dateTimePicker"
                        className="mb-0"
                        name="startDt"
                        placeholder="YYYY-MM-DD"
                        inputProps={{ timeFormat: null, inputClassName: 'ft-12' }}
                        value={options.startDt}
                        disabled={disabled.date}
                    />
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput
                        as="dateTimePicker"
                        className="mb-0"
                        name="endDt"
                        placeholder="YYYY-MM-DD"
                        inputProps={{ timeFormat: null, inputClassName: 'ft-12' }}
                        value={options.endDt}
                        disabled={disabled.date}
                    />
                </Col>
                <Col xs={1} className="p-0 pr-2">
                    <MokaInput
                        as="select"
                        name="searchType"
                        value={options.searchType}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            handleChangeValue(name, value);
                        }}
                    >
                        <option value="artTitle">제목</option>
                        <option value="totalId">기사ID</option>
                    </MokaInput>
                </Col>
                <Col xs={4} className="p-0 pr-2">
                    <MokaSearchInput
                        buttonClassName="ft-12"
                        inputClassName="ft-12"
                        name="keyword"
                        value={options.keyword}
                        onChange={(e) => {
                            const { name, value } = e.target;
                            handleChangeValue(name, value);
                        }}
                        onSearch={handleClickSearch}
                    />
                </Col>
                <Col xs={1} className="p-0">
                    <Button variant="negative" onClick={handleClickReset}>
                        초기화
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default SEOMetaSearch;
