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

    return (
        <Form>
            <Form.Row className="mb-2">
                <div style={{ width: 280 }}>
                    <MokaInputLabel
                        label="신청일시"
                        className="mb-0 mr-2"
                        inputClassName=""
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
                    className="mb-2"
                    inputClassName=""
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
                    className="mb-2"
                    inputClassName=" resize-none"
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
                    className="mb-2"
                    inputClassName=""
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
                        className="mb-0 mr-2"
                        inputClassName=""
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
                className="mb-2"
                inputClassName=" resize-none"
                as="textarea"
                inputProps={{ rows: 4 }}
                value={discription}
                name="status"
                onChange={
                    (e) => setDiscription(e.target.value)
                    // handleChangeValue
                }
            />
            <hr className="divider" />
            <MokaInputLabel label="신청자 정보" className="mb-2" as="none" />
            <Form.Row className="mb-2">
                <MokaInputLabel label="성명" className="mb-0 mr-2" inputProps={{ readOnly: true, plaintext: true }} value={name} onChange={(e) => e.target.value} />
                <MokaInputLabel label="연락처" className="mb-0 mr-2" inputProps={{ readOnly: true, plaintext: true }} value={phone} onChange={(e) => e.target.value} />
            </Form.Row>
            <MokaInputLabel label="이메일" className="mb-2" inputProps={{ readOnly: true, plaintext: true }} value={email} onChange={(e) => e.target.value} />
            <Form.Row className="mb-2">
                <Col xs={6} className="px-0">
                    <MokaInputLabel label="비밀번호\n(4자리)" className="mb-0 mr-2" value={pwd} onChange={(e) => setPwd(e.target.value)} />
                </Col>
                <Col xs={6} className="px-0 d-flex align-items-center">
                    <Button variant="negative" size="sm" onClick={handleClickReset}>
                        비밀번호 초기화
                    </Button>
                </Col>
            </Form.Row>
            <hr className="divider" />
            <MokaInputLabel label="담당자 정보" className="mb-2" as="none" />
            <MokaInputLabel label="부서" className="mb-2" value={dept} onChange={(e) => setDept(e.target.value)} />
            <MokaInputLabel label="성명" className="mb-2" value={admin} onChange={(e) => setAdmin(e.target.value)} />
            <MokaInputLabel label="연락처" className="mb-2" value={adminPhone} onChange={(e) => setAdminPhone(e.target.value)} />
            <hr className="divider" />
            <div className="mb-2  color-secondary">
                <p className="m-0">※ 최초 한번의 승인/반려 시에만 메일이 발송됩니다.</p>
                <p className="m-0">※ 신청자의 이메일 정보는 아이디 개념이라 수정할 수 없습니다.</p>
            </div>
        </Form>
    );
};

export default TourListEdit;
