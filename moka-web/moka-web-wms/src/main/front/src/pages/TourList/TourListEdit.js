import React, { useState } from 'react';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { DB_DATEFORMAT } from '@/constants';
import { MokaInput, MokaInputLabel } from '@/components';

const TourListEdit = () => {
    const [startDate, setStartDate] = useState(moment().format(DB_DATEFORMAT));
    const [time, setTime] = useState('10');
    const [status, setStatus] = useState('S');
    const [rejectDescpt, setRejectDescpt] = useState('S');
    const [groupName, setGroupName] = useState('');
    const [people, setPeople] = useState('5');
    const [discription, setDiscription] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [dept, setDept] = useState('');
    const [admin, setAdmin] = useState('');
    const [adminPhone, setAdminPhone] = useState('');

    /**
     * 비밀번호 초기화 버튼
     */
    const handleClickReset = () => {
        setPwd('');
    };

    /**
     * 메일 미리보기 버튼
     */
    const handleClickPreview = () => {
        window.open(``, '메일 미리보기');
    };

    return (
        <Form>
            <div style={{ borderBottom: '2px solid #E0E0E0' }}>
                <Form.Row className="mb-2">
                    <div style={{ width: 280 }}>
                        <MokaInputLabel
                            label="신청일시"
                            labelClassName="mr-5 ft-12 d-flex justify-content-end"
                            className="mb-0 mr-2"
                            inputClassName="ft-12"
                            as="dateTimePicker"
                            value={startDate}
                            inputProps={{ timeFormat: null }}
                            name="startDate"
                            onChange={(date) => {
                                if (typeof date === 'object') {
                                    setStartDate(date);
                                } else {
                                    setStartDate(null);
                                }
                                // handleChangeValue
                            }}
                        />
                    </div>
                    <div style={{ width: 120 }}>
                        <MokaInput
                            as="select"
                            name="time"
                            value={time}
                            onChange={
                                (e) => setTime(e.target.value)
                                // handleChangeValue
                            }
                        >
                            <option value="10">오전 10시</option>
                            <option value="14">오후 2시</option>
                        </MokaInput>
                    </div>
                </Form.Row>
                <div style={{ width: 220 }}>
                    <MokaInputLabel
                        label="신청상태"
                        labelClassName="mr-5 ft-12 d-flex justify-content-end"
                        className="mb-2"
                        inputClassName="ft-12"
                        as="select"
                        value={status}
                        name="status"
                        onChange={
                            (e) => setStatus(e.target.value)
                            // handleChangeValue
                        }
                    >
                        <option value="S">신청</option>
                        <option value="A">승인</option>
                        <option value="R">반려</option>
                        <option value="C">취소</option>
                    </MokaInputLabel>
                </div>
                {status === 'R' && (
                    <MokaInputLabel
                        label="반려사유"
                        labelClassName="mr-5 ft-12 d-flex justify-content-end"
                        className="mb-2"
                        inputClassName="ft-12 resize-none"
                        as="textarea"
                        inputProps={{ rows: 4 }}
                        value={rejectDescpt}
                        name="rejectDescpt"
                        onChange={
                            (e) => setRejectDescpt(e.target.value)
                            // handleChangeValue
                        }
                    />
                )}
                <div style={{ width: 400 }}>
                    <MokaInputLabel
                        label="단체명"
                        labelClassName="mr-5 ft-12 d-flex justify-content-end"
                        className="mb-2"
                        inputClassName="ft-12"
                        value={groupName}
                        onChange={
                            (e) => setGroupName(e.target.value)
                            // handleChangeValue
                        }
                    />
                </div>
                <Form.Row className="mb-2">
                    <div style={{ width: 280 }}>
                        <MokaInputLabel
                            label="견학인원"
                            labelClassName="mr-5 ft-12 d-flex justify-content-end"
                            className="mb-0 mr-2"
                            inputClassName="ft-12"
                            as="select"
                            value={groupName}
                            name="status"
                            onChange={
                                (e) => setGroupName(e.target.value)
                                // handleChangeValue
                            }
                        >
                            <option value="0">초등학생</option>
                            <option value="1">중학생</option>
                            <option value="2">고등학생</option>
                            <option value="3">대학생</option>
                            <option value="4">성인</option>
                        </MokaInputLabel>
                    </div>
                    <div style={{ width: 120 }}>
                        <MokaInput
                            as="select"
                            name="people"
                            value={people}
                            onChange={
                                (e) => setPeople(e.target.value)
                                // handleChangeValue
                            }
                        >
                            {[...Array(11)].map((d, idx) => {
                                return (
                                    <option key={idx} value={`${idx + 5}`}>
                                        {idx + 5}명
                                    </option>
                                );
                            })}
                        </MokaInput>
                    </div>
                </Form.Row>
                <MokaInputLabel
                    label="견학목적"
                    labelClassName="mr-5 ft-12 d-flex justify-content-end"
                    className="mb-2"
                    inputClassName="ft-12 resize-none"
                    as="textarea"
                    inputProps={{ rows: 4 }}
                    value={discription}
                    name="status"
                    onChange={
                        (e) => setDiscription(e.target.value)
                        // handleChangeValue
                    }
                />
            </div>
            <div className="pt-4" style={{ borderBottom: '2px solid #E0E0E0' }}>
                <MokaInputLabel label="신청자 정보" labelClassName="ft-12 d-flex justify-content-end" className="mb-2" as="none" />
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="성명"
                        labelClassName="mr-5 ft-12 d-flex justify-content-end"
                        className="mb-0 mr-2"
                        inputProps={{ readOnly: true, plaintext: true }}
                        value={name}
                        onChange={(e) => e.target.value}
                    />
                    <MokaInputLabel
                        label="연락처"
                        labelClassName="mr-5 ft-12 d-flex justify-content-end"
                        className="mb-0 mr-2"
                        inputProps={{ readOnly: true, plaintext: true }}
                        value={phone}
                        onChange={(e) => e.target.value}
                    />
                </Form.Row>
                <MokaInputLabel
                    label="이메일"
                    labelClassName="mr-5 ft-12 d-flex justify-content-end"
                    className="mb-2"
                    inputProps={{ readOnly: true, plaintext: true }}
                    value={email}
                    onChange={(e) => e.target.value}
                />
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="비밀번호(4자리)"
                        labelClassName="mr-5 ft-12 d-flex justify-content-end"
                        className="mb-0 mr-2"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                    />
                    <Button variant="negative" className="ft-12" onClick={handleClickReset}>
                        비밀번호 초기화
                    </Button>
                </Form.Row>
            </div>
            <div className="mb-4 pt-4" style={{ borderBottom: '2px solid #E0E0E0' }}>
                <MokaInputLabel label="담당자 정보" labelClassName="ft-12 d-flex justify-content-end" className="mb-2" as="none" />
                <MokaInputLabel label="부서" labelClassName="mr-5 ft-12 d-flex justify-content-end" className="mb-2" value={dept} onChange={(e) => setDept(e.target.value)} />
                <MokaInputLabel label="성명" labelClassName="mr-5 ft-12 d-flex justify-content-end" className="mb-2" value={admin} onChange={(e) => setAdmin(e.target.value)} />
                <MokaInputLabel
                    label="연락처"
                    labelClassName="mr-5 ft-12 d-flex justify-content-end"
                    className="mb-2"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                />
            </div>
            <div className="mb-2 ft-12 color-secondary">
                <p className="m-0">※ 최초 한번의 승인/반려 시에만 메일이 발송됩니다.</p>
                <p className="m-0">※ 신청자의 이메일 정보는 아이디 개념이라 수정할 수 없습니다.</p>
            </div>
            <Form.Row>
                <Col xs={7} className="p-0 d-flex justify-content-end">
                    <Button className="mr-2 ft-12">저장</Button>
                    <Button variant="negative" className="ft-12">
                        삭제
                    </Button>
                </Col>
                <Col xs={5} className="p-0 d-flex justify-content-end">
                    <Button variant="searching" className="ft-12" onClick={handleClickPreview}>
                        메일 미리보기
                    </Button>
                </Col>
            </Form.Row>
        </Form>
    );
};

export default TourListEdit;
