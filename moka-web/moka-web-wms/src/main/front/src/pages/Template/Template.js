import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaIcon } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';
import { ITEM_TP } from '@/constants';
import { clearStore, deleteTemplate, hasRelationList, changeTemplateBody } from '@store/template';
import toast, { messageBox } from '@utils/toastUtil';
import TemplateEditor from './TemplateEditor';
import TemplateEdit from './TemplateEdit';
import TemplateList from './TemplateList';

// relations
import RelationInPageList from '@pages/Page/components/RelationInPageList';
import RelationInArticlePageList from '@pages/ArticlePage/components/RelationInArticlePageList';
import RelationInContainerList from '@pages/Container/components/RelationInContainerList';
import RelationInComponentList from '@pages/Component/components/RelationInComponentList';
import HistoryList from '@pages/commons/HistoryList';

/**
 * 템플릿 관리
 */
const Template = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const template = useSelector(({ template }) => template.template);
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
     * 템플릿 삭제
     * @param {object} template template
     */
    const deleteCallback = useCallback(
        (template) => {
            messageBox.confirm(`${template.templateSeq}_${template.templateName}을 삭제하시겠습니까?`, () => {
                dispatch(
                    deleteTemplate({
                        templateSeq: template.templateSeq,
                        callback: ({ header, body }) => {
                            if (header.success && body) {
                                // 삭제 성공
                                toast.success(header.message);
                                history.push(match.path);
                            } else {
                                // 삭제 실패
                                messageBox.alert(header.message);
                            }
                        },
                    }),
                );
            });
        },
        [dispatch, history, match.path],
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
                            messageBox.alert(header.message);
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
                <title>{currentMenu?.menuDisplayNm}</title>
                <meta name="description" content={`${currentMenu?.menuDisplayNm}페이지입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard
                width={412}
                className="mr-gutter"
                title={currentMenu?.menuDisplayNm}
                bodyClassName="d-flex flex-column"
                expansion={expansionState[0]}
                onExpansion={handleListExpansion}
                foldable
            >
                <TemplateList onDelete={handleClickDelete} match={match} />
            </MokaCard>

            <Route
                path={[`${match.path}/add`, `${match.path}/:templateSeq`]}
                exact
                render={() => (
                    <React.Fragment>
                        {/* 에디터 */}
                        <TemplateEditor expansion={expansionState[1]} onExpansion={handleEditorExpansion} match={match} />

                        {/* 탭 */}
                        <MokaIconTabs
                            expansion={expansionState[2]}
                            onExpansion={handleTabExpansion}
                            onSelectNav={(idx) => setActiveTabIdx(idx)}
                            tabWidth={412}
                            tabs={[
                                <TemplateEdit show={activeTabIdx === 0} onDelete={handleClickDelete} match={match} />,
                                <RelationInPageList show={activeTabIdx === 1} relSeqType={ITEM_TP} relSeq={template.templateSeq} />,
                                <RelationInArticlePageList show={activeTabIdx === 2} relSeqType={ITEM_TP} relSeq={template.templateSeq} />,
                                <RelationInContainerList show={activeTabIdx === 3} relSeqType={ITEM_TP} relSeq={template.templateSeq} />,
                                <RelationInComponentList show={activeTabIdx === 4} relSeqType={ITEM_TP} relSeq={template.templateSeq} />,
                                <HistoryList show={activeTabIdx === 5} seqType={ITEM_TP} seq={template.templateSeq} onLoad={handleClickLoad} />,
                            ]}
                            tabNavWidth={48}
                            tabNavPosition="right"
                            tabNavs={[
                                { title: '템플릿 정보', text: 'Info' },
                                { title: '관련 페이지', icon: <MokaIcon iconName="fal-money-check" /> },
                                { title: '관련 아티클페이지', icon: <MokaIcon iconName="fal-file-alt" /> },
                                { title: '관련 컨테이너', icon: <MokaIcon iconName="fal-calculator" /> },
                                { title: '관련 컴포넌트', icon: <MokaIcon iconName="fal-ballot" /> },
                                { title: '히스토리', icon: <MokaIcon iconName="fal-history" /> },
                            ]}
                        />
                    </React.Fragment>
                )}
            />
        </div>
    );
};

export default Template;
