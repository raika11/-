import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { MokaModal } from '@/components';

const RcvprogsModal = (props) => {
    const { show, onHide, data } = props;
    const [message, setMessage] = useState('');
    const [xml, setXml] = useState('');

    const handleHide = () => {
        setMessage('');
        setXml('');
        onHide();
    };

    useEffect(() => {
        if (show) {
            if (data === '실패') {
                setXml('xml...');
                setMessage('FTP 전송 중 CONNECTION이 끊어졌습니다.');
            } else if (data === '완료') {
                setMessage('정상적으로 생성되었습니다.');
            }
        }
    }, [data, show]);

    return (
        <MokaModal size="md" width={400} show={show} onHide={handleHide} buttons={[{ variant: 'negative', text: '닫기', onClick: handleHide }]}>
            <Form>
                {data === '실패' && (
                    <>
                        <p className="mb-2">생성 XML</p>
                        <p className="p-2 mb-2" style={{ height: 136, border: '1px solid #E4EBF6' }}>
                            {xml}
                        </p>
                    </>
                )}
                <p className="mb-2">메세지</p>
                <p className="p-2 mb-0" style={{ height: data === '실패' ? 136 : 272, border: '1px solid #E4EBF6' }}>
                    {message}
                </p>
            </Form>
        </MokaModal>
    );
};

export default RcvprogsModal;
