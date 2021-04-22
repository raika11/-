import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInputLabel, MokaInput } from '@/components';
import MokaTagInput from './MokaTagInput';

/**
 * 패키지 관리 > 기사 패키지 > 패키지 편집
 */
const ArticlePackageEdit = ({ match }) => {
    const history = useHistory();
    const { pkgSeq } = useParams();
    const [temp, setTemp] = useState({
        pkgName: '',
        type: 'all',
        tags: [],
    });

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        setTemp({ ...temp, [name]: value });
    };

    /**
     * 취소
     */
    const handleClickCancel = () => {
        history.push(match.path);
    };

    return (
        <MokaCard
            className="w-100"
            footer
            footerButtons={[
                pkgSeq && { text: '종료', variant: 'negative', className: 'mr-1' },
                { text: pkgSeq ? '수정' : '저장', variant: 'positive', className: 'mr-1' },
                { text: '취소', variant: 'negative', onClick: handleClickCancel },
            ].filter(Boolean)}
        >
            <Form>
                <Form.Row className="mb-2">
                    <MokaInputLabel className="mr-2 flex-fill" label="패키지 명" value={temp.pkgName} onChange={handleChangeValue} />
                    <Button variant="searching">중복 검사</Button>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={8} className="p-0 d-flex justify-content-between">
                        <MokaInputLabel as="none" label="구분" />
                        <MokaInput
                            as="radio"
                            name="type"
                            value="all"
                            id="all"
                            inputProps={{ label: '전체 기사', custom: true, checked: temp.type === 'all' }}
                            onChange={handleChangeValue}
                        />
                        <MokaInput
                            as="radio"
                            name="type"
                            value="section"
                            id="section"
                            inputProps={{ label: '섹션', custom: true, checked: temp.type === 'section' }}
                            onChange={handleChangeValue}
                        />
                        <MokaInput
                            as="radio"
                            name="type"
                            value="tag"
                            id="tag"
                            inputProps={{ label: '태그', custom: true, checked: temp.type === 'tag' }}
                            onChange={handleChangeValue}
                        />
                        <MokaInput
                            as="radio"
                            name="type"
                            value="release"
                            id="release"
                            inputProps={{ label: '출고일', custom: true, checked: temp.type === 'release' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>
                {/* <MokaTagInput value={temp.tags} /> */}
            </Form>
        </MokaCard>
    );
};

export default ArticlePackageEdit;
