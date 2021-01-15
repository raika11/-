import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { MokaModal, MokaInput } from '@components';
import { unescapeHtml } from '@utils/convertUtil';
import toast from '@utils/toastUtil';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { putArticleEditTitle, PUT_ARTICLE_EDIT_TITLE } from '@store/article';

/**
 * 기사별 웹제목 / 모바일제목 수정하는 모달
 */
const ChangeArtGroupModal = (props) => {
    const { show, onHide, artData } = props;
    const dispatch = useDispatch();
    const loading = useSelector((store) => store.loading[PUT_ARTICLE_EDIT_TITLE]);
    const { mobWidth, titleWidth } = useSelector((store) => ({
        mobWidth: store.app['DESKING_MTITLE_WIDTH'] || 215,
        titleWidth: store.app['DESKING_TITLE_WIDTH'] || [240, 326],
    }));

    // state
    const [webTitle, setWebTitle] = useState('');
    const [mobTitle, setMobTitle] = useState('');
    const [error, setError] = useState({});

    const validate = () => {
        const regex = REQUIRED_REGEX;
        let invalid = false,
            ne = {};

        if (!regex.test(webTitle)) {
            ne.webTitle = true;
            invalid = invalid || true;
        } else {
            ne.webTitle = false;
        }

        if (!regex.test(mobTitle)) {
            ne.mobTitle = true;
            invalid = invalid || true;
        } else {
            ne.mobTitle = false;
        }

        setError({ ...error, ...ne });
        return !invalid;
    };

    /**
     * 저장 버튼
     */
    const handleClickSave = () => {
        if (validate()) {
            dispatch(
                putArticleEditTitle({
                    totalId: artData.totalId,
                    title: webTitle.length > 0 ? webTitle : null,
                    mobTitle: mobTitle.length > 0 ? mobTitle : null,
                    callback: ({ header }) => {
                        if (header.success) {
                            toast.success(header.message);
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        }
    };

    /**
     * 닫기
     */
    const handleHide = () => {
        if (onHide) onHide();
        setWebTitle('');
        setMobTitle('');
        setError({});
    };

    useEffect(() => {
        if (show) {
            if (artData.artEditTitle && artData.artEditTitle !== '') {
                setWebTitle(unescapeHtml(artData.artEditTitle));
            } else if (artData.artJamTitle && artData.artJamTitle !== '') {
                setWebTitle(unescapeHtml(artData.artJamTitle));
            }

            if (artData.artEditMobTitle && artData.artEditMobTitle !== '') {
                setMobTitle(unescapeHtml(artData.artEditMobTitle));
            } else if (artData.artJamMobTitle && artData.artJamMobTitle !== '') {
                setMobTitle(unescapeHtml(artData.artJamMobTitle));
            }
        }
    }, [show, artData]);

    return (
        <MokaModal
            width={600}
            title={unescapeHtml(artData.artTitle || '')}
            titleClassName="user-select-text"
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
            <div className="title-line1 position-absolute" style={{ height: 19, top: 35, left: 8 + titleWidth[0] }}></div>
            <div className="title-line2 position-absolute" style={{ height: 19, top: 35, left: 8 + titleWidth[1] }}></div>
            <p
                className={clsx('mb-10', {
                    'color-positive': !artData.artEditTitle || artData.artEditTitle === '',
                })}
            >
                웹제목
            </p>
            <MokaInput className="mb-20" value={webTitle} onChange={(e) => setWebTitle(e.target.value)} isInvalid={error.webTitle} />

            <div className="mob-title-line position-absolute" style={{ height: 19, top: 115, left: 8 + mobWidth }}></div>
            <p
                className={clsx('mb-10', {
                    'color-positive': !artData.artEditMobTitle || artData.artEditMobTitle === '',
                })}
            >
                모바일제목
            </p>
            <MokaInput className="mb-0" value={mobTitle} onChange={(e) => setMobTitle(e.target.value)} isInvalid={error.mobTitle} />
        </MokaModal>
    );
};

export default ChangeArtGroupModal;
