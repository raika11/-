import React, { useState, forwardRef, useEffect, useImperativeHandle } from 'react';
import Badge from 'react-bootstrap/Badge';

const badgeReg = new RegExp(/([\[\(]+(속보|긴급|1보|종합1보|2보|종합2보|종합|수정)[\]\)]+)(.*)/);

const TitleRenderer = forwardRef((params, ref) => {
    const { data: initialData, colDef } = params;
    const [field] = useState(colDef.field);
    const [data, setData] = useState(initialData);
    const [badgeTitle, setBadgeTitle] = useState(null);

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
            const result = badgeReg.exec(title);
            // result = [종합]미-이란,[종합],종합,미-이란
            if (result) {
                setBadgeTitle([result[2], result[3]]);
            } else {
                setBadgeTitle([null, title]);
            }
        }
    }, [initialData, field]);

    return (
        <div>
            {badgeTitle && badgeTitle[0] && (
                <Badge variant={badgeTitle[0] !== '수정' ? 'success' : 'searching'} className="mr-1">
                    {badgeTitle[0]}
                </Badge>
            )}
            {badgeTitle && badgeTitle[1]}
        </div>
    );
});

export default TitleRenderer;
