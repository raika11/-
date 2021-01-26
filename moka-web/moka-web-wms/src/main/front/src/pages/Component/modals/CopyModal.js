import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaInputLabel } from '@components';
import { copyComponent } from '@store/component';
import toast from '@utils/toastUtil';

/**
 * 컴포넌트 복사 Modal
 */
const CopyModal = (props) => {
    const { show, onHide, componentSeq, componentName } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const [name, setName] = useState('');
    const [error, setError] = useState(false);

    /**
     * 닫기
     */
    const handleHide = () => {
        setName('');
        setError(false);
        onHide();
    };

    /**
     * 복사
     */
    const handleCopy = () => {
        if (name.length > 0) {
            setError(false);
            dispatch(
                copyComponent({
                    componentSeq: componentSeq,
                    componentName: name,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            handleHide();
                            toast.success(header.message);
                            history.push(`/component/${body.componentSeq}`);
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        } else {
            setError(true);
        }
    };

    useEffect(() => {
        if (show) {
            setName(`${componentName}_복사`);
        }
    }, [componentName, show]);

    return (
        <MokaModal
            width={600}
            show={show}
            onHide={handleHide}
            title="컴포넌트 설정복사"
            size="md"
            buttons={[
                { text: '저장', variant: 'positive', onClick: handleCopy },
                { text: '취소', variant: 'negative', onClick: handleHide },
            ]}
            footerClassName="justify-content-center"
            draggable
            centered
        >
            <Form>
                <MokaInputLabel label="컴포넌트명" labelWidth={90} className="mb-0" value={name} onChange={(e) => setName(e.target.value)} isInvalid={error} />
            </Form>
        </MokaModal>
    );
};

export default CopyModal;
