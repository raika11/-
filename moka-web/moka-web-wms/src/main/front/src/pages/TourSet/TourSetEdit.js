import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { MokaInput, MokaInputLabel } from '@/components';

const TourSetEdit = () => {
    const [number, setNumber] = useState(0);
    return (
        <Form>
            <Form.Row>
                <MokaInputLabel
                    label="견학신청"
                    labelWidth={100}
                    labelClassName="mr-5 ft-12 d-flex justify-content-end"
                    className="mb-0"
                    as="switch"
                    name="tour"
                    id="switch-tour"
                    inputProps={{
                        custom: true,
                        // checked: temp.ilganUse === 'Y'
                    }}
                    onChange={
                        (e) => e.target.checked
                        // handleChangeValue
                    }
                />
            </Form.Row>

            <Form.Row>
                <div style={{ width: 80 }}>
                    <MokaInput
                        as="select"
                        name="above"
                        value={number}
                        onChange={
                            (e) => e.target.value
                            // handleChangeValue
                        }
                    >
                        <option value="5">5</option>
                    </MokaInput>
                </div>
                <div style={{ width: 80 }}>
                    <MokaInput
                        as="select"
                        name="above"
                        value={number}
                        onChange={
                            (e) => e.target.value
                            // handleChangeValue
                        }
                    >
                        <option value="5">5</option>
                    </MokaInput>
                </div>
            </Form.Row>

            <Form.Row>
                <div style={{ width: 80 }}>
                    <MokaInput
                        as="select"
                        name="above"
                        value={number}
                        onChange={
                            (e) => e.target.value
                            // handleChangeValue
                        }
                    >
                        <option value="5">5</option>
                    </MokaInput>
                </div>
                <div style={{ width: 80 }}>
                    <MokaInput
                        as="select"
                        name="below"
                        value={number}
                        onChange={
                            (e) => e.target.value
                            // handleChangeValue
                        }
                    >
                        <option value="15">15</option>
                    </MokaInput>
                </div>
            </Form.Row>

            <Form.Row>
                <MokaInputLabel
                    label="일"
                    labelWidth={20}
                    labelClassName="mr-3 ft-12"
                    className="mb-0"
                    as="switch"
                    name="sunday"
                    id="switch-sunday"
                    inputProps={{
                        custom: true,
                        // checked: temp.ilganUse === 'Y'
                    }}
                    onChange={
                        (e) => e.target.checked
                        // handleChangeValue
                    }
                />
                <MokaInputLabel
                    label="월"
                    labelWidth={20}
                    labelClassName="mr-3 ft-12"
                    className="mb-0"
                    as="switch"
                    name="monday"
                    id="switch-monday"
                    inputProps={{
                        custom: true,
                        // checked: temp.ilganUse === 'Y'
                    }}
                    onChange={
                        (e) => e.target.checked
                        // handleChangeValue
                    }
                />
                <MokaInputLabel
                    label="화"
                    labelWidth={20}
                    labelClassName="mr-3 ft-12"
                    className="mb-0"
                    as="switch"
                    name="tuesday"
                    id="switch-tuesday"
                    inputProps={{
                        custom: true,
                        // checked: temp.ilganUse === 'Y'
                    }}
                    onChange={
                        (e) => e.target.checked
                        // handleChangeValue
                    }
                />
                <MokaInputLabel
                    label="수"
                    labelWidth={20}
                    labelClassName="mr-3 ft-12"
                    className="mb-0"
                    as="switch"
                    name="wednesday"
                    id="switch-wednesday"
                    inputProps={{
                        custom: true,
                        // checked: temp.ilganUse === 'Y'
                    }}
                    onChange={
                        (e) => e.target.checked
                        // handleChangeValue
                    }
                />
                <MokaInputLabel
                    label="목"
                    labelWidth={20}
                    labelClassName="mr-3 ft-12"
                    className="mb-0"
                    as="switch"
                    name="thursday"
                    id="switch-thursday"
                    inputProps={{
                        custom: true,
                        // checked: temp.ilganUse === 'Y'
                    }}
                    onChange={
                        (e) => e.target.checked
                        // handleChangeValue
                    }
                />
                <MokaInputLabel
                    label="금"
                    labelWidth={20}
                    labelClassName="mr-3 ft-12"
                    className="mb-0"
                    as="switch"
                    name="friday"
                    id="switch-friday"
                    inputProps={{
                        custom: true,
                        // checked: temp.ilganUse === 'Y'
                    }}
                    onChange={
                        (e) => e.target.checked
                        // handleChangeValue
                    }
                />
                <MokaInputLabel
                    label="토"
                    labelWidth={20}
                    labelClassName="mr-3 ft-12"
                    className="mb-0"
                    as="switch"
                    name="saturday"
                    id="switch-saturday"
                    inputProps={{
                        custom: true,
                        // checked: temp.ilganUse === 'Y'
                    }}
                    onChange={
                        (e) => e.target.checked
                        // handleChangeValue
                    }
                />
            </Form.Row>
        </Form>
    );
};

export default TourSetEdit;
