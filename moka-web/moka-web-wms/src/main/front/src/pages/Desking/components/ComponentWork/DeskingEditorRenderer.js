import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import clsx from 'clsx';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { MokaTableEditButton, MokaInput, MokaTableEditCancleButton } from '@components';
import toast from '@utils/toastUtil';

/**
 * 데스킹 워크의 타이틀 노출 + 에디터 + 제목 수정 + 삭제 기능이 모여있는 컴포넌트
 */
const DeskingEditorRenderer = forwardRef((params, ref) => {
    const { data: initialData } = params;
    const { onSave, onDelete, onRowClicked } = initialData;

    // state
    const [editMode, setEditMode] = useState(false);
    const [editValue, setEditValue] = useState('');
    const [error, setError] = useState(false);
    const [data, setData] = useState(initialData);

    useImperativeHandle(ref, () => ({
        refresh: (params) => {
            setData(params.data);
            return true;
        },
    }));

    const validate = () => {
        const regex = /[^\s\t\n]+/;

        if (!regex.test(editValue)) {
            setError(true);
            return false;
        }

        setError(false);
        return true;
    };

    /**
     * 제목수정/저장 버튼
     */
    const handleClickEdit = () => {
        if (editMode) {
            if (!validate()) return;
            if (!onSave) return;
            onSave(
                {
                    ...data,
                    title: editValue,
                    onRowClicked: undefined,
                    onSave: undefined,
                    onDelete: undefined,
                },
                ({ header }) => {
                    if (!header.success) {
                        toast.fail(header.message);
                    } else {
                        setEditMode(false);
                    }
                },
            );
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
            setEditValue(data.title);
            setError(false);
        } else {
            if (onDelete) {
                onDelete(data);
            }
        }
    };

    /**
     * row 클릭
     * @param {object} e event
     */
    const handleClickRow = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (onRowClicked) {
            onRowClicked(data);
        }
    };

    useEffect(() => {
        setEditValue(data.title);
    }, [data]);

    return (
        <div className="d-flex h-100 align-items-center desking-ag-grid-editor">
            <OverlayTrigger overlay={<Tooltip id={data.contentId}>{editValue}</Tooltip>}>
                <div className={clsx('title', 'cursor-pointer', { rel: data.rel })} onClick={handleClickRow} style={{ minWidth: data.rel ? 245 : 173 }}>
                    {editValue}
                </div>
            </OverlayTrigger>
            {editMode && (
                <div className="edit">
                    <MokaInput as={data.rel ? 'input' : 'textarea'} className="resize-none" value={editValue} onChange={(e) => setEditValue(e.target.value)} isInvalid={error} />
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
});

export default DeskingEditorRenderer;