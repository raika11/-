import React, { useImperativeHandle, useState, forwardRef } from 'react';
import Button from 'react-bootstrap/Button';

/**
 * Button Renderer
 * 버튼명 : text가 있을 경우 text 노출, 없으면 field 노출
 * 클릭 함수 : clickFunctionName이 있을 경우 그 명칭에 해당하는 함수 실행, 없으면 onClick 실행
 */
const MokaTableButton = forwardRef((params, ref) => {
    const { text, clickFunctionName } = params;
    const [field] = useState(params.colDef.field);

    useImperativeHandle(ref, () => ({
        refresh: () => true,
    }));

    return (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <Button
                variant="outline-table-btn"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (clickFunctionName && params.node.data[clickFunctionName]) {
                        Function.prototype.call(params.node.data[clickFunctionName], params.node.data);
                    } else if (params.node.data.onClick) {
                        params.node.data.onClick(params.node.data);
                    }
                }}
                size="sm"
            >
                {text ? text : field === 'add' ? '등록' : field}
            </Button>
        </div>
    );
});

export default MokaTableButton;
