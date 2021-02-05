import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import { MokaInput } from '@/components';

/**
 * 포스트 상태 변경
 */
const PostSelectRenderer = forwardRef((params, ref) => {
    const field = params.colDef.field;
    const data = params.node.data;
    const [answDiv, setAnswDiv] = useState(data[field]);
    const ANSWER_DIV = useSelector(({ app }) => app.ANSWER_DIV || []);

    useImperativeHandle(
        ref,
        () => ({
            refresh: () => true,
            init: () => true,
            setValue: (answDiv) => setAnswDiv(answDiv),
            getValue: () => answDiv,
        }),
        [answDiv],
    );

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        setAnswDiv(e.target.value);
        params.api.applyTransaction({ update: [{ ...params.node.data, [field]: e.target.value }] });
        if (params.data.onChangeAnswDiv) {
            params.data.onChangeAnswDiv.call(null, params.node.data);
        }
    };

    return (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <MokaInput as="select" value={answDiv} onChange={handleChangeValue}>
                {ANSWER_DIV.map((div) => (
                    <option key={div.code} value={div.code}>
                        {div.name}
                    </option>
                ))}
            </MokaInput>
        </div>
    );
});

export default PostSelectRenderer;
