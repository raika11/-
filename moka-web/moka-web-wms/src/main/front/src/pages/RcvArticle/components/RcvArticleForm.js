import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { CodeListModal, CodeAutocomplete } from '@pages/commons';
import { MokaInputLabel, MokaCard } from '@components';
// import ArticlePC from '@pages/Article/components/ArticlePC';

const RcvArticleForm = ({ reporterList, article, onChange, articleTypeRows, loading, onCancle }) => {
    const [selectedMasterCode, setSelectedMasterCode] = useState([]); // 마스터코드 리스트
    const [selectedReporter, setSelectedReporter] = useState([]); // 기자 리스트
    const [articleTypeName, setArticleTypeName] = useState(''); // 기사유형명
    const [pressDt, setPressDt] = useState(''); // 발행일자
    const [codeModalShow, setCodeModalShow] = useState(false); // 분류코드 모달

    /**
     * input 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        onChange({
            key: name,
            value,
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
            key: 'codeList',
            value: result,
        });
    };

    /**
     * 기자 자동완성 변경
     * @param {array} value value
     */
    const handleReporter = (value) => {
        setSelectedReporter(value);
    };

    useEffect(() => {
        setSelectedMasterCode(article.codeList || []);
        if (articleTypeRows) {
            const at = articleTypeRows.find((a) => a.dtlCd === article.pressArtType);
            if (at) setArticleTypeName(at.cdNm);
            else setArticleTypeName('기본');
        }
        if (article.pressDt) {
            setPressDt(article.pressDt.slice(0, 10));
        }
    }, [article, articleTypeRows]);

    return (
        <MokaCard
            title="수신기사"
            className="flex-fill"
            footer
            footerClassName="d-flex justify-content-center"
            footerButtons={[
                { variant: 'outline-neutral', text: '미리보기', className: 'mr-2' },
                { variant: 'outline-neutral', text: '모바일 미리보기', className: 'mr-2' },
                { variant: 'positive', text: '기사등록', className: 'mr-2' },
                { variant: 'negative', text: '취소', onClick: onCancle },
            ]}
            loading={loading}
        >
            <Form>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={6}>
                        <MokaInputLabel label="기사유형" value={articleTypeName} className="mr-2 mb-0" inputProps={{ plaintext: true }} disabled />
                    </Col>
                    <Col className="p-0 d-flex justify-content-end" xs={6}>
                        <MokaInputLabel label="발행일" labelWidth={40} value={pressDt} className="mr-2 mb-0" inputProps={{ plaintext: true }} disabled />
                        <MokaInputLabel label="수신ID" labelWidth={40} value={article.rid} className="mb-0" inputProps={{ plaintext: true }} disabled />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={12}>
                        <MokaInputLabel label="출처" value={article.articleSource?.sourceName} className="mb-0" inputProps={{ plaintext: true }} disabled />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={10}>
                        <CodeAutocomplete
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
                            className="flex-fill overflow-hidden overflow-y-scroll border rounded p-2"
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
                            inputProps={{ options: reporterList, isMulti: true, className: 'ft-12', maxMenuHeight: 120 }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={6}>
                        <MokaInputLabel label="태그" className="mb-0" value="태그입력" disabled />
                    </Col>
                    <Col className="p-0 pl-2 d-flex align-items-center" xs={6}>
                        <Button variant="outline-neutral" className="ft-12 h-100">
                            추천태그 자동 입력
                        </Button>
                        <p className="mb-0 ml-2">콤마(,) 구분입력</p>
                    </Col>
                </Form.Row>

                {/* masterCode 모달 */}
                <CodeListModal show={codeModalShow} onHide={() => setCodeModalShow(false)} value={selectedMasterCode} selection="multiple" onSave={handleMasterCode} />
            </Form>
        </MokaCard>
    );
};

export default RcvArticleForm;
