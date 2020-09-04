import React, { useState, useEffect, Suspense } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { WmsLoader, WmsCard } from '~/components';
import style from '~/assets/jss/pages/RelationStyle';
import DatasetRelationBar from './DatasetRelationBar';

const DatasetRelationPG = React.lazy(() => import('./DatasetRelationPG'));
const DatasetRelationCS = React.lazy(() => import('./DatasetRelationCS'));
const DatasetRelationCT = React.lazy(() => import('./DatasetRelationCT'));
const DatasetRelationCP = React.lazy(() => import('./DatasetRelationCP'));

/**
 * Relation Style
 */
const useStyle = makeStyles(style);
const relationBarInfo = [
    { id: 'pg', name: '페이지 검색' },
    { id: 'cs', name: '콘텐츠스킨 검색' },
    { id: 'ct', name: '컨테이너 검색' },
    { id: 'cp', name: '컴포넌트 검색' }
];

const DatasetRelationContainer = (props) => {
    const { toggleState, changeToggleState } = props;
    const classes = useStyle();
    const [toggle, setToggle] = useState(true);
    const [title, setTitle] = useState('페이지 검색');
    const [componentToggleState, setComponentToggleState] = useState([true, false, false, false]);

    useEffect(() => {
        if (toggleState) {
            const nextState = toggleState[2];
            setToggle(nextState);
            if (nextState) {
                if (componentToggleState.indexOf(true) < 0) {
                    setComponentToggleState([true, false, false, false]);
                }
            } else {
                if (componentToggleState.indexOf(true) >= 0) {
                    setComponentToggleState([false, false, false, false]);
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
        if (groupByFalse === 4) {
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
                <WmsCard title={title} overrideRootClassName={classes.relbarLeft} width="412">
                    <div className={classes.h100}>
                        <Suspense className={classes.first} fallback={<WmsLoader />}>
                            {componentToggleState[0] && <DatasetRelationPG />}
                        </Suspense>
                        <Suspense className={classes.first} fallback={<WmsLoader />}>
                            {componentToggleState[1] && <DatasetRelationCS />}
                        </Suspense>
                        <Suspense className={classes.first} fallback={<WmsLoader />}>
                            {componentToggleState[2] && <DatasetRelationCT />}
                        </Suspense>
                        <Suspense className={classes.first} fallback={<WmsLoader />}>
                            {componentToggleState[3] && <DatasetRelationCP />}
                        </Suspense>
                    </div>
                </WmsCard>
            )}
            <WmsCard width="50" overrideClassName={classes.relbar}>
                <DatasetRelationBar
                    showComponent={showComponent}
                    relationBarInfo={relationBarInfo}
                    componentToggleState={componentToggleState}
                />
            </WmsCard>
        </>
    );
};

export default DatasetRelationContainer;
