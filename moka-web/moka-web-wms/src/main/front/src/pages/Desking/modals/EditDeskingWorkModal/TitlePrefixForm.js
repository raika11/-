import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { getDsPre, getDsPreLoc } from '@store/codeMgt';
import { MokaInputLabel, MokaInput } from '@components';

/**
 * 말머리 폼
 */
const TitlePrefixForm = ({ show, temp, onChange }) => {
    const dispatch = useDispatch();
    const { dsPreRows, dsPreLocRows } = useSelector((store) => ({
        dsPreRows: store.codeMgt.dsPreRows,
        dsPreLocRows: store.codeMgt.dsPreLocRows,
    }));

    useEffect(() => {
        if (!show) return;
        !dsPreRows && dispatch(getDsPre());
    }, [dispatch, dsPreRows, show]);

    useEffect(() => {
        if (!show) return;
        !dsPreLocRows && dispatch(getDsPreLoc());
    }, [dispatch, dsPreLocRows, show]);

    return (
        <Form.Row className="mb-2">
            <Col xs={3} className="p-0">
                <MokaInputLabel
                    as="select"
                    label="말머리"
                    labelWidth={80}
                    labelClassName="ft-12 pr-3"
                    className="mb-0 w-100"
                    inputClassName="ft-12"
                    value={temp.titlePrefix}
                    name="titlePrefix"
                    onChange={onChange}
                >
                    <option hidden>선택</option>
                    {dsPreRows &&
                        dsPreRows.map((code) => (
                            <option key={code.id} value={code.id}>
                                {code.name}
                            </option>
                        ))}
                </MokaInputLabel>
            </Col>
            <Col xs={3} className="p-0 pl-2">
                <MokaInput as="select" className="ft-12" name="titlePrefixLoc" value={temp.titlePrefixLoc} onChange={onChange}>
                    <option hidden>선택</option>
                    {dsPreLocRows &&
                        dsPreLocRows.map((code) => (
                            <option key={code.id} value={code.id}>
                                {code.name}
                            </option>
                        ))}
                </MokaInput>
            </Col>
        </Form.Row>
    );
};

export default TitlePrefixForm;
