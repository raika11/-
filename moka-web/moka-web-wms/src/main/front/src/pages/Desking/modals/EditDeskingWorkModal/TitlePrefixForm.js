import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { getDsPre, getDsPreLoc } from '@store/codeMgt';
import { MokaInputLabel, MokaInput } from '@components';

/**
 * 말머리 폼
 */
const TitlePrefixForm = ({ show, temp, deskingPart, onChange }) => {
    const dispatch = useDispatch();
    const { dsPreRows, dsPreLocRows } = useSelector(({ codeMgt }) => codeMgt);
    const [filteredLocRows, setFilteredLocRows] = useState([]);

    useEffect(() => {
        if (!show) return;
        !dsPreRows && dispatch(getDsPre());
    }, [dispatch, dsPreRows, show]);

    useEffect(() => {
        if (!show) return;
        !dsPreLocRows && dispatch(getDsPreLoc());
    }, [dispatch, dsPreLocRows, show]);

    useEffect(() => {
        if (dsPreLocRows) {
            setFilteredLocRows(dsPreLocRows.filter((loc) => deskingPart.indexOf(loc.cdNmEtc1) > -1));
        }
    }, [deskingPart, dsPreLocRows]);

    return (
        <Form.Row className="mb-2">
            <Col xs={4} className="p-0">
                <MokaInputLabel as="select" label="말머리" className="w-100" value={temp.titlePrefix} name="titlePrefix" onChange={onChange}>
                    <option value="">선택</option>
                    {dsPreRows &&
                        dsPreRows.map((code) => (
                            <option key={code.id} value={code.id}>
                                {code.name}
                            </option>
                        ))}
                </MokaInputLabel>
            </Col>
            <Col xs={3} className="p-0 pl-2">
                <MokaInput as="select" name="titlePrefixLoc" value={temp.titlePrefixLoc} onChange={onChange}>
                    <option value="">선택</option>
                    {filteredLocRows &&
                        filteredLocRows.map((code) => (
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
