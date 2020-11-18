import React from 'react';
import { useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { MokaIcon, MokaOverlayTooltipButton } from '@components';
import toast from '@utils/toastUtil';

import { postPreComponentWork } from '@store/desking';

/**
 * 데스킹 워크 버튼 그룹 컴포넌트
 */
const DeskingWorkButtonGroup = (props) => {
    const { component, agGridIndex } = props;
    const dispatch = useDispatch();

    const title = `ID: CP${component.componentSeq} ${component.componentName}`;

    /**
     * 임시저장
     */
    const handlePreComponentWork = () => {
        const option = {
            componentWorkSeq: component.seq,
            callback: ({ header }) => {
                if (!header.success) {
                    toast.warn(header.message);
                }
            },
        };
        dispatch(postPreComponentWork(option));
    };

    const iconName = [
        { title: '관련기사 정보', iconName: 'fal-minus-circle' },
        { title: 'HTML 수동편집', iconName: 'fal-minus-circle' },
        { title: '템플릿', iconName: 'fal-minus-circle' },
        { title: '히스토리', iconName: 'fal-minus-circle' },
        { title: '기사 이동', iconName: 'fal-minus-circle' },
        { title: '더미기사 등록', iconName: 'fal-minus-circle' },
        { title: '임시저장', iconName: 'fal-minus-circle', onClick: handlePreComponentWork },
        { title: '전송', iconName: 'fal-minus-circle' },
        { title: '삭제', iconName: 'fal-minus-circle' },
    ];

    return (
        <div className="px-2 pt-1">
            <Row className="m-0 d-flex align-items-center justify-content-between">
                <Col className="p-0" xs={6}>
                    <p className="ft-12 mb-0">{title}</p>
                </Col>
                <Col className="p-0 d-flex align-items-center justify-content-between" xs={6}>
                    {iconName.map((icon, idx) => (
                        <MokaOverlayTooltipButton key={idx} tooltipText={icon.title} variant="white" className="p-0">
                            <MokaIcon iconName={icon.iconName} onClick={icon.onClick} />
                        </MokaOverlayTooltipButton>
                    ))}
                </Col>
            </Row>
        </div>
    );
};

export default DeskingWorkButtonGroup;
