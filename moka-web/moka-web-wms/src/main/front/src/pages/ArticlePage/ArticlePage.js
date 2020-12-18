import React, { useState, Suspense, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { MokaCard, MokaIcon, MokaLoader } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';
import { ITEM_AP, ITEM_CT, ITEM_CP, ITEM_TP, TEMS_PREFIX } from '@/constants';
import { getArticleType } from '@store/codeMgt';
import { clearStore, deleteArticlePage, appendTag, changeArticlePageBody } from '@store/articlePage';
import toast, { messageBox } from '@utils/toastUtil';

import ArticlePageEditor from './ArticlePageEditor';
const ArticlePageList = React.lazy(() => import('./ArticlePageList'));
const ArticlePageEdit = React.lazy(() => import('./ArticlePageEdit'));
// relations
const LookupArticlePageList = React.lazy(() => import('@pages/ArticlePage/components/LookupArticlePageList'));
const LookupContainerList = React.lazy(() => import('@pages/Container/components/LookupContainerList'));
const LookupComponentList = React.lazy(() => import('@pages/Component/components/LookupComponentList'));
const LookupTemplateList = React.lazy(() => import('@pages/Template/components/LookupTemplateList'));
const PageChildAdList = React.lazy(() => import('@pages/Page/relations/PageChildAdList'));
const HistoryList = React.lazy(() => import('@pages/commons/HistoryList'));
/**
 * 기사페이지 관리
 */
const ArticlePage = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { articlePage, articleTypeRows } = useSelector((store) => ({
        articlePage: store.articlePage.articlePage,
        articleTypeRows: store.codeMgt.articleTypeRows,
    }));

    // state
    const [expansionState, setExpansionState] = useState([true, false, true]);
    const [activeTabIdx, setActiveTabIdx] = useState(0);

    /**
     * 리스트 확장 시
     * @param {boolean} expansion 확장여부
     */
    const handleListExpansion = (expansion) => {
        setExpansionState(
            produce(expansionState, (draft) => {
                if (!draft[2] && !expansion) {
                    draft[1] = true;
                } else {
                    draft[1] = false;
                }
                draft[0] = expansion;
            }),
        );
    };

    /**
     * 에디터 확장 시
     * @param {boolean} expansion 확장여부
     */
    const handleEditorExpansion = (expansion) => {
        if (expansion) {
            setExpansionState([false, expansion, false]);
        } else {
            setExpansionState([true, expansion, true]);
        }
    };

    /**
     * 탭 확장 시
     * @param {boolean} expansion 확장여부
     */
    const handleTabExpansion = (expansion) => {
        setExpansionState(
            produce(expansionState, (draft) => {
                if (!draft[0] && !expansion) {
                    draft[1] = true;
                } else {
                    draft[1] = false;
                }
                draft[2] = expansion;
            }),
        );
    };
    /**
     * 삭제 이벤트
     */
    const handleClickDelete = useCallback(
        (articlePage) => {
            messageBox.confirm(`${articlePage.artPageSeq}_${articlePage.artPageSeq}을 삭제하시겠습니까?`, () => {
                dispatch(
                    deleteArticlePage({
                        artPageSeq: articlePage.artPageSeq,
                        callback: ({ header }) => {
                            // 삭제 성공
                            if (header.success) {
                                toast.success(header.message);
                                history.push('/article-page');
                            }
                            // 삭제 실패
                            else {
                                toast.error(header.message);
                            }
                        },
                    }),
                );
            });
        },
        [dispatch, history],
    );

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    React.useEffect(() => {
        if (!articleTypeRows || articleTypeRows.length <= 0) {
            dispatch(getArticleType());
        }
    }, [articleTypeRows, dispatch]);

    /**
     * 히스토리 로드 버튼 이벤트
     */
    const handleClickHistLoad = ({ header, body }) => {
        if (header.success) {
            messageBox.confirm('현재 작업된 소스가 히스토리 내용으로 변경됩니다.\n변경하시겠습니까?', () => {
                dispatch(changeArticlePageBody(body.body));
            });
        } else {
            toast.error(header.message);
        }
    };

    /**
     * 기사페이지 로드 버튼 이벤트
     */
    const handleClickArticlePageLoad = useCallback(
        ({ header, body }) => {
            if (header.success) {
                messageBox.confirm('현재 작업된 소스가 변경됩니다.\n변경하시겠습니까?', () => {
                    dispatch(changeArticlePageBody(body.artPageBody));
                });
            } else {
                toast.error(header.message);
            }
        },
        [dispatch],
    );

    /**
     * tems태그 삽입
     */
    const handleAppendTag = useCallback(
        (data, itemType) => {
            let tag = null;
            if (itemType === ITEM_CT) {
                tag = `${new Date().getTime()}<${TEMS_PREFIX}:${itemType.toLowerCase()} id="${data.containerSeq}" name="${data.containerName}"/>\n`;
            } else if (itemType === ITEM_CP) {
                tag = `${new Date().getTime()}<${TEMS_PREFIX}:${itemType.toLowerCase()} id="${data.componentSeq}" name="${data.componentName}"/>\n`;
            } else if (itemType === ITEM_TP) {
                tag = `${new Date().getTime()}<${TEMS_PREFIX}:${itemType.toLowerCase()} id="${data.templateSeq}" name="${data.templateName}"/>\n`;
            }
            dispatch(appendTag(tag));
        },
        [dispatch],
    );

    return (
        <div className="d-flex">
            <Helmet>
                <title>기사페이지 관리</title>
                <meta name="description" content="기사페이지관리 입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard
                width={412}
                className="mr-gutter"
                titleClassName="mb-0"
                bodyClassName="d-flex flex-column"
                title="기사페이지 검색"
                expansion={expansionState[0]}
                onExpansion={handleListExpansion}
                foldable
            >
                <Suspense>
                    <ArticlePageList onDelete={handleClickDelete} />
                </Suspense>
            </MokaCard>

            <Route
                path={[`${match.url}/add`, `${match.url}/:artPageSeq`]}
                exact
                render={() => (
                    <React.Fragment>
                        {/* 에디터 */}
                        <ArticlePageEditor expansion={expansionState[1]} onExpansion={handleEditorExpansion} />

                        {/* 탭 */}

                        <MokaIconTabs
                            expansion={expansionState[2]}
                            onExpansion={handleTabExpansion}
                            onSelectNav={(idx) => setActiveTabIdx(idx)}
                            tabWidth={412}
                            tabs={[
                                <Suspense fallback={<MokaLoader />}>
                                    <ArticlePageEdit show={activeTabIdx === 0} onDelete={handleClickDelete} />
                                </Suspense>,
                                <Suspense fallback={<MokaLoader />}>
                                    <LookupArticlePageList show={activeTabIdx === 1} seqType={ITEM_AP} seq={articlePage.artPageSeq} onLoad={handleClickArticlePageLoad} />
                                </Suspense>,
                                <Suspense fallback={<MokaLoader />}>
                                    <LookupContainerList show={activeTabIdx === 2} seqType={ITEM_AP} seq={articlePage.artPageSeq} onAppend={handleAppendTag} />
                                </Suspense>,
                                <Suspense fallback={<MokaLoader />}>
                                    <LookupComponentList show={activeTabIdx === 3} seqType={ITEM_AP} seq={articlePage.artPageSeq} onAppend={handleAppendTag} />
                                </Suspense>,
                                <Suspense fallback={<MokaLoader />}>
                                    <LookupTemplateList show={activeTabIdx === 4} seqType={ITEM_AP} seq={articlePage.artPageSeq} onAppend={handleAppendTag} />
                                </Suspense>,
                                <Suspense fallback={<MokaLoader />}>
                                    <PageChildAdList show={activeTabIdx === 5} seqType={ITEM_AP} />
                                </Suspense>,
                                <Suspense fallback={<MokaLoader />}>
                                    <HistoryList show={activeTabIdx === 6} seqType={ITEM_AP} seq={articlePage.artPageSeq} onLoad={handleClickHistLoad} />
                                </Suspense>,
                            ]}
                            tabNavWidth={48}
                            tabNavPosition="right"
                            tabNavs={[
                                { title: '기사페이지 정보', text: 'Info' },

                                { title: '관련 기사페이지', icon: <MokaIcon iconName="fal-money-check" /> },
                                { title: '관련 컨테이너', icon: <MokaIcon iconName="fal-calculator" /> },
                                { title: '관련 컴포넌트', icon: <MokaIcon iconName="fal-ballot" /> },
                                { title: '관련 템플릿', icon: <MokaIcon iconName="fal-newspaper" /> },
                                { title: '관련 광고', icon: <MokaIcon iconName="fal-ad" /> },
                                { title: '히스토리', icon: <MokaIcon iconName="fal-history" /> },
                            ]}
                        />
                    </React.Fragment>
                )}
            />
        </div>
    );
};

export default ArticlePage;
