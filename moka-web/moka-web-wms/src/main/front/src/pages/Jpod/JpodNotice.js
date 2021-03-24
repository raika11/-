import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import clsx from 'clsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { clearStore } from '@store/jpod';
import useBreakpoint from '@hooks/useBreakpoint';
import { getBoardChannelList, getJpodBoard, changeSelectBoard } from '@store/jpod';
import NoticeList from '@pages/Jpod/JpodNotice/NoticeList';
import NoticeEdit from '@pages/Jpod/JpodNotice/NoticeEdit';

/**
 * J팟 관리 - 공지 게시판
 */
const JpodChannel = ({ match, displayName }) => {
    const dispatch = useDispatch();
    const matchPoints = useBreakpoint();

    const { boardList } = useSelector((store) => ({
        boardList: store.jpod.jpodNotice.boardList,
    }));

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    useEffect(() => {
        // 최초 로딩시 목록 가져오기
        dispatch(getJpodBoard());
        dispatch(getBoardChannelList()); // J팟 채널 목록
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (boardList.length > 0) {
            dispatch(changeSelectBoard(boardList[0]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardList]);

    return (
        <Container className="p-0 position-relative" fluid>
            <Helmet>
                <title>{displayName}</title>
                <meta name="description" content={`${displayName} 페이지 입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            <Row className="m-0">
                {/* 리스트 */}
                <Col sm={12} md={7} className={clsx('p-0', { 'pr-gutter': matchPoints.md || matchPoints.lg })}>
                    <NoticeList match={match} />
                </Col>
                {/* 등록 / 수정 */}
                {(matchPoints.md || matchPoints.lg) && (
                    <Col md={5} className="p-0">
                        <Switch>
                            <Route
                                path={[`${match.path}/add`, `${match.path}/:boardSeq`, `${match.path}/:boardSeq/:reply`, `${match.path}/:parentBoardSeq/:reply/:boardSeq`]}
                                exact
                                render={() => <NoticeEdit match={match} />}
                            />
                        </Switch>
                    </Col>
                )}
                {(matchPoints.xs || matchPoints.sm) && (
                    <Switch>
                        <Route
                            path={[`${match.path}/add`, `${match.path}/:boardSeq`, `${match.path}/:boardSeq/:reply`, `${match.path}/:parentBoardSeq/:reply/:boardSeq`]}
                            exact
                            render={() => (
                                <Col xs={7} className="absolute-top-right h-100 overlay-shadow p-0" style={{ zIndex: 2 }}>
                                    <NoticeEdit match={match} />
                                </Col>
                            )}
                        />
                    </Switch>
                )}
            </Row>
        </Container>
    );
};

export default JpodChannel;
