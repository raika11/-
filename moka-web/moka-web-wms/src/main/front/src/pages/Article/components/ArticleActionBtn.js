import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Button from 'react-bootstrap/Button';
// import { FB_DEBUGGER_LINK } from '@/constants';

const ArticleActionBtn = forwardRef(({ data: initialData }, ref) => {
    const [data, setData] = useState(initialData);

    useImperativeHandle(
        ref,
        () => ({
            refresh: ({ data: newData }) => {
                if (newData.serviceFlag !== data.serviceFlag) {
                    setData(newData);
                    return true;
                } else {
                    return false;
                }
            },
        }),
        [data.serviceFlag],
    );

    return (
        <div className="d-flex align-items-center h-100">
            <Button size="sm" variant="outline-table-btn" className="mr-1 px-1 flex-shrink-0" onClick={() => data.handleClickDelete(data)}>
                삭제
            </Button>
            <Button size="sm" variant="outline-table-btn" className="mr-1 px-1 flex-shrink-0" disabled={data.serviceFlag !== 'Y'} onClick={() => data.handleClickStop(data)}>
                중지
            </Button>
            {/* FB버튼 제거 */}
            {/* <Button size="sm" variant="outline-table-btn" className="mr-1 px-1 flex-shrink-0" onClick={() => window.open(`${FB_DEBUGGER_LINK}${data.totalId}`)}>
                FB
            </Button> */}
        </div>
    );
});

export default ArticleActionBtn;
