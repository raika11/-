import React, { useEffect, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { clearStore } from '@store/jpod';
import { getBoardChannelList, getJpodBoard, changeSelectBoard } from '@store/jpod';
import NoticeList from '@pages/Jpod/JpodNotice/NoticeList';
import NoticeEdit from '@pages/Jpod/JpodNotice/NoticeEdit';

/**
 * J팟 관리 - 공지 게시판
 */
const JpodChannel = ({ match }) => {
    const dispatch = useDispatch();

    const { boardList } = useSelector((store) => ({
        boardList: store.jpod.jpodNotice.boardList,
    }));

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

    useEffect(() => {
        if (boardList.length > 0) {
            dispatch(changeSelectBoard(boardList[0]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardList]);

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
