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
    const { data } = params;

    // state
    const [editMode, setEditMode] = useState(false);
    const [editValue, setEditValue] = useState('');

    useImperativeHandle(ref, () => ({
        refresh: (params) => {
            if (params.data.rel) {
                return params.data.relTitle !== data.relTitle;
            } else {
                return params.data.title !== data.title;
            }
        },
    }));

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
                data.onDelete(data);
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

        if (data.onRowClicked) {
            data.onRowClicked(data);
        }
    };

    useEffect(() => {
        setEditValue(data.rel ? data.relTitle : data.title);
    }, [data]);

    if (data.title !== '' && data.rel) return null;

    return (
        <div className="d-flex h-100 align-items-center desking-ag-grid-editor">
            <OverlayTrigger overlay={<Tooltip id={data.contentId}>{editValue}</Tooltip>}>
                <div className={clsx('title', 'cursor-pointer', { rel: data.rel })} onClick={handleClickRow} style={{ minWidth: data.rel ? 245 : 173 }}>
                    {editValue}
                </div>
            </OverlayTrigger>
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
});

export default DeskingEditorRenderer;
