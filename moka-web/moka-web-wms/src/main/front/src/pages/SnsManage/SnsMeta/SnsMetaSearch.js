import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';
import toast from '@utils/toastUtil';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import commonUtil from '@utils/commonUtil';

const SnsMetaSearch = ({ searchOptions, onSearch, onReset }) => {
    const [dateType, setDateType] = useState('today');
    const [disabled, setDisabled] = useState({ date: true });
    const [options, setOptions] = useState(searchOptions);

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
        if (name === 'dateType') {
            setDateType(value);
        } else {
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
        }
    };

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

    useEffect(() => {
        if (!commonUtil.isEmpty(searchOptions)) {
            setOptions(searchOptions);
        }
    }, [searchOptions]);

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
                            handleChangeValue(name, value);
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
