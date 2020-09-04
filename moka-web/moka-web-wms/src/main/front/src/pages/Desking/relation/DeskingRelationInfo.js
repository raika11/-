import React, { useEffect, useState, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { WmsLoader } from '~/components';
import { getEtccodeList } from '~/stores/etccode/etccodeStore';

import DeskingInfoLeft from '../form/DeskingInfoLeft';
import DeskingInfoRight from '../form/DeskingInfoRight';

const DeskingPreview = React.lazy(() => import('../form/DeskingPreview'));

/**
 * 화면편집 > 데스킹 정보/수정창/미리보기
 * @param {object} props.classes DeskingStyle
 * @param {boolean} props.isDummyForm 더미폼 여부
 */
const DeskingRelationInfo = (props) => {
    const { classes, isDummyForm } = props;
    const dispatch = useDispatch();
    const { component, latestContentsId, loading, etccodes } = useSelector((store) => ({
        component: store.deskingStore.component,
        latestContentsId: store.deskingStore.latestContentsId,
        loading:
            store.loadingStore['deskingStore/PUT_DESKING_WORK'] ||
            store.loadingStore['deskingStore/PUT_DESKING_REL_WORKS'],
        etccodes: store.etccodeStore.etccodes
    }));

    // 워크 데이터
    const [workData, setWorkData] = useState({});
    const [relWorkData, setRelWorkData] = useState([]);

    // state
    const [callCnt, setCallCnt] = useState(0);

    useEffect(() => {
        if (component !== null) {
            const { deskingWorks, deskingRelWorks } = component;
            const selectedWork = deskingWorks.find((d) => d.contentsId === latestContentsId);
            const selectedRelWork = deskingRelWorks.filter(
                (d) => d.contentsId === latestContentsId
            );

            if (selectedWork) setWorkData(selectedWork);
            else setWorkData({});

            if (selectedRelWork) setRelWorkData(selectedRelWork);
            else setRelWorkData([]);
        } else {
            setWorkData({});
            setRelWorkData([]);
        }
    }, [component, latestContentsId]);

    useEffect(() => {
        if (callCnt < 1) {
            dispatch(getEtccodeList('DESKING'));
            setCallCnt(callCnt + 1);
        }
    }, [dispatch, callCnt]);

    return (
        <>
            {loading && (
                <div className={classes.loadingBox}>
                    <WmsLoader />
                </div>
            )}
            {/* 폼 */}
            <div className={classes.infoRoot}>
                <DeskingInfoLeft
                    component={component}
                    workData={workData}
                    classes={classes}
                    isDummyForm={isDummyForm}
                    deskingEtccodes={etccodes}
                />
                <DeskingInfoRight
                    component={component}
                    workData={workData}
                    relWorkData={relWorkData}
                    classes={classes}
                    isDummyForm={isDummyForm}
                />
            </div>
            {/* 미리보기 */}
            <div>
                {component !== null && (
                    <Suspense>
                        <DeskingPreview component={component} classes={classes} />
                    </Suspense>
                )}
            </div>
        </>
    );
};

export default DeskingRelationInfo;
