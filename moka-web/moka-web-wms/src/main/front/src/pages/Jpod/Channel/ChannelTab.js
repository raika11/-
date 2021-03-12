import React, { useState } from 'react';
import { MokaIconTabs, MokaIcon } from '@components';
import ChannelEdit from './ChannelEdit';
import ChannelEpisode from './ChannelEpisode';

const ChannelTab = ({ match }) => {
    const [, setActiveTabIdx] = useState(0);

    return (
        <MokaIconTabs
            foldable={false}
            className="w-100 flex-fill"
            onSelectNave={(idx) => setActiveTabIdx(idx)}
            tabs={[
                /**
                 * 등록 수정.
                 */
                <ChannelEdit match={match} />,
                /**
                 * 에피소드 리스트.
                 */
                <ChannelEpisode match={match} />,
            ]}
            tabNavWidth={48}
            placement="left"
            tabNavs={[
                { title: 'info', text: 'Info' },
                { title: '에피소드', icon: <MokaIcon iconName="fal-file" /> },
            ]}
            hasHotkeys={true}
        />
    );
};

export default ChannelTab;
