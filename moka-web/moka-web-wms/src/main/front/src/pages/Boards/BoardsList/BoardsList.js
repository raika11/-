import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import clsx from 'clsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BoardsGroupList from './BoardsGroupList';
import BoardsContentsList from './BoardsContentsList/BoardsContentsList';
import BoardsEdit from './BoardsEdit/BoardsEdit';
import useBreakpoint from '@hooks/useBreakpoint';

/**
 * 게시판 관리 > 게시글 관리
 */
const BoardsList = ({ match, displayName }) => {
    const matchPoints = useBreakpoint();

    return (
        <Container className="p-0 position-relative" fluid>
            <Helmet>
                <title>{displayName}</title>
                <meta name="description" content={`${displayName} 페이지입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            <Row className="m-0">
                <Col xs={2} className={clsx('p-0', { 'pr-gutter': matchPoints.md || matchPoints.lg })}>
                    {/* 트리 */}
                    <Switch>
                        <Route
                            path={[
                                `${match.path}`,
                                `${match.path}/:boardId`,
                                `${match.path}/:boardId/:boardSeq`,
                                `${match.path}/:boardId/:boardSeq/:reply`,
                                `${match.path}/:boardId/:parentBoardSeq/:reply/:boardSeq`,
                            ]}
                            exact
                            render={() => <BoardsGroupList />}
                        />
                    </Switch>
                </Col>

                {/* 리스트 */}
                <Col xs={6} className="p-0 pr-gutter">
                    <Switch>
                        <Route
                            path={[
                                `${match.path}/:boardId`,
                                `${match.path}/:boardId/:boardSeq`,
                                `${match.path}/:boardId/:boardSeq/:reply`,
                                `${match.path}/:boardId/:parentBoardSeq/:reply/:boardSeq`,
                            ]}
                            exact
                            render={() => <BoardsContentsList />}
                        />
                    </Switch>
                </Col>

                {/* 수정창 */}
                <Col xs={4} className="p-0">
                    <Switch>
                        <Route
                            path={[
                                `${match.path}/:boardId/add`,
                                `${match.path}/:boardId/:boardSeq`,
                                `${match.path}/:boardId/:boardSeq/:reply`,
                                `${match.path}/:boardId/:parentBoardSeq/:reply/:boardSeq`,
                            ]}
                            exact
                            render={() => <BoardsEdit match={match} />}
                        />
                    </Switch>
                </Col>
            </Row>
        </Container>
    );
};

export default BoardsList;
