import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { Container, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import BoardsGroupTree from './BoardsGroupTree/BoardsGroupTree';
import BoardsContentsList from './BoardsContentsList/BoardsContentsList';
import BoardsEdit from './BoardsEdit/BoardsEdit';
import clsx from 'clsx';
import useBreakpoint from '@hooks/useBreakpoint';

const BoardsList = ({ match, displayName }) => {
    const matchPoints = useBreakpoint();
    // 공통 구분값 URL
    const { pagePathName } = useSelector((store) => ({
        pagePathName: store.board.pagePathName,
    }));

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
                </Col>

                {/* 리스트 */}
                <Col xs={6} className="p-0 pr-3">
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
                </Col>

                {/* 수정창 */}
                <Col xs={4} className="p-0">
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
                </Col>
            </Row>
        </Container>
    );
};

export default BoardsList;
