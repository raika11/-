import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { MokaCard } from '@components';
import { changeLatestDomainId } from '@store/auth';
import { initialState, getComponent, clearComponent, clearRelationList, changeComponent, saveComponent, changeInvalidList } from '@store/component';
import { DB_DATEFORMAT } from '@/constants';
import { notification } from '@utils/toastUtil';

import BasicForm from './components/BasicForm';
import DetailRelationForm from './components/DetailRelationForm';
import DetailPeriodForm from './components/DetailPeriodForm';
import DetailSchForm from './components/DetailSchForm';
import DetailPagingForm from './components/DetailPagingForm';

// 기본값
const { component: initialComponent } = initialState;

/**
 * 컴포넌트 정보/수정 컴포넌트
 */
const ComponentEdit = () => {
    const { componentSeq } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const { component, inputTag, latestDomainId, invalidList } = useSelector((store) => ({
        component: store.component.component,
        inputTag: store.component.inputTag,
        latestDomainId: store.auth.latestDomainId,
        invalidList: store.template.invalidList,
    }));

    // state
    const [componentName, setComponentName] = useState('');
    const [description, setDescription] = useState('');
    const [template, setTemplate] = useState(initialComponent.template);
    const [dataset, setDataset] = useState(initialComponent.dataset);
    const [dataType, setDataType] = useState(initialComponent.dataType);
    const [delWords, setDelWords] = useState(initialComponent.delWords);
    const [skin, setSkin] = useState(initialComponent.skin);
    const [zone, setZone] = useState('');
    const [matchZone, setMatchZone] = useState('');
    // 사용기간 설정
    const [periodYn, setPeriodYn] = useState(initialComponent.periodYn);
    const [periodStartDt, setPeriodStartDt] = useState(null);
    const [periodEndDt, setPeriodEndDt] = useState(null);
    // 검색 설정
    const [schServiceType, setSchServiceType] = useState(initialComponent.schServiceType);
    const [schLang, setSchLang] = useState(initialComponent.schLang);
    const [schCodeId, setSchCodeId] = useState(initialComponent.schCodeId);
    // 목록 설정
    const [pagingYn, setPagingYn] = useState(initialComponent.pagingYn);
    const [pagingType, setPagingType] = useState(initialComponent.pagingType);
    const [perPageCount, setPerPageCount] = useState(initialComponent.perPageCount);
    const [maxPageCount, setMaxPageCount] = useState(initialComponent.maxPageCount);
    const [dispPageCount, setDispPageCount] = useState(initialComponent.dispPageCount);
    const [moreCount, setMoreCount] = useState(initialComponent.moreCount);

    /**
     * 유효성 검사
     * @param {object} temp 컴포넌트데이터
     */
    const validate = (temp) => {
        let isInvalid = false;
        let errList = [];

        // 컴포넌트명 체크
        if (!/[^\s\t\n]+/.test(temp.componentName)) {
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

    // 저장 버튼
    const handleClickSave = () => {
        let temp = {
            ...component,
            componentName,
            description,
            template,
            dataset,
            dataType,
            delWords,
            skin,
            zone,
            periodYn,
            periodStartDt: null,
            periodEndDt: null,
            schServiceType,
            schLang,
            schCodeId,
            pagingYn,
            pagingType,
            perPageCount,
            maxPageCount,
            dispPageCount,
            moreCount,
        };

        if (periodYn === 'Y') {
            // 기간설정이 있는 경우 moment 객체를 DB에 저장가능한 string 문자열로 치환
            let sdt = moment(periodStartDt).format(DB_DATEFORMAT);
            let edt = moment(periodEndDt).format(DB_DATEFORMAT);
            if (sdt !== 'Invalid date') {
                temp.periodStartDt = sdt;
            }
            if (edt !== 'Invalid date') {
                temp.periodEndDt = edt;
            }
        }

        if (validate(temp)) {
            dispatch(
                saveComponent({
                    actions: [changeComponent(temp)],
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

    // 삭제 버튼
    const handleClickDelete = () => {};

    // 복사 버튼
    const handleClickCopy = () => {};

    useEffect(() => {
        // 스토어에서 가져온 컴포넌트 데이터 셋팅
        setComponentName(component.componentName || '');
        setDescription(component.description || '');
        setTemplate(component.template || initialComponent.template);
        setDataset(component.dataset || initialComponent.dataset);
        setDataType(component.dataType);
        setDelWords(component.delWords);
        setSkin(component.skin || initialComponent.skin);
        setZone(component.zone);
        setMatchZone(component.matchZone);
        setPeriodYn(component.periodYn);
        setPeriodStartDt(moment(component.periodStartDt, DB_DATEFORMAT));
        setPeriodEndDt(moment(component.periodEndDt, DB_DATEFORMAT));
        setSchServiceType(component.schServiceType);
        setSchLang(component.schLang);
        setPagingYn(component.pagingYn);
        setPagingType(component.pagingType);
        setPerPageCount(component.perPageCount);
        setMaxPageCount(component.maxPageCount);
        setDispPageCount(component.dispPageCount);
        setMoreCount(component.moreCount);
    }, [component]);

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
            dispatch(clearRelationList());
        }
    }, [dispatch, componentSeq]);

    return (
        <MokaCard title="컴포넌트 편집" className="flex-fill mr-10">
            <BasicForm
                componentSeq={component.componentSeq}
                componentName={componentName}
                setComponentName={setComponentName}
                description={description}
                setDescription={setDescription}
                onClickSave={handleClickSave}
                onClickDelete={handleClickDelete}
                onClickCopy={handleClickCopy}
                invalidList={invalidList}
            />
            <hr className="divider" />
            <div className="custom-scroll component-padding-box pb-10" style={{ height: 563 }}>
                <DetailRelationForm
                    template={template}
                    dataType={dataType}
                    dataset={dataset}
                    prevAutoDataset={component.prevAutoDataset}
                    prevDeskDataset={component.prevDeskDataset}
                    inputTag={inputTag}
                    delWords={delWords}
                    skin={skin}
                    zone={zone}
                    matchZone={matchZone}
                    setTemplate={setTemplate}
                    setDataType={setDataType}
                    setDataset={setDataset}
                    setDelWords={setDelWords}
                    setSkin={setSkin}
                    setZone={setZone}
                    invalidList={invalidList}
                />
                <hr className="divider" />
                <DetailPeriodForm
                    periodYn={periodYn}
                    periodStartDt={periodStartDt}
                    periodEndDt={periodEndDt}
                    setPeriodYn={setPeriodYn}
                    setPeriodStartDt={setPeriodStartDt}
                    setPeriodEndDt={setPeriodEndDt}
                    available={dataType !== 'NONE'}
                />
                <hr className="divider" />
                <DetailSchForm
                    schServiceType={schServiceType}
                    schLang={schLang}
                    schCodeId={schCodeId}
                    setSchServiceType={setSchServiceType}
                    setSchLang={setSchLang}
                    setSchCodeId={setSchCodeId}
                    available={dataType !== 'NONE'}
                />
                <hr className="divider" />
                <DetailPagingForm
                    pagingYn={pagingYn}
                    pagingType={pagingType}
                    perPageCount={perPageCount}
                    maxPageCount={maxPageCount}
                    dispPageCount={dispPageCount}
                    moreCount={moreCount}
                    setPagingYn={setPagingYn}
                    setPagingType={setPagingType}
                    setPerPageCount={setPerPageCount}
                    setMaxPageCount={setMaxPageCount}
                    setDispPageCount={setDispPageCount}
                    setMoreCount={setMoreCount}
                    available={dataType !== 'NONE'}
                />
            </div>
        </MokaCard>
    );
};

export default ComponentEdit;
