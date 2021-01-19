import React, { useState, forwardRef, useEffect, useImperativeHandle } from 'react';
import Badge from 'react-bootstrap/Badge';

const titleReg = /[\[\(]+(속보|긴급|1보|종합1보|2보|종합2보|종합|수정)[\]\)]+/;

const TitleRenderer = forwardRef((originParam, ref) => {
    const [params, setParams] = useState(originParam);
    const [titleArr, setTitleArr] = useState([]);

    useImperativeHandle(ref, () => ({
        refresh: (newParams) => {
            if (newParams.data[params.colDef.field] !== params[params.colDef.field]) {
                setParams(newParams);
            }
            return false;
        },
    }));

    useEffect(() => {
        const title = params.data[params.colDef.field];
        if (title) {
            const result = title.match(titleReg);
            if (result !== null) {
                setTitleArr([result[1], title.replace(result[0], '')]);
            } else {
                setTitleArr([null, title]);
            }
        }
    }, [params]);

    return (
        <p className="mb-0">
            {titleArr && titleArr[0] && (
                <Badge variant={titleArr[0] !== '수정' ? 'success' : 'searching'} className="mr-1">
                    {titleArr[0]}
                </Badge>
            )}
            {titleArr && titleArr[1]}
        </p>
    );
});

export default TitleRenderer;
