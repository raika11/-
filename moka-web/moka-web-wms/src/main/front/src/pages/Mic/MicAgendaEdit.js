import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaImage, MokaInputLabel } from '@/components';
import ArticleListModal from '@pages/Article/modals/ArticleListModal';

export const options = [
    { value: 'test1', label: '정치' },
    { value: 'test2', label: '사회' },
    { value: 'test3', label: '경제' },
];

const MicAgendaEdit = () => {
    const [temp, setTemp] = useState({});
    const [defaultValue, setDefaultValue] = useState(null);
    const [categoryList, setCategoryList] = useState([]);
    const [showAsModal, setShowAsModal] = useState(false);
    // const handleChangeCategory = (list) => {
    //     let result = [];
    //     if (list) {
    //         result = list.map((c) => c.value);
    //     }
    //     setCategoryList(result);
    // };
    const handleClickSave = () => {};
    const handleClickCancel = () => {};
    const handleClickDelete = () => {};
    const handleClickVote = () => {};
    const handleClickArticleSearch = () => {
        setShowAsModal(true);
    };

    useEffect(() => {
        let cts = [];
        let values = categoryList
            .join(',')
            .split(',')
            .filter((val) => val !== '');
        values.forEach((val) => {
            const ct = options.find((ct) => ct.value === val);
            if (ct) cts.push(ct);
        });
        setDefaultValue(cts);
    }, [categoryList]);

    return (
        <MokaCard
            title="아젠다 수정"
            titleClassName="mb-0"
            className="w-100"
            footerClassName="justify-content-center"
            footer
            footerButtons={[
                { text: '수정', variant: 'positive', className: 'mr-2', onClick: handleClickSave },
                { text: '취소', variant: 'negative', className: 'mr-2', onClick: handleClickCancel },
                { text: '삭제', variant: 'negative', onClick: handleClickDelete },
            ]}
        >
            <Form>
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="사용 여부"
                        labelClassName="d-flex justify-content-end"
                        className="mb-0 mr-2"
                        as="switch"
                        name="usedYn"
                        id="switch-usedYn"
                        inputProps={{
                            custom: true,
                            checked: temp.usedYn === 'Y',
                        }}
                        onChange={
                            (e) => setTemp({ ...temp, usedYn: e.target.checked ? 'Y' : 'N' })
                            // handleChangeValue
                        }
                    />
                    <MokaInputLabel
                        label="최상단 여부"
                        labelClassName="d-flex justify-content-end"
                        className="mb-0"
                        as="switch"
                        name="menu"
                        id="switch-menu"
                        inputProps={{
                            custom: true,
                            checked: temp.menu === 'Y',
                        }}
                        onChange={
                            (e) => setTemp({ ...temp, menu: e.target.checked ? 'Y' : 'N' })
                            // handleChangeValue
                        }
                    />
                </Form.Row>
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="공개일"
                        labelClassName="d-flex justify-content-end"
                        className="mb-0 mr-2"
                        inputClassName=""
                        as="dateTimePicker"
                        value={temp.openDate}
                        inputProps={{ timeFormat: null }}
                        name="startDate"
                        onChange={(date) => {
                            if (typeof date === 'object') {
                                setTemp({ ...temp, openDate: date });
                            } else {
                                setTemp({ ...temp, openDate: null });
                            }
                            // handleChangeValue
                        }}
                    />
                    <MokaInputLabel
                        label="타입"
                        labelClassName="d-flex justify-content-end"
                        className="mb-0 mr-2"
                        as="select"
                        name="type"
                        value={temp.type}
                        onChange={(e) => setTemp({ ...temp, type: e.target.value })}
                    >
                        <option value="0">일반</option>
                    </MokaInputLabel>
                </Form.Row>
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="기사화 단계"
                        labelClassName="d-flex justify-content-end"
                        className="mb-0 mr-2"
                        as="select"
                        name="step"
                        value={temp.step}
                        onChange={(e) => setTemp({ ...temp, step: e.target.value })}
                    >
                        <option value="0">미노출</option>
                        <option value="1">의견수렴</option>
                        <option value="2">검토중</option>
                        <option value="3">취재중</option>
                        <option value="4">기사화</option>
                    </MokaInputLabel>
                    <MokaInputLabel
                        label="관련기사 URL"
                        labelClassName="d-flex justify-content-end"
                        className="mb-0"
                        name="articleUrl"
                        value={temp.articleUrl}
                        onChange={(e) => setTemp({ ...temp, articleUrl: e.target.value })}
                    />
                </Form.Row>
                <MokaInputLabel
                    label="카테고리"
                    labelClassName="d-flex justify-content-end"
                    className="mb-2"
                    as="autocomplete"
                    name="category"
                    value={defaultValue}
                    inputProps={{ options: options, isMulti: true, maxMenuHeight: 150 }}
                    onChange={(ct) => {
                        console.log(ct);
                        let result = [];
                        if (ct) {
                            result = ct.map((ct) => ct.value);
                        }
                        setCategoryList(result);
                    }}
                />
                <MokaInputLabel
                    label="아젠다"
                    labelClassName="d-flex justify-content-end"
                    className="mb-1"
                    name="agenda"
                    value={temp.agenda}
                    onChange={(e) => setTemp({ ...temp, agenda: e.target.value })}
                />
                <div className="d-flex mb-2">
                    <MokaInputLabel label=" " as="none" className="mb-0" />
                    <p className="mb-0 ft-12 color-secondary">※ 예) 가계부채</p>
                </div>
                <MokaInputLabel
                    label="아젠다 제목"
                    labelClassName="d-flex justify-content-end"
                    className="mb-1"
                    name="agendaTitle"
                    value={temp.agendaTitle}
                    onChange={(e) => setTemp({ ...temp, agendaTitle: e.target.value })}
                />
                <div className="d-flex mb-2">
                    <MokaInputLabel label=" " as="none" />
                    <p className="mb-0 ft-12 color-secondary">※ 예) # 가계부채에 대한 # 당신의 생각은 어떠신가요?</p>
                </div>
                <MokaInputLabel
                    label="아젠다 본문"
                    labelClassName="d-flex justify-content-end"
                    className="mb-2"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 3 }}
                    name="agendaContent"
                    value={temp.agendaContent}
                    onChange={(e) => setTemp({ ...temp, agendaContent: e.target.value })}
                    // isInvalid={}
                />
                <MokaInputLabel
                    label="아젠다 코멘트"
                    labelClassName="d-flex justify-content-end"
                    className="mb-2"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 3 }}
                    name="agendaComent"
                    value={temp.agendaComent}
                    onChange={(e) => setTemp({ ...temp, agendaComent: e.target.value })}
                    // isInvalid={}
                />
                <MokaInputLabel
                    label="아젠다 리드"
                    labelClassName="d-flex justify-content-end"
                    className="mb-2"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 3 }}
                    name="agendaLead"
                    value={temp.agendaLead}
                    onChange={(e) => setTemp({ ...temp, agendaLead: e.target.value })}
                    // isInvalid={}
                />
                <MokaInputLabel
                    label="동영상 HTML 코드"
                    labelClassName="d-flex justify-content-end"
                    className="mb-2"
                    as="textarea"
                    inputClassName="resize-none"
                    inputProps={{ rows: 3 }}
                    name="videoHtml"
                    value={temp.videoHtml}
                    onChange={(e) => setTemp({ ...temp, videoHtml: e.target.value })}
                    // isInvalid={}
                />
                <Form.Row className="mb-3">
                    <MokaInputLabel
                        label="찬반 투표"
                        labelClassName="d-flex justify-content-end"
                        className="mb-0 mr-2"
                        name="vote"
                        value={temp.vote}
                        onChange={(e) => setTemp({ ...temp, vote: e.target.value })}
                        // isInvalid={}
                    />
                    <Button variant="searching" onClick={handleClickVote}>
                        투표 찾기
                    </Button>
                </Form.Row>
                <Form.Row className="mb-3">
                    <Col className="p-0 mr-2">
                        <div className="d-flex">
                            <MokaInputLabel label="배경이미지(PC)\n(800*600)" labelClassName="d-flex justify-content-end" className="mb-0" as="none" />
                            <div className="d-flex flex-column">
                                <MokaImage img={temp.pcImg} width={280} height={170} className="mb-1" />
                                <div className="d-flex justify-content-between">
                                    <Button variant="positive">신규 등록</Button>
                                    <Button variant="negative">삭제</Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="p-0">
                        <div className="d-flex">
                            <MokaInputLabel label="배경이미지(모바일)\n(600*500)" labelClassName="d-flex justify-content-end" className="mb-0" as="none" />
                            <div className="d-flex flex-column">
                                <MokaImage img={temp.mobileImg} width={280} height={170} className="mb-1" />
                                <div className="d-flex justify-content-between">
                                    <Button variant="positive">신규 등록</Button>
                                    <Button variant="negative">삭제</Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-3 align-items-center">
                    <div className="d-flex flex-column align-items-center">
                        <MokaInputLabel label="관련 기사 1" labelClassName="d-flex justify-content-end" className="mb-2" as="none" />
                        <Button variant="negative" style={{ width: 66 }}>
                            삭제
                        </Button>
                    </div>
                    <div>
                        <MokaImage img={temp.articleImg1} width={180} height={170} className="mb-1" />
                        <div className="d-flex justify-content-between">
                            <Button variant="positive" size="sm">
                                신규 등록
                            </Button>
                            <Button variant="negative" size="sm">
                                편집
                            </Button>
                        </div>
                    </div>
                    <div className="flex-fill">
                        <Form.Row>
                            <MokaInputLabel
                                label="기사 아이디"
                                labelClassName="d-flex justify-content-end"
                                className="mb-2"
                                value={temp.articleId1}
                                onChange={(e) => setTemp({ ...temp, articleId1: e.target.value })}
                            />
                        </Form.Row>
                        <Form.Row>
                            <MokaInputLabel
                                label="제목"
                                labelClassName="d-flex justify-content-end"
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
                    <div className="d-flex flex-column align-items-center">
                        <MokaInputLabel label="관련 기사 1" labelClassName="d-flex justify-content-end" className="mb-2" as="none" />
                        <Button variant="negative" style={{ width: 66 }}>
                            삭제
                        </Button>
                    </div>
                    <div>
                        <MokaImage img={temp.articleImg2} width={180} height={170} className="mb-1" />
                        <div className="d-flex justify-content-between">
                            <Button variant="positive" size="sm">
                                신규 등록
                            </Button>
                            <Button variant="negative" size="sm">
                                편집
                            </Button>
                        </div>
                    </div>
                    <div className="flex-fill">
                        <Form.Row>
                            <MokaInputLabel
                                label="기사 아이디"
                                labelClassName="d-flex justify-content-end"
                                className="mb-2"
                                value={temp.articleId2}
                                onChange={(e) => setTemp({ ...temp, articleId2: e.target.value })}
                            />
                        </Form.Row>
                        <Form.Row>
                            <MokaInputLabel
                                label="제목"
                                labelClassName="d-flex justify-content-end"
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
                    <div className="d-flex flex-column align-items-center">
                        <MokaInputLabel label="관련 기사 1" labelClassName="d-flex justify-content-end" className="mb-2" as="none" />
                        <Button variant="negative" style={{ width: 66 }}>
                            삭제
                        </Button>
                    </div>
                    <div>
                        <MokaImage img={temp.articleImg3} width={180} height={170} className="mb-1" />
                        <div className="d-flex justify-content-between">
                            <Button variant="positive" size="sm">
                                신규 등록
                            </Button>
                            <Button variant="negative" size="sm">
                                편집
                            </Button>
                        </div>
                    </div>
                    <div className="flex-fill">
                        <Form.Row>
                            <MokaInputLabel
                                label="기사 아이디"
                                labelClassName="d-flex justify-content-end"
                                className="mb-2"
                                value={temp.articleId3}
                                onChange={(e) => setTemp({ ...temp, articleId3: e.target.value })}
                            />
                        </Form.Row>
                        <Form.Row>
                            <MokaInputLabel
                                label="제목"
                                labelClassName="d-flex justify-content-end"
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
                    <div className="d-flex flex-column align-items-center">
                        <MokaInputLabel label="관련 기사 1" labelClassName="d-flex justify-content-end" className="mb-2" as="none" />
                        <Button variant="negative" style={{ width: 66 }}>
                            삭제
                        </Button>
                    </div>
                    <div>
                        <MokaImage img={temp.articleImg4} width={180} height={170} className="mb-1" />
                        <div className="d-flex justify-content-between">
                            <Button variant="positive" size="sm">
                                신규 등록
                            </Button>
                            <Button variant="negative" size="sm">
                                편집
                            </Button>
                        </div>
                    </div>
                    <div className="flex-fill">
                        <Form.Row>
                            <MokaInputLabel
                                label="기사 아이디"
                                labelClassName="d-flex justify-content-end"
                                className="mb-2"
                                value={temp.articleId4}
                                onChange={(e) => setTemp({ ...temp, articleId4: e.target.value })}
                            />
                        </Form.Row>
                        <Form.Row>
                            <MokaInputLabel
                                label="제목"
                                labelClassName="d-flex justify-content-end"
                                className="mb-0 mr-2 flex-fill"
                                value={temp.articleTitle4}
                                onChange={(e) => setTemp({ ...temp, articleTitle4: e.target.value })}
                            />
                            <Button variant="searching" onClick={handleClickArticleSearch}>
                                기사 찾기
                            </Button>
                        </Form.Row>
                    </div>
                </Form.Row>
            </Form>
            <ArticleListModal show={showAsModal} onHide={() => setShowAsModal(false)} />
        </MokaCard>
    );
};

export default MicAgendaEdit;
