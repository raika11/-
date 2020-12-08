import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { MokaCard } from '@components';
import { changeLatestDomainId } from '@store/auth';
import { initialState, getComponent, clearComponent, saveComponent, hasRelationList, changeInvalidList, GET_COMPONENT, SAVE_COMPONENT, DELETE_COMPONENT } from '@store/component';
import { DB_DATEFORMAT } from '@/constants';
import toast, { messageBox } from '@utils/toastUtil';
import { REQUIRED_REGEX } from '@utils/regexUtil';

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
        invalidList: store.component.invalidList,
        MORE_COUNT: store.app.MORE_COUNT,
        DISP_PAGE_COUNT: store.app.DISP_PAGE_COUNT,
        PER_PAGE_COUNT: store.app.PER_PAGE_COUNT,
        MAX_PAGE_COUNT: store.app.MAX_PAGE_COUNT,
        loading: store.loading[GET_COMPONENT] || store.loading[SAVE_COMPONENT] || store.loading[DELETE_COMPONENT],
    }));

    // state
    const [temp, setTemp] = useState(initialState.component);
    const [error, setError] = useState({});

    /**
     * 유효성 검사
     * @param {object} temp 컴포넌트데이터
     */
    const validate = (temp) => {
        let isInvalid = false;
        let errList = [];
        errList = errList.concat(
            Object.keys(error)
                .filter((e) => error[e])
                .map((e) => ({ field: e, reason: '' })),
        );
        if (errList.length > 0) {
            isInvalid = true;
        }

        // 컴포넌트명 체크
        if (!temp.componentName || !REQUIRED_REGEX.test(temp.componentName)) {
            errList.push({
                field: 'componentName',
                reason: '',
            });
            isInvalid = isInvalid || true;
        }
        // 템플릿 체크
        if (!temp.template?.templateSeq) {
            errList.push({
                field: 'template',
                reason: '',
            });
            isInvalid = isInvalid || true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    /**
     * 저장
     * @param {object} component component
     */
    const saveCallback = (component) => {
        dispatch(
            saveComponent({
                component,
                callback: ({ header, body }) => {
                    if (header.success) {
                        toast.success(header.message);
                        history.push(`/component/${body.componentSeq}`);
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 관련아이템 체크
     * @param {object} component component
     */
    const checkRelationList = (component) => {
        dispatch(
            hasRelationList({
                componentSeq: component.componentSeq,
                callback: ({ header, body }) => {
                    if (header.success) {
                        // 관련 아이템 없음
                        if (!body) saveCallback(component);
                        // 관련 아이템 있음
                        else {
                            messageBox.confirm(
                                '다른 곳에서 사용 중입니다.\n변경 시 전체 수정 반영됩니다.\n수정하시겠습니까?',
                                () => saveCallback(component),
                                () => {},
                            );
                        }
                    } else {
                        toast.error(header.message);
                    }
                },
            }),
        );
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

        if (!saveData.editFormPart?.partSeq) {
            saveData.editFormPart = null;
        } else {
            saveData.editFormPart = { partSeq: saveData.editFormPart.partSeq };
        }

        if (!saveData.dataset?.datasetSeq) {
            saveData.dataset = null;
        } else {
            saveData.dataset = { datasetSeq: saveData.dataset.datasetSeq };
        }

        if (saveData.template?.templateSeq) {
            saveData.template = { templateSeq: saveData.template.templateSeq };
        }

        if (validate(saveData)) {
            if (!saveData.domain.domainId) {
                // 도메인 정보가 없으면 latestDomainId 셋팅
                saveData.domain = {
                    domainId: latestDomainId,
                };
                saveCallback(saveData);
            } else {
                checkRelationList(saveData);
            }
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

    useEffect(() => {
        if (invalidList) {
            setError(
                invalidList.reduce(
                    (all, c) => ({
                        ...all,
                        [c.field]: true,
                    }),
                    {},
                ),
            );
        }
    }, [invalidList]);

    return (
        <MokaCard width={688} title={`컴포넌트 ${componentSeq ? '정보' : '등록'}`} className="flex-fill mr-gutter" loading={loading} bodyClassName="pb-0">
            <BasicForm
                component={temp}
                setComponent={setTemp}
                componentNameRegex={REQUIRED_REGEX}
                onClickSave={handleClickSave}
                onClickDelete={() => onDelete(component)}
                error={error}
                setError={setError}
            />
            <hr className="divider mb-0" />
            <div className="custom-scroll component-padding-box py-3" style={{ height: 615 }}>
                <DetailRelationForm component={temp} setComponent={setTemp} inputTag={inputTag} error={error} setError={setError} />
                <hr className="divider" />
                <DetailPeriodForm component={temp} setComponent={setTemp} available={temp.dataType !== 'NONE'} error={error} setError={setError} />
                <hr className="divider" />
                <DetailSchForm component={temp} setComponent={setTemp} available={temp.dataType !== 'NONE'} />
                <hr className="divider" />
                <DetailPagingForm component={temp} setComponent={setTemp} available={temp.dataType !== 'NONE'} />
            </div>
        </MokaCard>
    );
};

export default ComponentEdit;
