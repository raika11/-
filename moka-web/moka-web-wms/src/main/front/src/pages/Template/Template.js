import React, { useState, Suspense, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { MokaCard, MokaIcon, MokaLoader } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';
import { ITEM_TP } from '@/constants';
import { clearStore, deleteTemplate, hasRelationList, changeTemplateBody } from '@store/template';
import toast, { messageBox } from '@utils/toastUtil';

import TemplateEditor from './TemplateEditor';
import TemplateEdit from './TemplateEdit';
const TemplateList = React.lazy(() => import('./TemplateList'));

// relations
const RelationInPageList = React.lazy(() => import('@pages/Page/components/RelationInPageList'));
const RelationInArticlePageList = React.lazy(() => import('@pages/ArticlePage/components/RelationInArticlePageList'));
const RelationInContainerList = React.lazy(() => import('@pages/Container/components/RelationInContainerList'));
const RelationInComponentList = React.lazy(() => import('@pages/Component/components/RelationInComponentList'));
const HistoryList = React.lazy(() => import('@pages/commons/HistoryList'));

/**
 * 템플릿 관리
 */
const Template = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { template } = useSelector((store) => ({
        template: store.template.template,
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
     * 템플릿 삭제
     * @param {object} template template
     */
    const deleteCallback = useCallback(
        (template) => {
            messageBox.confirm(`${template.templateSeq}_${template.templateName}을 삭제하시겠습니까?`, () => {
                dispatch(
                    deleteTemplate({
                        templateSeq: template.templateSeq,
                        callback: ({ header }) => {
                            // 삭제 성공
                            if (header.success) {
                                toast.success(header.message);
                                history.push('/template');
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
     * 삭제 이벤트
     */
    const handleClickDelete = useCallback(
        (template) => {
            const { templateSeq } = template;

            dispatch(
                hasRelationList({
                    templateSeq,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            // 관련 아이템 없음
                            if (!body) deleteCallback(template);
                            // 관련 아이템 있음
                            else {
                                messageBox.alert('사용 중인 템플릿입니다.\n삭제할 수 없습니다.');
                            }
                        } else {
                            toast.error(header.message);
                        }
                    },
                }),
            );
        },
        [deleteCallback, dispatch],
    );

    /**
     * 히스토리 로드 버튼 이벤트
     */
    const handleClickLoad = ({ header, body }) => {
        if (header.success) {
            messageBox.confirm('현재 작업된 소스가 히스토리 내용으로 변경됩니다.\n변경하시겠습니까?', () => {
                dispatch(changeTemplateBody(body.body));
            });
        } else {
            toast.error(header.message);
        }
    };

    React.useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>템플릿관리</title>
                <meta name="description" content="템플릿관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard
                width={412}
                className="mr-gutter"
                title="템플릿 검색"
                bodyClassName="d-flex flex-column"
                expansion={expansionState[0]}
                onExpansion={handleListExpansion}
                foldable
            >
                <Suspense>
                    <TemplateList onDelete={handleClickDelete} />
                </Suspense>
            </MokaCard>

            <Route
                path={[`${match.url}/add`, `${match.url}/:templateSeq`]}
                exact
                render={() => (
                    <React.Fragment>
                        {/* 에디터 */}
                        <TemplateEditor expansion={expansionState[1]} onExpansion={handleEditorExpansion} />

                        {/* 탭 */}
                        <Suspense>
                            <MokaIconTabs
                                expansion={expansionState[2]}
                                onExpansion={handleTabExpansion}
                                onSelectNav={(idx) => setActiveTabIdx(idx)}
                                tabWidth={412}
                                tabs={[
                                    <TemplateEdit show={activeTabIdx === 0} onDelete={handleClickDelete} />,
                                    <Suspense fallback={<MokaLoader />}>
                                        <RelationInPageList show={activeTabIdx === 1} relSeqType={ITEM_TP} relSeq={template.templateSeq} />
                                    </Suspense>,
                                    <Suspense fallback={<MokaLoader />}>
                                        <RelationInArticlePageList show={activeTabIdx === 2} relSeqType={ITEM_TP} relSeq={template.templateSeq} />
                                    </Suspense>,
                                    <Suspense fallback={<MokaLoader />}>
                                        <RelationInContainerList show={activeTabIdx === 3} relSeqType={ITEM_TP} relSeq={template.templateSeq} />
                                    </Suspense>,
                                    <Suspense fallback={<MokaLoader />}>
                                        <RelationInComponentList show={activeTabIdx === 4} relSeqType={ITEM_TP} relSeq={template.templateSeq} />
                                    </Suspense>,
                                    <Suspense fallback={<MokaLoader />}>
                                        <HistoryList show={activeTabIdx === 5} seqType={ITEM_TP} seq={template.templateSeq} onLoad={handleClickLoad} />
                                    </Suspense>,
                                ]}
                                tabNavWidth={48}
                                tabNavPosition="right"
                                tabNavs={[
                                    { title: '템플릿 정보', text: 'Info' },
                                    { title: '관련 페이지', icon: <MokaIcon iconName="fal-money-check" /> },
                                    { title: '관련 기사페이지', icon: <MokaIcon iconName="fal-file-alt" /> },
                                    { title: '관련 컨테이너', icon: <MokaIcon iconName="fal-calculator" /> },
                                    { title: '관련 컴포넌트', icon: <MokaIcon iconName="fal-ballot" /> },
                                    { title: '히스토리', icon: <MokaIcon iconName="fal-history" /> },
                                ]}
                            />
                        </Suspense>
                    </React.Fragment>
                )}
            />
        </div>
    );
};

export default Template;
