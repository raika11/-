import React, { useState, useImperativeHandle, forwardRef } from 'react';
import clsx from 'clsx';
import { GRID_ROW_HEIGHT, GRID_LINE_HEIGHT, WEBKIT_BOX } from '@/style_constants';

const defaultProps = {
    cellClass: 'ag-preline-cell',
};

/**
 * ag-grid 셀에 긴 텍스트를 그리는 컴포넌트
 * 노출 텍스트는 data[field] 값을 사용한다
 *
 * @param {object} params ag grid params
 */
const MokaTableLongTextRenderer = forwardRef((params, ref) => {
    const { colDef, cellClass } = params;
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
        <div className={clsx('h-100 w-100', cellClass)}>
            <span style={{ margin: 'auto 0', lineHeight: `${GRID_LINE_HEIGHT.M}px`, ...style }}>{data?.[field]}</span>
        </div>
    );
});

MokaTableLongTextRenderer.defaultProps = defaultProps;

export default MokaTableLongTextRenderer;
