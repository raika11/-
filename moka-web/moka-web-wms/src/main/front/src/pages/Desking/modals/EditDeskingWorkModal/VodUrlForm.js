import React from 'react';
import Form from 'react-bootstrap/Form';
import { MokaInputLabel, MokaSearchInput } from '@components';

/**
 * 영상 url 폼
 */
const VodUrlForm = ({ temp, onChange }) => {
    return (
        <Form.Row className="mb-2">
            <MokaInputLabel label="영상" labelWidth={80} labelClassName="ft-12 pr-3" className="m-0" onChange={onChange} as="none" />
            <div className="w-100">
                <MokaSearchInput placeholder="URL을 입력하세요" name="vodUrl" value={temp.vodUrl} onChange={onChange} />
            </div>
        </Form.Row>
    );
};

export default VodUrlForm;
