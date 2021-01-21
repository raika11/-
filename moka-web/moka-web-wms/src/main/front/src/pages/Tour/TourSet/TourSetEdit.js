import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { MokaInput, MokaInputLabel, MokaCard } from '@/components';

/**
 * 견학 기본 설정 편집
 */
const TourSetEdit = () => {
    const [minDay, setMinDay] = useState(1);
    const [maxDay, setMaxDay] = useState(90);
    const [minVisitor, setMinVisitor] = useState(5);
    const [maxVisitor, setMaxVisitor] = useState(15);

    return (
        <MokaCard
            width={790}
            title="견학 기본설정"
            footer
            footerButtons={[
                {
                    text: '저장',
                    variant: 'positive',
                    className: 'mr-2',
                },
                {
                    text: '취소',
                    variant: 'negative',
                },
            ]}
            footerClassName="justify-content-center"
        >
            <Form>
                <Form.Row className="mb-3">
                    <MokaInputLabel
                        label="견학신청"
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
                <Form.Row className="mb-3 d-flex align-items-center">
                    <MokaInputLabel label="신청기간" as="none" />
                    <p className="mb-0 mr-2 ft-12">오늘자 기준</p>
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
                    <p className="mb-0 mx-2 ft-12">일 후부터</p>
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
                    <p className="mb-0 mx-2 ft-12">일 후까지 신청 가능</p>
                </Form.Row>
                <Form.Row className="mb-3 d-flex align-items-center">
                    <MokaInputLabel label="신청인원" as="none" />
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
                    <p className="mb-0 mx-2 ft-12">명 이상 ~ </p>
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
                    <p className="mb-0 mx-2 ft-12">명 이하</p>
                </Form.Row>
                <Form.Row className="mb-3">
                    <MokaInputLabel label="견학가능\n요일" as="none" />
                    <MokaInputLabel
                        label="일"
                        labelWidth={13}
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
                        labelWidth={13}
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
                        labelWidth={13}
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
                        labelWidth={13}
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
                        labelWidth={13}
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
                        labelWidth={13}
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
                        labelWidth={13}
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
            </Form>
        </MokaCard>
    );
};

export default TourSetEdit;
