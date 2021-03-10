import React, { useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { MokaCard } from '@components';
import { clearStore } from '@store/codeMgt';
import DtlList from './DtlList';
const GrpList = React.lazy(() => import('./GrpList'));

/**
 * 기타코드 관리
 */
const CodeMgt = ({ match }) => {
    const dispatch = useDispatch();
    const currentMenu = useSelector(({ auth }) => auth.currentMenu);

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

            {/* 그룹코드 목록 */}
            <MokaCard width={480} className="mr-gutter" bodyClassName="d-flex flex-column" title={currentMenu?.menuDisplayNm}>
                <Suspense>
                    <GrpList match={match} />
                </Suspense>
            </MokaCard>

            {/* 그룹의 상세코드 목록 */}
            <Switch>
                <Route
                    path={[`${match.path}/:grpCd`]}
                    exact
                    render={() => (
                        <MokaCard className="flex-fill" bodyClassName="d-flex flex-column" header={false}>
                            <DtlList match={match} />
                        </MokaCard>
                    )}
                />
            </Switch>
        </div>
    );
};

export default CodeMgt;
