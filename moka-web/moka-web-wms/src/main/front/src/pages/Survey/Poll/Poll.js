import React, { Suspense, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { MokaCard, MokaIconTabs, MokaLoader } from '@components';
import { Route } from 'react-router-dom';
import PollChildRelation from '@pages/Survey/Poll/relations/PollChildRelationInfo';
import { useDispatch, useSelector } from 'react-redux';
import { getPollCategoryCodes, getPollGroupCodes } from '@store/survey/poll/pollAction';
import { deletePoll, getPollList } from '@store/survey/poll/pollAction';
import toast from '@utils/toastUtil';
import { clearStore } from '@store/survey/poll/pollAction';
import PollList from '@pages/Survey/Poll/PollList';
import PollEdit from '@pages/Survey/Poll/PollEdit';

const Poll = ({ match }) => {
    const dispatch = useDispatch();
    const [activeTabIdx, setActiveTabIdx] = useState(0);
    const { search } = useSelector((store) => ({
        search: store.poll.search,
    }));

    const handleClickDelete = (pollSeq) => {
        dispatch(
            deletePoll({
                pollSeq,
                callback: (response) => {
                    dispatch(getPollList({ search }));
                    toast.result(response);
                },
            }),
        );
    };

    useEffect(() => {
        dispatch(getPollCategoryCodes());
        dispatch(getPollGroupCodes());
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>투표 관리</title>
                <meta name="description" content="투표 관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard width={950} className="mr-gutter" titleClassName="mb-0" title="투표 관리">
                <Suspense fallback={<MokaLoader />}>
                    <PollList onDelete={handleClickDelete} />
                </Suspense>
            </MokaCard>

            {/* 등록/수정창 */}
            <Route
                path={[`${match.url}/add`, `${match.url}/:pollSeq`]}
                exact
                render={(props) => (
                    <MokaIconTabs
                        foldable={false}
                        tabWidth={570}
                        onSelectNav={(idx) => setActiveTabIdx(idx)}
                        tabs={[
                            <Suspense fallback={<MokaLoader />}>
                                <PollEdit show={activeTabIdx === 0} onDelete={handleClickDelete} />
                            </Suspense>,
                            <Suspense fallback={<MokaLoader />}>
                                <PollChildRelation show={activeTabIdx === 1} />
                            </Suspense>,
                        ]}
                        tabNavWidth={48}
                        placement="left"
                        tabNavs={[
                            { title: '투표 정보', text: 'Info' },
                            { title: '관련 정보페이지', text: '관련' },
                        ]}
                    />
                )}
            />
        </div>
    );
};

export default Poll;
