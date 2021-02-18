import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { DATA_TYPE_DESK, DATA_TYPE_FORM } from '@/constants';

/**
 * 컴포넌트워크의 타이틀
 * 컴포넌트ID, 데이터셋ID, 템플릿ID 노출
 */
const ComponentInfo = (props) => {
    const { component, className } = props;
    const [title, setTitle] = useState('');
    const [tooltipText, setTooltipText] = useState('');

    const popover = (
        <Popover id="popover-component-info">
            <Popover.Content className="pre-wrap user-select-text">{tooltipText}</Popover.Content>
        </Popover>
    );

    useEffect(() => {
        if (component.dataType === DATA_TYPE_DESK) {
            setTooltipText(`컴포넌트ID: ${component.componentSeq}\n데이터셋ID: ${component.datasetSeq}\n템플릿ID: ${component.templateSeq}`);
        } else if (component.dataType === DATA_TYPE_FORM) {
            setTooltipText(`컴포넌트ID: ${component.componentSeq}\n파트ID: ${component.partSeq}\n템플릿ID: ${component.templateSeq}`);
        }
    }, [component.componentSeq, component.dataType, component.datasetSeq, component.partSeq, component.templateSeq]);

    useEffect(() => {
        if (component.componentSeq) setTitle(component.componentName);
    }, [component.componentName, component.componentSeq]);

    return (
        <OverlayTrigger trigger={['click']} placement="bottom" overlay={popover}>
            <p className={clsx('mb-0 component-title text-truncate cursor-pointer', className)}>{title}</p>
        </OverlayTrigger>
    );
};

export default ComponentInfo;
