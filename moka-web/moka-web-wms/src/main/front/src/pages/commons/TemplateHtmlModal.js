import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaModalEditor } from '@components';
import { getTemplate, changeTemplateBody, saveTemplate, clearTemplate, GET_TEMPLATE, SAVE_TEMPLATE } from '@store/template';
import { notification } from '@utils/toastUtil';

const TemplateHtmlModal = (props) => {
    const { show, onHide, templateSeq } = props;
    const dispatch = useDispatch();

    const { template, templateBody, invalidList, loading } = useSelector((store) => ({
        template: store.template.template,
        templateBody: store.template.templateBody,
        invalidList: store.template.invalidList,
        loading: store.loading[GET_TEMPLATE] || store.loading[SAVE_TEMPLATE],
    }));

    // state
    const [defaultValue, setDefalutValue] = useState('');
    const [error, setError] = useState({});

    /**
     * 닫기
     */
    const handleHide = () => {
        setError({});
        dispatch(clearTemplate());
        onHide();
    };

    /**
     * 저장
     */
    const handleClickSave = () => {
        dispatch(
            saveTemplate({
                callback: ({ header }) => {
                    if (header.success) {
                        notification('success', header.message);
                    } else {
                        notification('warning', header.message);
                    }
                    handleHide();
                },
            }),
        );
    };

    /**
     * onBlur
     * @param {string} value 에디터 내용
     */
    const handleBlur = (value) => {
        dispatch(changeTemplateBody(value));
    };

    useEffect(() => {
        if (templateSeq && show) {
            dispatch(
                getTemplate({
                    templateSeq: templateSeq,
                }),
            );
        }
    }, [templateSeq, show, dispatch]);

    useEffect(() => {
        setDefalutValue(templateBody);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [template.templateSeq]);

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
        <MokaModalEditor
            title={template.templateName || ''}
            show={show}
            onHide={handleHide}
            onBlur={handleBlur}
            defaultValue={defaultValue}
            buttons={[
                { text: '저장', variant: 'primary', onClick: handleClickSave },
                { text: '닫기', variant: 'gray150', onClick: handleHide },
            ]}
            error={error}
            loading={loading}
        />
    );
};

export default TemplateHtmlModal;
