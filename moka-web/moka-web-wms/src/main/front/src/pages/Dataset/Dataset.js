import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { ITEM_DS } from '@/constants';
import { MokaCard, MokaIcon, MokaIconTabs } from '@components';
import { clearStore, deleteDataset, hasRelationList } from '@store/dataset';
import toast, { messageBox } from '@utils/toastUtil';
import DatasetEdit from './DatasetEdit';
import RelationInPageList from '@pages/Page/components/RelationInPageList';
import DatasetList from './DatasetList';
import RelationInArticlePageList from '@pages/ArticlePage/components/RelationInArticlePageList';
import RelationInContainerList from '@pages/Container/components/RelationInContainerList';
import RelationInComponentList from '@pages/Component/components/RelationInComponentList';

/**
 * 데이터셋 관리
 */
const Dataset = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const dataset = useSelector(({ dataset }) => dataset.dataset);
    const currentMenu = useSelector(({ auth }) => auth.currentMenu);
    const [activeTabIdx, setActiveTabIdx] = useState(0);

    /**
     * 삭제 콜백
     * @param {object} dataset dataset
     */
    const deleteCallback = (dataset) => {
        messageBox.confirm(
            `${dataset.datasetSeq}을(를) 삭제 하시겠습니까?`,
            () => {
                dispatch(
                    deleteDataset({
                        datasetSeq: dataset.datasetSeq,
                        callback: ({ header, body }) => {
                            if (header.success && body) {
                                toast.success(header.message);
                                history.push(match.path);
                            } else {
                                messageBox.alert(header.message);
                            }
                        },
                    }),
                );
            },
            () => {},
        );
    };

    /**
     * 삭제 클릭
     */
    const handleClickDelete = (dataset) => {
        if (dataset.autoCreateYn !== 'Y') {
            messageBox.alert('편집 데이터셋은 삭제할 수 없습니다.');
            return;
        }
        dispatch(
            hasRelationList({
                datasetSeq: dataset.datasetSeq,
                callback: ({ header, body }) => {
                    if (header.success) {
                        // 관련 아이템 없음
                        if (!body) deleteCallback(dataset);
                        // 관련 아이템 있음
                        else {
                            messageBox.alert('사용 중인 데이터셋입니다.\n삭제할 수 없습니다.');
                        }
                    } else {
                        toast.error(header.message);
                    }
                },
            }),
        );
    };

    useEffect(() => {
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
                <DatasetList onDelete={handleClickDelete} match={match} />
            </MokaCard>

            <Switch>
                <Route
                    path={[`${match.path}/add`, `${match.path}/:datasetSeq`]}
                    exact
                    render={() => (
                        <>
                            <DatasetEdit onDelete={handleClickDelete} match={match} />
                            <MokaIconTabs
                                foldable={false}
                                tabWidth={412}
                                onSelectNav={(idx) => setActiveTabIdx(idx)}
                                tabs={[
                                    <RelationInPageList show={activeTabIdx === 0} relSeqType={ITEM_DS} relSeq={dataset.datasetSeq} />,
                                    <RelationInArticlePageList show={activeTabIdx === 1} relSeqType={ITEM_DS} relSeq={dataset.datasetSeq} />,
                                    <RelationInContainerList show={activeTabIdx === 2} relSeqType={ITEM_DS} relSeq={dataset.datasetSeq} />,
                                    <RelationInComponentList show={activeTabIdx === 3} relSeqType={ITEM_DS} relSeq={dataset.datasetSeq} />,
                                ]}
                                tabNavWidth={48}
                                placement="left"
                                tabNavs={[
                                    { title: '관련 페이지', icon: <MokaIcon iconName="fal-money-check" /> },
                                    { title: '관련 아티클페이지', icon: <MokaIcon iconName="fal-file-alt" /> },
                                    { title: '관련 컨테이너', icon: <MokaIcon iconName="fal-calculator" /> },
                                    { title: '관련 컴포넌트', icon: <MokaIcon iconName="fal-ballot" /> },
                                ]}
                            />
                        </>
                    )}
                />
            </Switch>
        </div>
    );
};

export default Dataset;
