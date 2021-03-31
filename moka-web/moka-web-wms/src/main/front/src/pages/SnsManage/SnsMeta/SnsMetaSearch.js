import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';
import toast from '@utils/toastUtil';
import commonUtil from '@utils/commonUtil';
import moment from 'moment';

const SnsMetaSearch = ({ searchOptions, onSearch, onReset }) => {
    const [dateType, setDateType] = useState('today');
    const [disabled, setDisabled] = useState({ date: false });
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
            console.log(options);
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
            setOptions({ ...options, startDt: moment(startDt), endDt: moment(endDt) });
            //setDisabled({ ...disabled, date: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateType]);

    useEffect(() => {
        if (!commonUtil.isEmpty(searchOptions)) {
            setOptions(searchOptions);
        }
    }, [searchOptions]);

    return (
        <Form className="mb-14">
            <Form.Row>
                <div style={{ width: 110 }} className="mr-2 flex-shrink-0">
                    <MokaInput
                        as="select"
                        value={dateType}
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
                        {/*<option value="direct">직접입력</option>*/}
                    </MokaInput>
                </div>
                <div style={{ width: 130 }} className="mr-2 flex-shrink-0">
                    <MokaInput
                        as="dateTimePicker"
                        className="mb-0"
                        name="startDt"
                        value={options.startDt}
                        onChange={(param) => {
                            handleChangeValue('startDt', param);
                        }}
                        inputProps={{ timeFormat: null }}
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
                            handleChangeValue('endDt', param);
                        }}
                        inputProps={{ timeFormat: null }}
                        disabled={disabled.date}
                    />
                </div>
                <div style={{ width: 85 }} className="mr-2 flex-shrink-0">
                    <MokaInput
                        as="select"
                        value={options.searchType}
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
                    className="mr-1 flex-fill"
                    onSearch={handleClickSearch}
                />
                {/* 초기화 버튼 */}
                <Button variant="negative" onClick={handleSearchReset} className="flex-shrink-0">
                    초기화
                </Button>
            </Form.Row>
        </Form>
    );
};

export default SnsMetaSearch;
