import React from 'react';
import clsx from 'clsx';
import { MokaIcon } from '@components';

const GroupNumberRenderer = (params) => {
    const { data } = params;
    const { artGroupNum, ovpYn, youtubeYn } = data;

    return (
        <div className="d-flex flex-column overflow-hidden h-100 py-1">
            <div className="article-group-number mb-1" data-group-number={artGroupNum}>
                {artGroupNum}
            </div>
            {(youtubeYn === 'Y' || ovpYn === 'Y') && (
                <div
                    className={clsx('article-video', {
                        orange: youtubeYn === 'Y' && ovpYn !== 'Y',
                        ovp: youtubeYn !== 'Y' && ovpYn === 'Y',
                    })}
                >
                    <MokaIcon iconName="fas-play-circle" />
                </div>
            )}
        </div>
    );
};

export default GroupNumberRenderer;
