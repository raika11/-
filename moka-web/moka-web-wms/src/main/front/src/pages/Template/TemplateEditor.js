import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MokaCardEditor } from '@components';
import { changeTemplateBody } from '@store/template/templateAction';

const TemplateEditor = (props) => {
    const { expansion, onExpansion } = props;
    const dispatch = useDispatch();
    const { templateBody, template } = useSelector((store) => ({
        templateBody: store.template.templateBody,
        template: store.template.template,
    }));

    // state
    const [title, setTitle] = useState('템플릿 편집');

    /**
     * onBlur
     * @param {string} value 에디터 내용
     */
    const handleBlur = (value) => {
        dispatch(changeTemplateBody(value));
    };

    useEffect(() => {
        if (template) {
            setTitle(`템플릿 편집(${template.templateSeq}_${template.templateName})`);
        }
    }, [template]);

    return <MokaCardEditor className="mr-10 flex-fill" title={title} expansion={expansion} onExpansion={onExpansion} defaultValue={templateBody} onBlur={handleBlur} />;
};

export default TemplateEditor;
