import React, { useEffect, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { MokaLoader } from '@components';
import { useDispatch } from 'react-redux';
import { clearStore } from '@store/jpod';

const ChannelList = React.lazy(() => import('./Channel/ChannelList'));
const ChannelEdit = React.lazy(() => import('./Channel/ChannelEdit'));

const JpodChannel = ({ match }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>채널 관리</title>
                <meta name="description" content="채널 관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}

            <Switch>
                <Route
                    path={[`${match.path}`, `${match.path}/add`, `${match.path}/:chnlSeq`]}
                    exact
                    render={() => (
                        <Suspense fallback={<MokaLoader />}>
                            <ChannelList match={match} />
                        </Suspense>
                    )}
                />
            </Switch>

            {/* 등록 / 수정창 */}
            <Switch>
                <Suspense fallback={<MokaLoader />}>
                    <Route path={([`${match.path}/add`], [`${match.path}/:chnlSeq`])} exact render={(props) => <ChannelEdit {...props} match={match} />} />
                </Suspense>
            </Switch>
        </div>
    );
};

export default JpodChannel;
