import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { getDsTitleLoc } from '@store/codeMgt';
import { MokaInputLabel } from '@components';

/**
 * 제목/부제위치 폼
 */
const DeskingWorkTitleLocForm = ({ show, temp, onChange }) => {
    const dispatch = useDispatch();
    const { dsTitleLocRows } = useSelector((store) => ({
        dsTitleLocRows: store.codeMgt.dsTitleLocRows,
    }));

    useEffect(() => {
        if (!show) return;
        !dsTitleLocRows && dispatch(getDsTitleLoc());
    }, [dispatch, dsTitleLocRows, show]);

    return (
        <Form.Row className="mb-2">
            <Col xs={4} className="p-0">
                <MokaInputLabel
                    as="select"
                    label="제목/\n부제위치"
                    labelWidth={80}
                    labelClassName="ft-12 pr-3"
                    className="mb-0 w-100"
                    inputClassName="ft-12"
                    value={temp.titleLoc}
                    name="titleLoc"
                    onChange={onChange}
                >
                    <option hidden>선택</option>
                    {dsTitleLocRows &&
                        dsTitleLocRows.map((code) => (
                            <option key={code.id} value={code.id}>
                                {code.name}
                            </option>
                        ))}
                </MokaInputLabel>
            </Col>
        </Form.Row>
    );
};

export default DeskingWorkTitleLocForm;
