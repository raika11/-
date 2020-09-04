import React, { Suspense, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import produce from 'immer';
import { ColumnThree } from '~/layouts';
import { WmsLoader } from '~/components';

const ContainerListContainer = React.lazy(() => import('./ContainerListContainer'));
const ContainerEditContainer = React.lazy(() => import('./ContainerEditContainer'));
const ContainerRelationContainer = React.lazy(() =>
    import('./relation/ContainerRelationContainer')
);

/**
 * width
 */
const widthOne = { true: 412, false: 32 };
const widthThree = { true: 462, false: 50 };

/**
 * ContainerPage
 * @param {object} props Props
 */
const ContainerPage = (props) => {
    /**
     * 컬럼별 toggle state
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
                <title>컨테이너관리</title>
                <meta name="description" content="컨테이너관리페이지입니다." />
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
                {/* 컨테이너 리스트 */}
                <Suspense fallback={<WmsLoader />}>
                    <ContainerListContainer
                        toggleState={toggleState}
                        changeToggleState={changeToggleState}
                    />
                </Suspense>

                {/* 컨테이너 편집 */}
                <Suspense fallback={<WmsLoader />}>
                    <ContainerEditContainer
                        toggleState={toggleState}
                        changeAllToggleState={changeAllToggleState}
                    />
                </Suspense>

                {/* 컨테이너 정보 */}
                <Suspense fallback={<WmsLoader />}>
                    <Switch>
                        <Route
                            path={['/', '/container', '/container/:containerSeq']}
                            exact
                            render={() => (
                                <ContainerRelationContainer
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

export default ContainerPage;
