import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { MokaIcon } from '@components';

/**
 * 데스킹 워크 버튼 그룹 컴포넌트
 */
const DeskingWorkButtonGroup = (props) => {
    const { component, agGridIndex } = props;

    const title = `ID: CP${component.componentSeq} ${component.componentName}`;

    const iconName = [
        { title: '관련기사 정보', iconName: 'fal-minus-circle' },
        { title: 'HTML 수동편집', iconName: 'fal-minus-circle' },
        { title: '템플릿', iconName: 'fal-minus-circle' },
        { title: '히스토리', iconName: 'fal-minus-circle' },
        { title: '기사 이동', iconName: 'fal-minus-circle' },
        { title: '더미기사 등록', iconName: 'fal-minus-circle' },
        { title: '전송', iconName: 'fal-minus-circle' },
        { title: '삭제', iconName: 'fal-minus-circle' },
    ];

    return (
        <Container fluid className="p-0">
            <Row className="m-0 mb-2 d-flex align-items-center justify-content-between">
                <Col className="p-0 text-center" xs={6}>
                    <div>{title}</div>
                </Col>
                <Col className="p-0 d-flex align-items-center justify-content-between" xs={6}>
                    {iconName.map((icon, idx) => (
                        <div key={idx}>
                            <OverlayTrigger overlay={<Tooltip id="tooltip-table-del-button">{icon.title}</Tooltip>}>
                                <Button variant="negative" className="border-0 p-0 moka-table-button bg-transparent">
                                    <MokaIcon iconName={icon.iconName} />
                                </Button>
                            </OverlayTrigger>
                        </div>
                    ))}
                </Col>
            </Row>
        </Container>
    );
};

export default DeskingWorkButtonGroup;
