import React, { Suspense, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import produce from 'immer';
import { ColumnThree } from '~/layouts';
import { WmsLoader } from '~/components';

const DatasetListContainer = React.lazy(() => import('./DatasetListContainer'));
const DatasetInfoContainer = React.lazy(() => import('./DatasetInfoContainer'));
const DatasetRelationContainer = React.lazy(() => import('./relation/DatasetRelationContainer'));

/**
 * width
 */
const widthOne = { true: 412, false: 32 };
const widthThree = { true: 462, false: 50 };

/**
 * DatasetPage
 * @param {object} props Props
 */
const DatasetPage = (props) => {
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
                <title>데이터셋관리</title>
                <meta name="description" content="데이터셋관리페이지입니다." />
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
                {/* 데이터 리스트 */}
                <Suspense fallback={<WmsLoader />}>
                    <DatasetListContainer
                        toggleState={toggleState}
                        changeToggleState={changeToggleState}
                    />
                </Suspense>

                {/* 데이터 정보 */}
                <Suspense fallback={<WmsLoader />}>
                    <Switch>
                        <Route
                            path={['/', '/dataset', '/dataset/:datasetSeq']}
                            exact
                            render={() => (
                                <DatasetInfoContainer
                                    toggleState={toggleState}
                                    changeAllToggleState={changeAllToggleState}
                                />
                            )}
                        />
                    </Switch>
                </Suspense>

                {/* 사이트 검색 */}
                <Suspense fallback={<WmsLoader />}>
                    <Switch>
                        <Route
                            path={['/', '/dataset', '/dataset/:datasetSeq']}
                            exact
                            render={() => (
                                <DatasetRelationContainer
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

export default DatasetPage;
