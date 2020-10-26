import React, { useState, useRef, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Row from 'react-bootstrap/Row';
import { MokaCard, MokaInputLabel, MokaIcon, MokaInput, MokaInputGroup } from '@components';
import BasicForm from './components/BasicForm';
import DetailRelationForm from './components/DetailRelationForm';
import DetailPeriodForm from './components/DetailPeriodForm';

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
    const [template, setTemplate] = useState({});
    const [dataset, setDataset] = useState({});
    const [dataType, setDataType] = useState('NONE');
    const [delWords, setDelWords] = useState('');
    const [skin, setSkin] = useState({});
    const [matchZone, setMatchZone] = useState('');
    // 사용기간 설정
    const [periodYn, setPeriodYn] = useState('N');
    const [periodStartDt, setPeriodStartDt] = useState('');
    const [periodEndDt, setPeriodEndDt] = useState('');
    // 검색 설정
    const [schServiceType, setSchServiceType] = useState('');
    const [schLang, setSchLang] = useState('');
    const [schCodeId, setSchCodeId] = useState('');
    // 목록 설정
    const [pagingYn, setPagingYn] = useState('N');
    const [pagingType, setPagingType] = useState('');
    const [perPageCount, setPerPageCount] = useState(0);
    const [maxPageCount, setMaxPageCount] = useState(0);
    const [dispPageCount, setDispPageCount] = useState(0);
    const [moreCount, setMoreCount] = useState(0);

    useEffect(() => {}, []);

    return (
        <MokaCard title="컴포넌트 편집" className="flex-fill mr-10">
            <BasicForm
                componentSeq={component.componentSeq}
                componentName={componentName}
                setComponentName={setComponentName}
                description={description}
                setDescription={setDescription}
            />
            <hr className="divider" />
            <div className="custom-scroll component-padding-box" style={{ height: 563 }}>
                <DetailRelationForm
                    template={template}
                    dataType={dataType}
                    dataset={dataset}
                    inputTag={inputTag}
                    delWords={delWords}
                    skin={skin}
                    matchZone={matchZone}
                    setTemplate={setTemplate}
                    setDataType={setDataType}
                    setDataset={setDataset}
                    setDelWords={setDelWords}
                    setSkin={setSkin}
                    setMatchZone={setMatchZone}
                />
                <hr className="divider" />
                <DetailPeriodForm
                    periodYn={periodYn}
                    periodStartDt={periodStartDt}
                    periodEndDt={periodEndDt}
                    setPeriodYn={setPeriodYn}
                    setPeriodStartDt={setPeriodStartDt}
                    setPeriodEndDt={setPeriodEndDt}
                />
            </div>
        </MokaCard>
    );
};

export default ComponentEdit;
