import React from 'react';
import { MokaModal } from '@components';

const IssueContentsModal = ({ show, onHide, pkg }) => {
    return <MokaModal show={show} onHide={onHide} title={pkg.pkgTitle} draggable></MokaModal>;
};

export default IssueContentsModal;
