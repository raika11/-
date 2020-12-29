import React, { Suspense, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {} from '@store/boards';
import { MokaLoader } from '@components';

const BoardsGroupTree = React.lazy(() => import('./BoardsGroupTree/BoardsGroupTree'));
const BoardsContentsList = React.lazy(() => import('./BoardsContentsList/BoardsContentsList'));
const BoardsEdit = React.lazy(() => import('./BoardsEdit/BoardsEdit'));

const BoardsList = () => {
    // 공통 구분값 URL
    const { pagePathName } = useSelector((store) => ({
        pagePathName: store.boards.pagePathName,
    }));

    return (
        <div className="d-flex">
            <Helmet>
                <title>게시글 게시판 관리</title>
                <meta name="description" content="게시글 게시판 관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 트리 */}
            <Switch>
                <Route
                    path={[`/${pagePathName}`, `/${pagePathName}/:boardId`, `/${pagePathName}/:boardId/:boardId`]}
                    exact
                    render={() => (
                        <Suspense fallback={<MokaLoader />}>
                            <BoardsGroupTree />
                        </Suspense>
                    )}
                />
            </Switch>

            {/* 리스트 */}
            <Switch>
                <Route
                    path={[`/${pagePathName}`, `/${pagePathName}/:boardId`, `/${pagePathName}/:boardId/:boardId`]}
                    exact
                    render={() => (
                        <Suspense fallback={<MokaLoader />}>
                            <BoardsContentsList />
                        </Suspense>
                    )}
                />
            </Switch>

            {/* 수정창 */}
            <Switch>
                <Route
                    path={[`/${pagePathName}/:boardId`, `/${pagePathName}/:boardId/:boardId`]}
                    exact
                    render={() => (
                        <Suspense fallback={<MokaLoader />}>
                            <BoardsEdit />
                        </Suspense>
                    )}
                />
            </Switch>
        </div>
    );
};

export default BoardsList;