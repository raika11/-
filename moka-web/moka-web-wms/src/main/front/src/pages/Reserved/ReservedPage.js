import React, { Suspense, useState } from 'react';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import produce from 'immer';
import { ColumnTwo } from '~/layouts';
import { WmsLoader } from '~/components';
import ReservedListContainer from './ReservedListContainer';
import ReservedInfoContainer from './ReservedInfoContainer';

/**
 * width
 */
const widthOne = { true: 412, false: 32 };
const widthThree = { true: 462, false: 50 };

/**
 * DatasetPage
 * @param {object} props Props
 */
const ReservedPage = (props) => {
    /**
     * 컬럼별 toggle state
     */
    const [toggleState, setToggleState] = useState([true, true]);

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
                <title>예약어관리</title>
                <meta name="description" content="예약어관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>
            <ColumnTwo
                {...props}
                sidebarSize="normal"
                widthOne={widthOne[toggleState[0]]}
                widthTwo={`calc(100% - ${
                    widthOne[toggleState[0]] + widthThree[toggleState[2]] + 16
                }px)`}
            >
                {/* 예약어 검색 */}
                <Suspense fallback={<WmsLoader />}>
                    <ReservedListContainer
                        toggleState={toggleState}
                        changeToggleState={changeToggleState}
                    />
                </Suspense>
                {/* 예약어 정보 */}
                <Suspense fallback={<WmsLoader />}>
                    <Route
                        path={['/reserved', '/reserved/:reservedSeq']}
                        exact
                        render={() => (
                            <ReservedInfoContainer
                                toggleState={toggleState}
                                changeAllToggleState={changeAllToggleState}
                            />
                        )}
                    />
                </Suspense>
            </ColumnTwo>
        </>
    );
};

export default ReservedPage;
