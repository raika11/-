import React, { Suspense, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearStore } from '@store/jpod';
import EpisodeList from '@pages/Jpod/Episode/EpisodeList';
import EpisodeEdit from '@pages/Jpod/Episode/EpisodeEdit';

/**
 * J팟 관리 - 에피소드
 */
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
                <meta name="description" content="에피소드 관리 페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <Suspense>
                <EpisodeList match={match} />
            </Suspense>

            {/* 등록 / 수정 */}
            <Switch>
                <Route
                    path={[`${match.path}/add`, `${match.path}/:chnlSeq`, `${match.path}/:chnlSeq/:epsdSeq`]}
                    exact
                    render={(props) => (
                        <Suspense>
                            <EpisodeEdit {...props} match={match} />
                        </Suspense>
                    )}
                />
            </Switch>
        </div>
    );
};

export default JpodEpisode;
