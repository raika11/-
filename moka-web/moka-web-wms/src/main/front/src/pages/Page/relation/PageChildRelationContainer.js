import React, { useState, useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import style from '~/assets/jss/pages/RelationStyle';
import { WmsCard } from '~/components';
import PageRelationBar from './PageRelationBar';

const PageInfoContainer = React.lazy(() => import('../PageInfoContainer'));
const PageRelationPG = React.lazy(() => import('./PageRelationPG'));
const PageChildRelationCT = React.lazy(() => import('./PageChildRelationCT'));
const PageChildRelationCP = React.lazy(() => import('./PageChildRelationCP'));
const PageChildRelationTP = React.lazy(() => import('./PageChildRelationTP'));
const PageChildRelationAD = React.lazy(() => import('./PageChildRelationAD'));
const PageRelationHist = React.lazy(() => import('./PageRelationHist'));

/**
 * Relation Style
 */
const useStyle = makeStyles(style);
const Loading = () => <></>;
const relationBarInfo = [
    { id: 'info', name: '페이지정보' },
    { id: 'pg', name: '페이지 검색' },
    { id: 'ct', name: '컨테이너 검색' },
    { id: 'cp', name: '컴포넌트 검색' },
    { id: 'tp', name: '템플릿 검색' },
    { id: 'ad', name: '광고 검색' },
    { id: 'hist', name: '히스토리 검색' }
];

const PageChildRelationContainer = (props) => {
    const { toggleState, changeToggleState } = props;
    const classes = useStyle();
    const [toggle, setToggle] = useState(true);
    const [title, setTitle] = useState('페이지 정보');
    const loading = useSelector(
        (store) =>
            store.loadingStore['pageStore/GET_PAGE'] ||
            store.loadingStore['pageStore/POST_PAGE'] ||
            store.loadingStore['pageStore/PUT_PAGE'] ||
            store.loadingStore['pageStore/DELETE_PAGE']
    );
    const [componentToggleState, setComponentToggleState] = useState([
        true,
        false,
        false,
        false,
        false,
        false,
        false
    ]);

    useEffect(() => {
        if (toggleState) {
            const nextState = toggleState[2];
            setToggle(nextState);
            if (nextState) {
                if (componentToggleState.indexOf(true) < 0) {
                    setComponentToggleState([true, false, false, false, false, false, false]);
                }
            }
        }
    }, [toggleState, componentToggleState]);

    /**
     * 컨텐츠바 토글에 따른 컴포넌트 show/hide
     * @param {number} idx 토글돼야하는 컴포넌트 순서
     */
    const handleExpansion = (idx) => {
        const result = componentToggleState.map((t, index) => (index === idx ? !t : false));
        setComponentToggleState(result);

        let groupByFalse = result.reduce((acc, it) => (!it ? acc + 1 : acc + 0), 0);
        if (groupByFalse === 7) {
            changeToggleState(2, false);
            setToggle(false);
        } else {
            changeToggleState(2, true);
            setToggle(true);
        }
    };

    /**
     * bar component 클릭 콜백
     * @param {string}} id  컴포넌트 ID값
     */
    const showComponent = (id) => {
        const idx = relationBarInfo.findIndex((c) => c.id === id);
        setTitle(relationBarInfo[idx].name);
        handleExpansion(idx);
    };

    return (
        <>
            {toggleState && toggle && (
                <WmsCard
                    title={title}
                    overrideRootClassName={classes.relbarLeft}
                    width="412"
                    loading={componentToggleState[0] && loading}
                >
                    <div className={classes.h100}>
                        <Suspense fallback={<Loading />}>
                            {componentToggleState[0] && <PageInfoContainer />}
                        </Suspense>
                        <Suspense fallback={<Loading />}>
                            {componentToggleState[1] && <PageRelationPG />}
                        </Suspense>
                        <Suspense fallback={<Loading />}>
                            {componentToggleState[2] && <PageChildRelationCT />}
                        </Suspense>
                        <Suspense fallback={<Loading />}>
                            {componentToggleState[3] && <PageChildRelationCP />}
                        </Suspense>
                        <Suspense fallback={<Loading />}>
                            {componentToggleState[4] && <PageChildRelationTP />}
                        </Suspense>
                        <Suspense fallback={<Loading />}>
                            {componentToggleState[5] && <PageChildRelationAD />}
                        </Suspense>
                        <Suspense fallback={<Loading />}>
                            {componentToggleState[6] && <PageRelationHist />}
                        </Suspense>
                    </div>
                </WmsCard>
            )}
            <WmsCard width="50" overrideClassName={classes.relbar}>
                <PageRelationBar
                    showComponent={showComponent}
                    relationBarInfo={relationBarInfo}
                    componentToggleState={componentToggleState}
                />
            </WmsCard>
        </>
    );
};

export default PageChildRelationContainer;
