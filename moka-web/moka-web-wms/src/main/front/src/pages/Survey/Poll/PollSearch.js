import React, { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaInput, MokaSearchInput } from '@components';
import Button from 'react-bootstrap/Button';
import commonUtil from '@utils/commonUtil';
import produce from 'immer';
import { initialState } from '@store/survey/poll/pollReducer';
import { AuthButton } from '@pages/Auth/AuthButton';

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
        <Form className="mb-14">
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
                        <option key="0" value="">
                            그룹 전체
                        </option>
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
                        className="mb-0 is-not-position-center"
                        name="startDt"
                        value={options.startDt}
                        onChange={(param) => {
                            handleChangeValue('startDt', param);
                        }}
                        inputProps={{ timeFormat: null, timeDefault: 'start' }}
                    />
                </Col>
                <Col xs={3} className="p-0 pr-2">
                    <MokaInput
                        as="dateTimePicker"
                        className="mb-0 is-not-position-center right"
                        name="endDt"
                        value={options.endDt}
                        onChange={(param) => {
                            handleChangeValue('endDt', param);
                        }}
                        closeOnSelect={true}
                        inputProps={{ timeFormat: null, timeDefault: 'end' }}
                    />
                </Col>
            </Form.Row>
            <Form.Row className="justify-content-between">
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
                        <Col xs={7} className="p-0 mr-1">
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
                            <Button variant="negative h-100" onClick={handleClickReset}>
                                초기화
                            </Button>
                        </Col>
                    </Form.Row>
                </Col>
                <Col xs={2} className="p-0  pr-2 text-right">
                    <AuthButton variant="positive h-100" onClick={onAdd}>
                        등록
                    </AuthButton>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default PollSearch;
