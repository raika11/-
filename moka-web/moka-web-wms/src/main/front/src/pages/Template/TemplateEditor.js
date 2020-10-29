import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MokaCardEditor } from '@components';
import { changeLatestDomainId } from '@store/auth/authAction';
import { changeTemplateBody, getTemplate, clearTemplate, clearHistory, clearRelationList } from '@store/template/templateAction';

const TemplateEditor = (props) => {
    const { expansion, onExpansion } = props;
    const { templateSeq } = useParams();
    const dispatch = useDispatch();
    const { templateBody, template, invalidList, latestDomainId } = useSelector((store) => ({
        templateBody: store.template.templateBody,
        template: store.template.template,
        invalidList: store.template.invalidList,
        latestDomainId: store.auth.latestDomainId,
    }));

    // state
    const [title, setTitle] = useState('템플릿 편집');
    const [error, setError] = useState({});

    /**
     * onBlur
     * @param {string} value 에디터 내용
     */
    const handleBlur = (value) => {
        dispatch(changeTemplateBody(value));
    };

    useEffect(() => {
        // 타이틀 변경
        if (template.templateSeq) {
            setTitle(`템플릿 편집(${template.templateSeq}_${template.templateName})`);
        } else {
            setTitle('템플릿 편집');
        }
    }, [template]);

    useEffect(() => {
        // 템플릿의 도메인ID를 latestDomainId에 저장
        if (Object.prototype.hasOwnProperty.call(template, 'domain')) {
            const domainId = template.domain.domainId;
            if (latestDomainId !== domainId) {
                dispatch(changeLatestDomainId(domainId));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, template]);

    useEffect(() => {
        // 템플릿seq가 있을 때 데이터 조회
        if (templateSeq) {
            dispatch(getTemplate({ templateSeq: templateSeq }));
        } else {
            dispatch(clearTemplate());
            dispatch(clearRelationList());
            dispatch(clearHistory());
        }
    }, [dispatch, templateSeq]);

    useEffect(() => {
        let isInvalid = false;

        // invalidList 처리
        if (invalidList.length > 0) {
            invalidList.forEach((i) => {
                if (i.field === 'templateBody') {
                    setError({
                        line: Number(i.extra),
                        message: i.reason,
                    });
                    isInvalid = isInvalid || true;
                }
            });
        }

        if (!isInvalid) {
            setError({});
        }
    }, [invalidList]);

    return (
        <MokaCardEditor
            className="mr-gutter flex-fill"
            error={error}
            title={title}
            expansion={expansion}
            onExpansion={onExpansion}
            defaultValue={templateBody}
            onBlur={handleBlur}
        />
    );
};

export default TemplateEditor;
