import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaIcon } from '@components';
import { MokaIconTabs } from '@/components/MokaTabs';
import { clearStore, deleteComponent, hasRelationList } from '@store/component';
import toast, { messageBox } from '@utils/toastUtil';
import { ITEM_CP } from '@/constants';
import ComponentEdit from './ComponentEdit';
import ComponentList from './ComponentList';
import RelationInPageList from '@pages/Page/components/RelationInPageList';
import RelationInArticlePageList from '@pages/ArticlePage/components/RelationInArticlePageList';
import RelationInContainerList from '@pages/Container/components/RelationInContainerList';

/**
 * 컴포넌트 관리
 */
const Component = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const component = useSelector(({ component }) => component.component);
    const currentMenu = useSelector(({ auth }) => auth.currentMenu);
    const [activeTabIdx, setActiveTabIdx] = useState(0);

    /**
     * 컴포넌트 삭제
     * @param {object} component component
     */
    const deleteCallback = useCallback(
        (component) => {
            messageBox.confirm(
                `${component.componentSeq}_${component.componentName}을 삭제하시겠습니까?`,
                () => {
                    dispatch(
                        deleteComponent({
                            componentSeq: component.componentSeq,
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
                },
                () => {},
            );
        },
        [dispatch, history, match.path],
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
                                messageBox.alert('사용 중인 컴포넌트입니다.\n삭제할 수 없습니다.');
                            }
                        } else {
                            toast.fail(header.message);
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
                <title>{currentMenu?.menuDisplayNm}</title>
                <meta name="description" content={`${currentMenu?.menuDisplayNm}페이지입니다.`} />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={412} className="mr-gutter" bodyClassName="d-flex flex-column" title={currentMenu?.menuDisplayNm}>
                <ComponentList onDelete={handleClickDelete} match={match} />
            </MokaCard>

            <Route
                path={[`${match.path}/add`, `${match.path}/:componentSeq`]}
                exact
                render={() => (
                    <React.Fragment>
                        {/* 등록/수정 */}
                        <ComponentEdit onDelete={handleClickDelete} match={match} />

                        {/* 탭 */}
                        <MokaIconTabs
                            foldable={false}
                            onSelectNav={(idx) => setActiveTabIdx(Number(idx))}
                            tabWidth={412}
                            tabs={[
                                <RelationInPageList show={activeTabIdx === 0} relSeqType={ITEM_CP} relSeq={component.componentSeq} />,
                                <RelationInArticlePageList show={activeTabIdx === 1} relSeqType={ITEM_CP} relSeq={component.componentSeq} />,
                                <RelationInContainerList show={activeTabIdx === 2} relSeqType={ITEM_CP} relSeq={component.componentSeq} />,
                            ]}
                            tabNavWidth={48}
                            tabNavPosition="right"
                            tabNavs={[
                                { title: '관련 페이지', icon: <MokaIcon iconName="fal-money-check" /> },
                                { title: '관련 아티클페이지', icon: <MokaIcon iconName="fal-file-alt" /> },
                                { title: '관련 컨테이너', icon: <MokaIcon iconName="fal-calculator" /> },
                            ]}
                        />
                    </React.Fragment>
                )}
            />
        </div>
    );
};

export default Component;
