import React from 'react';
import { Row, Col } from 'react-bootstrap';

// 게시글 타이틀 렌더.
// 삭제 옵션으로 글자색 변경 처리.
const TitleItemRenderer = ({ paramsValue: { replyFlag, delYn, title } }) => {
    return (
        <>
            {delYn === 'N' ? (
                <Row>
                    <Col style={{ width: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{replyFlag ? `ㄴ ${title}` : title}</Col>
                </Row>
            ) : (
                <Row>
                    <Col>
                        <div style={{ width: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#a0a0a0' }}>{title}</div>
                    </Col>
                </Row>
            )}
        </>
    );
};

export default TitleItemRenderer;
