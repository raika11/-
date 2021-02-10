import React, { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaInput, MokaSearchInput } from '@components';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import Button from 'react-bootstrap/Button';
import commonUtil from '@utils/commonUtil';
import produce from 'immer';
import { initialState } from '@store/survey/poll/pollReducer';

const PollSearch = ({ searchOptions, codes, onSearch, onAdd, onReset }) => {
    const [options, setOptions] = useState(initialState.search);
    const handleChangeValue = (name, value) => {
        setOptions(
            produce(options, (draft) => {
                draft[name] = value;
            }),
        );
    };

    const handleClickSearch = () => {
        if (onSearch instanceof Function) {
            onSearch(
                produce(options, (draft) => {
                    draft['page'] = 0;
                }),
            );
        }
    };

    const handleClickReset = () => {
        if (onReset instanceof Function) {
            onReset(setOptions);
        }
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
                    <MokaInput
                        name="pollGroup"
                        as="select"
                        onChange={(e) => {
                            const { name, value } = e.target;
                            handleChangeValue(name, value);
                        }}
                        value={options.pollGroup}
                    >
                        {codes.pollGroup.map((option) => (
                            <option key={option.key} value={option.key}>
                                {option.value}
                            </option>
                        ))}
                    </MokaInput>
                </Col>
                <Col xs={2} className="p-0 pr-2">
                    <MokaInput
                        name="status"
                        as="select"
                        onChange={(e) => {
                            const { name, value } = e.target;
                            handleChangeValue(name, value);
                        }}
                        value={options.status}
                    >
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
                    <MokaInput
                        name="pollCategory"
                        as="select"
                        onChange={(e) => {
                            const { name, value } = e.target;
                            handleChangeValue(name, value);
                        }}
                        value={options.pollCategory}
                    >
                        <option key="0" value="">
                            분류 전체
                        </option>
                        {codes.pollCategory.map((option) => (
                            <option key={option.key} value={option.key}>
                                {option.value}
                            </option>
                        ))}
                    </MokaInput>
                </Col>

                <Col xs={3} className="p-0  pr-2">
                    <MokaInput
                        as="dateTimePicker"
                        className="mb-0"
                        name="startDt"
                        value={options.startDt}
                        onChange={(param) => {
                            let selectDate = param._d;
                            if (selectDate) {
                                selectDate = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                            }
                            handleChangeValue('startDt', selectDate);
                        }}
                        inputProps={{ timeFormat: null }}
                    />
                </Col>
                <Col xs={3} className="p-0 pr-2">
                    <MokaInput
                        as="dateTimePicker"
                        className="mb-0"
                        name="endDt"
                        value={options.endDt}
                        onChange={(param) => {
                            let selectDate = param._d;
                            if (selectDate) {
                                selectDate = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                            }
                            handleChangeValue('endDt', selectDate);
                        }}
                        inputProps={{ timeFormat: null }}
                    />
                </Col>
            </Form.Row>
            <Form.Row className="justify-content-between mb-2">
                <Col xs={8} className="p-0">
                    <Form.Row>
                        <Col xs={3} className="p-0 pr-2">
                            <MokaInput
                                as="select"
                                name="searchType"
                                value={options.searchType}
                                onChange={(e) => {
                                    const { name, value } = e.target;
                                    handleChangeValue(name, value);
                                }}
                            >
                                <option value="title">투표 제목</option>
                                <option value="itemTitle">투표 보기</option>
                                <option value="pollSeq">투표 ID</option>
                            </MokaInput>
                        </Col>
                        <Col xs={7} className="p-0 pr-2">
                            <MokaSearchInput
                                name="keyword"
                                value={options.keyword}
                                onChange={(e) => {
                                    const { name, value } = e.target;
                                    handleChangeValue(name, value);
                                }}
                                onSearch={handleClickSearch}
                            />
                        </Col>
                        <Col xs={2} className="p-0">
                            <Button variant="negative" onClick={handleClickReset}>
                                초기화
                            </Button>
                        </Col>
                    </Form.Row>
                </Col>
                <Col xs={2} className="p-0  pr-2 text-right">
                    <Button variant="positive" onClick={onAdd}>
                        등록
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default PollSearch;
