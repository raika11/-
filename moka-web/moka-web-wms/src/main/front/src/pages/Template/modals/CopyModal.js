import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaInput } from '@components';
import { copyTemplate } from '@store/template/templateAction';

/**
 * 템플릿 복사 Modal
 */
const CopyModal = (props) => {
    const { show, onHide, template } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const [templateName, setTemplateName] = useState('');
    const [templateNameInvalid, setTemplateNameInvalid] = useState(false);

    /**
     * 닫기
     */
    const handleHide = () => {
        setTemplateName('');
        setTemplateNameInvalid(false);
        onHide();
    };

    /**
     * 복사
     */
    const handleCopy = () => {
        if (templateName.length > 0) {
            setTemplateNameInvalid(false);
            dispatch(
                copyTemplate({
                    domainId: template.domain.domainId,
                    templateSeq: template.templateSeq,
                    templateName,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            handleHide();
                            history.push(`/template/${body.templateSeq}`);
                        }
                    },
                }),
            );
        } else {
            setTemplateNameInvalid(true);
        }
    };

    return (
        <MokaModal
            show={show}
            onHide={handleHide}
            title="템플릿 설정복사"
            size="md"
            buttons={[
                { text: '저장', variant: 'primary', onClick: handleCopy },
                { text: '취소', variant: 'gray150', onClick: handleHide },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <Form>
                <MokaInput
                    label="템플릿명"
                    labelWidth={90}
                    className="mb-0"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    isInvalid={templateNameInvalid}
                />
            </Form>
        </MokaModal>
    );
};

export default CopyModal;
