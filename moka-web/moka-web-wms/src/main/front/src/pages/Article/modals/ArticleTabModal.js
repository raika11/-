import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MokaModal, MokaCardTabs } from '@components';
import ArticleList from '@pages/Article/components/Desking';
import IssueList from '@pages/Issue/components/Desking';

const propTypes = {};
const defaultProps = {
    show: false,
};

/**
 * 기사탭 모달 (기사 / 영상 / 패키지 / 그래프)
 */
const ArticleTabModal = (props) => {
    const { show, onHide } = props;
    const [tabNavs] = useState(['기사', '영상', '패키지', '그래프']);
    const [navIdx, setNavIdx] = useState(0);

    return (
        <MokaModal show={show} onHide={onHide} size="lg" width={1000} height={800} bodyClassName="p-0" headerClassName="p-0" headerStyle={{ zIndex: 1 }}>
            <MokaCardTabs
                className="w-100 h-100 shadow-none"
                onSelectNav={(idx) => setNavIdx(idx)}
                tabs={[
                    // 기사
                    <ArticleList
                        show={navIdx === 0 && show}
                        addColumnDefs={[
                            {
                                index: 0,
                                headerName: '',
                                field: 'add',
                                width: 60,
                                cellRenderer: 'buttonRenderer',
                                cellRendererParams: { onClick: () => console.log('test') },
                            },
                        ]}
                        suppressChangeArtGroup
                        suppressChangeArtTitle
                    />,
                    // 영상
                    <ArticleList
                        show={navIdx === 1 && show}
                        addColumnDefs={[
                            {
                                index: 0,
                                headerName: '',
                                field: 'add',
                                width: 60,
                                cellRenderer: 'buttonRenderer',
                                cellRendererParams: { onClick: () => console.log('test') },
                            },
                        ]}
                        movie
                        suppressChangeArtTitle
                    />,
                    <IssueList show={navIdx === 2 && show} />,
                ]}
                tabNavs={tabNavs}
            />
        </MokaModal>
    );
};

ArticleTabModal.propTypes = propTypes;
ArticleTabModal.defaultProps = defaultProps;

export default ArticleTabModal;
