import React from 'react';
import DeskingStatusBadge from '@pages/Desking/components/ComponentWork/StatusBadge';

/**
 * 상태 표기 (홈 화면편집의 StatusBadge 사용)
 */
const StatusBadge = ({ desking }) => {
    if (desking?.lastSaveDt) {
        return (
            <div style={{ height: 26 }} className="h3 mr-1 mb-0">
                <DeskingStatusBadge
                    lastPublishDt={desking?.lastPublishDt}
                    lastPublishNm={desking?.lastPublishNm}
                    lastPublishId={desking?.lastPublishId}
                    lastSaveNm={desking?.lastSaveNm}
                    lastSaveId={desking?.lastSaveId}
                    lastSaveDt={desking?.lastSaveDt}
                    className="h-100 d-flex align-items-center px-2"
                />
            </div>
        );
    }

    return null;
};

export default StatusBadge;
