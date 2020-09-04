import React, { Suspense, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import produce from 'immer';
import { ColumnTwo } from '~/layouts';
import { WmsLoader } from '~/components';
import { clearDomain } from '~/stores/domain/domainStore';

const DomainListContainer = React.lazy(() => import('./DomainListContainer'));
const DomainInfoContainer = React.lazy(() => import('./DomainInfoContainer'));

/**
 * width
 */
const widthOne = { true: 412, false: 32 };
const widthTwo = { true: 838 };

/**
 * DatasetPage
 * @param {object} props Props
 */
const DatasetPage = (props) => {
    /**
     * 컬럼별 toggle state
     */
    const [toggleState, setToggleState] = useState([true, true]);

    /**
     * 컬럼의 토글값을 하나씩 변경한다
     * @param {number} target 0|1
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
     * @param {Array} target [true, true]
     */
    const changeAllToggleState = (toggleArr) => {
        setToggleState(toggleArr);
    };

    const dispatch = useDispatch();
    useEffect(() => {
        /**
         * 언마운트시 템플릿 데이터 날림
         */
        return () => {
            dispatch(clearDomain());
        };
    }, [dispatch]);

    return (
        <>
            <Helmet>
                <title>도메인관리</title>
                <meta name="description" content="도메인관리페이지입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>
            <ColumnTwo
                {...props}
                sidebarSize="normal"
                widthOne={widthOne[toggleState[0]]}
                widthTwo={widthTwo.true}
            >
                {/* 도메인 관리 */}
                <Suspense fallback={<WmsLoader />}>
                    <DomainListContainer
                        toggleState={toggleState}
                        changeToggleState={changeToggleState}
                    />
                </Suspense>

                {/* 도메인 정보 */}
                <Suspense fallback={<WmsLoader />}>
                    <Switch>
                        <Route
                            path={['/domain', '/domain/:domainId']}
                            exact
                            render={() => (
                                <DomainInfoContainer
                                    toggleState={toggleState}
                                    changeAllToggleState={changeAllToggleState}
                                />
                            )}
                        />
                    </Switch>
                </Suspense>
            </ColumnTwo>
        </>
    );
};

export default DatasetPage;
