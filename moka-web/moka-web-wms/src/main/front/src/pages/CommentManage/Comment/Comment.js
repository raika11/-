import React, { Suspense, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { MokaLoader } from '@components';
import { Helmet } from 'react-helmet';
import { clearStore, getInitData } from '@store/commentManage';

const CommentList = React.lazy(() => import('./CommentLIst'));

/**
 * 댓글 관리
 */
const Comment = ({ match }) => {
    const dispatch = useDispatch();
    const matchPath = useRef(null);

    // 스토어 초기화.
    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    useEffect(() => {
        if (matchPath.current !== match.path) {
            matchPath.current = match.path;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [match]);

    useEffect(() => {
        dispatch(getInitData());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="d-flex">
            <Helmet>
                <title>댓글 관리</title>
                <meta name="description" content="댓글 관리 페이지 입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <Switch>
                <Route
                    path={[`${match.path}`, `${match.path}/:commentSeq`]}
                    exact
                    render={() => (
                        <Suspense fallback={<MokaLoader />}>
                            <CommentList matchPath={matchPath.current} />
                        </Suspense>
                    )}
                />
            </Switch>
        </div>
    );
};

export default Comment;
