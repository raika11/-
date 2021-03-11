import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import toast, { messageBox } from '@utils/toastUtil';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import {
    initialState,
    getCdnArticle,
    clearCdnArticle,
    saveCdnArticle,
    checkExists,
    clearCache,
    GET_CDN_ARTICLE,
    SAVE_CDN_ARTICLE,
    CHECK_EXISTS,
    CLEAR_CACHE,
} from '@store/cdnArticle';
import ArticleListModal from '@pages/Article/modals/ArticleListModal';

/**
 * 트래픽 분산 관리 등록 / 수정
 */
const CdnArticleEdit = ({ match }) => {
    const { totalId } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_CDN_ARTICLE] || loading[SAVE_CDN_ARTICLE] || loading[CHECK_EXISTS] || loading[CLEAR_CACHE]);
    const { cdnArticle } = useSelector(({ cdnArticle }) => ({
        cdnArticle: cdnArticle.cdnArticle,
    }));
    const [modalShow, setModalShow] = useState(false);
    const [temp, setTemp] = useState(initialState.cdnArticle);
    const [error, setError] = useState({});

    /**
     * 입력 값 변경
     */
    const handleChangeValue = (e) => {
        const { name, checked, value } = e.target;
        if (name === 'usedYn') {
            setTemp({ ...temp, usedYn: checked ? 'Y' : 'N' });
        } else {
            setTemp({ ...temp, [name]: value });
        }
    };

    /**
     * 취소
     */
    const handleClickCancle = () => history.push(match.path);

    /**
     * 기사 모달에서 기사 클릭
     * @param {object} row row데이터
     */
    const handleRowClicked = (row) => {
        dispatch(
            checkExists({
                totalId: row.totalId,
                callback: ({ header, body }) => {
                    if (header.success) {
                        if (body) {
                            messageBox.alert('이미 등록된 기사입니다');
                        } else {
                            setTemp({
                                ...temp,
                                totalId: row.totalId,
                                title: unescapeHtmlArticle(row.artTitle),
                            });
                            setModalShow(false);
                            setError({ ...error, totalId: false });
                        }
                    } else {
                        messageBox.alert('통신에 실패하였습니다. 다시 시도해주세요.');
                    }
                },
            }),
        );
    };

    /**
     * 저장
     */
    const handleClickSave = () => {
        if (temp.totalId) {
            dispatch(
                saveCdnArticle({
                    cdnArticle: temp,
                    callback: ({ header }) => {
                        if (header.success) {
                            toast.success(header.message);
                            history.push(`${match.path}/${temp.totalId}`);
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        } else {
            setError({ ...error, totalId: true });
        }
    };

    /**
     * 캐시 삭제
     */
    const handleClear = () => {
        messageBox.confirm(
            'cdn 캐시를 삭제하시겠습니까?',
            () => {
                if (temp.totalId) {
                    dispatch(
                        clearCache({
                            totalId: temp.totalId,
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
            },
            () => {},
        );
    };

    useEffect(() => {
        if (totalId) {
            dispatch(
                getCdnArticle({
                    totalId,
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        } else {
            dispatch(clearCdnArticle());
        }
    }, [dispatch, totalId]);

    useEffect(() => {
        setTemp({
            ...cdnArticle,
            title: unescapeHtmlArticle(cdnArticle.title),
        });
        setError({});
    }, [cdnArticle]);

    useEffect(() => {
        return () => {
            dispatch(clearCdnArticle());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaCard
            className="flex-fill"
            title={`트래픽 분산(기사) ${totalId ? '수정' : '등록'}`}
            footerClassName="d-flex justify-content-center"
            loading={loading}
            footer
            footerButtons={[
                { text: totalId ? '수정' : '저장', variant: 'positive', className: 'mr-1', onClick: handleClickSave },
                totalId && { text: '캐시 삭제', variant: 'negative', className: 'mr-1', onClick: handleClear },
                { text: '취소', variant: 'negative', onClick: handleClickCancle },
            ].filter((a) => a)}
        >
            <Form>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel label="사용여부" as="switch" id="usedYn" name="usedYn" inputProps={{ checked: temp.usedYn === 'Y' }} onChange={handleChangeValue} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    {/* 기사ID */}
                    <Col xs={4} className="p-0">
                        <MokaInputLabel label="기사" value={temp.totalId} inputClassName="bg-white" isInvalid={error.totalId} disabled required />
                    </Col>
                    {/* 기사 제목 (수정불가) */}
                    <Col xs={totalId ? 8 : 6} className="p-0 pl-2">
                        <MokaInput className="bg-white" value={temp.title} isInvalid={error.totalId} disabled />
                    </Col>
                    {/* 기사 검색 */}
                    {!totalId && (
                        <Col xs={2} className="p-0 pl-2 d-flex">
                            <Button variant="searching" className="w-100" onClick={() => setModalShow(true)}>
                                기사 검색
                            </Button>
                        </Col>
                    )}
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel label="메모" as="textarea" name="memo" value={temp.memo} onChange={handleChangeValue} inputProps={{ rows: 7 }} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel label="CDN NEWS" inputClassName="bg-white" value={temp.cdnUrlNews} inputProps={{ plaintext: true }} disabled />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel label="CDN MNEWS" inputClassName="bg-white" value={temp.cdnUrlMnews} inputProps={{ plaintext: true }} disabled />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0 d-flex align-items-center">
                        <MokaInputLabel label="등록정보" as="none" />
                        <p className="mb-0 mr-2">{temp.regId}</p>
                        <p className="mb-0">{temp.regDt}</p>
                    </Col>
                </Form.Row>
            </Form>

            {/* 기사리스트 모달 */}
            <ArticleListModal show={modalShow} onHide={() => setModalShow(false)} onRowClicked={handleRowClicked} />
        </MokaCard>
    );
};

export default CdnArticleEdit;
