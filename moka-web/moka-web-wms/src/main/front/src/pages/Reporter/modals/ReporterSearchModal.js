import React from 'react';
import { MokaModal } from '@components';
import Search from '../relations/ReporterModalSearch';
import AgGrid from '../relations/ReporterModalAgGrid';

const ReporterMgrSearchModal = (props) => {
    const { show, onHide } = props;

    return (
        <MokaModal size="xl" show={show} onHide={onHide} title="기자 검색" width={970} draggable>
            <Search />
            <AgGrid />
        </MokaModal>
    );
};

export default ReporterMgrSearchModal;
