import React, { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
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
            <MokaCard
                className="mb-0 flex-fill"
                height={CARD_DEFAULT_HEIGHT}
                headerClassName="d-flex justify-content-between align-item-center"
                bodyClassName="d-flex flex-column"
                title="댓글 관리"
                titleClassName="mb-0"
                minWidth={1360}
            >
                <Suspense>
                    <CommentList />
                </Suspense>
            </MokaCard>
        </div>
    );
};

export default Comment;
