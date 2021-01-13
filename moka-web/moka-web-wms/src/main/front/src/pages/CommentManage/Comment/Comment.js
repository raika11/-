import React, { Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard } from '@components';
import { clearStore } from '@store/commentManage';

const CommentList = React.lazy(() => import('./CommentLIst'));

/**
 * 댓글 관리
 */
const Comment = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <Container fluid>
            <Helmet>
                <title>댓글 관리</title>
                <meta name="description" content="댓글 관리 페이지 입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <Row>
                <Col xs={12} className="p-0">
                    <MokaCard className="w-100" bodyClassName="d-flex flex-column" title="댓글 관리">
                        <Suspense>
                            <CommentList />
                        </Suspense>
                    </MokaCard>
                </Col>
            </Row>
        </Container>
    );
};

export default Comment;
