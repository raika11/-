import React, { useState, useEffect, useCallback, Suspense } from 'react';
import produce from 'immer';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

import { MokaCard, MokaIcon } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';
import { ITEM_CT, ITEM_CP, ITEM_TP, TEMS_PREFIX } from '@/constants';
import toast from '@utils/toastUtil';
import { deleteContainer, hasRelationList, changeContainerBody, appendTag, clearStore } from '@store/container';

import ContainerEditor from './ContainerEditor';
const ContainerList = React.lazy(() => import('./ContainerList'));
const ContainerEdit = React.lazy(() => import('./ContainerEdit'));

// relations
const RelationInPageList = React.lazy(() => import('@pages/commons/RelationInPageList'));
const RelationInSkinList = React.lazy(() => import('@pages/commons/RelationInSkinList'));
const LookupContainerList = React.lazy(() => import('@pages/commons/LookupContainerList'));
const LookupComponentList = React.lazy(() => import('@pages/commons/LookupComponentList'));
const LookupTemplateList = React.lazy(() => import('@pages/commons/LookupTemplateList'));
const HistoryList = React.lazy(() => import('@pages/commons/HistoryList'));

/**
 * 컨테이너 관리
 */
const Container = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { container } = useSelector((store) => ({
        container: store.container.container,
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
     * 컨테이너 삭제
     * @param {object} container container
     */
    const deleteCallback = useCallback(
        (container) => {
            toast.confirm(
                `${container.containerSeq}_${container.containerName}을 삭제하시겠습니까?`,
                () => {
                    dispatch(
                        deleteContainer({
                            containerSeq: container.containerSeq,
                            callback: ({ header }) => {
                                if (header.success) {
                                    toast.success(header.message);
                                    history.push('/container');
                                } else {
                                    toast.error(header.message);
                                }
                            },
                        }),
                    );
                },
                () => {},
            );
        },
        [dispatch, history],
    );

    /**
     * 삭제 이벤트
     */
    const handleClickDelete = useCallback(
        (container) => {
            const { containerSeq } = container;

            dispatch(
                hasRelationList({
                    containerSeq,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            // 관련 아이템 없음
                            if (!body) deleteCallback(container);
                            // 관련 아이템 있음
                            else {
                                toast.alert(
                                    <React.Fragment>
                                        사용 중인 템플릿입니다.
                                        <br />
                                        삭제할 수 없습니다.
                                    </React.Fragment>,
                                );
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
    const handleClickHistLoad = ({ header, body }) => {
        if (header.success) {
            toast.confirm(
                <React.Fragment>
                    현재 작업된 소스가 히스토리 내용으로 변경됩니다.
                    <br />
                    변경하시겠습니까?
                </React.Fragment>,
                () => {
                    dispatch(changeContainerBody(body.body));
                },
            );
        } else {
            toast.error(header.message);
        }
    };

    /**
     * 컨테이너 로드 버튼 이벤트
     */
    const handleClickContainerLoad = ({ header, body }) => {
        if (header.success) {
            toast.confirm(
                <React.Fragment>
                    현재 작업된 소스가 변경됩니다.
                    <br />
                    변경하시겠습니까?
                </React.Fragment>,
                () => {
                    dispatch(changeContainerBody(body.containerBody));
                },
            );
        } else {
            toast.error(header.message);
        }
    };

    /**
     * tems태그 삽입
     */
    const handleAppendTag = useCallback(
        (row, itemType) => {
            let tag = null;
            if (itemType === ITEM_CT) {
                tag = `${new Date().getTime()}<${TEMS_PREFIX}:${itemType.toLowerCase()} id="${row.containerSeq}" name="${row.containerName}"/>\n`;
            } else if (itemType === ITEM_CP) {
                tag = `${new Date().getTime()}<${TEMS_PREFIX}:${itemType.toLowerCase()} id="${row.componentSeq}" name="${row.componentName}"/>\n`;
            } else if (itemType === ITEM_TP) {
                tag = `${new Date().getTime()}<${TEMS_PREFIX}:${itemType.toLowerCase()} id="${row.templateSeq}" name="${row.templateName}"/>\n`;
                // } else if (itemType === ITEM_AD) {
                //     tag = `${new Date().getTime()}<${TEMS_PREFIX}:${itemType.toLowerCase()} id="${row.adSeq}" name="${row.adName}"/>\n`;
            }
            dispatch(appendTag(tag));
        },
        [dispatch],
    );

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>컨테이너관리</title>
                <meta name="description" content="컨테이너관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={412} headerClassName="pb-0" titleClassName="mb-0" title="컨테이너 검색" foldable expansion={expansionState[0]} onExpansion={handleListExpansion}>
                <Suspense>
                    <ContainerList onDelete={handleClickDelete} />
                </Suspense>
            </MokaCard>

            <Switch>
                <Route
                    path={['/container', '/container/:containerSeq']}
                    exact
                    render={() => (
                        <>
                            {/* 에디터 */}
                            <ContainerEditor expansion={expansionState[1]} onExpansion={handleEditorExpansion} />

                            {/* 탭 */}
                            <MokaIconTabs
                                expansion={expansionState[2]}
                                onExpansion={handleTabExpansion}
                                onSelectNav={(idx) => setActiveTabIdx(idx)}
                                tabWidth={412}
                                tabs={[
                                    <Suspense>
                                        <ContainerEdit show={activeTabIdx === 0} onDelete={handleClickDelete} />
                                    </Suspense>,
                                    <Suspense>
                                        <RelationInPageList show={activeTabIdx === 1} relSeqType={ITEM_CT} relSeq={container.containerSeq} />
                                    </Suspense>,
                                    <Suspense>
                                        <RelationInSkinList show={activeTabIdx === 2} relSeqType={ITEM_CT} relSeq={container.containerSeq} />
                                    </Suspense>,
                                    <Suspense>
                                        <LookupContainerList show={activeTabIdx === 3} seqType={ITEM_CT} seq={container.containerSeq} onLoad={handleClickContainerLoad} />
                                    </Suspense>,
                                    <Suspense>
                                        <LookupComponentList show={activeTabIdx === 4} seqType={ITEM_CT} seq={container.containerSeq} onAppend={handleAppendTag} />
                                    </Suspense>,
                                    <Suspense>
                                        <LookupTemplateList show={activeTabIdx === 5} seqType={ITEM_CT} seq={container.containerSeq} onAppend={handleAppendTag} />
                                    </Suspense>,
                                    <Suspense>
                                        <HistoryList show={activeTabIdx === 6} seqType={ITEM_CT} seq={container.containerSeq} onLoad={handleClickHistLoad} />
                                    </Suspense>,
                                ]}
                                tabNavWidth={48}
                                tabNavPosition="right"
                                tabNavs={[
                                    { title: '컨테이너 정보', text: 'Info' },
                                    { title: '관련 페이지', icon: <MokaIcon iconName="fal-money-check" /> },
                                    { title: '관련 기사타입', icon: <MokaIcon iconName="fal-file-alt" /> },
                                    { title: '관련 컨테이너', icon: <MokaIcon iconName="fal-calculator" /> },
                                    { title: '관련 컴포넌트', icon: <MokaIcon iconName="fal-ballot" /> },
                                    { title: '관련 템플릿', icon: <MokaIcon iconName="fal-newspaper" /> },
                                    { title: '히스토리', icon: <MokaIcon iconName="fal-history" /> },
                                ]}
                            />
                        </>
                    )}
                />
            </Switch>
        </div>
    );
};

export default Container;
