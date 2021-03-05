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
import { useHistory } from 'react-router-dom';
import PollList from '@pages/Survey/Poll/PollList';
import PollEdit from '@pages/Survey/Poll/PollEdit';
import { Col } from 'react-bootstrap';
import clsx from 'clsx';
import useBreakpoint from '@hooks/useBreakpoint';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const Poll = ({ match }) => {
    const matchPoints = useBreakpoint();
    const dispatch = useDispatch();
    const history = useHistory();
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
                    history.push('/poll');
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
        <Container className="p-0 position-relative" fluid>
            <Row className="m-0">
                <Helmet>
                    <title>투표 관리</title>
                    <meta name="description" content="투표 관리페이지입니다." />
                    <meta name="robots" content="noindex" />
                </Helmet>

                {/* 리스트 */}
                <Col sm={12} md={7} className={clsx('p-0', { 'pr-gutter': matchPoints.md || matchPoints.lg })}>
                    <MokaCard className="w-100" titleClassName="mb-0" title="투표 관리">
                        <Suspense fallback={<MokaLoader />}>
                            <PollList onDelete={handleClickDelete} />
                        </Suspense>
                    </MokaCard>
                </Col>

                {/* 등록/수정창 */}
                <Route
                    path={[`${match.url}/add`, `${match.url}/:pollSeq`]}
                    exact
                    render={(props) => {
                        let clazz = 'absolute-top-right h-100 overlay-shadow';
                        let xs = 7;
                        if (matchPoints.md || matchPoints.lg) {
                            xs = 5;
                            clazz = '';
                        }

                        return (
                            <Col xs={xs} className={clsx('p-0  color-bg-body', clazz)} style={{ zIndex: 2 }}>
                                <MokaIconTabs
                                    foldable={false}
                                    className="w-100"
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
                            </Col>
                        );
                    }}
                />
            </Row>
        </Container>
    );
};

export default Poll;
