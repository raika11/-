import React, { useCallback, useState, Suspense } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { MokaCard, MokaIcon } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';
import { clearStore, deleteComponent, hasRelationList } from '@store/component';
import { notification, toastr } from '@utils/toastUtil';
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
const Component = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { component } = useSelector((store) => ({
        component: store.component.component,
    }));

    // state
    const [activeTabIdx, setActiveTabIdx] = useState(0);

    /**
     * 도메인 삭제
     * @param {object} response response
     */
    const deleteCallback = useCallback(
        (response, componentSeq) => {
            if (response.header.success) {
                dispatch(
                    deleteComponent({
                        componentSeq: componentSeq,
                        callback: (response) => {
                            if (response.header.success) {
                                notification('success', '삭제하였습니다.');
                                history.push('/component');
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
     * 삭제 버튼 클릭
     * @param {object} component 컴포넌트 데이터
     */
    const handleClickDelete = useCallback(
        (component) => {
            const { componentSeq, componentName } = component;

            toastr.confirm(`${componentSeq}_${componentName}을 정말 삭제하시겠습니까?`, {
                onOk: () => {
                    dispatch(
                        hasRelationList({
                            componentSeq,
                            callback: deleteCallback,
                        }),
                    );
                },
                onCancel: () => {},
            });
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
                <Route path={['/component', '/component/:componentSeq']} exact render={() => <ComponentEdit onDelete={handleClickDelete} />} />
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
