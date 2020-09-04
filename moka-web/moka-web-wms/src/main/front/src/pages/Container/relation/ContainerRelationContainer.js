import React, { useState, useEffect, Suspense } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { WmsCard } from '~/components';
import ContainerRelationBar from './ContainerRelationBar';
import style from '~/assets/jss/pages/RelationStyle';

const ContainerInfoContainer = React.lazy(() => import('../ContainerInfoContainer'));
const ContainerRelationHist = React.lazy(() => import('./ContainerRelationHist'));
const ContainerRelationPG = React.lazy(() => import('./ContainerRelationPG'));
const ContainerRelationCS = React.lazy(() => import('./ContainerRelationCS'));
const ContainerRelationCT = React.lazy(() => import('./ContainerRelationCT'));
const ContainerChildRelationCP = React.lazy(() => import('./ContainerChildRelationCP'));
const ContainerChildRelationTP = React.lazy(() => import('./ContainerChildRelationTP'));
const ContainerChildRelationAD = React.lazy(() => import('./ContainerChildRelationAD'));

/**
 * Relation Style
 */
const useStyle = makeStyles(style);
const Loading = () => <></>;
const relationBarInfo = [
    { id: 'info', name: '컨테이너정보' },
    { id: 'pg', name: '페이지 검색' },
    { id: 'cs', name: '콘텐츠스킨 검색' },
    { id: 'ct', name: '컨테이너 검색' },
    { id: 'cp', name: '컴포넌트 검색' },
    { id: 'tp', name: '템플릿 검색' },
    { id: 'ad', name: '광고 검색' },
    { id: 'hist', name: '히스토리 검색' }
];

const ContainerRelationContainer = (props) => {
    const { toggleState, changeToggleState } = props;
    const classes = useStyle();
    const [toggle, setToggle] = useState(true);
    const [title, setTitle] = useState('컨테이너정보');
    const [containerToggleState, setContainerToggleState] = useState([
        true,
        false,
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
                if (containerToggleState.indexOf(true) < 0) {
                    setContainerToggleState([
                        true,
                        false,
                        false,
                        false,
                        false,
                        false,
                        false,
                        false
                    ]);
                }
            } else {
                if (containerToggleState.indexOf(true) >= 0) {
                    setContainerToggleState([
                        false,
                        false,
                        false,
                        false,
                        false,
                        false,
                        false,
                        false
                    ]);
                }
            }
        }
    }, [toggleState, containerToggleState]);

    /**
     * 컨텐츠바 토글에 따른 컴포넌트 show/hide
     * @param {number} idx 토글돼야하는 컴포넌트 순서
     */
    const handleExpansion = (idx) => {
        const result = containerToggleState.map((t, index) => (index === idx ? !t : false));
        setContainerToggleState(result);

        let groupByFalse = result.reduce((acc, it) => (!it ? acc + 1 : acc + 0), 0);
        if (groupByFalse === 8) {
            changeToggleState(2, false);
            setToggle(false);
        } else {
            changeToggleState(2, true);
            setToggle(true);
        }
    };

    /**
     * bar container 클릭 콜백
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
                <WmsCard title={title} overrideRootClassName={classes.relbarLeft} width="412">
                    <div className={classes.h100}>
                        <Suspense fallback={<Loading />}>
                            {containerToggleState[0] && <ContainerInfoContainer />}
                        </Suspense>
                        <Suspense fallback={<Loading />}>
                            {containerToggleState[1] && <ContainerRelationPG />}
                        </Suspense>
                        <Suspense fallback={<Loading />}>
                            {containerToggleState[2] && <ContainerRelationCS />}
                        </Suspense>
                        <Suspense fallback={<Loading />}>
                            {containerToggleState[3] && <ContainerRelationCT />}
                        </Suspense>
                        <Suspense fallback={<Loading />}>
                            {containerToggleState[4] && <ContainerChildRelationCP />}
                        </Suspense>
                        <Suspense fallback={<Loading />}>
                            {containerToggleState[5] && <ContainerChildRelationTP />}
                        </Suspense>
                        <Suspense fallback={<Loading />}>
                            {containerToggleState[6] && <ContainerChildRelationAD />}
                        </Suspense>
                        <Suspense fallback={<Loading />}>
                            {containerToggleState[7] && <ContainerRelationHist />}
                        </Suspense>
                    </div>
                </WmsCard>
            )}
            <WmsCard width="50" overrideClassName={classes.relbar}>
                <ContainerRelationBar
                    showComponent={showComponent}
                    relationBarInfo={relationBarInfo}
                    containerToggleState={containerToggleState}
                />
            </WmsCard>
        </>
    );
};

export default ContainerRelationContainer;
