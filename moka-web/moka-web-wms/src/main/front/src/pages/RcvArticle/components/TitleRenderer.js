import React, { useState, forwardRef, useEffect, useImperativeHandle } from 'react';
import Badge from 'react-bootstrap/Badge';

const titleReg = /[\[\(]+(속보|긴급|1보|종합1보|2보|종합2보|종합|수정)[\]\)]+/;

const TitleRenderer = forwardRef((params, ref) => {
    const { data: initialData, colDef } = params;
    const [field] = useState(colDef.field);
    const [data, setData] = useState(initialData);
    const [titleArr, setTitleArr] = useState([]);

    useImperativeHandle(ref, () => ({
        refresh: (params) => {
            if (params.data[field] !== data[field]) {
                setData(params.data);
                return true;
            } else {
                return false;
            }
        },
    }));

    useEffect(() => {
        const title = initialData[field];
        if (title) {
            const result = title.match(titleReg);
            if (result !== null) {
                setTitleArr([result[1], title.replace(result[0], '')]);
            } else {
                setTitleArr([null, title]);
            }
        }
    }, [initialData, field]);

    return (
        <div>
            {titleArr && titleArr[0] && (
                <Badge variant={titleArr[0] !== '수정' ? 'success' : 'searching'} className="mr-1">
                    {titleArr[0]}
                </Badge>
            )}
            {titleArr && titleArr[1]}
        </div>
    );
});

export default TitleRenderer;
