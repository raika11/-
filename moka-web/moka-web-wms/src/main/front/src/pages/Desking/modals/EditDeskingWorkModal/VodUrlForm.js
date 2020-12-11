import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { MokaInputLabel, MokaSearchInput } from '@components';
import VodModal from '@pages/Desking/modals/VodModal';

/**
 * 영상 url 폼
 */
const VodUrlForm = ({ temp, setTemp }) => {
    const [show, setShow] = useState(false);

    /**
     * 저장
     * @param {string} url vodUrl
     */
    const handleClickSave = (url) => {
        setTemp({ ...temp, vodUrl: url });
    };

    return (
        <Form.Row className="mb-2">
            <MokaInputLabel label="영상" labelWidth={80} labelClassName="ft-12 pr-3" className="m-0" as="none" />
            <div className="w-100">
                <MokaSearchInput
                    placeholder="URL을 선택하세요"
                    name="vodUrl"
                    value={temp.vodUrl}
                    onSearch={() => setShow(true)}
                    inputProps={{ readOnly: true }}
                    inputClassName="bg-white"
                />
            </div>

            <VodModal show={show} onHide={() => setShow(false)} vodUrl={temp.vodUrl} onSave={handleClickSave} />
        </Form.Row>
    );
};

export default VodUrlForm;
