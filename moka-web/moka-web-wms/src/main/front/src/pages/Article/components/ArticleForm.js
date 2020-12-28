import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import copy from 'copy-to-clipboard';
import { CodeListModal, CodeAutocomplete } from '@pages/commons';
import { MokaInputLabel, MokaCard } from '@components';
import toast from '@utils/toastUtil';
import ArticleHistoryModal from '@pages/Article/modals/ArticleHistoryModal';
import ArticlePC from '@pages/Article/components/ArticlePC';

const ArticleForm = ({ reporterList, inRcv, loading, onCancle, article, onChange, articleTypeRows }) => {
    const [selectedMasterCode, setSelectedMasterCode] = useState([]); // 마스터코드 리스트
    const [selectedReporter, setSelectedReporter] = useState([]); // 기자 리스트
    const [articleTypeName, setArticleTypeName] = useState(''); // 기사유형명
    const [pressDt, setPressDt] = useState(''); // 발행일자
    const [codeModalShow, setCodeModalShow] = useState(false); // 분류코드 모달
    const [historyModalShow, setHistoryModalShow] = useState(false); // 히스토리 모달
    const [previewOn, setPreviewOn] = useState({ pc: false, mobile: false }); // 미리보기 윈도우

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
            title="등록기사"
            className="flex-fill"
            footer
            footerClassName="d-flex justify-content-center"
            footerButtons={[
                { variant: 'outline-neutral', text: '미리보기', className: 'mr-2', onClick: () => setPreviewOn({ ...previewOn, pc: true }) },
                { variant: 'outline-neutral', text: '모바일 미리보기', className: 'mr-2' },
                { variant: 'positive', text: '기사수정', className: 'mr-2' },
                { variant: 'outline-neutral', text: 'NDArticle Upload', className: 'mr-2' },
                { variant: 'negative', text: '취소', onClick: onCancle },
            ]}
            loading={loading}
        >
            <Form>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={4}>
                        <MokaInputLabel label="기사유형" value={articleTypeName} className="mr-2 mb-0" inputProps={{ plaintext: true }} disabled />
                    </Col>
                    <Col className="p-0 d-flex justify-content-end" xs={8}>
                        <MokaInputLabel label="발행일 :" labelWidth={43} value={pressDt} className="mr-2 mb-0" inputProps={{ plaintext: true }} disabled />
                        <MokaInputLabel label="기사ID :" labelWidth={43} value={article.totalId} className="mb-0" inputProps={{ plaintext: true }} disabled />
                        <MokaInputLabel label="수신ID :" labelWidth={43} value={article.rid} className="mb-0" inputProps={{ plaintext: true }} disabled />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={4}>
                        <MokaInputLabel label="출처" value={article.articleSource?.sourceName} className="mb-0" inputProps={{ plaintext: true }} disabled />
                    </Col>
                    <Col className="p-0" xs={8}>
                        <Button variant="outline-neutral" className="ft-12" onClick={() => setHistoryModalShow(true)}>
                            작업정보
                        </Button>
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
                        <MokaInputLabel label="제목" name="title" className="mb-0" value={article.title} onChange={handleChangeValue} required />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0" xs={12}>
                        <MokaInputLabel label="부제목" className="mb-0" value={article.subTitle} inputClassName="bg-white" disabled />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0 d-flex" xs={12}>
                        <MokaInputLabel
                            label="본문"
                            as="textarea"
                            name="content"
                            className="mb-0 flex-fill"
                            value={article.content}
                            onChange={handleChangeValue}
                            inputProps={{ rows: 13 }}
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
                <CodeListModal show={codeModalShow} onHide={() => setCodeModalShow(false)} value={selectedMasterCode} selection="multiple" onSave={handleMasterCode} />

                {/* 작업정보 모달 */}
                <ArticleHistoryModal show={historyModalShow} onHide={() => setHistoryModalShow(false)} />

                {/* PC미리보기 */}
                <ArticlePC show={previewOn.pc} onHide={() => setPreviewOn({ ...previewOn, pc: false })} />
            </Form>
        </MokaCard>
    );
};

export default ArticleForm;
