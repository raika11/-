import React, { useState } from 'react';
import clsx from 'clsx';
import { useHistory, useParams } from 'react-router';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { CodeAutocomplete, CodeListModal } from '@pages/commons';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInputLabel, MokaInput, MokaTagInput } from '@/components';

/**
 * 패키지 관리 > 기사 패키지 > 패키지 편집
 */
const ArticlePackageEdit = ({ match }) => {
    const history = useHistory();
    const { pkgSeq } = useParams();
    const [temp, setTemp] = useState({
        pkgName: '',
        type: 'all',
        sectionList: [],
        tags: [],
        condition: 'and',
        subscribeYn: 'N',
    });
    const [codeModalShow, setCodeModalShow] = useState(false);

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

    /**
     * 마스터코드 변경 모달
     * @param {array} list 마스터코드리스트
     */
    const handleMasterCode = (list) => {
        let result = [];
        if (list) {
            result = list.map((code) => code.masterCode);
        }
        setTemp({
            ...temp,
            sectionList: result,
        });
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
                    <MokaInputLabel className="mr-2 flex-fill" name="pkgName" label="패키지 명" value={temp.pkgName} onChange={handleChangeValue} />
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
                {temp.type === 'all' && <p className="mb-2">서비스 또는 콘텐츠 예외 처리</p>}
                {temp.type === 'release' && <p className="mb-2">출고일 조건 기사 예외 처리</p>}
                {temp.type !== 'tag' && (
                    <>
                        <Form.Row
                            className={clsx('mb-2', 'align-items-center', {
                                'justify-content-between': temp.type === 'all' || temp.type === 'release',
                                'justify-content-end': temp.type === 'section',
                            })}
                        >
                            {(temp.type === 'all' || temp.type === 'release') && <p className="mb-0">└ 섹션</p>}
                            <Button variant="outline-neutral" onClick={() => setCodeModalShow(true)}>
                                선택
                            </Button>

                            {/* masterCode 모달 */}
                            <CodeListModal
                                show={codeModalShow}
                                onHide={() => setCodeModalShow(false)}
                                value={temp.sectionList}
                                selection="multiple"
                                onSave={handleMasterCode}
                                selectable={['content']}
                            />
                        </Form.Row>
                        <CodeAutocomplete
                            label={temp.type === 'section' ? '섹션' : null}
                            className="mb-2"
                            searchIcon={false}
                            labelType="masterCodeContentKorname"
                            value={temp.sectionList.join(',')}
                            onChange={handleMasterCode}
                            maxMenuHeight={150}
                            selectable={['content']}
                            // isInvalid={error.categoryList}
                            isMulti
                        />
                    </>
                )}
                {temp.type === 'section' && <p className="mb-2">서비스 또는 콘텐츠 예외 처리</p>}
                {(temp.type === 'all' || temp.type === 'release') && (
                    <Form.Row className="mb-2">
                        <Col xs={3} className="p-0 d-flex">
                            <MokaInput
                                as="radio"
                                name="condition"
                                id="codition-and"
                                value="and"
                                inputProps={{ label: 'And', custom: true, checked: temp.condition === 'and' }}
                                onChange={handleChangeValue}
                            />
                            <MokaInput
                                as="radio"
                                name="condition"
                                id="codition-or"
                                value="or"
                                inputProps={{ label: 'Or', custom: true, checked: temp.condition === 'or' }}
                                onChange={handleChangeValue}
                            />
                        </Col>
                    </Form.Row>
                )}
                {temp.type !== 'tag' && <p className="mb-2">└ 태그</p>}
                <Form.Row className="mb-2">
                    {temp.type === 'tag' && <MokaInputLabel as="none" label="태그" />}
                    <MokaTagInput value={temp.tags} onChange={(value) => setTemp({ ...temp, tags: value })} onAddSpace />
                </Form.Row>
                {(temp.type === 'section' || temp.type === 'tag') && (
                    <MokaInputLabel
                        as="switch"
                        className="mt-2"
                        id="subscribeYn-switch"
                        label="구독 가능 여부"
                        value={temp.subscribeYn}
                        onChange={handleChangeValue}
                        inputProps={{ custom: true, checked: temp.subscribeYn === 'Y' ? true : false }}
                    />
                )}
            </Form>
        </MokaCard>
    );
};

export default ArticlePackageEdit;
