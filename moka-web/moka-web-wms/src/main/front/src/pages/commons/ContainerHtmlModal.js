import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MokaModalEditor } from '@components';
import { getContainerModal } from '@store/container';
import { notification } from '@utils/toastUtil';

/**
 * 컨테이너 TEMS 소스 보여주는 모달
 * (수정 불가, local state만 사용)
 */
const ContainerHtmlModal = (props) => {
    const { show, onHide, containerSeq } = props;
    const dispatch = useDispatch();

    // state
    const [container, setContainer] = useState({});
    const [loading, setLoading] = useState(false);

    /**
     * 닫기
     */
    const handleHide = () => {
        setContainer({});
        onHide();
    };

    useEffect(() => {
        if (containerSeq && show) {
            setLoading(true);
            dispatch(
                getContainerModal({
                    containerSeq,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            setContainer(body);
                        } else {
                            notification(header.message);
                        }
                        setLoading(false);
                    },
                }),
            );
        }
    }, [containerSeq, show, dispatch]);

    return (
        <MokaModalEditor
            title={container.containerName || ''}
            show={show}
            onHide={handleHide}
            defaultValue={container.containerBody}
            buttons={[{ text: '닫기', variant: 'gray150', onClick: handleHide }]}
            options={{ readOnly: true }}
            loading={loading}
        />
    );
};

export default ContainerHtmlModal;
