import React, { useState } from 'react';

const KEY_BACKSPACE = 8;
const KEY_DELETE = 46;
const KEY_F2 = 113;
const KEY_ENTER = 13;
const KEY_TAB = 9;

/** --------------------------------------------
 * ag-grid의 셀에 사용하는 input 에디터
 * ---------------------------------------------
 * 부모 grid가 input의 값을 사용할 수 있도록
 * 1) colDef의 cellEditor에 해당 컴포넌트를 선언하고
 * 2) React.forwardRef를 사용하여 부모가 전달한 ref를 자식 input에 연결한다.
 *
 * 변경된 텍스트를 부모 grid에서 사용할 수 있도록
 * 1) React.useImperativeHandle를 사용하여 getValue를 구현한다.
 * https://medium.com/@kelly.kh.woo/react-hook-useimperativehandle-89fee716d80
 *
 * @param {object} props Props
 * @param {object} ref 부모컴포넌트에서 넘긴 ref
 */
const CellEditor = (props, ref) => {
    const { value, ...rest } = props;
    const [cellValue, setCellValue] = React.useState(value || '');

    React.useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                return cellValue;
            }
        };
    });

    const handleKeyDown = (e) => {
        if (e.keyCode === KEY_ENTER) {
            // const index = rest.node.getRowIndexString();
            rest.api.applyTransaction({
                update: [rest.node.data]
            });
        }
    };

    return (
        <input
            ref={ref}
            value={cellValue}
            // onKeyDown={handleKeyDown}
            onChange={(e) => setCellValue(e.target.value)}
            style={{
                width: '100%',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: '"Noto Sans KR","맑은고딕",Roboto,Arial,sans-serif',
                border: '1px solid #DADADA'
            }}
        />
    );
};

export default React.forwardRef(CellEditor);
