import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { MokaCard } from '@components';
import { changeLatestDomainId } from '@store/auth';
import { initialState, getComponent, clearComponent, changeComponent, saveComponent, changeInvalidList, GET_COMPONENT, SAVE_COMPONENT, DELETE_COMPONENT } from '@store/component';
import { DB_DATEFORMAT } from '@/constants';
import { notification } from '@utils/toastUtil';

import BasicForm from './components/BasicForm';
import DetailRelationForm from './components/DetailRelationForm';
import DetailPeriodForm from './components/DetailPeriodForm';
import DetailSchForm from './components/DetailSchForm';
import DetailPagingForm from './components/DetailPagingForm';

/**
 * 컴포넌트 정보/수정 컴포넌트
 */
const ComponentEdit = ({ onDelete }) => {
    const { componentSeq } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const { component, inputTag, latestDomainId, invalidList, MORE_COUNT, DISP_PAGE_COUNT, PER_PAGE_COUNT, MAX_PAGE_COUNT, loading } = useSelector((store) => ({
        component: store.component.component,
        inputTag: store.component.inputTag,
        latestDomainId: store.auth.latestDomainId,
        invalidList: store.template.invalidList,
        MORE_COUNT: store.app.MORE_COUNT,
        DISP_PAGE_COUNT: store.app.DISP_PAGE_COUNT,
        PER_PAGE_COUNT: store.app.PER_PAGE_COUNT,
        MAX_PAGE_COUNT: store.app.MAX_PAGE_COUNT,
        loading: store.loading[GET_COMPONENT] || store.loading[SAVE_COMPONENT] || store.loading[DELETE_COMPONENT],
    }));

    // state
    const [temp, setTemp] = useState(initialState.component);
    const componentNameRegex = /[^\s\t\n]+/;

    /**
     * 유효성 검사
     * @param {object} temp 컴포넌트데이터
     */
    const validate = (temp) => {
        let isInvalid = false;
        let errList = [];

        // 컴포넌트명 체크
        if (!componentNameRegex.test(temp.componentName)) {
            errList.push({
                field: 'componentName',
                reason: '',
            });
            isInvalid = isInvalid | true;
        }
        // 템플릿 체크
        if (!temp.template.templateSeq) {
            errList.push({
                field: 'template',
                reason: '',
            });
            isInvalid = isInvalid | true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    /**
     * 저장 버튼
     */
    const handleClickSave = () => {
        let saveData = {
            ...component,
            ...temp,
            periodStartDt: null,
            periodEndDt: null,
        };

        if (saveData.periodYn === 'Y') {
            // 기간설정이 있는 경우 moment 객체를 DB에 저장가능한 string 문자열로 치환
            let sdt = moment(temp.periodStartDt).format(DB_DATEFORMAT);
            let edt = moment(temp.periodEndDt).format(DB_DATEFORMAT);
            if (sdt !== 'Invalid date') {
                saveData.periodStartDt = sdt;
            }
            if (edt !== 'Invalid date') {
                saveData.periodEndDt = edt;
            }
        }

        if (!saveData.domain.domainId) {
            // 도메인 정보가 없으면 latestDomainId 셋팅
            saveData.domain = {
                domainId: latestDomainId,
            };
        }

        if (validate(saveData)) {
            dispatch(
                saveComponent({
                    actions: [changeComponent(saveData)],
                    callback: ({ header, body }) => {
                        if (header.success) {
                            notification('success', header.message);
                            history.push(`/component/${body.componentSeq}`);
                        } else {
                            notification('warning', header.message);
                        }
                    },
                }),
            );
        }
    };

    useEffect(() => {
        // 스토어에서 가져온 컴포넌트 데이터 셋팅
        setTemp({
            ...component,
            periodStartDt: moment(component.periodStartDt, DB_DATEFORMAT),
            periodEndDt: moment(component.periodEndDt, DB_DATEFORMAT),
            perPageCount: component.perPageCount || PER_PAGE_COUNT,
            maxPageCount: component.maxPageCount || MAX_PAGE_COUNT,
            dispPagecount: component.dispPageCount || DISP_PAGE_COUNT,
            moreCount: component.moreCount || MORE_COUNT,
        });
    }, [DISP_PAGE_COUNT, MAX_PAGE_COUNT, MORE_COUNT, PER_PAGE_COUNT, component]);

    useEffect(() => {
        // 컴포넌트의 도메인ID를 latestDomainId에 저장
        const domainId = component.domain.domainId;
        if (domainId && latestDomainId !== domainId) {
            dispatch(changeLatestDomainId(domainId));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, component]);

    useEffect(() => {
        // 컴포넌트ID가 있을 때 데이터 조회
        if (componentSeq) {
            dispatch(getComponent({ componentSeq: componentSeq }));
        } else {
            dispatch(clearComponent());
        }
    }, [dispatch, componentSeq]);

    return (
        <MokaCard width={688} title="컴포넌트 편집" className="flex-fill mr-gutter" loading={loading}>
            <BasicForm
                component={temp}
                setComponent={setTemp}
                componentNameRegex={componentNameRegex}
                onClickSave={handleClickSave}
                onClickDelete={() => onDelete(component)}
                invalidList={invalidList}
            />
            <hr className="divider" />
            <div className="custom-scroll component-padding-box pb-10" style={{ height: 563 }}>
                <DetailRelationForm component={temp} setComponent={setTemp} inputTag={inputTag} invalidList={invalidList} />
                <hr className="divider" />
                <DetailPeriodForm component={temp} setComponent={setTemp} available={component.dataType !== 'NONE'} />
                <hr className="divider" />
                <DetailSchForm component={temp} setComponent={setTemp} available={component.dataType !== 'NONE'} />
                <hr className="divider" />
                <DetailPagingForm component={temp} setComponent={setTemp} available={component.dataType !== 'NONE'} />
            </div>
        </MokaCard>
    );
};

export default ComponentEdit;
