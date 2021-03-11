import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BoardsGroupTree from './BoardsGroupTree/BoardsGroupTree';
import BoardsContentsList from './BoardsContentsList/BoardsContentsList';
import BoardsEdit from './BoardsEdit/BoardsEdit';

const BoardsList = ({ match, displayName }) => {
    // 공통 구분값 URL
    const { pagePathName } = useSelector((store) => ({
        pagePathName: store.board.pagePathName,
    }));

    return (
        <div className="d-flex">
            <Helmet>
                <title>{displayName}</title>
                <meta name="description" content={`${displayName} 페이지입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 트리 */}
            <Switch>
                <Route
                    path={[
                        `/${pagePathName}/:boardId/:parentBoardSeq/:reply/:boardSeq`,
                        `/${pagePathName}/:boardId/:boardSeq/:reply`,
                        `/${pagePathName}/:boardId/:boardSeq`,
                        `/${pagePathName}/:boardId`,
                        `/${pagePathName}`,
                    ]}
                    exact
                    render={() => <BoardsGroupTree />}
                />
            </Switch>

            {/* 리스트 */}
            <Switch>
                <Route
                    path={[
                        `/${pagePathName}/:boardId/:parentBoardSeq/:reply/:boardSeq`,
                        `/${pagePathName}/:boardId/:boardSeq/:reply`,
                        `/${pagePathName}/:boardId/:boardSeq`,
                        `/${pagePathName}/:boardId`,
                    ]}
                    exact
                    render={() => <BoardsContentsList />}
                />
            </Switch>

            {/* 수정창 */}
            <Switch>
                <Route
                    path={[
                        `/${pagePathName}/:boardId/:parentBoardSeq/:reply/:boardSeq`,
                        `/${pagePathName}/:boardId/:boardSeq/:reply`,
                        `/${pagePathName}/:boardId/:boardSeq`,
                        `/${pagePathName}/:boardId/add`,
                    ]}
                    exact
                    render={() => <BoardsEdit />}
                />
            </Switch>
        </div>
    );
};

export default BoardsList;
