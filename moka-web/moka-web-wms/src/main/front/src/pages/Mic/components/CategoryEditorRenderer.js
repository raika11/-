import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { MokaInput } from '@components';

/**
 * 카테고리 제목 수정
 */
const CategoryEditorRenderer = forwardRef((params, ref) => {
    // state
    const field = params.colDef.field;
    const data = params.data;
    const [error, setError] = useState(false);
    const [name, setName] = useState('');

    useImperativeHandle(
        ref,
        () => ({
            refresh: () => {
                return false;
            },
        }),
        [],
    );

    // const validate = () => {
    //     const regex = /[^\s\t\n]+/;

    //     if (!regex.test(editValue)) {
    //         setError(true);
    //         return false;
    //     }

    //     setError(false);
    //     return true;
    // };

    const handleChangeValue = (e) => {
        setName(e.target.value);
    };

    const handleBlur = (e) => {
        params.setValue(e.target.value);
    };

    useEffect(() => {
        if (data && field) {
            setName(data[field]);
        }
    }, [data, field]);

    return <MokaInput className="ft-12" value={name} onChange={handleChangeValue} onBlur={handleBlur} isInvalid={error} />;
});

export default CategoryEditorRenderer;
