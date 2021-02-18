import React, { useEffect, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { MokaLoader } from '@components';
import { useDispatch } from 'react-redux';
import { clearStore } from '@store/jpod';

const NoticeList = React.lazy(() => import('./JpodNotice/NoticeList'));
const NoticeEdit = React.lazy(() => import('./JpodNotice/NoticeEdit'));

// 임시.
const selectBoard = {
    boardId: 94,
    boardName: '테스트 job 게시판',
    boardType: 'S',
    usedYn: 'Y',
    titlePrefix1: '말머리1',
    titlePrefix2: '말머리2',
    insLevel: '1',
    viewLevel: '1',
    answLevel: '1',
    replyLevel: '1',
    editorYn: 'Y',
    answYn: 'N',
    replyYn: 'N',
    fileYn: 'N',
    allowFileCnt: 0,
    allowFileSize: 0,
    allowFileExt: '',
    recomFlag: '0',
    declareYn: 'N',
    captchaYn: 'N',
    channelType: 'BOARD_DIVC1',
    boardDesc: '테스트용',
    emailReceiveYn: 'N',
    receiveEmail: null,
    sendEmail: null,
    emailSendYn: 'N',
    exceptItem: 'ADDR',
    regDt: '2021-02-18 18:43:54',
    headerContent: null,
    footerContent: null,
};

const JpodChannel = ({ match }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

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
                    path={[`${match.path}`, `${match.path}/add`, `${match.path}/:boardSeq`]}
                    exact
                    render={() => (
                        <Suspense fallback={<MokaLoader />}>
                            <NoticeList match={match} SelectBoard={selectBoard} />
                        </Suspense>
                    )}
                />
            </Switch>

            {/* 등록 / 수정창 */}
            <Switch>
                <Suspense fallback={<MokaLoader />}>
                    <Route
                        path={([`${match.path}/add`], [`${match.path}/:boardSeq`])}
                        exact
                        render={(props) => <NoticeEdit {...props} match={match} SelectBoard={selectBoard} />}
                    />
                </Suspense>
            </Switch>
        </div>
    );
};

export default JpodChannel;
