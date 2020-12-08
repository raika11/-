import React from 'react';
// import { useDispatch } from 'react-redux';
import { MokaCard } from '@components';

/**
 * 2020.12.08
 * 기획 바뀔 수 있어서 일단 중단
 */
const ComponentWorkForm = (props) => {
    // const { show, editFormPart, component, onHide } = props;
    const { editFormPart, onHide } = props;
    // const dispatch = useDispatch();

    return (
        <MokaCard
            className="h-100 absolute-top-right"
            width={600}
            title={editFormPart?.partTitle}
            titleClassName="mb-0"
            headerClassName="border-bottom"
            footer
            footerClassName="d-flex justify-content-center border-top"
            footerButtons={[
                { text: '저장', variant: 'positive', className: 'mr-2' },
                { text: '임시저장', variant: 'positive', className: 'mr-2' },
                { text: '닫기', variant: 'negative', onClick: onHide },
            ]}
        >
            내용!!!
        </MokaCard>
    );
};

export default ComponentWorkForm;
