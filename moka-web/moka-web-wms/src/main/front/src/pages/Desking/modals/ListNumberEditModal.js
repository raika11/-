import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { MokaInputLabel, MokaModal } from '@components';
import { putComponentWork } from '@store/desking';
import toast from '@utils/toastUtil';

const ListNumberEditModal = (props) => {
    const { show, onHide, data } = props;
    const dispatch = useDispatch();
    const [number, setNumber] = useState(data.perPageCount);

    const handleSave = () => {
        dispatch(
            putComponentWork({
                componentWork: {
                    ...data,
                    perPageCount: number,
                },
                callback: ({ header }) => {
                    if (header.success) {
                        toast.success(header.message);
                    } else {
                        toast.warn(header.message);
                    }
                },
            }),
        );
    };

    return (
        <MokaModal
            title="주요 뉴스 리스트 건수"
            size="sm"
            width={303}
            show={show}
            onHide={onHide}
            buttons={[
                { variant: 'positive', text: '저장', onClick: handleSave },
                { variant: 'negative', text: '취소', onClick: onHide },
            ]}
            footerClassName="d-flex justify-content-center"
            draggable
        >
            <MokaInputLabel label="주요 뉴스 리스트 건수" labelWidth={150} className="m-0 px-3" value={number} onChange={(e) => setNumber(e.target.value)} />
        </MokaModal>
    );
};

export default ListNumberEditModal;
