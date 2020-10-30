import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RelationTemplateList } from '@pages/commons';
import { ITEM_PG } from '@/constants';
import TemplateHtmlModal from '../modals/TemplateHtmlModal';

const PageChildTemplateList = ({ show }) => {
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
            <RelationTemplateList show={show} relSeqType={ITEM_PG} relSeq={page.pageSeq} onRowClicked={handleRowClicked} />
            <TemplateHtmlModal data={selected} show={showModal} onHide={() => setShowModal(false)} />
        </React.Fragment>
    );
};

export default PageChildTemplateList;
