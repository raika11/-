import React from 'react';
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
        { title: '더미기사 추가', iconName: 'fal-minus-circle' },
        { title: '전송', iconName: 'fal-minus-circle' },
        { title: '삭제', iconName: 'fal-minus-circle' },
    ];

    return (
        <div className="d-flex" style={{ width: 420 }}>
            <p>{title}</p>
            {iconName.map((icon, idx) => (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center" key={idx}>
                    <OverlayTrigger overlay={<Tooltip id="tooltip-table-del-button">{icon.title}</Tooltip>}>
                        <Button variant="white" className="border-0 p-0 moka-table-button bg-transparent">
                            <MokaIcon iconName={icon.iconName} />
                        </Button>
                    </OverlayTrigger>
                </div>
            ))}
        </div>
    );
};

export default DeskingWorkButtonGroup;
