import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MokaModalEditor } from '@components';
import { getPageModal } from '@store/page';
import { notification } from '@utils/toastUtil';

/**
 * 페이지 TEMS 소스 보여주는 모달
 * (수정 불가, local state만 사용)
 */
const PageHtmlModal = (props) => {
    const { show, onHide, pageSeq } = props;
    const dispatch = useDispatch();

    // state
    const [page, setPage] = useState({});
    const [loading, setLoading] = useState(false);

    /**
     * 닫기
     */
    const handleHide = () => {
        setPage({});
        onHide();
    };

    useEffect(() => {
        if (pageSeq && show) {
            setLoading(true);
            dispatch(
                getPageModal({
                    pageSeq,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            setPage(body);
                        } else {
                            notification(header.message);
                        }
                        setLoading(false);
                    },
                }),
            );
        }
    }, [pageSeq, show, dispatch]);

    return (
        <MokaModalEditor
            title={page.pageName || ''}
            show={show}
            onHide={handleHide}
            defaultValue={page.pageBody}
            buttons={[{ text: '닫기', variant: 'gray150', onClick: handleHide }]}
            options={{
                readOnly: true,
            }}
            loading={loading}
        />
    );
};

export default PageHtmlModal;
