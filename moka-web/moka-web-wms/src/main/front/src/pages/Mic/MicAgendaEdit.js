import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaImage, MokaInputLabel } from '@/components';
import ImageUploadButton from './components/ImageUploadButton';
import RelationPollModal from '@pages/Survey/Poll/modals/RelationPollModal';
import ArticleListModal from '@pages/Article/modals/ArticleListModal';
import { EditThumbModal } from '@pages/Desking/modals';

const options = [
    { value: 'test1', label: '정치' },
    { value: 'test2', label: '사회' },
    { value: 'test3', label: '경제' },
];

const deskingData = {
    artType: 'B',
    bodyHead: null,
    componentSeq: 55,
    componentWorkSeq: 15583,
    contentId: '23854068',
    contentOrd: 1,
    contentOrdEx: '01',
    contentType: null,
    datasetSeq: 73,
    deskingPart: 'THUMB_FILE_NAME,TITLE_LOC,TITLE,SUB_TITLE,BODY_HEAD',
    deskingSeq: 7712,
    distDt: '2020-08-21 21:26:24',
    gridType: 'DESKING',
    iconFileName: null,
    irThumbFileName: 'https://stg-wimage.joongang.co.kr/1000/politics/202012/23854068_73_20201222154141.jpeg',
    lang: 'KR',
    linkTarget: null,
    linkUrl: null,
    nameplate: null,
    nameplateTarget: null,
    nameplateUrl: null,
    parentContentId: null,
    regDt: '2021-01-12 14:13:14',
    rel: false,
    relOrd: 1,
    relOrdEx: '',
    relSeqs: [77360],
    seq: 77359,
    sourceCode: '3',
    subTitle: null,
    thumbFileName: 'https://stg-wimage.joongang.co.kr/1000/politics/202012/23854068_73_20201222154141.jpeg',
    thumbHeight: 180,
    thumbSize: 50149,
    thumbWidth: 290,
    title: '檢, ‘공금으로 어록집 발간 의혹’ 이찬희 변협회장 불기소 처분',
    titleLoc: null,
    titlePrefix: null,
    titlePrefixLoc: null,
    titleSize: null,
    vodUrl: null,
};

const MicAgendaEdit = (props) => {
    const { seqNo } = useParams();
    const [temp, setTemp] = useState({});
    const [defaultValue, setDefaultValue] = useState(null);
    const [categoryList, setCategoryList] = useState([]);
    const [showPollModal, setShowPollModal] = useState(false);
    const [showAsModal, setShowAsModal] = useState(false);
    const [showEtModal, setShowEtModal] = useState(false);

    const handleClickSave = () => {};

    const handleClickCancel = () => {};

    const handleClickDelete = () => {};

    const handleClickPoll = () => {
        setShowPollModal(true);
    };

    const handleClickArticleSearch = () => {
        setShowAsModal(true);
    };

    const handleClickThumbAdd = () => {
        setShowEtModal(true);
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
            footerButtons={
                seqNo
                    ? [
                          { text: '수정', variant: 'positive', className: 'mr-2', onClick: handleClickSave },
                          { text: '취소', variant: 'negative', className: 'mr-2', onClick: handleClickCancel },
                          { text: '삭제', variant: 'negative', onClick: handleClickDelete },
                      ]
                    : [
                          { text: '저장', variant: 'positive', className: 'mr-2', onClick: handleClickSave },
                          { text: '취소', variant: 'negative', onClick: handleClickCancel },
                      ]
            }
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
                        className="mb-0 flex-fill"
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
                    <Col xs={6} className="p-0">
                        <MokaInputLabel
                            label="찬반 투표"
                            labelClassName="d-flex justify-content-end"
                            className="mb-0 mr-2"
                            name="vote"
                            value={temp.vote}
                            onChange={(e) => setTemp({ ...temp, vote: e.target.value })}
                            // isInvalid={}
                        />
                    </Col>
                    <Button variant="searching" onClick={handleClickPoll}>
                        투표 찾기
                    </Button>
                </Form.Row>
                <Form.Row className="mb-3">
                    <Col className="p-0 mr-2">
                        <div className="d-flex">
                            <MokaInputLabel label="배경이미지(PC)\n(800*600)" labelClassName="d-flex justify-content-end" className="mb-0" as="none" />
                            <div className="d-flex flex-column">
                                <MokaImage img={temp.pcImg} alt="배경이미지(PC) (800*600)" width={280} height={170} className="mb-1" size="sm" />
                                <div className="d-flex justify-content-between">
                                    <ImageUploadButton fileUrl={(url) => setTemp({ ...temp, pcImg: url })} />
                                    <Button variant="negative" size="sm">
                                        삭제
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="p-0">
                        <div className="d-flex">
                            <MokaInputLabel label="배경이미지(모바일)\n(600*500)" labelClassName="d-flex justify-content-end" className="mb-0" as="none" />
                            <div className="d-flex flex-column">
                                <MokaImage img={temp.mobileImg} alt="배경이미지(모바일) (600*500)" width={280} height={170} className="mb-1" />
                                <div className="d-flex justify-content-between">
                                    <ImageUploadButton fileUrl={(url) => setTemp({ ...temp, mobileImg: url })} size="sm" />
                                    <Button variant="negative" size="sm">
                                        삭제
                                    </Button>
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
                        <MokaInputLabel label="관련 기사 2" labelClassName="d-flex justify-content-end" className="mb-2" as="none" />
                        <Button variant="negative" style={{ width: 66 }}>
                            삭제
                        </Button>
                    </div>
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
                        <MokaInputLabel label="관련 기사 3" labelClassName="d-flex justify-content-end" className="mb-2" as="none" />
                        <Button variant="negative" style={{ width: 66 }}>
                            삭제
                        </Button>
                    </div>
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
                        <MokaInputLabel label="관련 기사 4" labelClassName="d-flex justify-content-end" className="mb-2" as="none" />
                        <Button variant="negative" style={{ width: 66 }}>
                            삭제
                        </Button>
                    </div>
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
            <RelationPollModal show={showPollModal} onHide={() => setShowPollModal(false)} />
            <ArticleListModal show={showAsModal} onHide={() => setShowAsModal(false)} />
            <EditThumbModal show={showEtModal} onHide={() => setShowEtModal(false)} deskingWorkData={deskingData} />
        </MokaCard>
    );
};

export default MicAgendaEdit;
