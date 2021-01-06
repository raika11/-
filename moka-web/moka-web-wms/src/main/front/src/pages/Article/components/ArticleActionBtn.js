import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { stopArticle, deleteArticle } from '@store/article';
import { FB_DEBUGGER_LINK } from '@/constants';
import toast, { messageBox } from '@utils/toastUtil';

const ArticleActionBtn = forwardRef(({ data: initialData }, ref) => {
    const dispatch = useDispatch();
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

    /**
     * 삭제
     */
    const handleClickDelete = () => {
        messageBox.confirm(
            '삭제 후 복구가 불가능합니다.\n그래도 해당 기사를 삭제하시겠습니까?',
            () => {
                dispatch(
                    deleteArticle({
                        totalId: data.totalId,
                        callback: ({ header }) => {
                            if (header.success) {
                                toast.success(header.message);
                            } else {
                                toast.fail(header.message);
                            }
                        },
                    }),
                );
            },
            () => {},
        );
    };

    /**
     * 중지
     */
    const handleClickStop = () => {
        messageBox.confirm(
            '기사가 더이상 서비스 되지 않습니다.\n다시 서비스하려면 기사 수정 기능을 사용하세요.\n계속 하시겠습니까?',
            () => {
                dispatch(
                    stopArticle({
                        totalId: data.totalId,
                        callback: ({ header }) => {
                            if (header.success) {
                                toast.success(header.message);
                            } else {
                                toast.fail(header.message);
                            }
                        },
                    }),
                );
            },
            () => {},
        );
    };

    return (
        <div className="d-flex align-items-center h-100">
            <Button size="sm" variant="outline-table-btn2" className="mr-1 flex-shrink-0" onClick={handleClickDelete}>
                삭제
            </Button>
            <Button size="sm" variant="outline-table-btn2" className="mr-1 flex-shrink-0" disabled={data.serviceFlag !== 'Y'} onClick={handleClickStop}>
                중지
            </Button>
            <Button size="sm" variant="outline-table-btn" className="mr-1 flex-shrink-0" onClick={() => window.open(`${FB_DEBUGGER_LINK}${data.totalId}`)}>
                FB
            </Button>
        </div>
    );
});

export default ArticleActionBtn;
