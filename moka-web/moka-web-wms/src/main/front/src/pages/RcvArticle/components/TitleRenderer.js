import React, { useState, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';
import Badge from 'react-bootstrap/Badge';

const titleReg = /[\[\(]+(속보|긴급|1보|종합1보|2보|종합2보|종합|수정)[\]\)]+/;

const TitleRenderer = forwardRef((originParam, ref) => {
    const [params, setParams] = useState(originParam);
    const [titleArr, setTitleArr] = useState([]);
    const [show, setShow] = useState(false);
    const ele = useRef(null);

    useImperativeHandle(ref, () => ({
        refresh: (newParams) => {
            setShow(false);
            if (newParams.data[params.colDef.field] !== params[params.colDef.field]) {
                setParams(newParams);
                return true;
            } else {
                return false;
            }
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

    useEffect(() => {
        if (titleArr.length > 1) {
            setTimeout(
                function () {
                    if (ele.current) {
                        let height = ele.current.offsetHeight;
                        if (height < 34) height = 34;
                        params.node.setRowHeight(height + 2);
                        params.api.onRowHeightChanged();
                        setShow(true);
                    }
                },
                [100],
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [titleArr]);

    return (
        <p className={clsx('mb-0', { 'color-white': !show })} ref={ele}>
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
