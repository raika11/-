import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { initialState, getArticle, GET_ARTICLE, SAVE_ARTICLE, saveArticle, changeInvalidList, clearArticle } from '@store/article';
import { saveCdnArticle, checkExists, CHECK_EXISTS, SAVE_CDN_ARTICLE } from '@store/cdnArticle';
import { CodeListModal, CodeAutocomplete } from '@pages/commons';
import { MokaInputLabel, MokaInput, MokaCard, MokaIcon, MokaInputGroup, MokaCopyTextButton } from '@components';
import { MokaEditorCore } from '@components/MokaEditor';
import toast, { messageBox } from '@utils/toastUtil';
import util from '@utils/commonUtil';
import { unescapeHtmlArticle, invalidListToError } from '@utils/convertUtil';
import { ARTICLE_URL, API_BASE_URL, PREVIEW_DOMAIN_ID } from '@/constants';
import ArticleHistoryModal from '@pages/Article/modals/ArticleHistoryModal';
import ArticleEtc from './ArticleEtc';

/**
 * 등록기사 > 수정
 */
const ArticleForm = ({ totalId, reporterList, onSave, inRcv, onCancle, returnUrl = '/article' }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const article = useSelector(({ article }) => article.article);
    const loading = useSelector(({ loading }) => loading[GET_ARTICLE] || loading[SAVE_ARTICLE] || loading[CHECK_EXISTS] || loading[SAVE_CDN_ARTICLE]);
    const invalidList = useSelector((store) => store.article.invalidList);
    const [tagStr, setTagStr] = useState(''); // 태그리스트
    const [repStr, setRepStr] = useState(''); // 기자리스트
    const [content, setContent] = useState(''); // 본문
    const [codeModalShow, setCodeModalShow] = useState(false); // 분류코드 모달
    const [historyModalShow, setHistoryModalShow] = useState(false); // 히스토리 모달
    const [temp, setTemp] = useState(initialState.article);
    const [error, setError] = useState({}); // 에러처리

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

        if (name === 'artTitle') {
            setError({ ...error, artTitle: false });
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

        const result =
            value !== ''
                ? value.split('.').map((repName) => {
                      let idx = tmpArr.findIndex((t) => t.repName === repName);
                      if (idx > -1) {
                          return tmpArr.splice(idx, 1)[0];
                      } else {
                          return {
                              repName,
                          };
                      }
                  })
                : [];

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
            setError({ ...error, categoryList: false });
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
            if (temp.reporterList.findIndex((s) => String(s.value) === String(value.value)) > -1) {
                toast.warning('포함된 기자입니다');
            } else {
                let narr = [...temp.reporterList, value];
                narr = narr.map((a) => ({ ...a, repEmail: a.repEmail1 }));
                setTemp({
                    ...temp,
                    reporterList: narr,
                });
                setRepStr(narr.map((r) => r.repName).join('.'));
            }
        }
    };

    /**
     * Cdn 등록
     */
    const handleClickCdn = () => {
        if (!temp.totalId) return;

        // 1. 중복 체크
        dispatch(
            checkExists({
                totalId: temp.totalId,
                callback: ({ header, body }) => {
                    if (header.success) {
                        if (!body) {
                            // 2. cdn 등록
                            dispatch(
                                saveCdnArticle({
                                    cdnArticle: {
                                        usedYn: 'Y',
                                        totalId: temp.totalId,
                                        title: temp.artTitle,
                                    },
                                    callback: ({ header }) => {
                                        if (header.success) {
                                            toast.success(header.message);
                                        } else {
                                            toast.fail(header.message);
                                        }
                                    },
                                }),
                            );
                        } else {
                            messageBox.alert('이미 등록된 기사입니다');
                        }
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };

    /**
     * PC 미리보기
     */
    const handlePCPreview = () => util.winOpenPreview(`${API_BASE_URL}/preview/article/update/${temp.totalId}`, { ...temp, domainId: PREVIEW_DOMAIN_ID });

    /**
     * 모바일 미리보기
     */
    // const handleMobilePreview = () => util.winOpenPreview(`${API_BASE_URL}/preview/article/update/${temp.totalId}`, { ...temp, domainId: PREVIEW_DOMAIN_ID });

    /**
     * validate
     * @param {object} articleData 검증할 데이터
     */
    const validate = (articleData) => {
        let isInvalid = false;
        let errList = [];

        // 제목 체크
        if (util.isEmpty(articleData.artTitle)) {
            errList.push({
                field: 'artTitle',
                reason: '',
            });
            isInvalid = isInvalid || true;
        }
        // 마스터코드 체크
        if (util.isEmpty(articleData.categoryList.join(''))) {
            errList.push({
                field: 'categoryList',
                reason: '',
            });
            isInvalid = isInvalid || true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    /**
     * 기사 수정
     */
    const handleClickSave = () => {
        const saveObj = {
            artTitle: temp.artTitle,
            totalId: temp.totalId,
            artContent: {
                totalId: temp.totalId,
                artContent: content,
            },
            artSubTitle: temp.artSubTitle,
            reporterList: (temp.reporterList || []).map((c, idx) => ({ ...c, ordNo: idx + 1 })), // ordNo 셋팅,
            tagList: temp.tagList,
            categoryList: temp.categoryList,
        };

        if (validate(saveObj)) {
            dispatch(
                saveArticle({
                    article: saveObj,
                    callback: ({ header, body }) => {
                        if (!header.success) {
                            toast.fail(header.message);
                        } else {
                            toast.success(header.message);
                            if (typeof onSave === 'function') onSave(body);
                        }
                    },
                }),
            );
        }
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
                            history.push(returnUrl);
                        }
                    },
                }),
            );
        }
    }, [dispatch, history, returnUrl, totalId]);

    useEffect(() => {
        setTemp({
            ...article,
            artTitle: unescapeHtmlArticle(article.artTitle),
            artSubTitle: unescapeHtmlArticle(article.artSubTitle),
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
        setRepStr(article.reporterList.map((r) => r.repName).join('.'));
        // 본문
        setContent(article.artContent?.artContent || '');
    }, [article, temp.totalId]);

    useEffect(() => {
        setError(invalidListToError(invalidList));
    }, [invalidList]);

    useEffect(() => {
        return () => {
            dispatch(clearArticle());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaCard
            title="등록 기사"
            className={clsx('flex-fill', { 'w-100': !inRcv })}
            footer
            footerButtons={[
                { variant: 'outline-neutral', text: '미리보기', className: 'mr-1', onClick: handlePCPreview },
                // { variant: 'outline-neutral', text: '모바일 미리보기', className: 'mr-1', onClick: handleMobilePreview },
                { variant: 'positive', text: '기사수정', className: 'mr-1', onClick: handleClickSave },
                { variant: 'outline-neutral', text: 'NDArticle Upload', className: 'mr-1', onClick: handleClickCdn },
                { variant: 'negative', text: '취소', onClick: onCancle },
            ]}
            loading={loading}
        >
            <Form className="d-flex flex-column h-100 overflow-y-hidden">
                {/* 등록정보 (매체, 발행일) + 작업정보 버튼 */}
                <div className="mb-2 d-flex">
                    <Col className="p-0 pr-2 d-flex align-items-center" xs={6}>
                        <MokaInputLabel label="매체" as="none" />
                        <span className="user-select-text">{temp?.articleSource?.sourceName}</span>
                    </Col>
                    <Col className="p-0 align-items-center justify-content-between d-flex" xs={6}>
                        <div className="d-flex align-items-center">
                            <MokaInputLabel label="발행일" as="none" />
                            <span className="user-select-text">{temp.pressDateText}</span>
                        </div>

                        <Button variant="outline-neutral flex-shrink-0" onClick={() => setHistoryModalShow(true)}>
                            작업정보
                        </Button>
                        {/* 작업정보 모달 */}
                        <ArticleHistoryModal totalId={article.totalId} show={historyModalShow} onHide={() => setHistoryModalShow(false)} />
                    </Col>
                </div>

                {/* 등록정보 (기사ID, 수신ID) */}
                <div className="mb-2 d-flex">
                    <Col className="p-0 pr-2 d-flex align-items-center" xs={6}>
                        <MokaInputLabel label="기사ID" as="none" />
                        <span className="user-select-text">{temp.totalId}</span>
                    </Col>

                    <Col className="p-0 d-flex align-items-center" xs={6}>
                        <MokaInputLabel label="수신ID" as="none" />
                        <span className="user-select-text">{temp.rid}</span>
                    </Col>
                </div>

                {/* 분류 */}
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={10}>
                        <CodeAutocomplete
                            max={4}
                            label="분류표"
                            searchIcon={false}
                            labelType="masterCodeContentKorname"
                            value={temp.categoryList.join(',')}
                            onChange={handleMasterCode}
                            maxMenuHeight={150}
                            selectable={['content']}
                            isInvalid={error.categoryList}
                            required
                            isMulti
                        />
                    </Col>
                    <Col className="p-0 pl-2 d-flex align-items-center" xs={2}>
                        <Button variant="outline-neutral" className="w-100" onClick={() => setCodeModalShow(true)}>
                            통합분류표
                        </Button>

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
                    </Col>
                </Form.Row>

                {/* 제목 */}
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={12}>
                        <MokaInputLabel label="제목" name="artTitle" className="mb-0" value={temp.artTitle} onChange={handleChangeValue} isInvalid={error.artTitle} required />
                    </Col>
                </Form.Row>

                {/* 부제목 */}
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={12}>
                        <MokaInputLabel as="textarea" label="부제목" name="artSubTitle" value={temp.artSubTitle} inputClassName="bg-white" onChange={handleChangeValue} />
                    </Col>
                </Form.Row>

                {/* 기자 */}
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={6}>
                        <MokaInputLabel label="기자" name="repStr" value={repStr} onChange={handleChangeValue} inputProps={{ onBlur: handleBlurRep }} />
                    </Col>
                    <Col className="p-0 d-flex align-items-center" xs={6}>
                        <p className="mb-0 mx-3 flex-shrink-0 ft-12">구분자는 마침표(.)</p>
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

                {/* 태그 */}
                <Form.Row className="mb-2">
                    <div className="flex-fill">
                        <MokaInputLabel label="태그" name="tagList" className="mb-0" value={tagStr} onChange={handleChangeValue} inputProps={{ onBlur: handleTagBlur }} />
                    </div>
                    <div className="flex-shrink-0 d-flex align-items-center">
                        <p className="mb-0 ml-2 ft-12">콤마(,) 구분입력</p>
                    </div>
                </Form.Row>

                {/* 본문 */}
                <Form.Row className="mb-2 flex-fill" style={{ height: 250 }}>
                    <MokaInputLabel label="본문" as="none" />
                    <div className="flex-fill input-border overflow-hidden">
                        <MokaEditorCore defaultValue={temp.artContent?.artContent} value={content} onBlur={handleContentBlur} fullWindowButton />
                    </div>
                </Form.Row>

                {/* 벌크 사이트 리스트, 조회 (AB테스트 등) */}
                {!inRcv && <ArticleEtc bulkSiteList={article.bulkSiteList} articleService={article.articleService} />}

                {/* 링크정보 */}
                <Form.Row>
                    <Col className="p-0" xs={12}>
                        <MokaInputGroup
                            label="LINK정보"
                            value={temp.serviceUrl}
                            inputClassName="bg-white"
                            append={<MokaCopyTextButton copyText={temp.serviceUrl} successText="복사하였습니다" />}
                            disabled
                        />
                    </Col>
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default ArticleForm;
