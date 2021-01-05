import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import copy from 'copy-to-clipboard';
import { initialState, getArticle, GET_ARTICLE, SAVE_ARTICLE, saveArticle } from '@store/article';
import { CodeListModal, CodeAutocomplete } from '@pages/commons';
import { MokaInputLabel, MokaInput, MokaCard, MokaIcon } from '@components';
import { MokaEditorCore } from '@components/MokaEditor';
import toast from '@utils/toastUtil';
import { popupPreview } from '@utils/commonUtil';
import { unescapeHtml } from '@utils/convertUtil';
import { ARTICLE_URL, API_BASE_URL } from '@/constants';
import ArticleHistoryModal from '@pages/Article/modals/ArticleHistoryModal';

const ArticleForm = ({ totalId, reporterList, inRcv, onCancle }) => {
    const dispatch = useDispatch();
    const article = useSelector((store) => store.article.article);
    const loading = useSelector((store) => store.loading[GET_ARTICLE] || store.loading[SAVE_ARTICLE]);
    const [tagStr, setTagStr] = useState(''); // 태그리스트
    const [repStr, setRepStr] = useState(''); // 기자리스트
    const [content, setContent] = useState(''); // 본문
    const [codeModalShow, setCodeModalShow] = useState(false); // 분류코드 모달
    const [historyModalShow, setHistoryModalShow] = useState(false); // 히스토리 모달
    const [temp, setTemp] = useState(initialState.article);

    /**
     * input 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        if (name === 'tagList') {
            // 계속 파싱할 수 없어서
            setTagStr(value);
        } else if (name === 'repStr') {
            setRepStr(value);
        } else {
            setTemp({
                ...temp,
                [name]: value,
            });
        }
    };

    /**
     * 태그 input blur
     */
    const handleTagBlur = () => {
        setTemp({
            ...temp,
            tagList: tagStr.split(','),
        });
    };

    /**
     * 본문 blur
     * @param {string} value editor value
     */
    const handleContentBlur = (value) => {
        setContent(value);
    };

    /**
     * 기자 입력 input blur
     * @param {object} e event
     */
    const handleBlurRep = (e) => {
        const { value } = e.target;
        let tmpArr = temp.reporterList;

        const result = value.split('.').map((repName) => {
            let idx = tmpArr.findIndex((t) => t.repName === repName);
            if (idx > -1) {
                return tmpArr.splice(idx, 1)[0];
            } else {
                return {
                    repName,
                };
            }
        });
        setTemp({
            ...temp,
            reporterList: result,
        });
    };

    /**
     * 마스터코드 변경 모달
     * @param {array} list 마스터코드리스트
     */
    const handleMasterCode = (list) => {
        let result = [];
        if (list) {
            result = list.map((code) => code.masterCode);
        }
        setTemp({
            ...temp,
            categoryList: result,
        });
    };

    /**
     * 기자 자동완성 변경
     * @param {object} value value
     */
    const handleReporter = (value) => {
        if (value) {
            if (temp.reporterList.findIndex((s) => s.value === value.value) > -1) {
                toast.warning('이미 선택한 기자입니다');
            } else {
                const narr = [...temp.reporterList, value];
                setTemp({
                    ...temp,
                    reporterList: narr,
                });
                setRepStr(narr.map((r) => r.repName).join(','));
            }
        }
    };

    /**
     * 복사
     */
    const handleClickCopy = () => {
        if (temp.serviceUrl) {
            copy(temp.serviceUrl);
            toast.success('복사하였습니다');
        } else {
            toast.warning('복사할 URL이 없습니다');
        }
    };

    /**
     * PC 미리보기
     */
    const handlePCPreview = () => popupPreview(`${API_BASE_URL}/preview/article/update/${temp.totalId}`, { ...temp, servicePlatform: 'P' });

    /**
     * 모바일 미리보기
     */
    const handleMobilePreview = () => popupPreview(`${API_BASE_URL}/preview/article/update/${temp.totalId}`, { ...temp, servicePlatform: 'M' });

    /**
     * 기사 수정
     */
    const handleClickSave = () => {
        // validate 추가
        const saveObj = {
            ...temp,
            artContent: {
                totalId: temp.totalId,
                artContent: content,
            },
        };
        dispatch(
            saveArticle({
                article: {
                    reporterList: saveObj.reporterList,
                    artContent: saveObj.artContent,
                },
            }),
        );
    };

    useEffect(() => {
        // 기사 상세 조회
        if (totalId) {
            dispatch(
                getArticle({
                    totalId,
                    callback: ({ header }) => {
                        if (!header.success) {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        }
    }, [dispatch, totalId]);

    useEffect(() => {
        setTemp({
            ...article,
            artTitle: unescapeHtml(article.artTitle),
            // 분류코드 (중복인 마스터코드 제거)
            categoryList: [...new Set(article.categoryList)],
            // 발행일
            pressDateText: `${article.pressDate.slice(0, 4)}-${article.pressDate.slice(4, 6)}-${article.pressDate.slice(6, 8)}`,
            // 기자리스트
            reporterList: article.reporterList.map((reporter) => ({
                ...reporter,
                label: reporter.repName,
                value: reporter.repSeq,
            })),
            // 링크
            serviceUrl: `${ARTICLE_URL}${temp.totalId}`,
        });
        // 태그 리스트
        setTagStr(article.tagList.join(','));
        // 기자리스트(text)
        setRepStr(article.reporterList.map((r) => r.repName).join(','));
        // 본문
        setContent(article.artContent?.artContent || '');
    }, [article, temp.totalId]);

    return (
        <MokaCard
            title="등록기사"
            className="flex-fill w-100"
            footer
            footerClassName="d-flex justify-content-center"
            footerButtons={[
                { variant: 'outline-neutral', text: '미리보기', className: 'mr-2', onClick: handlePCPreview },
                { variant: 'outline-neutral', text: '모바일 미리보기', className: 'mr-2', onClick: handleMobilePreview },
                { variant: 'positive', text: '기사수정', className: 'mr-2', onClick: handleClickSave },
                { variant: 'outline-neutral', text: 'NDArticle Upload', className: 'mr-2' },
                { variant: 'negative', text: '취소', onClick: onCancle },
            ]}
            loading={loading}
        >
            <Form>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={3}>
                        <MokaInputLabel label="출처" value={temp?.articleSource?.sourceName} inputProps={{ plaintext: true }} disabled />
                    </Col>
                    <Col className="p-0 d-flex justify-content-end align-items-center" xs={9}>
                        <MokaInputLabel label="발행일" labelWidth={39} inputClassName="ft-12" value={temp.pressDateText} inputProps={{ plaintext: true }} disabled />
                        <MokaInputLabel label="기사ID" labelWidth={39} inputClassName="ft-12" value={temp.totalId} inputProps={{ plaintext: true }} disabled />
                        <MokaInputLabel label="수신ID" labelWidth={39} inputClassName="ft-12" value={temp.rid} inputProps={{ plaintext: true }} disabled />
                        <Button variant="outline-neutral flex-shrink-0" className="ft-12" onClick={() => setHistoryModalShow(true)} size="sm">
                            작업정보
                        </Button>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={10}>
                        <CodeAutocomplete
                            max={4}
                            label="분류표"
                            searchIcon={false}
                            labelType="contentKorname"
                            value={temp.categoryList.join(',')}
                            onChange={handleMasterCode}
                            maxMenuHeight={150}
                            selectable={['content']}
                            isMulti
                        />
                    </Col>
                    <Col className="p-0 pl-2 d-flex align-items-center" xs={2}>
                        <Button variant="outline-neutral" className="ft-12 w-100" size="sm" onClick={() => setCodeModalShow(true)}>
                            통합분류표
                        </Button>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={12}>
                        <MokaInputLabel label="제목" name="title" className="mb-0" value={temp.artTitle} onChange={handleChangeValue} required />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={12}>
                        <MokaInputLabel label="부제목" className="mb-0" value={temp.artSubTitle} inputClassName="bg-white" disabled />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={6}>
                        <MokaInputLabel label="기자" name="repStr" value={repStr} onChange={handleChangeValue} inputProps={{ onBlur: handleBlurRep }} />
                    </Col>
                    <Col className="p-0 d-flex justify-content-center align-items-center" xs={2}>
                        <p className="mb-0 ft-12">구분자는 마침표(.)</p>
                    </Col>
                    <Col className="p-0 d-flex align-items-center" xs={4}>
                        <MokaInput
                            className="mb-0"
                            as="autocomplete"
                            onChange={handleReporter}
                            inputProps={{ options: reporterList, className: 'ft-12', maxMenuHeight: 150, placeholder: '기자 선택' }}
                        />
                        <OverlayTrigger overlay={<Tooltip id="reporter-info">중앙일보 기자인 경우 기자를 선택해주세요</Tooltip>}>
                            <MokaIcon iconName="fas-info-circle" className="ml-1 color-info" />
                        </OverlayTrigger>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={10}>
                        <MokaInputLabel label="태그" name="tagList" className="mb-0" value={tagStr} onChange={handleChangeValue} inputProps={{ onBlur: handleTagBlur }} />
                    </Col>
                    <Col className="p-0 pl-2 d-flex align-items-center" xs={2}>
                        <p className="mb-0 ml-2 ft-12">콤마(,) 구분입력</p>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0 d-flex overflow-hidden" xs={12} style={{ height: inRcv ? 320 : 280 }}>
                        <MokaInputLabel label="본문" as="none" />
                        <div className="flex-fill input-border">
                            <MokaEditorCore defaultValue={temp.artContent?.artContent} value={content} onBlur={handleContentBlur} />
                        </div>
                    </Col>
                </Form.Row>
                {!inRcv && (
                    <Form.Row className="mb-2">
                        <Col xs={12} className="d-flex p-0">
                            <MokaInputLabel label="벌크" as="none" />
                            <div className="d-flex flex-column flex-fill">
                                <Form.Row className="align-items-center">
                                    <Col xs={2} className="p-0">
                                        <MokaInput as="checkbox" inputProps={{ label: '기사', custom: true }} />
                                    </Col>
                                    <Col xs={2} className="p-0">
                                        <MokaInput as="checkbox" inputProps={{ label: '이미지', custom: true }} />
                                    </Col>
                                </Form.Row>
                                <Form.Row className="align-items-center">
                                    <Col xs={2} className="p-0">
                                        <MokaInput as="checkbox" inputProps={{ label: '네이버', custom: true }} />
                                    </Col>
                                    <Col xs={2} className="p-0">
                                        <MokaInput as="checkbox" inputProps={{ label: '다음', custom: true }} />
                                    </Col>
                                    <Col xs={2} className="p-0">
                                        <MokaInput as="checkbox" inputProps={{ label: '네이트', custom: true }} />
                                    </Col>
                                    <Col xs={2} className="p-0">
                                        <MokaInput as="checkbox" inputProps={{ label: '줌', custom: true }} />
                                    </Col>
                                    <Col xs={2} className="p-0">
                                        <MokaInput as="checkbox" inputProps={{ label: '기타', custom: true }} />
                                    </Col>
                                </Form.Row>
                            </div>
                        </Col>
                    </Form.Row>
                )}
                <Form.Row className="mb-2">
                    <Col className="p-0 d-flex align-items-center" xs={12}>
                        <MokaInputLabel label="LINK정보" className="mb-0" as="none" />
                        <Button variant="outline-neutral" size="sm" className="ft-12 mr-2" onClick={handleClickCopy}>
                            복사
                        </Button>
                        <p className="mb-0">중앙: {temp.serviceUrl}</p>
                    </Col>
                </Form.Row>

                {/* masterCode 모달 */}
                <CodeListModal
                    max={4}
                    show={codeModalShow}
                    onHide={() => setCodeModalShow(false)}
                    value={temp.categoryList}
                    selection="multiple"
                    onSave={handleMasterCode}
                    selectable={['content']}
                />

                {/* 작업정보 모달 */}
                <ArticleHistoryModal show={historyModalShow} onHide={() => setHistoryModalShow(false)} />
            </Form>
        </MokaCard>
    );
};

export default ArticleForm;
