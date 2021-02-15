import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BoardsGroupTree from './BoardsGroupTree/BoardsGroupTree';
import BoardsContentsList from './BoardsContentsList/BoardsContentsList';
import BoardsEdit from './BoardsEdit/BoardsEdit';

const BoardsList = () => {
    // 공통 구분값 URL
    const { pagePathName } = useSelector((store) => ({
        pagePathName: store.board.pagePathName,
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
                    path={[
                        `/${pagePathName}`,
                        `/${pagePathName}/:boardId`,
                        `/${pagePathName}/:boardId/:boardSeq`,
                        `/${pagePathName}/:boardId/:boardSeq/reply`,
                        `/${pagePathName}/:boardId/:parentBoardSeq/reply/:boardSeq`,
                    ]}
                    exact
                    render={() => <BoardsGroupTree />}
                />
            </Switch>

            {/* 리스트 */}
            <Switch>
                <Route
                    path={[
                        `/${pagePathName}/:boardId`,
                        `/${pagePathName}/:boardId/:boardSeq`,
                        `/${pagePathName}/:boardId/:boardSeq/reply`,
                        `/${pagePathName}/:boardId/:parentBoardSeq/reply/:boardSeq`,
                    ]}
                    exact
                    render={() => <BoardsContentsList />}
                />
            </Switch>

            {/* 수정창 */}
            <Switch>
                <Route
                    path={[
                        `/${pagePathName}/:boardId/add`,
                        `/${pagePathName}/:boardId/:boardSeq`,
                        `/${pagePathName}/:boardId/:boardSeq/reply`,
                        `/${pagePathName}/:boardId/:parentBoardSeq/reply/:boardSeq`,
                    ]}
                    exact
                    render={() => <BoardsEdit />}
                />
            </Switch>
        </div>
    );
};

export default BoardsList;
