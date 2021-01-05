import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaInputLabel } from '@/components';

/**
 * 견학 기본 설정 편집
 */
const TourSetEdit = () => {
    const [minDay, setMinDay] = useState(1);
    const [maxDay, setMaxDay] = useState(90);
    const [minVisitor, setMinVisitor] = useState(5);
    const [maxVisitor, setMaxVisitor] = useState(15);

    return (
        <Form>
            <Form.Row className="mb-3">
                <MokaInputLabel
                    label="견학신청"
                    labelClassName="mr-5 d-flex justify-content-end"
                    className="mb-0"
                    as="switch"
                    name="tour"
                    id="switch-tour"
                    inputProps={{
                        custom: true,
                        // checked: temp.ilganUse === 'Y'
                        checked: true,
                    }}
                    onChange={
                        (e) => e.target.checked
                        // handleChangeValue
                    }
                />
            </Form.Row>
            <Form.Row className="mb-3">
                <MokaInputLabel label="신청기간" labelClassName="mr-5 d-flex justify-content-end" className="mb-0" as="none" />
                <MokaInputLabel label="오늘자 기준" labelClassName="ml-0 mr-2" className="mb-0" as="none" />
                <div style={{ width: 80 }}>
                    <MokaInput
                        as="select"
                        name="minDay"
                        value={minDay}
                        onChange={
                            (e) => setMinDay(e.target.value)
                            // handleChangeValue
                        }
                    >
                        {[...Array(90)].map((d, idx) => {
                            return (
                                <option key={idx} value={`${idx + 1}`}>
                                    {idx + 1}
                                </option>
                            );
                        })}
                    </MokaInput>
                </div>
                <MokaInputLabel label="일 후부터" labelClassName="mx-2" className="mb-0" as="none" />
                <div style={{ width: 80 }}>
                    <MokaInput
                        as="select"
                        name="maxDay"
                        value={maxDay}
                        onChange={
                            (e) => setMaxDay(e.target.value)
                            // handleChangeValue
                        }
                    >
                        {[...Array(90)].map((d, idx) => {
                            return (
                                <option key={idx} value={`${idx + 1}`}>
                                    {idx + 1}
                                </option>
                            );
                        })}
                    </MokaInput>
                </div>
                <MokaInputLabel label="일 후까지 신청 가능" labelClassName="ml-3" className="mb-0" as="none" />
            </Form.Row>
            <Form.Row className="mb-3">
                <MokaInputLabel label="신청인원" labelClassName="mr-5 d-flex justify-content-end" className="mb-0" as="none" />
                <div style={{ width: 80 }}>
                    <MokaInput
                        as="select"
                        name="minVisitor"
                        value={minVisitor}
                        onChange={
                            (e) => setMinVisitor(e.target.value)
                            // handleChangeValue
                        }
                    >
                        {[...Array(90)].map((d, idx) => {
                            return (
                                <option key={idx} value={`${idx + 1}`}>
                                    {idx + 1}
                                </option>
                            );
                        })}
                    </MokaInput>
                </div>
                <MokaInputLabel label="명 이상~" labelClassName="ml-0 mr-2 d-flex justify-content-end" className="mb-0" as="none" />
                <div style={{ width: 80 }}>
                    <MokaInput
                        as="select"
                        name="maxVisitor"
                        value={maxVisitor}
                        onChange={
                            (e) => setMaxVisitor(e.target.value)
                            // handleChangeValue
                        }
                    >
                        {[...Array(90)].map((d, idx) => {
                            return (
                                <option key={idx} value={`${idx + 1}`}>
                                    {idx + 1}
                                </option>
                            );
                        })}
                    </MokaInput>
                </div>
                <MokaInputLabel label="명 이하" labelClassName="ml-0 d-flex justify-content-end" className="mb-0" as="none" />
            </Form.Row>
            <Form.Row className="mb-3">
                <MokaInputLabel label="견학가능요일" labelClassName="mr-5 d-flex justify-content-end" className="mb-0" as="none" />
                <MokaInputLabel
                    label="일"
                    labelClassName="ml-0"
                    className="mb-0"
                    as="switch"
                    name="sunday"
                    id="switch-sunday"
                    inputProps={{
                        custom: true,
                        // checked: temp.sunday === '1'
                    }}
                    onChange={
                        (e) => e.target.checked
                        // handleChangeValue
                    }
                />
                <MokaInputLabel
                    label="월"
                    className="mb-0"
                    as="switch"
                    name="monday"
                    id="switch-monday"
                    inputProps={{
                        custom: true,
                        // checked: temp.monday === '2'
                        checked: true,
                    }}
                    onChange={
                        (e) => e.target.checked
                        // handleChangeValue
                    }
                />
                <MokaInputLabel
                    label="화"
                    className="mb-0"
                    as="switch"
                    name="tuesday"
                    id="switch-tuesday"
                    inputProps={{
                        custom: true,
                        // checked: temp.tuesday === '3'
                        checked: true,
                    }}
                    onChange={
                        (e) => e.target.checked
                        // handleChangeValue
                    }
                />
                <MokaInputLabel
                    label="수"
                    className="mb-0"
                    as="switch"
                    name="wednesday"
                    id="switch-wednesday"
                    inputProps={{
                        custom: true,
                        // checked: temp.wednesday === '4'
                        checked: true,
                    }}
                    onChange={
                        (e) => e.target.checked
                        // handleChangeValue
                    }
                />
                <MokaInputLabel
                    label="목"
                    className="mb-0"
                    as="switch"
                    name="thursday"
                    id="switch-thursday"
                    inputProps={{
                        custom: true,
                        // checked: temp.thursday === '5'
                        checked: true,
                    }}
                    onChange={
                        (e) => e.target.checked
                        // handleChangeValue
                    }
                />
                <MokaInputLabel
                    label="금"
                    className="mb-0"
                    as="switch"
                    name="friday"
                    id="switch-friday"
                    inputProps={{
                        custom: true,
                        // checked: temp.friday === '6'
                        checked: true,
                    }}
                    onChange={
                        (e) => e.target.checked
                        // handleChangeValue
                    }
                />
                <MokaInputLabel
                    label="토"
                    className="mb-0"
                    as="switch"
                    name="saturday"
                    id="switch-saturday"
                    inputProps={{
                        custom: true,
                        // checked: temp.saturday === '7'
                    }}
                    onChange={
                        (e) => e.target.checked
                        // handleChangeValue
                    }
                />
            </Form.Row>
            <div className="d-flex justify-content-center">
                <Button className="mr-2">저장</Button>
                <Button variant="negative">취소</Button>
            </div>
        </Form>
    );
};

export default TourSetEdit;
