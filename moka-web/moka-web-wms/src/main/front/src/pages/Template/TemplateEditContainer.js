import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WmsEditor from '~/components/WmsEditor';
import { changeTemplateBody } from '~/stores/template/templateStore';

/**
 * 템플릿 에디터
 * @param {array} props.toggleState 컬럼별 toggle state
 * @param {func} props.changeAllToggleState toggle state 변경
 */
const TemplateEditContainer = (props) => {
    const { toggleState, changeAllToggleState } = props;
    const dispatch = useDispatch();

    // 스토어 데이터
    const { detail, detailError, templateBody, loading, search } = useSelector((store) => ({
        detail: store.templateStore.detail,
        search: store.templateStore.search,
        templateBody: store.templateStore.templateBody,
        detailError: store.templateStore.detailError,
        loading:
            store.loadingStore['templateStore/GET_TEMPLATE'] ||
            store.loadingStore['templateStore/SAVE_TEMPLATE'] ||
            store.loadingStore['templateStore/DELETE_TEMPLATE'] ||
            store.loadingStore['templateStore/COPY_TEMPLATE']
    }));

    // state
    const [defaultValue, setDefaultValue] = useState('');
    const [expansion, setExpansion] = useState(false);
    const [title, setTitle] = useState('템플릿 편집');
    const [errorObj, setErrorObj] = useState({});

    // 템플릿 셋팅
    useEffect(() => {
        let seq = detail.templateSeq || '';
        let name = detail.templateName || '';
        if (seq !== '' && name !== '') {
            setTitle(`템플릿 편집 (${seq}_${name})`);
        } else {
            setTitle('템플릿 편집');
        }
    }, [detail]);

    // 템플릿 에러 처리
    useEffect(() => {
        let bodyError = 0;
        const { body = {} } = detailError;
        if (body.list && Array.isArray(body.list)) {
            body.list.forEach((e) => {
                const { field, reason, extra } = e;
                if (field === 'templateBody') {
                    setErrorObj({
                        error: true,
                        message: reason,
                        line: Number(extra)
                    });
                    bodyError++;
                }
            });
        }
        if (bodyError < 1) setErrorObj({});
    }, [detailError]);

    /**
     * 에디터 확장 콜백 함수
     * @param {boolean} ex 확장 여부
     */
    const onExpansion = (ex) => {
        if (ex) {
            changeAllToggleState([false, true, false]);
            setExpansion(true);
        } else {
            changeAllToggleState([true, true, true]);
            setExpansion(false);
        }
    };

    /**
     * 에디터 내용 변경
     * @param {string} value 변경값
     */
    const onBlur = (value) => {
        dispatch(changeTemplateBody(value));
    };

    // width값에 따라 카드헤더의 확장 마크를 변경한다
    useEffect(() => {
        if (toggleState && !toggleState[0] && !toggleState[2]) {
            setExpansion(true);
        } else {
            setExpansion(false);
        }
    }, [toggleState, expansion]);

    // 기본값을 설정한다
    useEffect(() => {
        setDefaultValue(templateBody);
    }, [templateBody, search.domainId]);

    return (
        <>
            {toggleState && (
                <WmsEditor
                    title={title}
                    language="html"
                    expansion={expansion}
                    onExpansion={onExpansion}
                    onBlur={onBlur}
                    loading={loading}
                    value={defaultValue}
                    error={errorObj.error}
                    errorline={errorObj.line}
                    errorMessage={errorObj.message}
                />
            )}
        </>
    );
};

export default TemplateEditContainer;
