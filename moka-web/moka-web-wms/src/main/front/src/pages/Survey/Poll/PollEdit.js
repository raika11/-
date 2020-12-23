import React, { useState } from 'react';
import { MokaCard, MokaInput, MokaInputLabel } from '@components';
import { Form, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { codes } from '@pages/Survey/Poll/PollAgGridColumns';
import { initialState } from '@store/survey/poll/pollReducer';

const PollEdit = () => {
    const [edit, setEdit] = useState(initialState.poll);
    const handleChangeValue = (name, value) => {
        console.log(name);
        console.log(value);
        setEdit({ ...edit, [name]: value });
    };

    return (
        <MokaCard
            title="투표 등록"
            className="flex-fill"
            footer
            footerClassName="justify-content-center"
            footerButtons={[
                { text: '저장', variant: 'positive', onClick: () => console.log('저장'), className: 'mr-05' },
                { text: '취소', variant: 'negative', onClick: () => console.log('취소'), className: 'mr-05' },
            ]}
        >
            <Form>
                <Form.Row>
                    <Col xs={3}>
                        <MokaInputLabel as="switch" label="메인노출" labelWidth={70} labelClassName="text-right" />
                    </Col>
                </Form.Row>
                <Form.Row className="justify-content-between">
                    <Col xs={6}>
                        <MokaInputLabel
                            as="select"
                            label="그룹"
                            name="group"
                            labelWidth={70}
                            labelClassName="text-right"
                            value={edit.group}
                            onChange={(e) => {
                                const {
                                    target: { name, value },
                                } = e;
                                handleChangeValue(name, value);
                            }}
                        >
                            {codes.groups.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.value}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                    <Col xs={6}>
                        <MokaInputLabel
                            as="select"
                            label="분류"
                            labelWidth={50}
                            name="servcode"
                            labelClassName="text-right"
                            value={edit.servcode}
                            onChange={(e) => {
                                const {
                                    target: { name, value },
                                } = e;
                                handleChangeValue(name, value);
                            }}
                        >
                            {codes.servcode.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.value}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                <Form.Row className="d-flex align-item-center">
                    <Col xs={4} className="pr-0">
                        <MokaInputLabel
                            as="select"
                            label="레이아웃"
                            labelWidth={70}
                            name="graphType"
                            labelClassName="text-right"
                            value={edit.graphType}
                            onChange={(e) => {
                                const {
                                    target: { name, value },
                                } = e;
                                handleChangeValue(name, value);
                            }}
                        >
                            {codes.graphType.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.value}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                    <Col xs={2} className="d-flex pr-0">
                        <MokaInputLabel
                            name="type"
                            id="type1"
                            as="radio"
                            value="M"
                            labelWidth={30}
                            inputProps={{ custom: true, label: 'text형', checked: edit.type === 'M' }}
                            onChange={(e) => {
                                const {
                                    target: { name, value },
                                } = e;
                                handleChangeValue(name, value);
                            }}
                        />
                    </Col>
                    <Col xs={2} className="d-flex pr-0">
                        <MokaInputLabel
                            name="type"
                            id="type2"
                            as="radio"
                            value="P"
                            labelWidth={30}
                            inputProps={{ custom: true, label: '이미지형', checked: edit.type === 'P' }}
                            onChange={(e) => {
                                const {
                                    target: { name, value },
                                } = e;
                                handleChangeValue(name, value);
                            }}
                        />
                    </Col>
                    <Col xs={3} className="d-flex pr-0">
                        <MokaInputLabel
                            name="type"
                            id="type3"
                            as="radio"
                            value="V"
                            labelWidth={85}
                            inputProps={{ custom: true, label: 'text형+이미지형', checked: edit.type === 'V' }}
                            onChange={(e) => {
                                const {
                                    target: { name, value },
                                } = e;
                                handleChangeValue(name, value);
                            }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={7}>
                        <MokaInputLabel
                            as="dateTimePicker"
                            label="투표기간"
                            labelWidth={70}
                            name="sdate"
                            labelClassName="text-right"
                            value={edit.sdate}
                            onChange={(data) => {
                                handleChangeValue('sdate', data._d);
                            }}
                        />
                    </Col>
                    <span>~</span>
                    <Col xs={5}>
                        <MokaInput
                            as="dateTimePicker"
                            name="edate"
                            value={edit.edate}
                            onChange={(data) => {
                                handleChangeValue('sdate', data._d);
                            }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={6}>
                        <MokaInputLabel
                            as="select"
                            label="서비스 상태"
                            labelWidth={70}
                            name="status"
                            labelClassName="text-right"
                            value={edit.status}
                            onChange={(e) => {
                                const {
                                    target: { name, value },
                                } = e;
                                handleChangeValue(name, value);
                            }}
                        >
                            {codes.status.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.value}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={2}>
                        <MokaInputLabel
                            as="switch"
                            label="로그인"
                            labelWidth={70}
                            name="loginFlag"
                            id="loginFlag"
                            labelClassName="text-right"
                            onChange={(e) => {
                                const {
                                    target: { name, checked },
                                } = e;
                                let value = 'N';
                                if (checked) {
                                    value = 'Y';
                                }
                                handleChangeValue(name, value);
                            }}
                            inputProps={{ checked: edit.loginFlag === 'Y' }}
                        />
                    </Col>
                    <Col xs={3}>
                        <MokaInputLabel
                            as="switch"
                            label="중복 투표 제한"
                            labelWidth={85}
                            name="repetitionFlag"
                            id="repetitionFlag"
                            labelClassName="text-right mr-1"
                            onChange={(e) => {
                                const {
                                    target: { name, checked },
                                } = e;
                                let value = 'N';
                                if (checked) {
                                    value = 'Y';
                                }
                                handleChangeValue(name, value);
                            }}
                            inputProps={{ checked: edit.repetitionFlag === 'Y' }}
                        />
                    </Col>
                    <Col xs={3}>
                        <MokaInputLabel
                            as="switch"
                            label="나도 한마디"
                            labelWidth={70}
                            name="commentFlag"
                            id="commentFlag"
                            labelClassName="text-right"
                            onChange={(e) => {
                                const {
                                    target: { name, checked },
                                } = e;
                                let value = 'N';
                                if (checked) {
                                    value = 'Y';
                                }
                                handleChangeValue(name, value);
                            }}
                            inputProps={{ checked: edit.commentFlag === 'Y' }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={2}>
                        <MokaInputLabel
                            as="switch"
                            label="게시판"
                            labelWidth={70}
                            name="bbsFlag"
                            id="bbsFlag"
                            labelClassName="text-right"
                            onChange={(e) => {
                                const {
                                    target: { name, checked },
                                } = e;
                                let value = 'N';
                                if (checked) {
                                    value = 'Y';
                                }
                                handleChangeValue(name, value);
                            }}
                            inputProps={{ checked: edit.bbsFlag === 'Y' }}
                        />
                    </Col>
                    {edit.bbsFlag === 'Y' && (
                        <Col xs={6}>
                            <MokaInputLabel
                                label="url"
                                labelWidth={35}
                                name="bbsUrl"
                                labelClassName="text-right"
                                onChange={(e) => {
                                    const {
                                        target: { name, value },
                                    } = e;
                                    handleChangeValue(name, value);
                                }}
                                value={edit.bbsUrl}
                            />
                        </Col>
                    )}
                </Form.Row>
                <Form.Row className="d-flex justify-content-center">
                    <MokaCard title="투표 정보 설정" height={130} className="w-75" headerClassName="pb-0">
                        <Form.Row>
                            <Col xs={4}>
                                <MokaInputLabel
                                    type="number"
                                    label="보기 개수"
                                    labelWidth={70}
                                    name="itemCount"
                                    labelClassName="text-left ml-0"
                                    className="pl-0"
                                    value={edit.itemCount}
                                    onChange={(e) => {
                                        const {
                                            target: { name, value },
                                        } = e;
                                        handleChangeValue(name, value);
                                    }}
                                />
                            </Col>
                            <Col xs={4}>
                                <MokaInputLabel
                                    type="number"
                                    label="허용 답변 수"
                                    labelWidth={60}
                                    name="itemvalueLimit"
                                    className="text-right"
                                    value={edit.itemvalueLimit}
                                    onChange={(e) => {
                                        const {
                                            target: { name, value },
                                        } = e;
                                        handleChangeValue(name, value);
                                    }}
                                />
                            </Col>
                            <Col xs={3} className="p-0  pr-2 text-right">
                                <Button variant="positive">생성</Button>
                            </Col>
                        </Form.Row>
                    </MokaCard>
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default PollEdit;
