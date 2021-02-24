import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { getBulkChar } from '@store/codeMgt';
import { MokaInputLabel } from '@components';

const SpecialCharForm = ({ show }) => {
    const dispatch = useDispatch();
    const bulkCharRows = useSelector(({ codeMgt }) => codeMgt.bulkCharRows);
    const [specialChar, setSpecialChar] = useState(''); // 약물

    useEffect(() => {
        // 기타코드 로드
        show &&
            (() => {
                !bulkCharRows ? dispatch(getBulkChar()) : setSpecialChar(bulkCharRows.find((char) => char.dtlCd === 'bulkChar').cdNm);
            })();
    }, [bulkCharRows, dispatch, show]);

    return (
        <Form.Row className="mb-2">
            <MokaInputLabel label="약물" className="mb-0 w-100" value={specialChar} inputProps={{ plaintext: true, readOnly: true }} />
        </Form.Row>
    );
};

export default SpecialCharForm;
