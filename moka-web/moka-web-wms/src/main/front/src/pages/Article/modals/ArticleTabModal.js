import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CHANNEL_TYPE } from '@/constants';
import { MokaModal, MokaCardTabs } from '@components';
import ArticleList from '@pages/Article/components/Desking';
import IssueList from '@pages/Issue/components/Desking';

const propTypes = {
    /**
     * 기사 선택
     */
    onRowClicked: PropTypes.func.isRequired,
    /**
     * 기사탭 숨기기
     * @default
     */
    hideArticleTab: PropTypes.bool,
    /**
     * 영상탭 숨기기
     * @default
     */
    hideMovieTab: PropTypes.bool,
    /**
     * 패키지탭 숨기기
     * @default
     */
    hidePackageTab: PropTypes.bool,
    /**
     * 그래프탭 숨기기
     * @default
     */
    hideGraphTab: PropTypes.bool,
};
const defaultProps = {
    show: false,
    hideArticleTab: false,
    hideMovieTab: false,
    hidePackageTab: false,
    hideGraphTab: false,
};

/**
 * 기사탭 모달 (기사 / 영상 / 패키지 / 그래프)
 */
const ArticleTabModal = ({ show, onHide, onRowClicked, hideArticleTab, hideMovieTab, hidePackageTab, hideGraphTab }) => {
    const [tabNavs, setTabNavs] = useState([]);
    const [navIdx, setNavIdx] = useState(0);

    useEffect(() => {
        setTabNavs([!hideArticleTab && '기사', !hideMovieTab && '영상', !hidePackageTab && '패키지', !hideGraphTab && '그래프'].filter(Boolean));
    }, [hideArticleTab, hideMovieTab, hidePackageTab, hideGraphTab]);

    return (
        <MokaModal show={show} onHide={onHide} size="lg" width={1000} height={800} bodyClassName="p-0" headerStyle={{ zIndex: 1 }}>
            <MokaCardTabs
                className="w-100 h-100 shadow-none"
                onSelectNav={(idx) => setNavIdx(idx)}
                tabs={[
                    // 기사
                    !hideArticleTab && (
                        <ArticleList
                            show={navIdx === 0 && show}
                            addColumnDefs={[
                                {
                                    index: 0,
                                    headerName: '',
                                    field: 'add',
                                    width: 60,
                                    cellRenderer: 'buttonRenderer',
                                    cellRendererParams: { onClick: (data) => onRowClicked(CHANNEL_TYPE.A.code, data) },
                                },
                            ]}
                            suppressChangeArtGroup
                            suppressChangeArtTitle
                        />
                    ),
                    // 영상
                    !hideMovieTab && (
                        <ArticleList
                            show={navIdx === 1 && show}
                            addColumnDefs={[
                                {
                                    index: 0,
                                    headerName: '',
                                    field: 'add',
                                    width: 60,
                                    cellRenderer: 'buttonRenderer',
                                    cellRendererParams: { onClick: (data) => onRowClicked(CHANNEL_TYPE.M.code, data) },
                                },
                            ]}
                            movie
                            suppressChangeArtTitle
                        />
                    ),
                    // 패키지
                    !hidePackageTab && (
                        <IssueList
                            show={navIdx === 2 && show}
                            addColumnDefs={[
                                {
                                    index: 0,
                                    headerName: '',
                                    field: 'add',
                                    width: 60,
                                    cellRenderer: 'buttonRenderer',
                                    cellRendererParams: { onClick: (data) => onRowClicked(CHANNEL_TYPE.I.code, data) },
                                },
                            ]}
                        />
                    ),
                ].filter(Boolean)}
                tabNavs={tabNavs}
            />
        </MokaModal>
    );
};

ArticleTabModal.propTypes = propTypes;
ArticleTabModal.defaultProps = defaultProps;

export default ArticleTabModal;
