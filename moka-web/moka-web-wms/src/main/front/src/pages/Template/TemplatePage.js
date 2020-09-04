import React, { Suspense, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import produce from 'immer';
import { ColumnThree } from '~/layouts';
import { WmsLoader } from '~/components';
import { clearTemplate } from '~/stores/template/templateStore';

const TemplateListContainer = React.lazy(() => import('./TemplateListContainer'));
const TemplateEditContainer = React.lazy(() => import('./TemplateEditContainer'));
const TemplateRelationContainer = React.lazy(() => import('./relation/TemplateRelationContainer'));

/**
 * width
 */
const widthOne = { true: 412, false: 32 };
const widthThree = { true: 462, false: 50 };

/**
 * TemplatePage
 * @param {object} props Props
 */
const TemplatePage = (props) => {
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

    /**
     * 언마운트시 템플릿 데이터 날림
     */
    const dispatch = useDispatch();
    useEffect(() => {
        return () => {
            dispatch(clearTemplate());
        };
    }, [dispatch]);

    return (
        <>
            <Helmet>
                <title>템플릿관리</title>
                <meta name="description" content="템플릿관리페이지입니다." />
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
                {/* 템플릿 리스트 */}
                <Suspense fallback={<WmsLoader />}>
                    <TemplateListContainer
                        toggleState={toggleState}
                        changeToggleState={changeToggleState}
                    />
                </Suspense>

                {/* 템플릿 편집 */}
                <Suspense fallback={<WmsLoader />}>
                    <TemplateEditContainer
                        toggleState={toggleState}
                        changeAllToggleState={changeAllToggleState}
                    />
                </Suspense>

                {/* 템플릿 정보 */}
                <Suspense fallback={<WmsLoader />}>
                    <Switch>
                        <Route
                            path={['/template', '/template/:templateSeq']}
                            exact
                            render={() => (
                                <TemplateRelationContainer
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

export default TemplatePage;
