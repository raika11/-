import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { CodeListModal, CodeAutocomplete } from '@pages/commons';
import { MokaInputLabel, MokaCard } from '@components';
// import ArticlePC from '@pages/Article/components/ArticlePC';

const RcvArticleForm = ({ reporterList, article, onChange, loading, onCancle, onPreview }) => {
    const [selectedMasterCode, setSelectedMasterCode] = useState([]); // 마스터코드 리스트
    const [selectedReporter, setSelectedReporter] = useState([]); // 기자 리스트
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
    const handleBlur = () => {
        onChange({
            key: 'tagList',
            value: tagStr.split(','),
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
     * PC 미리보기
     */
    const handlePCPreview = () => {
        onPreview('P');
    };

    /**
     * 모바일 미리보기
     */
    const handleMobilePreview = () => {
        onPreview('M');
    };

    useEffect(() => {
        setSelectedMasterCode(article.categoryList || []);
        if (article.pressDt) {
            setPressDt(article.pressDt.slice(0, 10));
        }
        setTagStr((article.tagList || []).join(','));
        setSelectedReporter(
            (article.reporterList || []).map((reporter) => ({
                ...reporter,
                label: reporter.reporterName,
                value: valueCreator(reporter.reporterName, reporter.reporterEmail),
            })),
        );
    }, [article]);

    return (
        <MokaCard
            title="수신기사"
            className="flex-fill"
            footer
            footerClassName="d-flex justify-content-center"
            footerButtons={[
                { variant: 'outline-neutral', text: '미리보기', className: 'mr-2', onClick: handlePCPreview },
                { variant: 'outline-neutral', text: '모바일 미리보기', className: 'mr-2', onClick: handleMobilePreview },
                { variant: 'positive', text: '기사등록', className: 'mr-2' },
                { variant: 'negative', text: '취소', onClick: onCancle },
            ]}
            loading={loading}
        >
            <Form>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={3}>
                        <MokaInputLabel label="출처" value={article.articleSource?.sourceName} className="mb-0" inputProps={{ plaintext: true }} disabled />
                    </Col>
                    <Col className="p-0 d-flex justify-content-end" xs={9}>
                        <MokaInputLabel label="발행일" labelWidth={40} value={pressDt} className="mr-2 mb-0" inputProps={{ plaintext: true }} disabled />
                        <MokaInputLabel label="수신ID" labelWidth={40} value={article.rid} className="mb-0" inputProps={{ plaintext: true }} disabled />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={10}>
                        <CodeAutocomplete
                            max={4}
                            label="분류표"
                            className="mb-0"
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
                        <MokaInputLabel label="제목" className="mb-0" value={article.title} inputProps={{ plaintext: true }} disabled />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={12}>
                        <MokaInputLabel label="부제목" className="mb-0" value={article.subTitle} inputProps={{ plaintext: true }} disabled />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0 d-flex" xs={12}>
                        <MokaInputLabel label="본문" className="mb-0" as="none" />
                        <div
                            className="flex-fill overflow-hidden overflow-y-scroll input-border p-2"
                            style={{ height: 283 }}
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
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
                        <MokaInputLabel label="태그" name="tagList" className="mb-0" value={tagStr} onChange={handleChangeValue} inputProps={{ onBlur: handleBlur }} />
                    </Col>
                    <Col className="p-0 pl-2 d-flex align-items-center" xs={2}>
                        <p className="mb-0 ml-2">콤마(,) 구분입력</p>
                    </Col>
                </Form.Row>

                {/* masterCode 모달 */}
                <CodeListModal max={4} show={codeModalShow} onHide={() => setCodeModalShow(false)} value={selectedMasterCode} selection="multiple" onSave={handleMasterCode} />
            </Form>
        </MokaCard>
    );
};

export default RcvArticleForm;
