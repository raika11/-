import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel, MokaInput, MokaSearchInput } from '@components';
import commonUtil from '@utils/commonUtil';
import toast from '@utils/toastUtil';
import { useDispatch } from 'react-redux';
import { changeSNSMetaSearchOptions, getSNSMetaList } from '@store/snsManage/snsAction';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';

const SnsMataSearch = ({ searchOptions }) => {
    const [dateType, setDateType] = useState('today');
    const [disabled, setDisabled] = useState({ date: true });
    const dateFormat = 'yyyy-MM-dd';

    // 에러 나서 수정 해놨습니다.
    // const today = commonUtil.dateFormat(new Date(), dateFormat);
    const today = new Date();

    //const [values, setValues] = useState({ dateType: 'today', startDt: today, endDt: today });
    const [options, setOptions] = useState(searchOptions);
    const dispatch = useDispatch();

    const handleSearchReset = () => {
        console.log('handleSearchReset');
    };

    const handleClickSearch = () => {
        dispatch(changeSNSMetaSearchOptions(options));
        /*dispatch(getSNSMetaList({ payload: options }));*/
    };

    const handleChangeValue = (name, value) => {
        console.log(value);
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
        setDisabled({ ...disabled, date: true });
        switch (value) {
            case 'today':
                startDt = today;
                break;
            case 'thisWeek':
                startDt = commonUtil.dateFormat(new Date(new Date().getTime() - new Date().getDay() * 24 * 60 * 60 * 1000), dateFormat);
                break;
            case 'thisMonth':
                startDt = commonUtil.dateFormat(new Date(new Date().setDate(1)), dateFormat);
                break;
            case 'direct':
                setDisabled({ ...disabled, date: false });
                break;
            default:
                break;
        }
        setDateType(value);
        setOptions({ ...options, startDt });
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
                        <option value="all">전체</option>
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

export default SnsMataSearch;
