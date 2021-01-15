import React, { Suspense, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { MokaLoader } from '@components';
import { useDispatch } from 'react-redux';
import { clearStore } from '@store/jpod';
import { useParams } from 'react-router-dom';

const EpisodeList = React.lazy(() => import('./Episode/EpisodeList'));
const EpisodeEdit = React.lazy(() => import('./Episode/EpisodeEdit'));

const JpodEpisode = ({ match }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <div className="d-flex">
            <Helmet>
                <title>에피소드 관리</title>
                <meta name="description" content="에피소드 관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <Switch>
                <Route
                    path={[`${match.path}`, `${match.path}/add`, `${match.path}/:chnlSeq`, `${match.path}/:chnlSeq/:epsdSeq`]}
                    exact
                    render={() => (
                        <Suspense fallback={<MokaLoader />}>
                            <EpisodeList match={match} />
                        </Suspense>
                    )}
                />
            </Switch>

            {/* 등록 / 수정창 */}
            <Switch>
                <Suspense fallback={<MokaLoader />}>
                    <Route
                        path={[`${match.path}/add`, `${match.path}/:chnlSeq`, `${match.path}/:chnlSeq/:epsdSeq`]}
                        exact
                        render={(props) => <EpisodeEdit {...props} match={match} />}
                    />
                </Suspense>
            </Switch>
        </div>
    );
};

export default JpodEpisode;
