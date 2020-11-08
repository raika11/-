import React, { useState } from 'react';

import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';

import { MokaCard, Moka } from '@components';
import { Col } from 'react-bootstrap';

const ComponentDashboard = () => {
    const [values, setValues] = useState({ 'moka-input': '', 'moka-checkbox': 'Y', 'moka-select': '', 'moka-radio': 'Y', 'moka-radio2': 'Y' });
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    return (
        <Container className="p-0" fluid>
            <Helmet>
                <title>예제 페이지</title>
                <meta name="description" content="예제 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="d-flex">
                <MokaCard>
                    <Moka.Input name="moka-input" value={values['moka-input']} onChange={handleChangeValue} />
                    <Moka.CheckBox name="moka-checkbox" label="moka-checkbox" value={values['moka-checkbox']} onChange={handleChangeValue} />
                    <Moka.Radio name="moka-radio" label="moka-radio" value={values['moka-radio']} onChange={handleChangeValue} />
                    <Moka.Select name="moka-select" value={values['moka-select']} onChange={handleChangeValue}>
                        <option value="moka1">moka1</option>
                        <option value="moka2">moka2</option>
                        <option value="moka3">moka3</option>
                    </Moka.Select>
                    <Moka.Label label="타이틀" labelWidth={80}>
                        <Col xs={5}>
                            <Moka.Radio name="moka-radio2" label="moka-checkbox" value="Y" checked={values['moka-radio2'] === 'Y'} onChange={handleChangeValue} />
                        </Col>
                        <Col xs={5}>
                            <Moka.Radio name="moka-radio2" label="moka-checkbox" value="N" checked={values['moka-radio2'] === 'N'} onChange={handleChangeValue} />
                        </Col>
                    </Moka.Label>
                </MokaCard>
            </div>
        </Container>
    );
};

export default ComponentDashboard;
