import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import clsx from 'clsx';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { MokaTableEditButton, MokaInput, MokaTableEditCancleButton } from '@components';
import { escapeHtmlArticle } from '@utils/convertUtil';
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
    const [editable, setEditable] = useState(false);

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
                    title: escapeHtmlArticle(editValue),
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

    useEffect(() => {
        if (initialData.deskingPart) {
            setEditable(initialData.deskingPart.split(',').indexOf('TITLE') > -1);
        }
    }, [initialData]);

    return (
        <div className="d-flex h-100 align-items-center ag-grid-desking-editor justify-content-between overflow-hidden">
            <OverlayTrigger overlay={<Tooltip id={data.contentId}>{editValue}</Tooltip>}>
                <div className={clsx('title', 'cursor-pointer', { rel: data.rel })} onClick={handleClickRow} style={{ minWidth: data.rel ? 243 : 171 }}>
                    {editValue}
                </div>
            </OverlayTrigger>

            <div className="d-flex align-items-center">
                {/* 수정버튼(deskingPart에 TITLE이 포함되어 있을 때만 처리) */}
                {editable && (
                    <React.Fragment>
                        {editMode && (
                            <div className="edit">
                                <MokaInput
                                    as={data.rel ? 'input' : 'textarea'}
                                    className="resize-none"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    isInvalid={error}
                                />
                            </div>
                        )}
                        <div style={{ height: 23, width: 23 }}>
                            <MokaTableEditButton editing={editMode} onClick={handleClickEdit} />
                        </div>
                    </React.Fragment>
                )}

                {/* 삭제버튼 */}
                <div style={{ height: 23, width: 23 }}>
                    <MokaTableEditCancleButton editing={editMode} onClick={handleClickDelete} />
                </div>
            </div>
        </div>
    );
});

export default DeskingEditorRenderer;
