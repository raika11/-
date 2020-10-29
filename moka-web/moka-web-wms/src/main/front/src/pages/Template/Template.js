import React, { useState, Suspense, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import produce from 'immer';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { MokaCard, MokaIcon } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';
import { clearStore, clearHistory, clearRelationList, deleteTemplate, hasRelationList } from '@store/template';
import { notification, toastr } from '@utils/toastUtil';

import TemplateEditor from './TemplateEditor';
const TemplateList = React.lazy(() => import('./TemplateList'));
const TemplateEdit = React.lazy(() => import('./TemplateEdit'));

// relations
const RelationPageList = React.lazy(() => import('@pages/commons/RelationPageList'));
const TemplateSkinList = React.lazy(() => import('./relations/TemplateSkinList'));
const TemplateContainerList = React.lazy(() => import('./relations/TemplateContainerList'));
const TemplateComponentList = React.lazy(() => import('./relations/TemplateComponentList'));
const TemplateHistoryList = React.lazy(() => import('./relations/TemplateHistoryList'));

/**
 * 템플릿 관리
 */
const Template = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { template } = useSelector((store) => ({
        template: store.template.template,
    }));

    // state
    const [expansionState, setExpansionState] = useState([true, false, true]);
    const [openTabIdx, setOpenTabIdx] = useState(0);

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
     * @param {object} response response
     */
    const deleteCallback = useCallback(
        (response, templateSeq) => {
            if (response.header.success) {
                dispatch(
                    deleteTemplate({
                        templateSeq: templateSeq,
                        callback: (response) => {
                            if (response.header.success) {
                                notification('success', response.header.message);
                                history.push('/template');
                            } else {
                                notification('warning', response.header.message);
                            }
                        },
                    }),
                );
            } else {
                notification('warning', response.header.message);
            }
        },
        [dispatch, history],
    );

    /**
     * 삭제 이벤트
     */
    const handleClickDelete = useCallback(
        (template) => {
            const { templateSeq, templateName } = template;
            toastr.confirm(`${templateSeq}_${templateName}을 정말 삭제하시겠습니까?`, {
                onOk: () => {
                    dispatch(
                        hasRelationList({
                            templateSeq: template.templateSeq,
                            callback: deleteCallback,
                        }),
                    );
                },
                onCancle: () => {},
            });
        },
        [deleteCallback, dispatch],
    );

    React.useEffect(() => {
        return () => {
            dispatch(clearStore());
            dispatch(clearRelationList());
            dispatch(clearHistory());
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
            <MokaCard width={412} className="mr-gutter" titleClassName="mb-0" title="템플릿 검색" expansion={expansionState[0]} onExpansion={handleListExpansion} foldable>
                <Suspense>
                    <TemplateList onDelete={handleClickDelete} />
                </Suspense>
            </MokaCard>

            {/* 에디터 */}
            <Switch>
                <Route path={['/template', '/template/:templateSeq']} exact render={() => <TemplateEditor expansion={expansionState[1]} onExpansion={handleEditorExpansion} />} />
            </Switch>

            {/* 탭 */}
            <MokaIconTabs
                expansion={expansionState[2]}
                onExpansion={handleTabExpansion}
                onSelectNav={(idx) => setOpenTabIdx(idx)}
                tabWidth={412}
                tabs={[
                    <Suspense>
                        <TemplateEdit show={openTabIdx === '0'} onDelete={handleClickDelete} />
                    </Suspense>,
                    <Suspense>
                        <RelationPageList show={openTabIdx === '1'} relSeqType="TP" relSeq={template.templateSeq} />
                    </Suspense>,
                    <Suspense>
                        <TemplateSkinList show={openTabIdx === '2'} />
                    </Suspense>,
                    <Suspense>
                        <TemplateContainerList show={openTabIdx === '3'} />
                    </Suspense>,
                    <Suspense>
                        <TemplateComponentList show={openTabIdx === '4'} />
                    </Suspense>,
                    <Suspense>
                        <TemplateHistoryList show={openTabIdx === '5'} />
                    </Suspense>,
                ]}
                tabNavWidth={48}
                tabNavPosition="right"
                tabNavs={[
                    { title: '템플릿 정보', text: 'Info' },
                    { title: '관련 페이지', icon: <MokaIcon iconName="fal-file" /> },
                    { title: '관련 뷰스킨', icon: <MokaIcon iconName="fal-file-alt" /> },
                    { title: '관련 컨테이너', icon: <MokaIcon iconName="fal-box" /> },
                    { title: '관련 컴포넌트', icon: <MokaIcon iconName="fal-ballot" /> },
                    { title: '히스토리', icon: <MokaIcon iconName="fal-history" /> },
                ]}
            />
        </div>
    );
};

export default Template;
