import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

/**
 * 조판 section renderer
 */
const SectionRenderer = forwardRef((props, ref) => {
    const { section, type } = props;
    const pressCate1Rows = useSelector((store) => store.codeMgt.pressCate1Rows);
    const pressCate61Rows = useSelector((store) => store.codeMgt.pressCate61Rows);
    const [sectionName, setSectionName] = useState('');

    useImperativeHandle(ref, () => ({
        refresh: () => false,
    }));

    useEffect(() => {
        let findSectionIndex;
        if (section) {
            if (type === '1') {
                findSectionIndex = pressCate1Rows.findIndex((s) => s.cdNmEtc1 === section);
                if (findSectionIndex > -1) {
                    setSectionName(pressCate1Rows[findSectionIndex].name);
                } else {
                    setSectionName('');
                }
            } else if (type === '61') {
                findSectionIndex = pressCate61Rows.findIndex((s) => s.cdNmEtc1 === section);
                if (findSectionIndex > -1) {
                    setSectionName(pressCate61Rows[findSectionIndex].name);
                } else {
                    setSectionName('');
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [section]);

    return (
        <>
            {sectionName && (
                <OverlayTrigger overlay={<Tooltip id="tooltip-table-section-info">{sectionName}</Tooltip>}>
                    <div className="h-100 d-flex align-items-center">
                        <p className="mb-0">{sectionName}</p>
                    </div>
                </OverlayTrigger>
            )}
        </>
    );
});

export default SectionRenderer;
