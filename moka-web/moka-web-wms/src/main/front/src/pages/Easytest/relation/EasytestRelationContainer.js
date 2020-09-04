import React, { useState, useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { WmsCard } from '~/components';
import { getTemplate, clearTemplate } from '~/stores/template/templateStore';
import EasytestRelationBar from './EasytestRelationBar';
import style from '~/assets/jss/pages/RelationStyle';

const EasytestInfoContainer = React.lazy(() => import('../EasytestInfoContainer'));
const EasytestRelationPS = React.lazy(() => import('./EasytestRelationPS'));
const EasytestRelationHT = React.lazy(() => import('./EasytestRelationHT'));

/**
 * Relation Style
 */
const useStyle = makeStyles(style);
const Loading = () => <></>;
const relationBarInfo = [
    { id: 'if', name: '테스트 정보' },
    { id: 'ps', name: '페이지 검색' },
    { id: 'ht', name: '히스토리' }
]; // Bar 정보

const EasytestRelationContainer = (props) => {
    const { toggleState, changeToggleState } = props; // 토글 상태를 받음
    const { easytestSeq: paramSeq } = useParams(); // 매개 변수의 key:value 객체를 return
    const [title, setTitle] = useState('테스트 정보'); // 타이틀 이름
    const [toggle, setToggle] = useState(true);
    const classes = useStyle();
    const dispatch = useDispatch();
    const { loading, detail } = useSelector((store) => ({
        loading:
            store.loadingStore['templateStore/GET_TEMPLATE'] ||
            store.loadingStore['templateStore/SAVE_TEMPLATE'] ||
            store.loadingStore['templateStore/DELETE_TEMPLATE'],
        detail: store.templateStore.detail
    }));
    const [componentToggleState, setComponentToggleState] = useState([true, false, false]);

    useEffect(() => {
        if (toggleState) {
            const nextState = toggleState[2];
            setToggle(nextState);
            if (nextState) {
                if (componentToggleState.indexOf(true) < 0) {
                    setComponentToggleState([true, false, false]);
                }
            } else {
                if (componentToggleState.indexOf(true) >= 0) {
                    setComponentToggleState([false, false, false]);
                }
            }
        }
    }, [toggleState, componentToggleState]);

    useEffect(() => {
        /**
         * 파라미터에 템플릿 아이디가 있는데 데이터가 없으면 조회,
         * 파라미터 없는데 데이터가 있으면 데이터 삭제
         */
        let s = Number(paramSeq);
        if (paramSeq && detail.templateSeq !== s && !loading) {
            dispatch(getTemplate({ templateSeq: s }));
        } else if (!paramSeq && detail.templateSeq && !loading) {
            dispatch(clearTemplate({ detail: true, history: true, relation: true }));
        }
    }, [dispatch, detail, loading, paramSeq]);

    /**
     * 컨텐츠바 토글에 따른 컴포넌트 show/hide
     * @param {number} idx 토글돼야하는 컴포넌트 순서
     */
    const handleExpansion = (idx) => {
        const result = componentToggleState.map((t, index) => (index === idx ? !t : false));
        setComponentToggleState(result);

        let groupByFalse = result.reduce((acc, it) => (!it ? acc + 1 : acc + 0), 0);
        if (groupByFalse === 6) {
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
                    loading={componentToggleState[0] && loading}
                    width="412"
                >
                    <div className={classes.h100}>
                        <Suspense fallback={<Loading />}>
                            {componentToggleState[0] && <EasytestInfoContainer />}
                        </Suspense>
                        <Suspense fallback={<Loading />}>
                            {componentToggleState[1] && <EasytestRelationPS />}
                        </Suspense>
                        <Suspense fallback={<Loading />}>
                            {componentToggleState[2] && <EasytestRelationHT />}
                        </Suspense>
                    </div>
                </WmsCard>
            )}
            <WmsCard width="50" overrideClassName={classes.relbar}>
                <EasytestRelationBar
                    showComponent={showComponent}
                    relationBarInfo={relationBarInfo}
                    componentToggleState={componentToggleState}
                />
            </WmsCard>
        </>
    );
};

export default EasytestRelationContainer;
