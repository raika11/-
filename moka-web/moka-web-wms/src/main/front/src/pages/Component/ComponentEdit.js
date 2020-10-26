import React, { useState, useRef, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import copy from 'copy-to-clipboard';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { MokaCard, MokaInputLabel, MokaIcon, MokaInput, MokaInputGroup } from '@components';

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
    const [viewSkin, setViewSkin] = useState({});
    // 사용기간 설정
    const [periodYn, setPeriod] = useState('N');
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

    return <MokaCard title="컴포넌트 편집"></MokaCard>;
};

export default ComponentEdit;
