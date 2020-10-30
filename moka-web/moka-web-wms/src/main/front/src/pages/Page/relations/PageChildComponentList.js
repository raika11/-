import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RelationComponentList } from '@pages/commons';
import { ITEM_PG } from '@/constants';
import ComponentHtmlModal from '../modals/ComponentHtmlModal';

const PageChildComponentList = ({ show }) => {
    const { page } = useSelector((store) => ({
        page: store.page.page,
    }));

    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState({});

    const handleRowClicked = (data) => {
        setSelected(data);
        setShowModal(true);
    };

    return (
        <React.Fragment>
            <RelationComponentList show={show} relSeqType={ITEM_PG} relSeq={page.pageSeq} onRowClicked={handleRowClicked} />
            <ComponentHtmlModal data={selected} show={showModal} onHide={() => setShowModal(false)} />
        </React.Fragment>
    );
};

export default PageChildComponentList;
