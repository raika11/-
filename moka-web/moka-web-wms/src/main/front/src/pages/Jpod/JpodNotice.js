import React, { useEffect, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { clearStore } from '@store/jpod';
import { getBoardChannelList, getJpodBoard } from '@store/jpod';

const NoticeList = React.lazy(() => import('./JpodNotice/NoticeList'));
const NoticeEdit = React.lazy(() => import('./JpodNotice/NoticeEdit'));

/**
 * J팟 관리 - 공지 게시판
 */
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

            <Suspense>
                <NoticeList match={match} />
            </Suspense>

            {/* 등록 / 수정창 */}
            <Switch>
                <Route
                    path={[
                        `${match.path}/add`,
                        `${match.path}/:boardId/:boardSeq`,
                        `${match.path}/:boardId/:boardSeq/reply`,
                        `${match.path}/:boardId/:parentBoardSeq/reply/:boardSeq`,
                    ]}
                    exact
                    render={(props) => (
                        <Suspense>
                            <NoticeEdit {...props} match={match} />
                        </Suspense>
                    )}
                />
            </Switch>
        </div>
    );
};

export default JpodChannel;
