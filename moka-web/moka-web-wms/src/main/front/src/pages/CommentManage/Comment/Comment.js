import React, { Suspense, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { clearStore } from '@store/commentManage';

const CommentList = React.lazy(() => import('./CommentLIst'));

/**
 * 댓글 관리 > 댓글 목록
 */
const Comment = ({ match, displayName }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        // 스토어 초기화
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div>
            <Helmet>
                <title>{displayName}</title>
                <meta name="description" content={`${displayName} 페이지입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <Switch>
                <Route
                    path={[`${match.path}`, `${match.path}/:commentSeq`]}
                    exact
                    render={() => (
                        <Suspense>
                            <CommentList />
                        </Suspense>
                    )}
                />
            </Switch>
        </div>
    );
};

export default Comment;
