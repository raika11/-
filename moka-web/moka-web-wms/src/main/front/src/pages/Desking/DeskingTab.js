import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { MokaIconTabs, MokaIcon } from '@components';
import { DeskingArticleTab, ComponentWorkPreview, HistoryList } from './components';

const DeskingTabs = ({ componentAgGridInstances }) => {
    const { componentList, isNaverChannel } = useSelector(({ desking }) => ({
        componentList: desking.list,
        isNaverChannel: desking.isNaverChannel,
    }));

    // state
    const [activeTabIdx, setActiveTabIdx] = useState(0);

    // 핫키로 탭 변경
    useHotkeys('shift+Q', () => setActiveTabIdx(0));
    useHotkeys('shift+W', () => setActiveTabIdx(1));
    useHotkeys('shift+E', () => setActiveTabIdx(2));

    return (
        <React.Fragment>
            <MokaIconTabs
                foldable={false}
                activeKey={activeTabIdx}
                onSelectNav={(idx) => setActiveTabIdx(idx)}
                tabWidth={840}
                height={817}
                className="flex-fill"
                tabContentClass="flex-fill"
                tabs={[
                    /**
                     * 미리보기
                     */
                    <ComponentWorkPreview show={activeTabIdx === 0} componentList={componentList} isNaverChannel={isNaverChannel} />,
                    /**
                     * 기사보기
                     */
                    <DeskingArticleTab componentAgGridInstances={componentAgGridInstances} componentList={componentList} show={activeTabIdx === 1} />,
                    /**
                     * 히스토리
                     */
                    <HistoryList show={activeTabIdx === 2} componentList={componentList} isNaverChannel={isNaverChannel} />,
                ]}
                tabNavWidth={48}
                tabNavPosition="right"
                tabNavs={[
                    { title: '미리보기', icon: <MokaIcon iconName="fal-tv" /> },
                    { title: '기사보기', icon: <MokaIcon iconName="fal-file" /> },
                    { title: '히스토리', icon: <MokaIcon iconName="fal-history" /> },
                ]}
            />
        </React.Fragment>
    );
};

export default DeskingTabs;
