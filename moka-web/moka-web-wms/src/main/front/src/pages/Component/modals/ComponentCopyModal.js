import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaInputLabel } from '@components';
import { copyComponent } from '@store/component';
import { notification } from '@utils/toastUtil';

/**
 * 컴포넌트 복사 Modal
 */
const ComponentCopyModal = (props) => {
    const { show, onHide, componentSeq } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const [componentName, setComponentName] = useState('');
    const [componentNameInvalid, setComponentNameInvalid] = useState(false);

    /**
     * 닫기
     */
    const handleHide = () => {
        setComponentName('');
        setComponentNameInvalid(false);
        onHide();
    };

    /**
     * 복사
     */
    const handleCopy = () => {
        if (componentName.length > 0) {
            setComponentNameInvalid(false);
            dispatch(
                copyComponent({
                    componentSeq: componentSeq,
                    componentName,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            handleHide();
                            notification('success', header.message);
                            history.push(`/component/${body.componentSeq}`);
                        } else {
                            notification('warning', header.message);
                        }
                    },
                }),
            );
        } else {
            setComponentNameInvalid(true);
        }
    };

    return (
        <MokaModal
            width={600}
            show={show}
            onHide={handleHide}
            title="컴포넌트 설정복사"
            size="md"
            buttons={[
                { text: '저장', variant: 'primary', onClick: handleCopy },
                { text: '취소', variant: 'gray150', onClick: handleHide },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <Form>
                <MokaInputLabel
                    label="컴포넌트명"
                    labelWidth={90}
                    className="mb-0"
                    value={componentName}
                    onChange={(e) => setComponentName(e.target.value)}
                    isInvalid={componentNameInvalid}
                />
            </Form>
        </MokaModal>
    );
};

export default ComponentCopyModal;
