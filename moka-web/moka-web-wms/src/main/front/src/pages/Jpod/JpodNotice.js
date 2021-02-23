import React, { useEffect, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { MokaLoader } from '@components';
import { useDispatch } from 'react-redux';
import { clearStore } from '@store/jpod';
import { getBoardChannelList, getJpodBoard } from '@store/jpod';

const NoticeList = React.lazy(() => import('./JpodNotice/NoticeList'));
const NoticeEdit = React.lazy(() => import('./JpodNotice/NoticeEdit'));

const JpodChannel = ({ match }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    // 최초 로딩시 목록 가져오기.
    useEffect(() => {
        dispatch(getJpodBoard());
        dispatch(getBoardChannelList()); // J팟 채널 목록.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="d-flex">
            <Helmet>
                <title>공지게시판 관리</title>
                <meta name="description" content="공지게시판 관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}

            <Switch>
                <Route
                    path={[
                        `${match.path}`,
                        `${match.path}/:boardId`,
                        `${match.path}/:boardId/:boardSeq`,
                        `${match.path}/:boardId/:boardSeq/reply`,
                        `${match.path}/:boardId/:parentBoardSeq/reply/:boardSeq`,
                    ]}
                    exact
                    render={() => (
                        <Suspense fallback={<MokaLoader />}>
                            <NoticeList match={match} />
                        </Suspense>
                    )}
                />
            </Switch>

            {/* 등록 / 수정창 */}
            <Switch>
                <Suspense fallback={<MokaLoader />}>
                    <Route
                        path={[
                            `${match.path}/add`,
                            `${match.path}/:boardId/:boardSeq`,
                            `${match.path}/:boardId/:boardSeq/reply`,
                            `${match.path}/:boardId/:parentBoardSeq/reply/:boardSeq`,
                        ]}
                        exact
                        render={(props) => <NoticeEdit {...props} match={match} />}
                    />
                </Suspense>
            </Switch>
        </div>
    );
};

export default JpodChannel;
