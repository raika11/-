import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MokaCardEditor } from '@components';
import { changeLatestDomainId } from '@store/auth/authAction';
import { changeTemplateBody, getTemplate, clearTemplate, GET_TEMPLATE, DELETE_TEMPLATE, SAVE_TEMPLATE } from '@store/template/templateAction';

/**
 * 템플릿 본문 에디터
 */
const TemplateEditor = (props) => {
    const { expansion, onExpansion } = props;
    const { templateSeq } = useParams();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_TEMPLATE] || loading[DELETE_TEMPLATE] || loading[SAVE_TEMPLATE]);
    const latestDomainId = useSelector(({ auth }) => auth.latsetDomainId);
    const { templateBody, template, invalidList } = useSelector((store) => ({
        templateBody: store.template.templateBody,
        template: store.template.template,
        invalidList: store.template.invalidList,
    }));

    // state
    const [title, setTitle] = useState('템플릿 수정');
    const [defaultValue, setDefalutValue] = useState('');
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
            setTitle(`템플릿 수정(${template.templateSeq}_${template.templateName})`);
            // defaultValue 변경
            setDefalutValue(templateBody);
        } else {
            setTitle('템플릿 등록');
            setDefalutValue('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [template.templateSeq, template.templateName]);

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
        }
    }, [dispatch, templateSeq]);

    useEffect(() => {
        // 본문 에러만 체크
        const bodyErrorList = invalidList.filter((e) => e.field === 'templateBody');
        if (bodyErrorList.length > 0) {
            setError({
                line: Number(bodyErrorList[0].extra),
                message: bodyErrorList[0].reason,
            });
        } else {
            setError({});
        }
    }, [invalidList]);

    useEffect(() => {
        return () => {
            dispatch(clearTemplate());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaCardEditor
            className="mr-gutter flex-fill"
            error={error}
            title={title}
            expansion={expansion}
            onExpansion={onExpansion}
            defaultValue={defaultValue}
            value={templateBody}
            onBlur={handleBlur}
            loading={loading}
        />
    );
};

export default TemplateEditor;
