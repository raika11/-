import React, { useEffect, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { MokaCard } from '@components';
import { clearStore } from '@store/codeMgt';
import CodeMgtEdit from './CodeMgtEdit';
const CodeMgtList = React.lazy(() => import('./CodeMgtList'));

/**
 * 기타코드 관리 컴포넌트
 */
const CodeMgt = ({ match }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    return (
        <>
            <div className="d-flex">
                <Helmet>
                    <title>기타코드 관리</title>
                    <meta name="description" content="기타코드 관리페이지입니다." />
                    <meta name="robots" content="noindex" />
                </Helmet>

                {/* 기타코드 리스트 */}
                <MokaCard width={260} className="mr-gutter" titleClassName="mb-0" bodyClassName="d-flex flex-column" header={false}>
                    <Suspense>
                        <CodeMgtList />
                    </Suspense>
                </MokaCard>

                <Switch>
                    <Route
                        path={[`${match.url}/:grpCd`, `${match.url}/:grpCd/:cdSeq`]}
                        exact
                        render={() => (
                            <MokaCard width={1300} titleClassName="mb-0" bodyClassName="d-flex flex-column" header={false}>
                                {/* 기타코드 편집 */}
                                <CodeMgtEdit />
                            </MokaCard>
                        )}
                    />
                </Switch>
            </div>
        </>
    );
};

export default CodeMgt;
