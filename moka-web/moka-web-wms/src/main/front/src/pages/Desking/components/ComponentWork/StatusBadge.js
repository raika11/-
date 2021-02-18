import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Badge from 'react-bootstrap/Badge';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';

moment.locale('ko');

/**
 * 최종 작업 상태를 표시하는 badge
 * 노출 중인 임시저장 데이터가 전송 데이터인지, 임시저장 데이터인지 판단
 */
const StatusBadge = (props) => {
    const { component, className } = props;
    const [published, setPublished] = useState(false);

    const popover = (
        <Popover id="popover-status-badge">
            <Popover.Content>
                <span className="font-weight-bold">{published ? '전송' : '임시'} 박진숙(ID)</span>
                <br />
                <span>{published ? component.lastPublishDt : component.lastSaveDt}</span>
            </Popover.Content>
        </Popover>
    );

    useEffect(() => {
        const pd = moment(component.lastPublishDt, DB_DATEFORMAT);
        const sd = moment(component.lastSaveDt, DB_DATEFORMAT);

        // 전송시간 > 임시저장시간이면 전송된 상태 (반드시 임시저장 후 전송해야만 하기 때문에)
        if (pd.isAfter(sd)) {
            setPublished(true);
        } else {
            setPublished(false);
        }
    }, [component.lastPublishDt, component.lastSaveDt]);

    return (
        <OverlayTrigger trigger="hover" placement="bottom" overlay={popover}>
            <Badge variant={published ? 'info' : 'gray-600'} className={clsx('rounded-0', className)}>
                {published ? '전송' : '임시'}
            </Badge>
        </OverlayTrigger>
    );
};

export default StatusBadge;
