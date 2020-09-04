import React, { useState, useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { WmsCard } from '~/components';
import { getTemplate, clearTemplate } from '~/stores/template/templateStore';
import TemplateRelationBar from './TemplateRelationBar';
import style from '~/assets/jss/pages/RelationStyle';

const TemplateInfoContainer = React.lazy(() => import('../TemplateInfoContainer'));
const TemplateRelationPG = React.lazy(() => import('./TemplateRelationPG'));
const TemplateRelationCS = React.lazy(() => import('./TemplateRelationCS'));
const TemplateRelationCT = React.lazy(() => import('./TemplateRelationCT'));
const TemplateRelationCP = React.lazy(() => import('./TemplateRelationCP'));
const TemplateRelationHist = React.lazy(() => import('./TemplateRelationHist'));

const useStyle = makeStyles(style);
const relationBarInfo = [
    { id: 'info', name: '템플릿정보' },
    { id: 'pg', name: '페이지 검색' },
    { id: 'cs', name: '콘텐츠 스킨 검색' },
    { id: 'ct', name: '컨테이너 검색' },
    { id: 'cp', name: '컴포넌트 검색' },
    { id: 'hist', name: '히스토리' }
];

/**
 * 템플릿 릴레이션
 * @param {array} props.toggleState 컬럼별 toggle state
 * @param {func} props.changeToggleState toggle state 변경
 */
const TemplateRelationContainer = (props) => {
    const { toggleState, changeToggleState } = props;
    const { templateSeq: paramSeq } = useParams();
    const classes = useStyle();
    const dispatch = useDispatch();

    // 스토어 데이터
    const { loading, templateData, dataError } = useSelector((store) => ({
        loading:
            store.loadingStore['templateStore/GET_TEMPLATE'] ||
            store.loadingStore['templateStore/SAVE_TEMPLATE'] ||
            store.loadingStore['templateStore/DELETE_TEMPLATE'] ||
            store.loadingStore['templateStore/COPY_TEMPLATE'],
        templateData: store.templateStore.detail,
        dataError: store.templateStore.detailError
    }));

    // state
    const [toggle, setToggle] = useState(true);
    const [title, setTitle] = useState('템플릿 정보');
    const [componentToggleState, setComponentToggleState] = useState([
        true,
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
                    setComponentToggleState([true, false, false, false, false, false]);
                }
            } else {
                if (componentToggleState.indexOf(true) >= 0) {
                    setComponentToggleState([false, false, false, false, false, false]);
                }
            }
        }
    }, [toggleState, componentToggleState]);

    useEffect(() => {
        // 파라미터에 템플릿 아이디가 있는데 데이터가 없으면 조회,
        // 파라미터 없는데 데이터가 있으면 데이터 삭제
        if (Object.keys(dataError).length < 1 && !loading) {
            let s = Number(paramSeq);
            if (paramSeq && templateData.templateSeq !== s) {
                dispatch(getTemplate({ templateSeq: s }));
            } else if (!paramSeq && templateData.templateSeq) {
                dispatch(clearTemplate({ detail: true, history: true, relation: true }));
            }
        }
    }, [dispatch, templateData, dataError, loading, paramSeq]);

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
                        <Suspense>{componentToggleState[0] && <TemplateInfoContainer />}</Suspense>
                        <Suspense>{componentToggleState[1] && <TemplateRelationPG />}</Suspense>
                        <Suspense>{componentToggleState[2] && <TemplateRelationCS />}</Suspense>
                        <Suspense>{componentToggleState[3] && <TemplateRelationCT />}</Suspense>
                        <Suspense>{componentToggleState[4] && <TemplateRelationCP />}</Suspense>
                        <Suspense>{componentToggleState[5] && <TemplateRelationHist />}</Suspense>
                    </div>
                </WmsCard>
            )}
            <WmsCard width="50" overrideClassName={classes.relbar}>
                <TemplateRelationBar
                    showComponent={showComponent}
                    relationBarInfo={relationBarInfo}
                    componentToggleState={componentToggleState}
                />
            </WmsCard>
        </>
    );
};

export default TemplateRelationContainer;
