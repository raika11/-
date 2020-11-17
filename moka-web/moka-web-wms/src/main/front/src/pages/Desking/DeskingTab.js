import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { MokaIconTabs, MokaIcon } from '@components';
import { DeskingHistoryList, DeskingArticleTab } from './components';
import { EditThumbModal } from './modals';

const DeskingTabs = ({ componentAgGridInstances }) => {
    const { componentList } = useSelector((store) => ({
        componentList: store.desking.list,
    }));

    // state
    const [activeTabIdx, setActiveTabIdx] = useState(0);
    const [modalShow, setModalShow] = useState(false);

    // 순서 반대로
    return (
        <React.Fragment>
            <MokaIconTabs
                foldable={false}
                onSelectNav={(idx) => setActiveTabIdx(idx)}
                tabWidth={840}
                className="flex-fill"
                tabContentClass="flex-fill"
                tabs={[
                    /**
                     * 기사보기
                     */
                    <DeskingArticleTab componentAgGridInstances={componentAgGridInstances} componentList={componentList} />,
                    /**
                     * 미리보기
                     */
                    <div>
                        TEST
                        <button onClick={() => setModalShow(true)}>이미지편집 모달</button>
                    </div>,
                    /**
                     * 히스토리
                     */
                    <DeskingHistoryList />,
                ]}
                tabNavWidth={48}
                tabNavPosition="right"
                tabNavs={[
                    { title: '기사보기', icon: <MokaIcon iconName="fal-file" /> },
                    { title: '미리보기', icon: <MokaIcon iconName="fal-tv" /> },
                    { title: '히스토리', icon: <MokaIcon iconName="fal-history" /> },
                ]}
            />
            <EditThumbModal show={modalShow} onHide={() => setModalShow(false)} />
        </React.Fragment>
    );
};

export default DeskingTabs;
