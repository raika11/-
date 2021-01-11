import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';
import toast from '@utils/toastUtil';
import { useDispatch } from 'react-redux';
import { changeSnsMetaSearchOptions } from '@store/snsManage/snsAction';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { initialState } from '@store/snsManage/snsReducer';

const SnsMetaSearch = ({ searchOptions, onSearch, onReset }) => {
    const [dateType, setDateType] = useState('today');
    const [disabled, setDisabled] = useState({ date: true });
    const [options, setOptions] = useState(searchOptions);
    const dispatch = useDispatch();

    const handleSearchReset = () => {
        setDateType('today');
        setDisabled({ date: true });

        if (onReset instanceof Function) {
            onReset(setOptions);
        }
    };

    const handleClickSearch = () => {
        if (onSearch instanceof Function) {
            onSearch(options);
        }

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
                <div style={{ width: 110 }} className="mr-2 flex-shrink-0">
                    <MokaInput
                        as="select"
                        value={dateType}
                        className="ft-12"
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
                    </MokaInput>
                </div>
                <div style={{ width: 130 }} className="mr-2 flex-shrink-0">
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
                        inputProps={{ timeFormat: null, inputClassName: 'ft-12' }}
                        disabled={disabled.date}
                    />
                </div>
                <div style={{ width: 130 }} className="mr-2 flex-shrink-0">
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
                        inputProps={{ timeFormat: null, inputClassName: 'ft-12' }}
                        disabled={disabled.date}
                    />
                </div>
                <div style={{ width: 85 }} className="mr-2 flex-shrink-0">
                    <MokaInput
                        as="select"
                        value={options.searchType}
                        className="m-0 ft-12"
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
                </div>
                <MokaSearchInput
                    name="keyword"
                    value={options.keyword}
                    onChange={(event) => {
                        const {
                            target: { name, value },
                        } = event;
                        handleChangeValue(name, value);
                    }}
                    className="mr-2 flex-fill"
                    buttonClassName="ft-12"
                    inputClassName="ft-12"
                    onSearch={handleClickSearch}
                />
                {/* 초기화 버튼 */}
                <Button variant="negative" onClick={handleSearchReset} className="flex-shrink-0 ft-12">
                    초기화
                </Button>
            </Form.Row>
        </Form>
    );
};

export default SnsMetaSearch;
