import React, { Suspense, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import produce from 'immer';
import { Route, Switch } from 'react-router-dom';
import { ColumnThree } from '~/layouts';
import { WmsLoader } from '~/components';

const EasyOneContainer = React.lazy(() => import('./EasyOneContainer'));
const EasytestRelationContainer = React.lazy(() => import('./relation/EasytestRelationContainer'));

/**
 * width
 */
const widthOne = { true: 412, false: 32 };
const widthThree = { true: 462, false: 50 };

/**
 * EasyTestPage
 * @param {object} props
 */
const EasyTestPage = (props) => {
    // 컬럼별 Toggle state
    const [toggleState, setToggleState] = useState([true, true, true]);

    /**
     * 컬럼 토글값을 변경
     * @param {number} target 0 | 1 | 2
     * @param {boolean} value true | false
     * toggleState 값을 target index 부터 1 제거 후 value 추가
     * Immer 라이브러리가 불변성 관리
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
     * @param {array} target [true, true, true]
     */
    const changeAllToggleState = (toggleArr) => {
        setToggleState(toggleArr);
    };

    return (
        <>
            <ColumnThree
                {...props}
                sidebarSize="normal"
                widthOne={widthOne[toggleState[0]]}
                widthTwo={`calc(100% - ${
                    widthOne[toggleState[0]] + widthThree[toggleState[2]] + 16
                }px)`}
                widthThree={widthThree[toggleState[2]]}
            >
                {/* 도메인 트리 */}
                <Suspense fallback={<WmsLoader />}>
                    <EasyOneContainer
                        toggleState={toggleState}
                        changeToggleState={changeToggleState}
                    />
                </Suspense>

                {/* 편집화면 리스트  */}
                <Suspense fallback={<WmsLoader />}>
                    <div>test</div>
                </Suspense>

                {/* 기사 정보 */}
                <Suspense fallback={<WmsLoader />}>
                    <Switch>
                        <Route
                            path={['/easytest', '/easytest/:easytestSeq']}
                            exact
                            render={() => (
                                <EasytestRelationContainer
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

export default EasyTestPage;
