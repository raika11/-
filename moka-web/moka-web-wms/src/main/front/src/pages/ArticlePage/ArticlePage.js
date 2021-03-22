import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaIcon } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';
import { ITEM_AP, ITEM_CT, ITEM_CP, ITEM_TP, TEMS_PREFIX } from '@/constants';
import { getArticleType } from '@store/codeMgt';
import { clearStore, deleteArticlePage, appendTag, changeArticlePageBody } from '@store/articlePage';
import toast, { messageBox } from '@utils/toastUtil';
import ArticlePageEditor from './ArticlePageEditor';
import ArticlePageEdit from './ArticlePageEdit';
import ArticlePageList from './ArticlePageList';

// relations
import LookupArticlePageList from '@pages/ArticlePage/components/LookupArticlePageList';
import LookupContainerList from '@pages/Container/components/LookupContainerList';
import LookupComponentList from '@pages/Component/components/LookupComponentList';
import LookupTemplateList from '@pages/Template/components/LookupTemplateList';
import LookupAdList from '@pages/Ad/components/LookupAdList';
import HistoryList from '@pages/commons/HistoryList';

/**
 * 아티클페이지 관리
 */
const ArticlePage = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const articlePage = useSelector(({ articlePage }) => articlePage.articlePage);
    const articleTypeRows = useSelector(({ codeMgt }) => codeMgt.articleTypeRows);
    const currentMenu = useSelector(({ auth }) => auth.currentMenu);

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
        if (!articleTypeRows) {
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
     * 아티클페이지 로드 버튼 이벤트
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
                <title>{currentMenu?.menuDisplayNm}</title>
                <meta name="description" content={`${currentMenu?.menuDisplayNm}페이지입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard
                width={412}
                className="mr-gutter"
                bodyClassName="d-flex flex-column"
                title={currentMenu?.menuDisplayNm}
                expansion={expansionState[0]}
                onExpansion={handleListExpansion}
                foldable
            >
                <ArticlePageList match={match} />
            </MokaCard>

            <Route
                path={[`${match.path}/add`, `${match.path}/:artPageSeq`]}
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
                                <ArticlePageEdit show={activeTabIdx === 0} match={match} onDelete={handleClickDelete} />,
                                <LookupArticlePageList show={activeTabIdx === 1} seqType={ITEM_AP} seq={articlePage.artPageSeq} onLoad={handleClickArticlePageLoad} />,
                                <LookupContainerList show={activeTabIdx === 2} seqType={ITEM_AP} seq={articlePage.artPageSeq} onAppend={handleAppendTag} />,
                                <LookupComponentList show={activeTabIdx === 3} seqType={ITEM_AP} seq={articlePage.artPageSeq} onAppend={handleAppendTag} />,
                                <LookupTemplateList show={activeTabIdx === 4} seqType={ITEM_AP} seq={articlePage.artPageSeq} onAppend={handleAppendTag} />,
                                <LookupAdList show={activeTabIdx === 5} seqType={ITEM_AP} />,
                                <HistoryList show={activeTabIdx === 6} seqType={ITEM_AP} seq={articlePage.artPageSeq} onLoad={handleClickHistLoad} />,
                            ]}
                            tabNavWidth={48}
                            tabNavPosition="right"
                            tabNavs={[
                                { title: '아티클페이지 정보', text: 'Info' },
                                { title: '관련 아티클페이지', icon: <MokaIcon iconName="fal-money-check" /> },
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
