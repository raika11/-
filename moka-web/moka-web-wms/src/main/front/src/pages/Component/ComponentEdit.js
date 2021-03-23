import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { MokaCard } from '@components';
import { changeLatestDomainId } from '@store/auth';
import { initialState, getComponent, clearComponent, saveComponent, hasRelationList, changeInvalidList, GET_COMPONENT, SAVE_COMPONENT, DELETE_COMPONENT } from '@store/component';
import { DB_DATEFORMAT, DATA_TYPE_AUTO } from '@/constants';
import { invalidListToError } from '@utils/convertUtil';
import toast, { messageBox } from '@utils/toastUtil';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import BasicForm from './components/BasicForm';
import DetailRelationForm from './components/DetailRelationForm';
import DetailPeriodForm from './components/DetailPeriodForm';
import DetailSchForm from './components/DetailSchForm';
import DetailPagingForm from './components/DetailPagingForm';

/**
 * 컴포넌트 > 상세 조회, 수정, 등록
 */
const ComponentEdit = ({ onDelete, match }) => {
    const { componentSeq } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const loading = useSelector(({ loading }) => loading[GET_COMPONENT] || loading[SAVE_COMPONENT] || loading[DELETE_COMPONENT]);
    const latestDomainId = useSelector(({ auth }) => auth.latestDomainId);
    const { MORE_COUNT, DISP_PAGE_COUNT, PER_PAGE_COUNT, MAX_PAGE_COUNT } = useSelector(({ app }) => app);
    const { component, inputTag, invalidList } = useSelector(({ component }) => component);

    // state
    const [temp, setTemp] = useState(initialState.component);
    const [error, setError] = useState({});
    const [addMode, setAddMode] = useState(false);

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
        // 데이터셋 체크 (자동일 때)
        if (temp.dataType === 'AUTO' && !temp.dataset?.datasetSeq) {
            errList.push({
                field: 'dataset',
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
                        history.push(`${match.path}/${body.componentSeq}`);
                    } else {
                        messageBox.alert(header.message);
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
                        messageBox.alert(header.message);
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

        if (saveData.dataType === DATA_TYPE_AUTO) {
            // 자동일 경우 반드시 viewYn을 Y로 바꾼다 (중요)
            saveData.viewYn = 'Y';
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

    /**
     * 취소
     */
    const handleClickCancle = () => history.push(match.path);

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
            setAddMode(false);
        } else {
            dispatch(clearComponent());
            setAddMode(true);
        }
        setError({});
    }, [dispatch, componentSeq]);

    useEffect(() => {
        setError(invalidListToError(invalidList));
    }, [invalidList]);

    useEffect(() => {
        return () => {
            dispatch(clearComponent());
            setAddMode(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaCard width={688} title={`컴포넌트 ${componentSeq ? '수정' : '등록'}`} className="flex-fill mr-gutter" loading={loading} bodyClassName="pb-0 d-flex flex-column">
            <BasicForm
                component={temp}
                setComponent={setTemp}
                componentNameRegex={REQUIRED_REGEX}
                onClickSave={handleClickSave}
                onClickDelete={() => onDelete(component)}
                onClickCancle={handleClickCancle}
                error={error}
                setError={setError}
            />
            <hr className="divider mb-0" />
            <div className="custom-scroll component-padding-box py-3" style={{ height: 615 }}>
                <DetailRelationForm addMode={addMode} component={temp} setComponent={setTemp} inputTag={inputTag} error={error} setError={setError} />
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
