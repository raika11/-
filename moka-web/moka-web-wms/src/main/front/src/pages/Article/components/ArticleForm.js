import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import copy from 'copy-to-clipboard';
import { CodeListModal, CodeAutocomplete } from '@pages/commons';
import { MokaInputLabel } from '@components';
import toast from '@utils/toastUtil';
import ArticleHistoryModal from '@pages/Article/modals/ArticleHistoryModal';

const ArticleForm = ({ reporterList, inRcv }) => {
    const [codeModalShow, setCodeModalShow] = useState(false);
    const [selectedMasterCode, setSelectedMasterCode] = useState([]);
    const [selectedReporter, setSelectedReporter] = useState([]);
    const [historyModalShow, setHistoryModalShow] = useState(false);

    /**
     * 마스터코드 변경 모달
     * @param {array} list 마스터코드리스트
     */
    const handleMasterCode = (list) => {
        let result = [];
        if (list) {
            result = list.map((code) => code.masterCode);
        }
        setSelectedMasterCode(result);
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
        copy('링크 복사');
        toast.success('복사하였습니다');
    };

    return (
        <Form>
            <Form.Row className="mb-2">
                <Col className="p-0" xs={6}>
                    <MokaInputLabel label="기사유형" value="기본" className="mr-2 mb-0" inputProps={{ plaintext: true }} disabled />
                </Col>
                <Col className="p-0 d-flex justify-content-end" xs={6}>
                    <MokaInputLabel label="발행일" labelWidth={40} value="2020-12-01" className="mr-2 mb-0" inputProps={{ plaintext: true }} disabled />
                    <MokaInputLabel label="수신ID" labelWidth={40} value="41777131" className="mb-0" inputProps={{ plaintext: true }} disabled />
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col className="p-0" xs={4}>
                    <MokaInputLabel label="출처" value="매체명 노출" className="mb-0" inputProps={{ plaintext: true }} disabled />
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
                    <Button variant="outline-neutral" className="ft-12" onClick={() => setCodeModalShow(true)}>
                        통합분류표
                    </Button>
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col className="p-0" xs={12}>
                    <MokaInputLabel label="제목" className="mb-0" value="기사제목 노출" disabled required />
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col className="p-0" xs={12}>
                    <MokaInputLabel label="부제목" className="mb-0" value="부제목 노출" disabled />
                </Col>
            </Form.Row>
            <Form.Row className="mb-2">
                <Col className="p-0 d-flex" xs={12}>
                    <MokaInputLabel label="본문" as="textarea" className="mb-0 flex-fill" value="등록기사 본문은 태그 그대로 노출" disabled inputProps={{ rows: 10 }} />
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
                        inputProps={{ options: reporterList || [], isMulti: true, className: 'ft-12', maxMenuHeight: 200 }}
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
                    <p className="mb-0">중앙: https://news.joins.com/article/23935566</p>
                </Col>
            </Form.Row>

            {/* masterCode 모달 */}
            <CodeListModal show={codeModalShow} onHide={() => setCodeModalShow(false)} value={selectedMasterCode} selection="multiple" onSave={handleMasterCode} />

            {/* 작업정보 모달 */}
            <ArticleHistoryModal show={historyModalShow} onHide={() => setHistoryModalShow(false)} />
        </Form>
    );
};

export default ArticleForm;
