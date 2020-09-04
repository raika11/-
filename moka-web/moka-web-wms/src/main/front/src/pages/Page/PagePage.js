import React, { Suspense, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import produce from 'immer';
import { ColumnThree } from '~/layouts';
import { WmsLoader } from '~/components';

const PageManagementContainer = React.lazy(() => import('./PageManagementContainer'));
const PageEditContainer = React.lazy(() => import('./PageEditContainer'));
const PageChildRelationContainer = React.lazy(() =>
    import('./relation/PageChildRelationContainer')
);

/**
 * width
 */
const widthOne = { true: 412, false: 32 };
const widthThree = { true: 462, false: 50 };

/**
 * PagePage
 * @param {object} props Props
 */
const PagePage = (props) => {
    /**
     * 컬럼별 togggle state
     */
    const [toggleState, setToggleState] = useState([true, true, true]);

    /**
     * 컬럼의 토글값을 하나씩 변경한다
     * @param {number} target 0|1|2
     * @param {boolean} value true|false
     */
    const changeToggleState = (target, value) => {
        setToggleState(() => {
            return produce(toggleState, (draft) => {
                draft.splice(target, 1, value);
            });
        });
    };

    /**
     * 컬럼의 토글값 전체를 변경한다
     * @param {Array} target [true, true, true]
     */
    const changeAllToggleState = (toggleArr) => {
        setToggleState(toggleArr);
    };

    return (
        <>
            <Helmet>
                <title>페이지관리</title>
                <meta name="description" content="페이지관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>
            <ColumnThree
                {...props}
                sidebarSize="normal"
                widthOne={widthOne[toggleState[0]]}
                widthTwo={`calc(100% - ${
                    widthOne[toggleState[0]] + widthThree[toggleState[2]] + 16
                }px)`}
                widthThree={widthThree[toggleState[2]]}
            >
                {/* 페이지 트리 */}
                <Suspense fallback={<WmsLoader />}>
                    <PageManagementContainer
                        toggleState={toggleState}
                        changeToggleState={changeToggleState}
                    />
                </Suspense>

                {/* 에디터 편집 */}
                <Suspense fallback={<WmsLoader />}>
                    <PageEditContainer
                        toggleState={toggleState}
                        changeAllToggleState={changeAllToggleState}
                    />
                </Suspense>

                {/* 페이지 정보 */}
                <Suspense fallback={<WmsLoader />}>
                    <Switch>
                        <Route
                            path={['/', '/page', '/page/:pageSeq']}
                            exact
                            render={() => (
                                <PageChildRelationContainer
                                    toggleState={toggleState}
                                    changeToggleState={changeToggleState}
                                />
                            )}
                        />
                    </Switch>
                </Suspense>
            </ColumnThree>
        </>
    );
};

export default PagePage;
