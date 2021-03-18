import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

/**
 * 스케줄 작업 분류 renderer
 */
const WorkServerSeqRenderer = forwardRef((props, ref) => {
    const { serverSeq } = props;
    const genCateRows = useSelector((store) => store.codeMgt.genCateRows);
    const [serverSeqName, setServerSeqName] = useState('');

    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    useEffect(() => {
        let findSectionIndex;
        if (serverSeq) {
            // if (type === '1') {
            // findSectionIndex = genCateRows.findIndex((c) => c.cdNmEtc1 === serverSeq);
            // if (findSectionIndex > -1) {
            //     setSectionName(pressCate1Rows[findSectionIndex].name);
            // } else {
            //     setSectionName('');
            // }
            // }
            // else if (type === '61') {
            //     findSectionIndex = pressCate61Rows.findIndex((s) => s.cdNmEtc1 === section);
            //     if (findSectionIndex > -1) {
            //         setSectionName(pressCate61Rows[findSectionIndex].name);
            //     } else {
            //         setSectionName('');
            //     }
            // }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serverSeq]);

    return (
        <>
            {serverSeqName && (
                <OverlayTrigger overlay={<Tooltip id="tooltip-table-section-info">{serverSeqName}</Tooltip>}>
                    <div className="h-100 d-flex align-items-center">
                        <p className="mb-0">{serverSeqName}</p>
                    </div>
                </OverlayTrigger>
            )}
        </>
    );
});

export default WorkServerSeqRenderer;
