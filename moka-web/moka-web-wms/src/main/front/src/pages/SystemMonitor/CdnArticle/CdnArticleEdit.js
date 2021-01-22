import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { ARTICLE_URL, MOBILE_ARTICLE_URL } from '@/constants';
import toast, { messageBox } from '@utils/toastUtil';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import { initialState, getCdnArticle, clearCdnArticle, saveCdnArticle, checkExists } from '@store/cdnArticle';
import ArticleListModal from '@pages/Article/modals/ArticleListModal';

const ArticleCdnEdit = ({ match }) => {
    const { totalId } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const { cdnArticle } = useSelector(({ cdnArticle }) => ({
        cdnArticle: cdnArticle.cdnArticle,
    }));
    const [modalShow, setModalShow] = useState(false);
    const [temp, setTemp] = useState(initialState.cdnArticle);
    const [error] = useState({});

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
                                title: row.artTitle,
                            });
                            setModalShow(false);
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
        dispatch(
            saveCdnArticle({
                cdnArticle: temp,
                callback: ({ header }) => {
                    if (header.success) {
                        toast.success(header.message);
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
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
        setTemp(cdnArticle);
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
            footerButtons={[
                { text: '저장', variant: 'positive', className: 'mr-2', onClick: handleClickSave },
                { text: '취소', variant: 'negative', className: 'mr-2', onClick: handleClickCancle },
                { text: '캐시 삭제', variant: 'negative' },
            ]}
            footer
        >
            <Form>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            label="사용여부"
                            labelWidth={76}
                            as="switch"
                            id="usedYn"
                            name="usedYn"
                            inputProps={{ checked: temp.usedYn === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    {/* 기사ID */}
                    <Col xs={4} className="p-0">
                        <MokaInputLabel label="기사" labelWidth={76} value={temp.totalId} inputClassName="bg-white" isInvalid={error.totalId} disabled required />
                    </Col>
                    {/* 기사 제목 (수정가능) */}
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
                        <MokaInputLabel
                            label="메모"
                            labelWidth={76}
                            as="textarea"
                            name="description"
                            value={temp.description}
                            onChange={handleChangeValue}
                            inputProps={{ rows: 7 }}
                            inputClassName="resize-none"
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            label="CDN NEWS"
                            labelWidth={76}
                            inputClassName="bg-white"
                            value={temp.totalId ? `${ARTICLE_URL}${temp.totalId}` : ''}
                            inputProps={{ plaintext: true }}
                            disabled
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            label="CDN MNEWS"
                            labelWidth={76}
                            inputClassName="bg-white"
                            value={temp.totalId ? `${MOBILE_ARTICLE_URL}${temp.totalId}` : ''}
                            inputProps={{ plaintext: true }}
                            disabled
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0 d-flex align-items-center">
                        <MokaInputLabel label="등록정보" labelWidth={76} as="none" />
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

export default ArticleCdnEdit;
