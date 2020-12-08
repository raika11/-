import React, { useState, Suspense, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { MokaCard, MokaIcon } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';
import { ITEM_AP } from '@/constants';
import { getArticleType } from '@store/codeMgt';
import { clearStore, deleteArticlePage, changeArticlePageBody } from '@store/articlePage';
import toast, { messageBox } from '@utils/toastUtil';

import ArticlePageEditor from './ArticlePageEditor';
const ArticlePageList = React.lazy(() => import('./ArticlePageList'));
const ArticlePageEdit = React.lazy(() => import('./ArticlePageEdit'));

const LookupArticlePageList = React.lazy(() => import('@pages/ArticlePage/components/LookupArticlePageList'));
// relations
/*
const RelationInPageList = React.lazy(() => import('@pages/Page/components/RelationInPageList'));
const RelationInContainerList = React.lazy(() => import('@pages/Container/components/RelationInContainerList'));
const RelationInComponentList = React.lazy(() => import('@pages/Component/components/RelationInComponentList'));
const HistoryList = React.lazy(() => import('@pages/commons/HistoryList'));
*/
/**
 * 템플릿 관리
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

    /**
     * 히스토리 로드 버튼 이벤트
     */
    /*    
    const handleClickLoad = ({ header, body }) => {
        if (header.success) {
            messageBox.confirm('현재 작업된 소스가 히스토리 내용으로 변경됩니다.\n변경하시겠습니까?', () => {
                dispatch(changeArticlePageBody(body.body));
            });
        } else {
            toast.error(header.message);
        }
    };
*/
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

    return (
        <div className="d-flex">
            <Helmet>
                <title>기사페이지 관리</title>
                <meta name="description" content="기사페이지관리 입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={412} className="mr-gutter" titleClassName="mb-0" title="기사페이지 검색" expansion={expansionState[0]} onExpansion={handleListExpansion} foldable>
                <Suspense>
                    <ArticlePageList onDelete={handleClickDelete} />
                </Suspense>
            </MokaCard>

            {/* 에디터 */}
            <Route path={[match.url, `${match.url}/:artPageSeq`]} exact render={() => <ArticlePageEditor expansion={expansionState[1]} onExpansion={handleEditorExpansion} />} />

            {/* 탭 */}
            <MokaIconTabs
                expansion={expansionState[2]}
                onExpansion={handleTabExpansion}
                onSelectNav={(idx) => setActiveTabIdx(idx)}
                tabWidth={412}
                tabs={[
                    <Suspense>
                        <ArticlePageEdit show={activeTabIdx === 0} onDelete={handleClickDelete} />
                    </Suspense>,

                    <Suspense>
                        <LookupArticlePageList show={activeTabIdx === 1} seqType={ITEM_AP} seq={articlePage.artPageSeq} /* onAppend={handleAppendTag}*/ />
                    </Suspense>,
                    /*
                                    <Suspense>
                                        <LookupContainerList show={activeTabIdx === 2} seqType={ITEM_PG} seq={page.pageSeq} onAppend={handleAppendTag} />
                                    </Suspense>,
                                    <Suspense>
                                        <LookupComponentList show={activeTabIdx === 3} seqType={ITEM_PG} seq={page.pageSeq} onAppend={handleAppendTag} />
                                    </Suspense>,
                                    <Suspense>
                                        <LookupTemplateList show={activeTabIdx === 4} seqType={ITEM_PG} seq={page.pageSeq} onAppend={handleAppendTag} />
                    */
                ]}
                tabNavWidth={48}
                tabNavPosition="right"
                tabNavs={[
                    { title: '기사페이지 정보', text: 'Info' },

                    { title: '관련 페이지', icon: <MokaIcon iconName="fal-money-check" /> },
                    /* { title: '관련 기사페이지', icon: <MokaIcon iconName="fal-file-alt" /> },
                    { title: '관련 컨테이너', icon: <MokaIcon iconName="fal-calculator" /> },
                    { title: '관련 컴포넌트', icon: <MokaIcon iconName="fal-ballot" /> },
                    { title: '히스토리', icon: <MokaIcon iconName="fal-history" /> },
                    */
                ]}
            />
        </div>
    );
};

export default ArticlePage;
