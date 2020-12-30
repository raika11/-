import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import toast from '@utils/toastUtil';
import { getRcvArticleModal } from '@store/rcvArticle';
import ArticlePreviewModal from '@pages/Article/modals/ArticlePreviewModal';
import { popupPreview } from '@utils/commonUtil';
import { API_BASE_URL } from '@/constants';

const RcvArticlePreviewBtn = ({ data }) => {
    const dispatch = useDispatch();
    const [modalShow, setModalShow] = useState(false);
    const [article, setArticle] = useState({});

    useEffect(() => {
        if (modalShow) {
            dispatch(
                getRcvArticleModal({
                    rid: data.rid,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            setArticle(body);
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        }
    }, [data.rid, dispatch, modalShow]);

    /**
     * 미리보기 팝업
     */
    const handleClickPreviewOpen = () => {
        popupPreview(`${API_BASE_URL}/preview/article-page/rcv/${data.rid}`, { ...data, servicePlatform: 'P' });
    };

    return (
        <React.Fragment>
            <Button variant={data.compUrl ? 'table-btn' : 'outline-table-btn'} size="sm" onClick={handleClickPreviewOpen}>
                {data.compUrl ? '포토' : '보기'}
            </Button>

            <ArticlePreviewModal show={modalShow} onHide={() => setModalShow(false)} article={article} />
        </React.Fragment>
    );
};

export default RcvArticlePreviewBtn;
