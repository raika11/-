import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { getComponent, clearComponent, changeEdits } from '~/stores/component/componentStore';
import { changeLatestMediaId } from '~/stores/auth/authStore';
import { WmsCard, WmsIconButton } from '~/components';
import {
    ComponentInfo,
    ComponentBasicSet,
    ComponentPeriodSet,
    ComponentSearchSet,
    ComponentListSet,
    ComponentPreviewSet
} from './form';
import style from '~/assets/jss/pages/Component/ComponentInfoStyle';

const useStyles = makeStyles(style);

const ComponentInfoContainer = (props) => {
    const { toggleState, changeAllToggleState } = props;
    const dispatch = useDispatch();
    const classes = useStyles();
    const { componentSeq: paramSeq } = useParams();
    const { detail, detailError, latestMediaId, loading } = useSelector((state) => ({
        detail: state.componentStore.detail,
        detailError: state.componentStore.detailError || [],
        latestMediaId: state.authStore.latestMediaId,
        loading:
            state.loadingStore['componentStore/GET_COMPONENT'] ||
            state.loadingStore['componentStore/DELETE_COMPONENT'] ||
            state.loadingStore['componentStore/SAVE_COMPONENT']
    }));
    const [expansion, setExpansion] = useState(false);
    const [mediaChangeCnt, setMediaChangeCnt] = useState(0);
    const [disabled, setDisabled] = useState(false);
    const [previewSetDisabled, setPreviewSetDisabled] = useState(false);

    /**
     * 편집영역 확장 함수
     */
    const handleExpansion = () => {
        if (expansion === false) {
            changeAllToggleState([false, true, false]);
            setExpansion(true);
        } else {
            changeAllToggleState([true, true, true]);
            setExpansion(false);
        }
    };

    /**
     * 설정 컴포넌트 접기/펴기
     * @param {boolean} d 컴포넌트 접기/펴기
     * @param {boolean} pd 미리보기화면리소스 접기/펴기
     */
    const expandComponent = (d, pd) => {
        setDisabled(d || false);
        setPreviewSetDisabled(pd || false);
    };

    /**
     * width값에 따라 카드헤더의 확장 마크를 변경한다
     */
    useEffect(() => {
        if (toggleState && !toggleState[0] && !toggleState[2]) {
            setExpansion(true);
        } else {
            setExpansion(false);
        }
    }, [toggleState, expansion]);

    useEffect(() => {
        /**
         * 파라미터에 seq가 있는데 데이터가 없으면 조회하고
         * 파라미터가 없는데 데이터가 없으면 데이터를 날린다.
         */

        if (Object.keys(detailError).length < 1 && !loading) {
            let s = Number(paramSeq);
            if (paramSeq && detail.componentSeq !== s) {
                dispatch(getComponent({ componentSeq: s }));
            } else if (!paramSeq && detail.componentSeq) {
                const f = function* () {
                    yield dispatch(clearComponent({ detail: true, relation: true }));
                    // 폼 렌더링하려고 일부러 넣음
                    yield dispatch(changeEdits({ key: 'c', value: new Date().getTime() }));
                };
                const result = f();
                result.next();
                result.next();
            }
        }
    }, [paramSeq, dispatch, detail, detailError, loading]);

    useEffect(() => {
        /**
         * 컴포넌트ID 링크로 다이렉트 접속 시,
         * 컴포넌트의 mediaId, domainId 정보로 latestMediaId, latestDomainId를 셋팅한다
         * 이 작업은 최초 한번만 한다!!
         */
        if (mediaChangeCnt < 1 && Object.prototype.hasOwnProperty.call(detail, 'domain')) {
            if (detail.domain.mediaId !== latestMediaId) {
                dispatch(
                    changeLatestMediaId({
                        mediaId: detail.domain.mediaId,
                        domainId: detail.domain.domainId
                    })
                );
            }
            setMediaChangeCnt(mediaChangeCnt + 1);
        }
    }, [detail, dispatch, latestMediaId, mediaChangeCnt]);

    const scrollHeight = () => {
        document
            .getElementById('rootHeight')
            .scrollTo(0, document.getElementById('rootHeight').offsetHeight);
    };

    return (
        <>
            {toggleState && (
                <WmsCard
                    title="컴포넌트 편집"
                    overrideClassName={classes.root}
                    action={
                        <WmsIconButton
                            onClick={handleExpansion}
                            icon={expansion ? 'crop_free' : 'zoom_out_map'}
                        />
                    }
                    loading={loading}
                >
                    <div className={classes.infoRoot}>
                        <ComponentInfo classes={classes} />
                    </div>
                    <Divider component="div" className={classes.seperator} />
                    <div className={classes.setRoot} id="rootHeight">
                        <ComponentBasicSet classes={classes} expandComponent={expandComponent} />
                        <Divider component="div" className={classes.divider} />
                        <ComponentPeriodSet classes={classes} />
                        <ComponentSearchSet classes={classes} disabled={disabled} />
                        <ComponentPreviewSet classes={classes} disabled={previewSetDisabled} />
                        <ComponentListSet
                            classes={classes}
                            disabled={disabled}
                            scrollHeight={scrollHeight}
                        />
                    </div>
                </WmsCard>
            )}
        </>
    );
};

export default ComponentInfoContainer;
