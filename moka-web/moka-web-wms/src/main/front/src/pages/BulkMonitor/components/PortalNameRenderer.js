import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { getBulkSite } from '@/store/codeMgt';

const PortalNameRenderer = (props) => {
    const { data } = props;
    const dispatch = useDispatch();
    const bulkSiteRows = useSelector((store) => store.codeMgt.bulkSiteRows); // 기타코드 벌크 사이트 목록
    const [portalName, setPortalName] = useState('');

    useEffect(() => {
        if (!bulkSiteRows) {
            dispatch(getBulkSite());
        } else {
            const target = bulkSiteRows.findIndex((s) => s.dtlCd === data.portalDiv);
            if (target > -1) {
                setPortalName(bulkSiteRows[target].cdNm);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bulkSiteRows]);

    return (
        <OverlayTrigger overlay={<Tooltip id={data.portalDiv}>{portalName}</Tooltip>}>
            <div className="h-100 d-flex align-items-center">
                <p className="mb-0">{portalName}</p>
            </div>
        </OverlayTrigger>
    );
};

export default PortalNameRenderer;
