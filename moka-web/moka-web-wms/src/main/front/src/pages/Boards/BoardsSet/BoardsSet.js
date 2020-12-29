import React, { Suspense, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initialState, getSetmenuBoardsList, changeSetMenuSearchOption } from '@store/boards';
import { MokaLoader } from '@components';

const BoardsList = React.lazy(() => import('./Component/BoardsList'));
const BoardsEdit = React.lazy(() => import('./Component/BoardsEdit'));

const BoardsSet = () => {
    const dispatch = useDispatch();
    // 공통 구분값 URL
    const { pagePathName, boardType } = useSelector((store) => ({
        pagePathName: store.boards.pagePathName,
        boardType: store.boards.boardType,
    }));

    // store boardType 값이 변경 되면 검색 옵션 처리후 리스트를 가지고 옵니다.
    useEffect(() => {
        const tmpSearchOption = {
            ...initialState.setmenu.search,
            boardType: boardType,
        };
        dispatch(getSetmenuBoardsList(changeSetMenuSearchOption(tmpSearchOption)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardType]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>전체 게시판 관리</title>
                <meta name="description" content="전체 게시판 관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <Switch>
                <Route path={[`/${pagePathName}`, `/${pagePathName}/add`, `/${pagePathName}/:boardId`]} exact render={() => <BoardsList />} />
            </Switch>

            {/* 수정창 */}
            <Switch>
                <Route
                    path={[`/${pagePathName}/add`, `/${pagePathName}/:boardId`]}
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

export default BoardsSet;
