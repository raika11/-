import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Button from 'react-bootstrap/Button';
// import { FB_DEBUGGER_LINK } from '@/constants';

const ArticleActionBtn = forwardRef((params, ref) => {
    const [data, setData] = useState(params.node.data);

    useImperativeHandle(
        ref,
        () => ({
            refresh: (params) => {
                setData(params.node.data);
                return true;
            },
        }),
        [],
    );

    // 삭제 버튼 iud 테이블에 들어가있으면 삭제 불가 (삭제 중인 상태 iud === 'D')
    // 중지 버튼 serviceFlag === 'Y' 이거나 iud 테이블에 들어가있으면 중지 불가 (중지 중인 상태 iud === 'E')
    return (
        <div className="d-flex align-items-center h-100">
            <Button size="sm" variant="outline-table-btn" className="mr-1 px-1 flex-shrink-0" onClick={() => data.handleClickDelete(data)} disabled={data.iud === 'D'}>
                삭제
            </Button>
            <Button
                size="sm"
                variant="outline-table-btn"
                className="mr-1 px-1 flex-shrink-0"
                disabled={data.serviceFlag !== 'Y' || data.iud === 'E'}
                onClick={() => data.handleClickStop(data)}
            >
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
