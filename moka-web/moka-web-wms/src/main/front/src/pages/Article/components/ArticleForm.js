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
import { REQUIRED_REGEX } from '@utils/regexUtil';
import commonUtil from '@utils/commonUtil';
import { unescapeHtmlArticle, invalidListToError } from '@utils/convertUtil';
import { ARTICLE_URL, API_BASE_URL } from '@/constants';
import ArticleHistoryModal from '@pages/Article/modals/ArticleHistoryModal';

/**
 * 등록기사 수정폼
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
    const [bulkSiteObj, setBulkSiteObj] = useState({}); // 벌크 체크
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
                const narr = [...temp.reporterList, value];
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
        if (temp.totalId) {
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
        }
    };

    /**
     * PC 미리보기
     */
    const handlePCPreview = () => commonUtil.popupPreview(`${API_BASE_URL}/preview/article/update/${temp.totalId}`, { ...temp, servicePlatform: 'P' });

    /**
     * 모바일 미리보기
     */
    const handleMobilePreview = () => commonUtil.popupPreview(`${API_BASE_URL}/preview/article/update/${temp.totalId}`, { ...temp, servicePlatform: 'M' });

    /**
     * validate
     * @param {object} articleData 검증할 데이터
     */
    const validate = (articleData) => {
        let isInvalid = false;
        let errList = [];

        // 제목 체크
        if (!articleData.artTitle || !REQUIRED_REGEX.test(articleData.artTitle)) {
            errList.push({
                field: 'artTitle',
                reason: '',
            });
            isInvalid = isInvalid || true;
        }
        // 마스터코드 체크
        if (!REQUIRED_REGEX.test(articleData.categoryList.join(''))) {
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
            reporterList: temp.reporterList,
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
        // 벌크사이트 => obj
        setBulkSiteObj(
            article.bulkSiteList.reduce(
                (all, cu) => ({
                    ...all,
                    [cu.siteName]: cu,
                }),
                {},
            ),
        );
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
            footerClassName="d-flex justify-content-center"
            footerButtons={[
                { variant: 'outline-neutral', text: '미리보기', className: 'mr-2', onClick: handlePCPreview },
                { variant: 'outline-neutral', text: '모바일 미리보기', className: 'mr-2', onClick: handleMobilePreview },
                { variant: 'positive', text: '기사수정', className: 'mr-2', onClick: handleClickSave },
                { variant: 'outline-neutral', text: 'NDArticle Upload', className: 'mr-2', onClick: handleClickCdn },
                { variant: 'negative', text: '취소', onClick: onCancle },
            ]}
            loading={loading}
        >
            <Form className="d-flex flex-column h-100 overflow-y-hidden">
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={3}>
                        <MokaInputLabel label="매체" inputClassName="ft-12" value={temp?.articleSource?.sourceName} inputProps={{ plaintext: true }} disabled />
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
                            isInvalid={error.categoryList}
                            required
                            isMulti
                        />
                    </Col>
                    <Col className="p-0 pl-2 d-flex align-items-center" xs={2}>
                        <Button variant="outline-neutral" className="w-100" size="sm" onClick={() => setCodeModalShow(true)}>
                            통합분류표
                        </Button>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={12}>
                        <MokaInputLabel label="제목" name="artTitle" className="mb-0" value={temp.artTitle} onChange={handleChangeValue} isInvalid={error.artTitle} required />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={12}>
                        <MokaInputLabel
                            as="textarea"
                            label="부제목"
                            name="artSubTitle"
                            value={temp.artSubTitle}
                            inputClassName="bg-white resize-none custom-scroll"
                            onChange={handleChangeValue}
                        />
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
                <Form.Row className="mb-2 flex-fill" style={{ height: 295 }}>
                    <Col className="p-0 d-flex overflow-hidden" xs={12}>
                        <MokaInputLabel label="본문" as="none" />
                        <div className="flex-fill input-border overflow-hidden">
                            <MokaEditorCore defaultValue={temp.artContent?.artContent} value={content} onBlur={handleContentBlur} />
                        </div>
                    </Col>
                </Form.Row>
                {!inRcv && (
                    <Form.Row className="mb-2">
                        <Col xs={7} className="d-flex p-0">
                            <MokaInputLabel label="벌크" as="none" />
                            <div className="d-flex flex-column flex-fill">
                                <div>
                                    <MokaInput
                                        as="checkbox"
                                        className="mr-2 float-left ft-12"
                                        inputProps={{ label: '기사', custom: true, checked: bulkSiteObj['기사']?.bulkYn === 'Y', readOnly: true }}
                                    />
                                    <MokaInput
                                        as="checkbox"
                                        className="float-left ft-12"
                                        inputProps={{ label: '이미지', custom: true, checked: bulkSiteObj['이미지']?.bulkYn === 'Y', readOnly: true }}
                                    />
                                </div>
                                <div>
                                    <MokaInput
                                        as="checkbox"
                                        className="mr-2 float-left ft-12"
                                        inputProps={{ label: '네이버', custom: true, checked: bulkSiteObj['네이버']?.bulkYn === 'Y', readOnly: true }}
                                    />
                                    <MokaInput
                                        as="checkbox"
                                        className="mr-2 float-left ft-12"
                                        inputProps={{ label: '다음', custom: true, checked: bulkSiteObj['다음']?.bulkYn === 'Y', readOnly: true }}
                                    />
                                    <MokaInput
                                        as="checkbox"
                                        className="mr-2 float-left ft-12"
                                        inputProps={{ label: '네이트', custom: true, checked: bulkSiteObj['네이트']?.bulkYn === 'Y', readOnly: true }}
                                    />
                                    <MokaInput
                                        as="checkbox"
                                        className="mr-2 float-left ft-12"
                                        inputProps={{ label: '줌', custom: true, checked: bulkSiteObj['줌']?.bulkYn === 'Y', readOnly: true }}
                                    />
                                    <MokaInput
                                        as="checkbox"
                                        className="float-left ft-12"
                                        inputProps={{ label: '기타', custom: true, checked: bulkSiteObj['기타']?.bulkYn === 'Y', readOnly: true }}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col xs={5} className="d-flex p-0">
                            <hr class="vertical-divider" />
                            <MokaInputLabel label="종류" labelWidth={30} as="none" />
                            <div className="d-flex flex-column flex-fill">
                                <div>
                                    <MokaInput as="checkbox" className="mr-2 float-left ft-12" inputProps={{ label: '로그인', custom: true, readOnly: true }} />
                                    <MokaInput as="checkbox" className="float-left ft-12" inputProps={{ label: 'AB테스트용', custom: true, readOnly: true }} />
                                </div>
                                <div>
                                    <MokaInput as="checkbox" className="float-left ft-12" inputProps={{ label: '연재기사(번호: 000)', custom: true, readOnly: true }} />
                                </div>
                            </div>
                        </Col>
                    </Form.Row>
                )}
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
                <ArticleHistoryModal totalId={article.totalId} show={historyModalShow} onHide={() => setHistoryModalShow(false)} />
            </Form>
        </MokaCard>
    );
};

export default ArticleForm;
