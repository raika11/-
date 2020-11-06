import React, { useState, useCallback, Suspense } from 'react';
import produce from 'immer';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

import { MokaCard, MokaIcon } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';
import { ITEM_CT } from '@/constants';
import { notification, toastr } from '@utils/toastUtil';
import { deleteContainer, hasRelationList, changeContainerBody } from '@store/container';

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
            toastr.confirm(`${container.containerSeq}_${container.containerName}을 삭제하시겠습니까?`, {
                onOk: () => {
                    dispatch(
                        deleteContainer({
                            containerSeq: container.containerSeq,
                            callback: ({ header }) => {
                                if (header.success) {
                                    notification('success', header.message);
                                    history.push('/container');
                                } else {
                                    notification('warning', header.message);
                                }
                            },
                        }),
                    );
                },
                onCancel: () => {},
            });
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
                            else notification('warning', '사용 중인 컨테이너는 삭제할 수 없습니다');
                        } else {
                            notification('warning', header.message);
                        }
                    },
                }),
            );
        },
        [deleteCallback, dispatch],
    );

    /**
     * 컨테이너 히스토리 로드 버튼
     */
    const handleClickLoad = ({ header, body }) => {
        if (header.success) {
            toastr.confirm('불러오기 시 작업 중인 컨테이너 소스 내용이 사라집니다. 불러오시겠습니까?', {
                onOk: () => {
                    dispatch(changeContainerBody(body.body));
                },
                onCancel: () => {},
            });
        } else {
            notification('error', header.message);
        }
    };

    return (
        <div className="d-flex">
            <Helmet>
                <title>컨테이너관리</title>
                <meta name="description" content="컨테이너관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard
                width={412}
                className="mr-gutter"
                headerClassName="pb-0"
                titleClassName="mb-0"
                title="컨테이너 검색"
                foldable
                expansion={expansionState[0]}
                onExpansion={handleListExpansion}
            >
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
                                        <LookupContainerList show={activeTabIdx === 3} relSeqType={ITEM_CT} seq={container.containerSeq} />
                                    </Suspense>,
                                    <Suspense>
                                        <LookupComponentList show={activeTabIdx === 4} relSeqType={ITEM_CT} seq={container.containerSeq} />
                                    </Suspense>,
                                    <Suspense>
                                        <LookupTemplateList show={activeTabIdx === 5} relSeqType={ITEM_CT} seq={container.containerSeq} />
                                    </Suspense>,
                                    <Suspense>
                                        <HistoryList show={activeTabIdx === 6} seqType={ITEM_CT} seq={container.containerSeq} onLoad={handleClickLoad} />
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
