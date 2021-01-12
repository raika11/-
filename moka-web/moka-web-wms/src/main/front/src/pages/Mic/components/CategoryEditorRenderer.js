import React, { useState, useEffect } from 'react';
import { MokaInput } from '@components';

/**
 * 카테고리 제목 수정
 */
const CategoryEditorRenderer = (params) => {
    const { data } = params;
    // state
    const [categoryName, setCategoryName] = useState(data.categoryName);
    const [error, setError] = useState(false);

    // const validate = () => {
    //     const regex = /[^\s\t\n]+/;

    //     if (!regex.test(editValue)) {
    //         setError(true);
    //         return false;
    //     }

    //     setError(false);
    //     return true;
    // };

    return <MokaInput className="ft-12" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} isInvalid={error} />;
};

export default CategoryEditorRenderer;
