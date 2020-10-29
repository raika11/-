import React, { useCallback, useState, Suspense } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { MokaCard, MokaIcon } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';
import { clearStore, deleteComponent, hasRelationList } from '@store/component';
import { notification, toastr } from '@utils/toastUtil';

const ComponentList = React.lazy(() => import('./ComponentList'));
const ComponentEdit = React.lazy(() => import('./ComponentEdit'));

/**
 * 컴포넌트 관리
 */
const Component = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [openTabIdx, setOpenTabIdx] = useState(0);

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
            // dispatch(clearRelationList());
            // dispatch(clearHistory());
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

            <Switch>
                <Route
                    path={['/component', '/component/:componentSeq']}
                    exact
                    render={() => (
                        <>
                            {/* 등록/수정 */}
                            <ComponentEdit onDelete={handleClickDelete} />

                            {/* 탭 */}
                            <MokaIconTabs
                                onSelectNav={(idx) => setOpenTabIdx(idx)}
                                tabWidth={412}
                                // tabs={[
                                //     <Suspense>
                                //         <TemplateEdit show={openTabIdx === '0'} />
                                //     </Suspense>,
                                //     <Suspense>
                                //         <TemplatePageList show={openTabIdx === '1'} />
                                //     </Suspense>,
                                //     <Suspense>
                                //         <TemplateSkinList show={openTabIdx === '2'} />
                                //     </Suspense>,
                                //     <Suspense>
                                //         <TemplateContainerList show={openTabIdx === '3'} />
                                //     </Suspense>,
                                //     <Suspense>
                                //         <TemplateComponentList show={openTabIdx === '4'} />
                                //     </Suspense>,
                                //     <Suspense>
                                //         <TemplateHistoryList show={openTabIdx === '5'} />
                                //     </Suspense>,
                                // ]}
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
                        </>
                    )}
                />
            </Switch>
        </div>
    );
};

export default Component;
