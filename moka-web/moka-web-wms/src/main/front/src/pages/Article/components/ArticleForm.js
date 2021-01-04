import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import copy from 'copy-to-clipboard';
import { CodeListModal, CodeAutocomplete } from '@pages/commons';
import { MokaInputLabel, MokaInput, MokaCard } from '@components';
import { MokaEditorCore } from '@components/MokaEditor';
import toast from '@utils/toastUtil';
import ArticleHistoryModal from '@pages/Article/modals/ArticleHistoryModal';

const ArticleForm = ({ reporterList, inRcv, loading, onCancle, article = {}, onChange, onPreview }) => {
    const [selectedMasterCode, setSelectedMasterCode] = useState([]); // 마스터코드 리스트
    const [selectedReporter, setSelectedReporter] = useState([]); // 기자 리스트
    const [tagStr, setTagStr] = useState(''); // 태그리스트
    const [pressDt, setPressDt] = useState(''); // 발행일자
    const [content, setContent] = useState(''); // 본문
    const [codeModalShow, setCodeModalShow] = useState(false); // 분류코드 모달
    const [historyModalShow, setHistoryModalShow] = useState(false); // 히스토리 모달

    /**
     * input 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        if (name === 'tagList') {
            // 계속 파싱할 수 없어서
            setTagStr(value);
        } else {
            onChange({
                key: name,
                value,
            });
        }
    };

    /**
     * 태그 input blur시에 onChange 실행
     */
    const handleTagBlur = () => {
        onChange({
            key: 'tagList',
            value: tagStr.split(','),
        });
    };

    /**
     * 본문 blur 시
     * @param {string} value editor value
     */
    const handleContentBlur = (value) => {
        setContent(value);
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
        onChange({
            key: 'categoryList',
            value: result,
        });
    };

    const valueCreator = (name, email) => `${name}/${email}`;

    /**
     * 기자 자동완성 변경
     * @param {array} value value
     */
    const handleReporter = (value) => {
        let result = [];
        if (value) {
            result = value.map((reporter) => ({
                rid: reporter.rid,
                reporterBlog: reporter.reporterBlog,
                reporterEmail: reporter.reporterEmail || reporter.repEmail1,
                reporterEtc: reporter.reporterEtc,
                reporterName: reporter.reporterName || reporter.repName,
                label: reporter.reporterName || reporter.repName,
                value: reporter.reporterName ? valueCreator(reporter.reporterName, reporter.reporterEmail) : valueCreator(reporter.repName, reporter.repEmail1),
            }));
        }

        onChange({
            key: 'reporterList',
            value: result,
        });
    };

    /**
     * 복사
     */
    const handleClickCopy = () => {
        if (article.serviceUrl) {
            copy(article.serviceUrl);
            toast.success('복사하였습니다');
        } else {
            toast.warning('복사할 URL이 없습니다');
        }
    };

    /**
     * PC 미리보기
     */
    const handlePCPreview = () => onPreview('P');

    /**
     * 모바일 미리보기
     */
    const handleMobilePreview = () => onPreview('M');

    useEffect(() => {
        setSelectedMasterCode(article.categoryList || []);
        // 발행일
        if (inRcv) {
            article.pressDt && setPressDt(article.pressDt.slice(0, 10));
        } else {
            article.pressDt && setPressDt(`${article.pressDt.slice(0, 4)}-${article.pressDt.slice(4, 6)}-${article.pressDt.slice(6, 8)}`);
        }
        // 태그 리스트
        setTagStr((article.tagList || []).join(','));
        // 기자
        setSelectedReporter(
            (article.reporterList || []).map((reporter) => ({
                ...reporter,
                label: reporter.reporterName,
                value: valueCreator(reporter.reporterName, reporter.reporterEmail),
            })),
        );
        // 본문
        setContent(article.content || '');
    }, [article.categoryList, article.content, article.pressDt, article.reporterList, article.tagList, inRcv]);

    return (
        <MokaCard
            title="등록기사"
            className="flex-fill w-100"
            footer
            footerClassName="d-flex justify-content-center"
            footerButtons={[
                { variant: 'outline-neutral', text: '미리보기', className: 'mr-2', onClick: handlePCPreview },
                { variant: 'outline-neutral', text: '모바일 미리보기', className: 'mr-2', onClick: handleMobilePreview },
                { variant: 'positive', text: '기사수정', className: 'mr-2' },
                { variant: 'outline-neutral', text: 'NDArticle Upload', className: 'mr-2' },
                { variant: 'negative', text: '취소', onClick: onCancle },
            ]}
            loading={loading}
        >
            <Form>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={3}>
                        <MokaInputLabel label="출처" value={article?.articleSource?.sourceName} className="mb-0" inputProps={{ plaintext: true }} disabled />
                    </Col>
                    <Col className="p-0 d-flex justify-content-end" xs={9}>
                        <Button variant="outline-neutral flex-shrink-0" className="ft-12" onClick={() => setHistoryModalShow(true)}>
                            작업정보
                        </Button>
                        <MokaInputLabel label="발행일" labelWidth={39} inputClassName="ft-12" value={pressDt} inputProps={{ plaintext: true }} disabled />
                        <MokaInputLabel label="기사ID" labelWidth={39} inputClassName="ft-12" value={article.totalId} inputProps={{ plaintext: true }} disabled />
                        <MokaInputLabel label="수신ID" labelWidth={39} inputClassName="ft-12" value={article.rid} inputProps={{ plaintext: true }} disabled />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={10}>
                        <CodeAutocomplete
                            max={4}
                            label="분류표"
                            searchIcon={false}
                            labelType="masterCode"
                            value={selectedMasterCode.join(',')}
                            onChange={handleMasterCode}
                            maxMenuHeight={150}
                            isMulti
                        />
                    </Col>
                    <Col className="p-0 pl-2 d-flex align-items-center" xs={2}>
                        <Button variant="outline-neutral" className="ft-12 w-100" onClick={() => setCodeModalShow(true)}>
                            통합분류표
                        </Button>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={12}>
                        <MokaInputLabel label="제목" name="title" className="mb-0" value={article.title} onChange={handleChangeValue} required />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={12}>
                        <MokaInputLabel label="부제목" className="mb-0" value={article.subTitle} inputClassName="bg-white" disabled />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0 d-flex overflow-hidden" xs={12} style={{ height: inRcv ? 320 : 280 }}>
                        <MokaInputLabel label="본문" as="none" />
                        <div className="flex-fill input-border">
                            <MokaEditorCore defaultValue={article.content} value={content} onBlur={handleContentBlur} />
                        </div>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={12}>
                        <MokaInputLabel
                            label="기자"
                            className="mb-0"
                            as="autocomplete"
                            value={selectedReporter}
                            onChange={handleReporter}
                            inputProps={{ options: reporterList, isMulti: true, className: 'ft-12', maxMenuHeight: 140 }}
                        />
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
                        <Button variant="outline-neutral" className="ft-12 h-100 mr-2" onClick={handleClickCopy}>
                            복사
                        </Button>
                        <p className="mb-0">중앙: {article.serviceUrl}</p>
                    </Col>
                </Form.Row>

                {/* masterCode 모달 */}
                <CodeListModal max={4} show={codeModalShow} onHide={() => setCodeModalShow(false)} value={selectedMasterCode} selection="multiple" onSave={handleMasterCode} />

                {/* 작업정보 모달 */}
                <ArticleHistoryModal show={historyModalShow} onHide={() => setHistoryModalShow(false)} />
            </Form>
        </MokaCard>
    );
};

export default ArticleForm;
