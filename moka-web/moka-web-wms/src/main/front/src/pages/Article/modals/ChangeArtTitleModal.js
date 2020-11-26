import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { MokaModal, MokaInputLabel } from '@components';
import { unescapeHtml } from '@utils/convertUtil';
import toast from '@utils/toastUtil';
import { putArticleEditTitle, PUT_ARTICLE_EDIT_TITLE } from '@store/article';

/**
 * 기사별 웹제목 / 모바일제목 수정하는 모달
 */
const ChangeArtGroupModal = (props) => {
    const { show, onHide, artData } = props;
    const dispatch = useDispatch();

    const { loading, mobWidth, titleWidth } = useSelector((store) => ({
        loading: store.loading[PUT_ARTICLE_EDIT_TITLE],
        mobWidth: store.app['DESKING_MTITLE_WIDTH'] || 215,
        titleWidth: store.app['DESKING_TITLE_WIDTH'] || [240, 326],
    }));

    // state
    const [webTitle, setWebTitle] = useState('');
    const [mobTitle, setMobTitle] = useState('');

    /**
     * 저장 버튼
     */
    const handleClickSave = () => {
        dispatch(
            putArticleEditTitle({
                totalId: artData.totalId,
                title: webTitle.length > 0 ? webTitle : null,
                mobTitle: mobTitle.length > 0 ? mobTitle : null,
                callback: ({ header }) => {
                    if (header.success) {
                        toast.success(header.message);
                    } else {
                        toast.warn(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 닫기
     */
    const handleHide = () => {
        if (onHide) onHide();
        setWebTitle('');
        setMobTitle('');
    };

    useEffect(() => {
        if (show) {
            if (artData.artEditTitle && artData.artEditTitle !== '') {
                setWebTitle(artData.artEditTitle);
            } else if (artData.artJamTitle && artData.artJamTitle !== '') {
                setWebTitle(artData.artJamTitle);
            }

            if (artData.artEditMobTitle && artData.artEditMobTitle !== '') {
                setMobTitle(artData.artEditMobTitle);
            } else if (artData.artJamMobTitle && artData.artJamMobTitle !== '') {
                setMobTitle(artData.artJamMobTitle);
            }
        }
    }, [show, artData]);

    return (
        <MokaModal
            width={530}
            title={unescapeHtml(artData.artTitle || '')}
            show={show}
            size="md"
            loading={loading}
            onHide={handleHide}
            bodyClassName="relative"
            footerClassName="d-flex justify-content-center"
            buttons={[
                {
                    text: '저장',
                    variant: 'positive',
                    onClick: handleClickSave,
                },
                {
                    text: '취소',
                    variant: 'negative',
                    onClick: handleHide,
                },
            ]}
            centered
        >
            <div className="title-line1 position-absolute" style={{ height: 21, top: 20, left: 70 + 5 + titleWidth[0] }}></div>
            <div className="title-line2 position-absolute" style={{ height: 21, top: 20, left: 70 + 5 + titleWidth[1] }}></div>
            <MokaInputLabel
                as="textarea"
                label="웹제목"
                labelWidth={70}
                labelClassName={clsx('mr-2', {
                    'color-positive': !artData.artEditTitle || artData.artEditTitle === '',
                })}
                className="mb-2"
                inputClassName="resize-none custom-scroll p-05"
                value={webTitle}
                onChange={(e) => setWebTitle(e.target.value)}
            />

            <div className="mob-title-line position-absolute" style={{ height: 21, top: 82, left: 70 + 5 + mobWidth }}></div>
            <MokaInputLabel
                as="textarea"
                label={
                    <React.Fragment>
                        모바일
                        <br />
                        제목
                    </React.Fragment>
                }
                labelClassName={clsx('mr-2', {
                    'color-positive': !artData.artEditMobTitle || artData.artEditMobTitle === '',
                })}
                className="mb-0"
                inputClassName="resize-none custom-scroll"
                value={mobTitle}
                onChange={(e) => setMobTitle(e.target.value)}
            />
        </MokaModal>
    );
};

export default ChangeArtGroupModal;
