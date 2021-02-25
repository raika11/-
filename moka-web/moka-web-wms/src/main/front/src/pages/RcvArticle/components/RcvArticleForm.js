import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import toast from '@utils/toastUtil';
import { CodeListModal, CodeAutocomplete } from '@pages/commons';
import { MokaInputLabel, MokaCard, MokaInput, MokaIcon } from '@components';
import { PREVIEW_DOMAIN_ID } from '@/constants';

const RcvArticleForm = ({ reporterList, article, onChange, loading, onCancle, onPreview, onRegister, error, setError, registerable }) => {
    const [selectedMasterCode, setSelectedMasterCode] = useState([]); // 마스터코드 리스트
    const [selectedReporter, setSelectedReporter] = useState([]); // 기자 리스트
    const [repStr, setRepStr] = useState('');
    const [tagStr, setTagStr] = useState(''); // 태그리스트
    const [pressDt, setPressDt] = useState(''); // 발행일자
    const [codeModalShow, setCodeModalShow] = useState(false); // 분류코드 모달

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
            // 기자명은 별도 처리
            setRepStr(value);
        } else {
            onChange({
                key: name,
                value,
            });
        }
    };

    /**
     * 태그 input blur
     */
    const handleBlurTag = () => {
        onChange({
            key: 'tagList',
            value: tagStr.split(','),
        });
    };

    /**
     * 기자 입력 input blur
     * @param {object} e event
     */
    const handleBlurRep = (e) => {
        const { value } = e.target;
        let tmpArr = selectedReporter;

        const result =
            value !== ''
                ? value.split('.').map((reporterName) => {
                      let idx = tmpArr.findIndex((t) => t.reporterName === reporterName);
                      if (idx > -1) {
                          return tmpArr.splice(idx, 1)[0];
                      } else {
                          return {
                              reporterName,
                          };
                      }
                  })
                : [];

        onChange({
            key: 'reporterList',
            value: result,
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
        onChange({
            key: 'categoryList',
            value: result,
        });
    };

    const valueCreator = (name, email) => `${name}/${email || ''}`;

    /**
     * 기자 자동완성 변경
     * @param {object} value value
     */
    const handleReporter = (value) => {
        if (value) {
            const result = {
                // rid: value.rid,
                reporterBlog: value.reporterBlog,
                reporterEmail: value.reporterEmail || value.repEmail1,
                reporterEtc: value.reporterEtc,
                reporterName: value.reporterName || value.repName,
                label: value.reporterName || value.repName,
                value: value.reporterName ? valueCreator(value.reporterName, value.reporterEmail) : valueCreator(value.repName, value.repEmail1),
            };

            if (selectedReporter.findIndex((s) => s.value === result.value) > -1) {
                toast.warning('포함된 기자입니다');
            } else {
                onChange({
                    key: 'reporterList',
                    value: [...selectedReporter, result],
                });
            }
        }
    };

    /**
     * PC 미리보기
     */
    const handlePCPreview = () => onPreview(PREVIEW_DOMAIN_ID);

    /**
     * 모바일 미리보기
     */
    // const handleMobilePreview = () => onPreview(PREVIEW_DOMAIN_ID);

    useEffect(() => {
        if (article.pressDt) {
            setPressDt(article.pressDt.slice(0, 10));
        }
    }, [article.pressDt]);

    useEffect(() => {
        setSelectedMasterCode(article.categoryList || []);
    }, [article.categoryList]);

    useEffect(() => {
        setTagStr((article.tagList || []).join(','));
    }, [article.tagList]);

    useEffect(() => {
        const sr = (article.reporterList || []).map((reporter) => ({
            ...reporter,
            label: reporter.reporterName,
            value: valueCreator(reporter.reporterName, reporter.reporterEmail),
        }));
        setSelectedReporter(sr);
        setRepStr(sr.map((s) => s.reporterName).join('.'));
    }, [article.reporterList]);

    return (
        <MokaCard
            title="수신기사"
            className="flex-fill"
            footer
            footerClassName="d-flex justify-content-center"
            footerButtons={[
                { variant: 'outline-neutral', text: '미리보기', className: 'mr-1', onClick: handlePCPreview },
                // { variant: 'outline-neutral', text: '모바일 미리보기', className: 'mr-1', onClick: handleMobilePreview },
                registerable === 'Y' && { variant: 'positive', text: '기사등록', className: 'mr-1', onClick: onRegister },
                { variant: 'negative', text: '취소', onClick: onCancle },
            ].filter((a) => a)}
            loading={loading}
        >
            <Form className="d-flex flex-column h-100">
                {/* 수신 정보 */}
                <div className="mb-2 d-flex">
                    <Col className="p-0 d-flex align-items-center" xs={4}>
                        <MokaInputLabel label="매체" as="none" />
                        <span className="ft-14 user-select-text">{article.articleSource?.sourceName}</span>
                    </Col>
                    <Col className="p-0 d-flex align-items-center" xs={4}>
                        <MokaInputLabel label="발행일" as="none" />
                        <span className="ft-14 user-select-text">{pressDt}</span>
                    </Col>
                    <Col className="p-0 d-flex align-items-center" xs={4}>
                        <MokaInputLabel label="수신ID" as="none" />
                        <span className="ft-14 user-select-text">{article.rid}</span>
                    </Col>
                </div>

                {/* 분류 */}
                <Form.Row className="mb-2 flex-shrink-0">
                    <Col className="p-0" xs={10}>
                        <CodeAutocomplete
                            max={4}
                            label="분류표"
                            className="mb-0"
                            searchIcon={false}
                            labelType="masterCodeContentKorname"
                            value={selectedMasterCode.join(',')}
                            onChange={handleMasterCode}
                            maxMenuHeight={150}
                            selectable={['content']}
                            isInvalid={error.categoryList}
                            required
                            isMulti
                        />
                    </Col>
                    <Col className="p-0 pl-2 d-flex align-items-center" xs={2}>
                        <Button variant="outline-neutral" className="ft-12 w-100" onClick={() => setCodeModalShow(true)} size="sm">
                            통합분류표
                        </Button>
                    </Col>
                </Form.Row>

                {/* 제목 */}
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={12}>
                        <MokaInputLabel label="제목" value={article.title} inputProps={{ plaintext: true }} disabled />
                    </Col>
                </Form.Row>

                {/* 부제목 */}
                <div className="mb-2 w-100">
                    <MokaInputLabel as="textarea" label="부제목" value={article.subTitle} inputProps={{ rows: 2 }} disabled />
                </div>

                {/* 기자 */}
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

                {/* 태그 */}
                <Form.Row className="mb-2">
                    <Col className="p-0 " xs={10}>
                        <MokaInputLabel label="태그" name="tagList" className="mb-0" value={tagStr} onChange={handleChangeValue} inputProps={{ onBlur: handleBlurTag }} />
                    </Col>
                    <Col className="p-0 pl-2 d-flex align-items-center" xs={2}>
                        <p className="mb-0 ml-2 ft-12">콤마(,) 구분입력</p>
                    </Col>
                </Form.Row>

                {/* 본문(단순 보기) */}
                <Form.Row className="flex-fill">
                    <MokaInputLabel label="본문" className="mb-0" as="none" />
                    <div
                        className="flex-fill overflow-hidden custom-scroll overflow-y-scroll input-border p-3 user-select-text"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </Form.Row>

                {/* masterCode 모달 */}
                <CodeListModal
                    max={4}
                    show={codeModalShow}
                    onHide={() => setCodeModalShow(false)}
                    value={selectedMasterCode}
                    selection="multiple"
                    onSave={handleMasterCode}
                    selectable={['content']}
                />
            </Form>
        </MokaCard>
    );
};

export default RcvArticleForm;
