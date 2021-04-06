import React from 'react';
import { MokaIcon } from '@components';

/**
 * 상태 설명표
 */
const StatusBar = () => {
    return (
        <div className="d-flex align-items-center">
            <span className="mr-3">
                <MokaIcon iconName="fas-circle" fixedWidth className="color-brand-a6 mr-1" />
                진행
            </span>
            <span className="mr-3">
                <MokaIcon iconName="fas-circle" fixedWidth className="color-neutral mr-1" />
                대기
            </span>
            <span className="mr-3">
                <MokaIcon iconName="fas-circle" fixedWidth className="color-gray-400 mr-1" />
                임시
            </span>
            <span className="mr-3">
                <MokaIcon iconName="fas-circle" fixedWidth className="color-searching mr-1" />
                종료
            </span>
        </div>
    );
};

export default StatusBar;
