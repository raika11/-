import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { GRID_ROW_HEIGHT, GRID_LINE_HEIGHT, WEBKIT_BOX } from '@/style_constants';

/**
 * ag-grid 셀에 긴 텍스트를 그리는 컴포넌트.
 * text는 field로 넘어온 값을 data에서 찾아서 사용하며 대체 텍스트는 data.imgAlt를 사용한다.
 *
 * @param {object} params ag grid params
 */
const MokaTableLongTextRenderer = forwardRef((params, ref) => {
    const { colDef } = params;
    const [field] = useState(colDef.field);
    const [data, setData] = useState(params.node.data);
    const [style, setStyle] = useState({});

    useImperativeHandle(ref, () => ({
        refresh: (params) => {
            setData(params.node.data);
            return true;
        },
    }));

    React.useEffect(() => {
        const rowHeight = params.node.rowHeight;
        let idx = GRID_ROW_HEIGHT.T.findIndex((f) => f === rowHeight);
        if (idx < 0) idx = GRID_ROW_HEIGHT.C.findIndex((f) => f === rowHeight);
        if (idx > -1) setStyle(WEBKIT_BOX(idx + 1));
    }, [params]);

    return (
        <div className="h-100 w-100 ag-preline-cell">
            <span style={{ margin: 'auto 0', lineHeight: `${GRID_LINE_HEIGHT.M}px`, ...style }}>{data?.[field]}</span>
        </div>
    );
});

export default MokaTableLongTextRenderer;
