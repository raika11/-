import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { MokaTableEditButton, MokaInput, MokaTableEditCancleButton } from '@components';
import toast from '@utils/toastUtil';

const DeskingEditorRenderer = (params) => {
    const { data } = params;

    // state
    const [editMode, setEditMode] = useState(false);
    const [editValue, setEditValue] = useState('');

    /**
     * 제목수정/저장 버튼
     */
    const handleClickEdit = () => {
        if (editMode) {
            // 저장 로직
            if (data.onSave) {
                data.onSave(
                    {
                        ...data,
                        title: !data.rel ? editValue : '',
                        relTitle: data.rel ? editValue : '',
                        onRowClicked: undefined,
                        onSave: undefined,
                        onDelete: undefined,
                    },
                    ({ header }) => {
                        if (!header.success) {
                            toast.warn(header.message);
                        } else {
                            setEditMode(false);
                        }
                    },
                );
            }
        } else {
            setEditMode(true);
        }
    };

    /**
     * 취소/삭제 버튼
     */
    const handleClickDelete = () => {
        if (editMode) {
            setEditMode(false);
            setEditValue(data.rel ? data.relTitle : data.title);
        } else {
            if (data.onDelete) {
                data.onDelete(params);
            }
        }
    };

    useEffect(() => {
        setEditValue(data.rel ? data.relTitle : data.title);
    }, [data]);

    if (data.title !== '' && data.rel) return null;

    return (
        <div className="d-flex h-100 align-items-center desking-ag-grid-editor">
            <div className={clsx('title', { rel: data.rel })}>{data.rel ? data.relTitle : data.title}</div>
            {editMode && (
                <div className="edit">
                    <MokaInput as={data.rel ? 'input' : 'textarea'} className="resize-none" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                </div>
            )}
            <div className="mr-1" style={{ height: 25, width: 25 }}>
                <MokaTableEditButton editing={editMode} onClick={handleClickEdit} />
            </div>
            <div style={{ height: 25, width: 25 }}>
                <MokaTableEditCancleButton editing={editMode} onClick={handleClickDelete} />
            </div>
        </div>
    );
};

export default DeskingEditorRenderer;
