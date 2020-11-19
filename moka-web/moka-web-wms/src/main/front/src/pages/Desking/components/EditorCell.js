import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { MokaTableDeleteButton, MokaTableEditButton, MokaInput } from '@components';

const EditorCell = (params) => {
    const { data } = params;
    const [editMode, setEditMode] = useState(false);
    const [editValue, setEditValue] = useState('');

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
                <MokaTableEditButton onStartEditing={() => setEditMode(true)} onEndEditing={() => setEditMode(false)} />
            </div>
            <div style={{ height: 25, width: 25 }}>
                <MokaTableDeleteButton onClick={data.onDelete} />
            </div>
        </div>
    );
};

export default EditorCell;
