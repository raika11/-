import React from 'react';
import { MokaModal, MokaTable } from '@components';
import columnDefs from './ArticleHistoryModalColumns';

/**
 * 기사 작업정보 모달
 */
const ArticleHistoryModal = (props) => {
    const { show, onHide, historyList } = props;

    return (
        <MokaModal size="lg" width={700} height={500} show={show} onHide={onHide} title="작업정보" centered draggable>
            <MokaTable rows={[]} columnDefs={columnDefs} onRowNodeId={(data) => data.seq} paging={false} className="h-100" />
        </MokaModal>
    );
};

export default ArticleHistoryModal;
