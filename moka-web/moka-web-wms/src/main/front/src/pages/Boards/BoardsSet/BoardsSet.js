import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import clsx from 'clsx';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import useBreakpoint from '@hooks/useBreakpoint';
import { initialState, getSetMenuBoardsList, changeSetMenuSearchOption } from '@store/board';
import BoardsList from './BoardsList';
import BoardsEdit from './BoardsEdit';

/**
 * 게시판 관리 > 전체 게시판
 */
const BoardsSet = ({ match, displayName }) => {
    const matchPoints = useBreakpoint();
    const dispatch = useDispatch();
    // 공통 구분값 URL
    const { pagePathName, boardType } = useSelector((store) => ({
        pagePathName: store.board.pagePathName,
        boardType: store.board.boardType,
    }));

    useEffect(() => {
        // store boardType 값이 변경 되면 검색 옵션 처리후 리스트를 가지고 옵니다.
        if (boardType) {
            const tmpSearchOption = {
                ...initialState.setMenu.search,
                boardType: boardType,
            };
            dispatch(getSetMenuBoardsList(changeSetMenuSearchOption(tmpSearchOption)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardType]);

    return (
        <Container className="p-0 position-relative" fluid>
            <Helmet>
                <title>{displayName}</title>
                <meta name="description" content={`${displayName} 페이지입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            <Row className="m-0">
                <Col sm={12} md={7} className={clsx('p-0', { 'pr-gutter': matchPoints.md || matchPoints.lg })}>
                    {/* 리스트 */}
                    <BoardsList />
                </Col>

                {(matchPoints.md || matchPoints.lg) && (
                    <Col md={5} className="p-0">
                        <Switch>
                            <Route path={[`/${pagePathName}/add`, `/${pagePathName}/:boardId`]} exact render={() => <BoardsEdit />} />
                        </Switch>
                    </Col>
                )}

                {(matchPoints.xs || matchPoints.sm) && (
                    <Route
                        path={[`${match.path}/:totalId`]}
                        exact
                        render={() => (
                            <Col xs={7} className="absolute-top-right h-100 overlay-shadow p-0" style={{ zIndex: 2 }}>
                                <Switch>
                                    <Route path={[`/${pagePathName}/add`, `/${pagePathName}/:boardId`]} exact render={() => <BoardsEdit match={match} />} />
                                </Switch>
                            </Col>
                        )}
                    />
                )}
            </Row>
        </Container>
    );
};

export default BoardsSet;
