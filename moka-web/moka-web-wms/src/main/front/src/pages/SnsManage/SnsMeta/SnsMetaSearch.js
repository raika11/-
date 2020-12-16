import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel, MokaInput, MokaSearchInput } from '@components';
import toast from '@utils/toastUtil';
import { useDispatch } from 'react-redux';
import { changeSnsMetaSearchOptions } from '@store/snsManage/snsAction';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { initialState } from '@store/snsManage/snsReducer';

const SnsMetaSearch = ({ searchOptions }) => {
    const [dateType, setDateType] = useState('today');
    const [disabled, setDisabled] = useState({ date: true });
    const [options, setOptions] = useState(searchOptions);
    const dispatch = useDispatch();

    const handleSearchReset = () => {
        setDateType('today');
        setDisabled({ date: true });
        setOptions(initialState.meta.search);
        dispatch(changeSnsMetaSearchOptions(initialState.meta.search));
    };

    const handleClickSearch = () => {
        dispatch(changeSnsMetaSearchOptions(options));
        /*dispatch(getSNSMetaList({ payload: options }));*/
    };

    const handleChangeValue = (name, value) => {
        if (name === 'startDt') {
            const startDt = new Date(value);
            const endDt = new Date(options.endDt);

            if (startDt > endDt) {
                toast.warning('시작일은 종료일 보다 클 수 없습니다.');
                return;
            }
        } else if (name === 'endDt') {
            const startDt = new Date(options.startDt);
            const endDt = new Date(value);

            if (endDt < startDt) {
                toast.warning('종료일은 시작일 보다 작을 수 없습니다.');
                return;
            }
        }

        setOptions({ ...options, [name]: value });
    };

    const handleChangeDateType = (name, value) => {
        let startDt = options.startDt;
        let endDt = moment().format(DB_DATEFORMAT);
        setDisabled({ ...disabled, date: true });
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
                setDisabled({ ...disabled, date: false });
                break;
            default:
                break;
        }
        setDateType(value);
        setOptions({ ...options, startDt, endDt });
    };

    return (
        <Form>
            <Form.Row className="mb-3">
                <Col xs={2} className="p-0 pr-2">
                    <MokaInputLabel
                        label="날짜"
                        labelWidth={56}
                        as="select"
                        value={dateType}
                        className="m-0"
                        name="dateType"
                        onChange={(event) => {
                            const {
                                target: { name, value },
                            } = event;
                            handleChangeDateType(name, value);
                        }}
                    >
                        <option value="today">오늘</option>
                        <option value="thisWeek">이번주</option>
                        <option value="thisMonth">이번달</option>
                        <option value="direct">직접입력</option>
                    </MokaInputLabel>
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput
                        as="dateTimePicker"
                        className="mb-0"
                        name="startDt"
                        value={options.startDt}
                        onChange={(param) => {
                            const selectDate = param._d;
                            const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                            handleChangeValue('startDt', date);
                        }}
                        inputProps={{ timeFormat: null }}
                        disabled={disabled.date}
                    />
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput
                        as="dateTimePicker"
                        className="mb-0"
                        name="endDt"
                        value={options.endDt}
                        onChange={(param) => {
                            const selectDate = param._d;
                            const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 23, 59, 59)).format(DB_DATEFORMAT);
                            handleChangeValue('endDt', date);
                        }}
                        inputProps={{ timeFormat: null }}
                        disabled={disabled.date}
                    />
                </Col>
                <Col xs={1} className="p-0 pr-2">
                    <MokaInput
                        as="select"
                        value={options.searchType}
                        className="m-0"
                        name="searchType"
                        onChange={(event) => {
                            const {
                                target: { name, value },
                            } = event;
                            handleChangeValue(name, value);
                        }}
                    >
                        <option value="artTitle">제목</option>
                        <option value="totalId">기사ID</option>
                    </MokaInput>
                </Col>
                <Col xs={4} className="p-0 pr-2">
                    <MokaSearchInput
                        name="keyword"
                        value={options.keyword}
                        onChange={(event) => {
                            const {
                                target: { name, value },
                            } = event;
                            handleChangeValue(name, value);
                        }}
                        onSearch={handleClickSearch}
                    />
                </Col>
                {/* 초기화 버튼 */}
                <Col xs={1} className="p-0">
                    <Button variant="negative" onClick={handleSearchReset}>
                        초기화
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default SnsMetaSearch;
