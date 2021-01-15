import React, { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';
import { clearStore } from '@store/commentManage';

const CommentList = React.lazy(() => import('./CommentLIst'));

/**
 * 댓글 관리
 */
const Comment = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>댓글 관리</title>
                <meta name="description" content="댓글 관리 페이지 입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard className="w-100" bodyClassName="d-flex flex-column" title="댓글 관리">
                <Suspense>
                    <CommentList />
                </Suspense>
            </MokaCard>
        </div>
    );
};

export default Comment;
