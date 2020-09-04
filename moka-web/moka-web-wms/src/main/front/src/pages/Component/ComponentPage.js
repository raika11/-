import React, { Suspense, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import produce from 'immer';
import { ColumnThree } from '~/layouts';
import { WmsLoader } from '~/components';
import { clearComponent } from '~/stores/component/componentStore';

const ComponentListContainer = React.lazy(() => import('./ComponentListContainer'));
const ComponentInfoContainer = React.lazy(() => import('./ComponentInfoContainer'));
const ComponentRelationContainer = React.lazy(() =>
    import('./relation/ComponentRelationContainer')
);

/**
 * width
 */
const widthOne = { true: 412, false: 32 };
const widthThree = { true: 462, false: 50 };

/**
 * Component Page
 * @param {object} props Props
 */
const ComponentPage = (props) => {
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

    /**
     * 언마운트시 템플릿 데이터 날림
     */
    const dispatch = useDispatch();
    useEffect(() => {
        return () => {
            dispatch(clearComponent());
        };
    }, [dispatch]);

    return (
        <>
            <Helmet>
                <title>컴포넌트관리</title>
                <meta name="description" content="컴포넌트관리페이지입니다." />
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
                {/* 컴포넌트 리스트 */}
                <Suspense fallback={<WmsLoader />}>
                    <ComponentListContainer
                        toggleState={toggleState}
                        changeToggleState={changeToggleState}
                    />
                </Suspense>

                {/* 컴포넌트 정보/편집 */}
                <Suspense fallback={<WmsLoader />}>
                    <Switch>
                        <Route
                            path={['/component', '/component/:componentSeq']}
                            exact
                            render={() => (
                                <ComponentInfoContainer
                                    toggleState={toggleState}
                                    changeAllToggleState={changeAllToggleState}
                                />
                            )}
                        />
                    </Switch>
                </Suspense>

                {/* 컴포넌트 관련아이템 */}
                <Suspense fallback={<WmsLoader />}>
                    <Switch>
                        <Route
                            path={['/component', '/component/:componentSeq']}
                            exact
                            render={() => (
                                <ComponentRelationContainer
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

export default ComponentPage;
