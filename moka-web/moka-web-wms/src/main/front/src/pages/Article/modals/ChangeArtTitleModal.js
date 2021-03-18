import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { MokaModal, MokaInput } from '@components';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import toast, { messageBox } from '@utils/toastUtil';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import { putArticleEditTitle, PUT_ARTICLE_EDIT_TITLE } from '@store/article';

/**
 * 기사별 웹제목 / 모바일제목 수정하는 모달
 */
const ChangeArtGroupModal = (props) => {
    const { show, onHide, artData, onSave } = props;
    const dispatch = useDispatch();
    const loading = useSelector((store) => store.loading[PUT_ARTICLE_EDIT_TITLE]);
    const { mobWidth, titleWidth } = useSelector((store) => ({
        mobWidth: store.app['DESKING_MTITLE_WIDTH'] || 215,
        titleWidth: store.app['DESKING_TITLE_WIDTH'] || [240, 326],
    }));
    const [artEditTitle, setArtEditTitle] = useState('');
    const [artEditMobTitle, setArtEditMobTitle] = useState('');
    const [error, setError] = useState({});

    /**
     * validate
     */
    const validate = () => {
        const regex = REQUIRED_REGEX;
        let invalid = false,
            ne = {};

        if (!regex.test(artEditTitle)) {
            ne.artEditTitle = true;
            invalid = invalid || true;
        } else {
            ne.artEditTitle = false;
        }

        if (!regex.test(artEditMobTitle)) {
            ne.artEditMobTitle = true;
            invalid = invalid || true;
        } else {
            ne.artEditMobTitle = false;
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
                    artEditTitle,
                    artEditMobTitle,
                    callback: ({ header }) => {
                        if (header.success) {
                            toast.success(header.message);
                            if (onSave) {
                                onSave();
                            }
                        } else {
                            messageBox.alert(header.message);
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
        setArtEditTitle('');
        setArtEditMobTitle('');
        setError({});
    };

    useEffect(() => {
        if (show) {
            if (artData.artEditTitle && artData.artEditTitle !== '') {
                setArtEditTitle(unescapeHtmlArticle(artData.artEditTitle));
            } else if (artData.artJamTitle && artData.artJamTitle !== '') {
                setArtEditTitle(unescapeHtmlArticle(artData.artJamTitle));
            }

            if (artData.artEditMobTitle && artData.artEditMobTitle !== '') {
                setArtEditMobTitle(unescapeHtmlArticle(artData.artEditMobTitle));
            } else if (artData.artJamMobTitle && artData.artJamMobTitle !== '') {
                setArtEditMobTitle(unescapeHtmlArticle(artData.artJamMobTitle));
            }
        }
    }, [show, artData]);

    return (
        <MokaModal
            width={600}
            title={unescapeHtmlArticle(artData.artTitle)}
            titleClassName="user-select-text"
            show={show}
            size="md"
            loading={loading}
            onHide={handleHide}
            bodyClassName="relative"
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
            <MokaInput className="mb-20" value={artEditTitle} onChange={(e) => setArtEditTitle(e.target.value)} isInvalid={error.artEditTitle} />

            <div className="mob-title-line position-absolute" style={{ height: 19, top: 115, left: 8 + mobWidth }}></div>
            <p
                className={clsx('mb-10', {
                    'color-positive': !artData.artEditMobTitle || artData.artEditMobTitle === '',
                })}
            >
                모바일제목
            </p>
            <MokaInput className="mb-0" value={artEditMobTitle} onChange={(e) => setArtEditMobTitle(e.target.value)} isInvalid={error.artEditMobTitle} />
        </MokaModal>
    );
};

export default ChangeArtGroupModal;
