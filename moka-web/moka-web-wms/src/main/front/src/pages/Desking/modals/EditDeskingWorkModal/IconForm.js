import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { getDsIcon } from '@store/codeMgt';
import { MokaInputLabel } from '@components';

/**
 * 아이콘 폼
 */
const IconForm = ({ show, temp, onChange }) => {
    const dispatch = useDispatch();
    const { dsIconRows } = useSelector(({ codeMgt }) => codeMgt);

    useEffect(() => {
        if (!show) return;
        !dsIconRows && dispatch(getDsIcon());
    }, [dispatch, dsIconRows, show]);

    return (
        <Form.Row className="mb-2">
            <Col xs={4} className="p-0">
                <MokaInputLabel as="select" label="아이콘" className="mb-0 w-100" value={temp.iconFileName} name="iconFileName" onChange={onChange}>
                    <option value="">선택</option>
                    {dsIconRows &&
                        dsIconRows.map((code) => (
                            <option key={code.id} value={code.id}>
                                {code.name}
                            </option>
                        ))}
                </MokaInputLabel>
            </Col>
        </Form.Row>
    );
};

export default IconForm;
