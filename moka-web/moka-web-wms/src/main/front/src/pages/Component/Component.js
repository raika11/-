import React, { useCallback, useState, Suspense } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { MokaCard, MokaIcon } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';
import { clearStore, deleteComponent, hasRelationList } from '@store/component';
import toast from '@utils/toastUtil';
import { ITEM_CP } from '@/constants';

const ComponentList = React.lazy(() => import('./ComponentList'));
const ComponentEdit = React.lazy(() => import('./ComponentEdit'));

// relations
const RelationInPageList = React.lazy(() => import('@pages/commons/RelationInPageList'));
const RelationInSkinList = React.lazy(() => import('@pages/commons/RelationInSkinList'));
const RelationInContainerList = React.lazy(() => import('@pages/commons/RelationInContainerList'));

/**
 * 컴포넌트 관리
 */
const Component = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { component } = useSelector((store) => ({
        component: store.component.component,
    }));

    // state
    const [activeTabIdx, setActiveTabIdx] = useState(0);

    /**
     * 컴포넌트 삭제
     * @param {object} component component
     */
    const deleteCallback = useCallback(
        (component) => {
            toast.confirm(
                `${component.componentSeq}_${component.componentName}을 삭제하시겠습니까?`,
                () => {
                    dispatch(
                        deleteComponent({
                            componentSeq: component.componentSeq,
                            callback: ({ header }) => {
                                // 삭제 성공
                                if (header.success) {
                                    toast.success(header.message);
                                    history.push('/component');
                                }
                                // 삭제 실패
                                else {
                                    toast.warning(header.message);
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
     * 삭제 버튼 클릭
     * @param {object} component 컴포넌트 데이터
     */
    const handleClickDelete = useCallback(
        (component) => {
            const { componentSeq } = component;
            dispatch(
                hasRelationList({
                    componentSeq,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            // 관련 아이템 없음
                            if (!body) deleteCallback(component);
                            // 관련 아이템 있음
                            else {
                                toast.alert(
                                    <React.Fragment>
                                        사용 중인 컴포넌트입니다.
                                        <br />
                                        삭제할 수 없습니다.
                                    </React.Fragment>,
                                );
                            }
                        } else {
                            toast.warning(header.message);
                        }
                    },
                }),
            );
        },
        [deleteCallback, dispatch],
    );

    React.useEffect(() => {
        // unmount시 스토어초기화
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>컴포넌트관리</title>
                <meta name="description" content="컴포넌트관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={412} className="mr-gutter" titleClassName="mb-0" title="컴포넌트 검색">
                <Suspense>
                    <ComponentList onDelete={handleClickDelete} />
                </Suspense>
            </MokaCard>

            {/* 등록/수정 */}
            <Switch>
                <Route path={[match.url, `${match.url}/:componentSeq`]} exact render={() => <ComponentEdit onDelete={handleClickDelete} />} />
            </Switch>

            {/* 탭 */}
            <MokaIconTabs
                onSelectNav={(idx) => setActiveTabIdx(Number(idx))}
                tabWidth={412}
                tabs={[
                    <Suspense>
                        <RelationInPageList show={activeTabIdx === 0} relSeqType={ITEM_CP} relSeq={component.componentSeq} />
                    </Suspense>,
                    <Suspense>
                        <RelationInSkinList show={activeTabIdx === 1} relSeqType={ITEM_CP} relSeq={component.componentSeq} />
                    </Suspense>,
                    <Suspense>
                        <RelationInContainerList show={activeTabIdx === 2} relSeqType={ITEM_CP} relSeq={component.componentSeq} />
                    </Suspense>,
                ]}
                tabNavWidth={48}
                tabNavPosition="right"
                tabNavs={[
                    { title: '관련 페이지', icon: <MokaIcon iconName="fal-money-check" /> },
                    { title: '관련 뷰스킨', icon: <MokaIcon iconName="fal-file-alt" /> },
                    { title: '관련 컨테이너', icon: <MokaIcon iconName="fal-calculator" /> },
                ]}
            />
        </div>
    );
};

export default Component;
