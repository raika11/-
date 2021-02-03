import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel } from '@components';

/**
 * 시민마이크 아젠다 폼
 */
const MicAgendaForm = ({ agenda, onChange, categoryAllList }) => {
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [cts, setCts] = useState([]);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'usedYn' || name === 'agndTop') {
            onChange({ key: name, value: checked ? 'Y' : 'N' });
        } else {
            onChange({ key: name, value });
        }
    };

    /**
     * 카테고리 변경
     * @param {*} value 변경값
     */
    const handleChangeCategory = (value) => onChange({ key: 'categoryList', value });

    useEffect(() => {
        // 카테고리 옵션 변경
        setCategoryOptions(
            categoryAllList.map((c) => ({
                ...c,
                label: c.catNm,
                value: String(c.catSeq),
            })),
        );
    }, [categoryAllList]);

    useEffect(() => {
        // 카테고리 리스트 value, label 셋팅
        let nl = [];
        if (agenda?.categoryList) {
            nl = agenda.categoryList.map((c) => ({
                ...c,
                label: c.catNm,
                value: String(c.catSeq),
            }));
        }
        setCts(nl);
    }, [agenda.categoryList]);

    return (
        <Form>
            {/* 사용여부, 최상단 여부 */}
            <Form.Row className="mb-2">
                <MokaInputLabel
                    label="사용 여부"
                    labelWidth={90}
                    className="mb-0 mr-2"
                    as="switch"
                    name="usedYn"
                    id="usedYn"
                    inputProps={{
                        custom: true,
                        checked: agenda.usedYn === 'Y',
                    }}
                    onChange={handleChangeValue}
                />
                <MokaInputLabel
                    label="최상단 여부"
                    labelWidth={90}
                    className="mb-0"
                    as="switch"
                    name="agndTop"
                    id="agndTop"
                    inputProps={{
                        custom: true,
                        checked: agenda.agndTop === 'Y',
                    }}
                    onChange={handleChangeValue}
                />
            </Form.Row>

            {/* 공개일, 타입 */}
            <Form.Row className="mb-2">
                <MokaInputLabel
                    label="공개일"
                    className="mr-2"
                    labelWidth={90}
                    as="dateTimePicker"
                    value={agenda.regDt}
                    inputProps={{ timeFormat: null }}
                    name="startDate"
                    onChange={() => {}}
                />
                <MokaInputLabel label="타입" className="mr-2" as="select" name="agndType" value={agenda.agndType} onChange={handleChangeValue}>
                    <option value="0">일반</option>
                    <option value="">그외</option>
                </MokaInputLabel>
            </Form.Row>

            {/* 기사화 단계, 관련기사 URL */}
            <Form.Row className="mb-2">
                <MokaInputLabel label="기사화 단계" labelWidth={90} className="mr-2" as="select" name="artProgress" value={agenda.artProgress} onChange={handleChangeValue}>
                    <option value="0">미노출</option>
                    <option value="1">의견수렴</option>
                    <option value="2">검토중</option>
                    <option value="3">취재중</option>
                    <option value="4">기사화</option>
                </MokaInputLabel>
                <MokaInputLabel label="관련기사 URL" labelWidth={90} className="flex-fill" name="artLink" value={agenda.artLink} onChange={handleChangeValue} />
            </Form.Row>

            {/* 카테고리 */}
            <MokaInputLabel
                label="카테고리"
                labelWidth={90}
                className="mb-2"
                as="autocomplete"
                name="category"
                value={cts}
                inputProps={{ options: categoryOptions, isMulti: true, maxMenuHeight: 250 }}
                onChange={handleChangeCategory}
            />

            {/* 아젠다키워드 */}
            <MokaInputLabel label="아젠다" labelWidth={90} className="mb-1" name="agndKwd" value={agenda.agndKwd} onChange={handleChangeValue} />
            <div className="d-flex mb-2">
                <MokaInputLabel label=" " labelWidth={90} as="none" className="mb-0" />
                <p className="mb-0 color-secondary">※ 예) 가계부채</p>
            </div>

            {/* 아젠다 제목 */}
            <MokaInputLabel label="아젠다 제목" labelWidth={90} className="mb-1" name="agndTitle" value={agenda.agndTitle} onChange={handleChangeValue} />
            <div className="d-flex mb-2">
                <MokaInputLabel label=" " labelWidth={90} as="none" />
                <p className="mb-0 color-secondary">※ 예) # 가계부채에 대한 # 당신의 생각은 어떠신가요?</p>
            </div>

            {/* 아젠다 본문 */}
            <MokaInputLabel
                label="아젠다 본문"
                labelWidth={90}
                className="mb-2"
                as="textarea"
                inputClassName="resize-none custom-scroll"
                inputProps={{ rows: 3 }}
                name="agndMemo"
                value={agenda.agndMemo}
                onChange={handleChangeValue}
            />

            {/* 아젠다 코멘트 */}
            <MokaInputLabel
                label="아젠다 코멘트"
                labelWidth={90}
                className="mb-2"
                as="textarea"
                inputClassName="resize-none custom-scroll"
                inputProps={{ rows: 3 }}
                name="agndComment"
                value={agenda.agndComment}
                onChange={handleChangeValue}
            />

            {/* 아젠다 리드 */}
            <MokaInputLabel
                label="아젠다 리드"
                labelWidth={90}
                className="mb-2"
                as="textarea"
                inputClassName="resize-none custom-scroll"
                inputProps={{ rows: 3 }}
                name="agndLead"
                value={agenda.agndLead}
                onChange={handleChangeValue}
            />

            {/* 동영상 코드 */}
            <MokaInputLabel
                label="동영상\nHTML 코드"
                labelWidth={90}
                className="mb-2"
                as="textarea"
                inputClassName="resize-none custom-scroll"
                inputProps={{ rows: 3 }}
                name="agndMov"
                value={agenda.agndMov}
                onChange={handleChangeValue}
            />

            {/* 찬반 투표 */}
            <Form.Row className="mb-2">
                <MokaInputLabel label="찬반 투표" labelWidth={90} className="flex-fill mr-2" value={agenda.pollSeq} disabled />
                <Button variant="searching" className="flex-shrink-0" onClick={() => {}}>
                    투표 찾기
                </Button>
            </Form.Row>

            {/* 배경이미지(PC) */}
            <Form.Row className="mb-3">
                <Col className="p-0 mr-2">
                    <MokaInputLabel
                        as="imageFile"
                        labelWidth={90}
                        label={
                            <React.Fragment>
                                배경이미지
                                <br />
                                <span className="color-danger">PC (800*600px)</span>
                                <Button variant="positive" size="sm" className="mt-1">
                                    신규등록
                                </Button>
                            </React.Fragment>
                        }
                        className="mb-2"
                        inputProps={{ img: agenda.agndImg, width: 280, height: 170 }}
                    />
                </Col>
                <Col className="p-0">
                    <MokaInputLabel
                        as="imageFile"
                        labelWidth={90}
                        label={
                            <React.Fragment>
                                배경이미지
                                <br />
                                <span className="color-danger">M (600*500px)</span>
                                <Button variant="positive" size="sm" className="mt-1">
                                    신규등록
                                </Button>
                            </React.Fragment>
                        }
                        className="mb-2"
                        inputProps={{ img: agenda.agndImgMob, width: 280, height: 170 }}
                    />
                </Col>
            </Form.Row>

            {/* <Form.Row className="mb-3 align-items-center">
                    <MokaInputLabel
                        as="none"
                        label={
                            <>
                                관련 기사 1<br />
                                <Button variant="negative" size="sm" className="mb-1">
                                    삭제
                                </Button>
                            </>
                        }
                    />
                    <div>
                        <MokaImage img={temp.articleImg1} width={180} height={170} className="mb-1" />
                        <div className="d-flex justify-content-between">
                            <Button variant="positive" size="sm" onClick={handleClickThumbAdd}>
                                신규 등록
                            </Button>
                            <Button variant="negative" size="sm">
                                편집
                            </Button>
                        </div>
                    </div>
                    <div className="flex-fill">
                        <Form.Row>
                            <MokaInputLabel label="기사 아이디" className="mb-2" value={temp.articleId1} onChange={(e) => setTemp({ ...temp, articleId1: e.target.value })} />
                        </Form.Row>
                        <Form.Row>
                            <MokaInputLabel
                                label="제목"
                                className="mb-0 mr-2 flex-fill"
                                value={temp.articleTitle1}
                                onChange={(e) => setTemp({ ...temp, articleTitle1: e.target.value })}
                            />
                            <Button variant="searching" onClick={handleClickArticleSearch}>
                                기사 찾기
                            </Button>
                        </Form.Row>
                    </div>
                </Form.Row>
                <Form.Row className="mb-3 align-items-center">
                    <MokaInputLabel
                        as="none"
                        label={
                            <>
                                관련 기사 2<br />
                                <Button variant="negative" size="sm" className="mb-1">
                                    삭제
                                </Button>
                            </>
                        }
                    />
                    <div>
                        <MokaImage img={temp.articleImg2} width={180} height={170} className="mb-1" />
                        <div className="d-flex justify-content-between">
                            <Button variant="positive" size="sm" onClick={handleClickThumbAdd}>
                                신규 등록
                            </Button>
                            <Button variant="negative" size="sm">
                                편집
                            </Button>
                        </div>
                    </div>
                    <div className="flex-fill">
                        <Form.Row>
                            <MokaInputLabel label="기사 아이디" className="mb-2" value={temp.articleId2} onChange={(e) => setTemp({ ...temp, articleId2: e.target.value })} />
                        </Form.Row>
                        <Form.Row>
                            <MokaInputLabel
                                label="제목"
                                className="mb-0 mr-2 flex-fill"
                                value={temp.articleTitle2}
                                onChange={(e) => setTemp({ ...temp, articleTitle2: e.target.value })}
                            />
                            <Button variant="searching" onClick={handleClickArticleSearch}>
                                기사 찾기
                            </Button>
                        </Form.Row>
                    </div>
                </Form.Row>
                <Form.Row className="mb-3 align-items-center">
                    <MokaInputLabel
                        as="none"
                        label={
                            <>
                                관련 기사 3<br />
                                <Button variant="negative" size="sm" className="mb-1">
                                    삭제
                                </Button>
                            </>
                        }
                    />
                    <div>
                        <MokaImage img={temp.articleImg3} width={180} height={170} className="mb-1" />
                        <div className="d-flex justify-content-between">
                            <Button variant="positive" size="sm" onClick={handleClickThumbAdd}>
                                신규 등록
                            </Button>
                            <Button variant="negative" size="sm">
                                편집
                            </Button>
                        </div>
                    </div>
                    <div className="flex-fill">
                        <Form.Row>
                            <MokaInputLabel label="기사 아이디" className="mb-2" value={temp.articleId3} onChange={(e) => setTemp({ ...temp, articleId3: e.target.value })} />
                        </Form.Row>
                        <Form.Row>
                            <MokaInputLabel
                                label="제목"
                                className="mb-0 mr-2 flex-fill"
                                value={temp.articleTitle3}
                                onChange={(e) => setTemp({ ...temp, articleTitle3: e.target.value })}
                            />
                            <Button variant="searching" onClick={handleClickArticleSearch}>
                                기사 찾기
                            </Button>
                        </Form.Row>
                    </div>
                </Form.Row>
                <Form.Row className="mb-3 align-items-center">
                    <MokaInputLabel
                        as="none"
                        label={
                            <>
                                관련 기사 4<br />
                                <Button variant="negative" size="sm" className="mb-1">
                                    삭제
                                </Button>
                            </>
                        }
                    />
                    <div>
                        <MokaImage img={temp.articleImg4} width={180} height={170} className="mb-1" />
                        <div className="d-flex justify-content-between">
                            <Button variant="positive" size="sm" onClick={handleClickThumbAdd}>
                                신규 등록
                            </Button>
                            <Button variant="negative" size="sm">
                                편집
                            </Button>
                        </div>
                    </div>
                    <div className="flex-fill">
                        <Form.Row>
                            <MokaInputLabel label="기사 아이디" className="mb-2" value={temp.articleId4} onChange={(e) => setTemp({ ...temp, articleId4: e.target.value })} />
                        </Form.Row>
                        <Form.Row>
                            <MokaInputLabel
                                label="제목"
                                className="mb-0 mr-2 flex-fill"
                                value={temp.articleTitle4}
                                onChange={(e) => setTemp({ ...temp, articleTitle4: e.target.value })}
                            />
                            <Button variant="searching" onClick={handleClickArticleSearch}>
                                기사 찾기
                            </Button>
                        </Form.Row>
                    </div>
                </Form.Row> */}
        </Form>
    );
};

export default MicAgendaForm;
