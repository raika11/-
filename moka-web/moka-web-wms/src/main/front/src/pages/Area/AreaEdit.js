import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { MokaCard } from '@components';

const AreaEdit = () => {
    const [formType, setFormType] = useState('1depth');

    return (
        <MokaCard title="편집영역 등록" className="flex-fill">
            {formType === '1depth' && <Form.Row>dddd</Form.Row>}
            {formType !== '1depth' && <Form.Row>ddggg</Form.Row>}
        </MokaCard>
    );
};

export default AreaEdit;
