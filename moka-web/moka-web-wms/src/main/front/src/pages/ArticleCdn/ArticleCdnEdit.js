import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { ARTICLE_URL, MOBILE_ARTICLE_URL } from '@/constants';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';

const ArticleCdnEdit = ({ match }) => {
    const { totalId } = useParams();
    const history = useHistory();
    const [temp, setTemp] = useState({
        totalId: '23854897',
        artTitle: '결혼 보름만에 사라진 신랑, 시부모도 신혼집도 다 가짜였다',
        usedYn: 'Y',
        description: '',
    });
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
    const handleClickCancle = () => {
        history.push(match.path);
    };

    return (
        <MokaCard
            className="flex-fill"
            title={`트래픽 분산(기사) ${totalId ? '수정' : '등록'}`}
            footerClassName="d-flex justify-content-center"
            footerButtons={[
                { text: '저장', variant: 'positive', className: 'mr-2' },
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
                            labelWidth={90}
                            as="switch"
                            id="usedYn"
                            name="usedYn"
                            inputProps={{ checked: temp.usedYn === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={4} className="p-0">
                        <MokaInputLabel label="기사" labelWidth={90} value={temp.totalId} inputClassName="bg-white" isInvalid={error.totalId} disabled required />
                    </Col>
                    <Col xs={6} className="p-0 pl-2">
                        <MokaInput className="bg-white" value={temp.artTitle} isInvalid={error.totalId} disabled />
                    </Col>
                    <Col xs={2} className="p-0 pl-2 d-flex">
                        <Button variant="searching" size="sm" className="w-100 ft-12">
                            기사 검색
                        </Button>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            label="메모"
                            labelWidth={90}
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
                            labelWidth={90}
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
                            labelWidth={90}
                            inputClassName="bg-white"
                            value={temp.totalId ? `${MOBILE_ARTICLE_URL}${temp.totalId}` : ''}
                            inputProps={{ plaintext: true }}
                            disabled
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={12} className="p-0 d-flex">
                        <MokaInputLabel label="등록정보" labelWidth={90} as="none" />
                    </Col>
                </Form.Row>
            </Form>
        </MokaCard>
    );
};

export default ArticleCdnEdit;
