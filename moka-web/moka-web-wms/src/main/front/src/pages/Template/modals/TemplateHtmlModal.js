import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { MokaModalEditor } from '@components';
import { getTemplate, changeTemplateBody, saveTemplate, clearTemplate, hasRelationList, GET_TEMPLATE, SAVE_TEMPLATE } from '@store/template';
import toast, { messageBox } from '@utils/toastUtil';
import { invalidListToError } from '@utils/convertUtil';

const propTypes = {
    editable: PropTypes.bool,
};

const defaultProps = {
    editable: true,
};

/**
 * 템플릿 TEMS 소스 수정 모달
 * (템플릿 스토어 사용)
 */
const TemplateHtmlModal = (props) => {
    const { show, onHide, templateSeq, editable } = props;
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
     * 템플릿 저장
     */
    const submitTemplate = () => {
        dispatch(
            saveTemplate({
                callback: ({ header }) => {
                    if (header.success) {
                        toast.success(header.message);
                        handleHide();
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 관련아이템 체크
     */
    const handleClickSave = () => {
        dispatch(
            hasRelationList({
                templateSeq: template.templateSeq,
                callback: ({ header, body }) => {
                    if (header.success) {
                        // 관련 아이템 없음
                        if (!body) submitTemplate();
                        // 관련 아이템 있음
                        else {
                            messageBox.confirm(
                                '다른 곳에서 사용 중인 템플릿입니다.\n변경 시 전체 수정 반영됩니다.\n수정하시겠습니까?',
                                () => {
                                    submitTemplate();
                                },
                                () => {},
                            );
                        }
                    } else {
                        toast.fail(header.message);
                    }
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
        setError(invalidListToError(invalidList));
    }, [invalidList]);

    return (
        <MokaModalEditor
            title={template.templateName || ''}
            show={show}
            onHide={handleHide}
            onBlur={handleBlur}
            defaultValue={defaultValue}
            value={templateBody}
            buttons={[!!editable && { text: '저장', variant: 'primary', onClick: handleClickSave }, { text: '닫기', variant: 'negative', onClick: handleHide }].filter((a) => a)}
            error={error}
            loading={loading}
        />
    );
};

TemplateHtmlModal.propsType = propTypes;
TemplateHtmlModal.defaultProps = defaultProps;

export default TemplateHtmlModal;
