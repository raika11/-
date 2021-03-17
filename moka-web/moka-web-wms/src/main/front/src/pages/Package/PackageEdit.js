import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import produce from 'immer';
import { useHistory, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput, MokaInputLabel, MokaIcon } from '@/components';

const options = [
    { value: 'test1', label: '대통령 사면론' },
    { value: 'test2', label: '이명박' },
    { value: 'test3', label: '박근혜' },
];

const rnOptions = [
    { value: 'test1', label: '김이나' },
    { value: 'test2', label: '박수진' },
    { value: 'test3', label: '최우영' },
];

/**
 * 패키지 상세 정보
 */
const PackageEdit = () => {
    const history = useHistory();
    const { seqNo } = useParams();
    const [pkg, setPkg] = useState({
        expoYn: 'Y',
        expoImd: null,
        expoResrvDT: null,
        expoResrvTm: null,
        type: null,
        seasonOptions: {
            season1: false,
            season2: false,
            season3: false,
            articleCount1: '',
            articleCount2: '',
            articleCount3: '',
        },
        epiDiv: 'N',
        mark: 'once',
        subsYn: 'N',
        title: '',
        uploadType: 'local',
        img: '',
        desc: '',
        recomPkgYn: 'N',
        recomIssue: [],
        keywordYn: 'Y',
        searchOptions: {},
        kwStartDt: moment(),
        kwEndDt: null,
        kwSearch: 'Y',
        reporterYn: 'N',
        reporterOptions: [],
        // reporterStartDt: [],
        // reporterEndDt: [],
        // reporterSearch: [],
        sectionYn: 'N',
        sectionOptions: {},
        sectionStartDt: null,
        sectionEndDt: null,
        sectionSearch: null,
        specialYn: 'N',
        specialOptions: {},
        specialStartDt: null,
        specialEndDt: null,
        specialSearch: null,
        ovpYn: 'N',
        ovpOptions: {},
        ovpStartDt: null,
        ovpEndDt: null,
        ovpSearch: null,
    });
    const [keywordValue, setKeywordValue] = useState(null);
    const [sectionValue, setSectionValue] = useState(null);
    const [specialValue, setSpecialValue] = useState(null);
    const [ovpValue, setOvpValue] = useState(null);
    const [keywordList, setKeywordList] = useState([]);
    const [sectionKeywordList, setSectionkeywordList] = useState(keywordList);
    const [specialKeywordList, setSpecialKeywordList] = useState(keywordList);
    const [ovpKeywordList, setOvpKeywordList] = useState(keywordList);
    const [reporterList, setReporterList] = useState([]);
    const [reporterName, setReporterName] = useState(null);

    const handleClickCancel = () => {
        history.push('/package');
    };

    /**
     * input value
     */
    const handleChangeValue = useCallback(
        (e) => {
            const { name, value } = e.target;
            setPkg({ ...pkg, [name]: value });
        },
        [pkg],
    );

    /**
     * switch value
     */
    const handleChangeSwitch = useCallback(
        (e) => {
            const { name, checked } = e.target;
            setPkg({ ...pkg, [name]: checked ? 'Y' : 'N' });
        },
        [pkg],
    );

    /**
     * 기자 필드 셋팅
     */
    const resetReporterList = useCallback(() => {
        setReporterList([
            {
                reporterSearch: pkg.kwSearch,
                reporterStartDt: pkg.kwStartDt,
                reporterOptions: [],
                reporterEndDt: pkg.kwEndDt,
            },
        ]);
    }, [pkg.kwEndDt, pkg.kwSearch, pkg.kwStartDt]);

    /**
     * 기자 필드 값 변경
     * @param {object} e
     * @param {number} idx object 순서
     */
    const handleReporterList = (e, idx) => {
        // reporterSearch, reporterStartDt, reporterOptions, reporterEndDt
        const { name, checked } = e.target;
        setReporterList(
            produce(reporterList, (draft) => {
                if (name === 'reporterSearch') {
                    draft[idx].reporterSearch = checked ? 'Y' : 'N';
                }
                // else if (name === 'paramDesc') {
                //     draft[idx].desc = value;
                // }
            }),
        );
    };

    /**
     * 기자 검색 조건 추가
     */
    const handleClickAddReporter = () => {
        setReporterList(
            produce(reporterList, (draft) => {
                draft.push({
                    reporterSearch: reporterList[0].reporterSearch,
                    reporterStartDt: reporterList[0].reporterStartDt,
                    reporterOptions: reporterList[0].reporterOptions,
                    reporterEndDt: reporterList[0].reporterEndDt,
                });
            }),
        );
    };

    /**
     * 기자 검색 조건 삭제
     */
    const handleClickDeleteReporter = (e, idx) => {
        setReporterList(
            produce(reporterList, (draft) => {
                draft.splice(idx, 1);
            }),
        );
    };

    useEffect(() => {
        resetReporterList();
    }, [resetReporterList]);

    /**
     * 공통 검색 조건 셋팅
     */
    useEffect(() => {
        let stDt = pkg.kwStartDt,
            edDt = pkg.kwEndDt,
            scYn = pkg.kwSearch;

        if (stDt) {
            setPkg({ ...pkg, sectionStartDt: stDt, specialStartDt: stDt, ovpStartDt: stDt });
        }
        if (scYn) {
            setPkg({ ...pkg, sectionSearch: scYn, specialSearch: scYn, ovpSearch: scYn });
        }
        if (edDt) {
            setPkg({ ...pkg, sectionEndDt: edDt, specialEndDt: edDt, ovpEndDt: edDt });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pkg.kwStartDt, pkg.kwEndDt, pkg.kwSearch]);

    useEffect(() => {
        let cts = [];
        let values = keywordList
            .join(',')
            .split(',')
            .filter((val) => val !== '');
        values.forEach((val) => {
            const ct = options.find((ct) => ct.value === val);
            if (ct) cts.push(ct);
        });
        setKeywordValue(cts);
        // setSectionValue();
        // setSpecialValue();
        // setOvpValue();
    }, [keywordList]);

    return (
        <MokaCard
            title={seqNo ? '패키지 수정' : '패키지 생성'}
            className="w-100"
            footerClassName="justify-content-center"
            footer
            footerButtons={[
                { text: '종료', variant: 'negative', className: 'mr-1' },
                { text: seqNo ? '수정' : '생성', variant: 'positive', className: 'mr-1' },
                { text: '취소', variant: 'negative', onClick: handleClickCancel },
            ]}
        >
            <p className="mb-2">* 표시는 필수 입력 정보입니다.</p>
            <Form>
                <Form.Row className="mb-3 align-items-center">
                    <Col xs={3} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            id="package-expoYn-checkbox"
                            label="노출 여부"
                            name="expoYn"
                            inputProps={{ custom: true, checked: pkg.expoYn === 'Y' }}
                            onChange={handleChangeSwitch}
                            required
                        />
                    </Col>
                    <Col xs={9} className="p-0 d-flex">
                        <div style={{ width: 80 }} className="pr-3">
                            <MokaInput
                                as="radio"
                                id="package-imedi-radio"
                                value="Y"
                                inputProps={{ label: '즉시', custom: true, checked: pkg.expoImd === 'Y' }}
                                onChange={(e) => setPkg({ ...pkg, expoImd: e.target.value })}
                            />
                        </div>
                        <div style={{ width: 80 }} className="pr-1">
                            <MokaInput
                                as="radio"
                                id="package-reserved-radio"
                                value="N"
                                inputProps={{ label: '예약', custom: true, checked: pkg.expoImd === 'N' }}
                                onChange={(e) => setPkg({ ...pkg, expoImd: e.target.value })}
                            />
                        </div>
                        <div style={{ width: 150 }} className="pr-1">
                            <MokaInput
                                as="dateTimePicker"
                                name="expoResrvDT"
                                inputProps={{ timeFormat: null }}
                                value={pkg.expoResrvDT}
                                onChange={(date) => {
                                    if (typeof date === 'object') {
                                        setPkg({ ...pkg, expoResrvDT: date });
                                    } else if (date === '') {
                                        setPkg({ ...pkg, expoResrvDT: null });
                                    }
                                }}
                            />
                        </div>
                        <div style={{ width: 150 }}>
                            <MokaInput
                                as="dateTimePicker"
                                name="expoResrvTm"
                                inputProps={{ dateFormat: null }}
                                value={pkg.expoResrvTm}
                                onChange={(time) => {
                                    if (typeof time === 'object') {
                                        setPkg({ ...pkg, expoResrvTm: time });
                                    } else if (time === '') {
                                        setPkg({ ...pkg, expoResrvTm: null });
                                    }
                                }}
                            />
                        </div>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-3 align-items-center">
                    <Col xs={3} className="p-0">
                        <MokaInputLabel as="none" label="유형 선택" required />
                    </Col>
                    <Col xs={9} className="p-0 d-flex align-items-center">
                        <div style={{ width: 80 }} className="pr-3">
                            <MokaInput
                                as="radio"
                                id="package-topic-radio"
                                value="topic"
                                inputProps={{ label: '토픽', custom: true, checked: pkg.type === 'topic' }}
                                onChange={(e) => setPkg({ ...pkg, type: e.target.value })}
                            />
                        </div>
                        <div style={{ width: 80 }} className="pr-3">
                            <MokaInput
                                as="radio"
                                id="package-issue-radio"
                                value="issue"
                                inputProps={{ label: '이슈', custom: true, checked: pkg.type === 'issue' }}
                                onChange={(e) => setPkg({ ...pkg, type: e.target.value })}
                            />
                        </div>
                        <div style={{ width: 70 }}>
                            <MokaInput
                                as="radio"
                                id="package-series-radio"
                                value="series"
                                inputProps={{ label: '시리즈', custom: true, checked: pkg.type === 'series' }}
                                onChange={(e) => setPkg({ ...pkg, type: e.target.value })}
                            />
                        </div>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-3 align-items-center">
                    <Col xs={3} className="p-0 d-flex">
                        <MokaInputLabel as="none" label="시즌/회차\n표시" />
                        <div>
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <MokaInputLabel as="none" label="시즌" />
                            </div>
                            <div style={{ height: 31 }} className="d-flex align-items-center">
                                <MokaInputLabel as="none" label="회차" />
                            </div>
                        </div>
                    </Col>
                    <Col xs={9} className="p-0">
                        <div className="mb-3 d-flex align-items-center">
                            <div className="pr-3 d-flex align-items-center">
                                <MokaInput
                                    as="checkbox"
                                    className="pr-1"
                                    id="package-season1-checkbox"
                                    inputProps={{ label: '시즌1', custom: true, checked: pkg.seasonOptions['season1'] === true }}
                                    onChange={(e) => setPkg({ ...pkg, seasonOptions: { ...pkg.seasonOptions, season1: e.target.checked } })}
                                />
                                <div style={{ width: 60 }}>
                                    <MokaInput
                                        value={pkg.seasonOptions.articleCount1}
                                        onChange={(e) => setPkg({ ...pkg, seasonOptions: { ...pkg.seasonOptions, articleCount1: e.target.value } })}
                                    />
                                </div>
                            </div>
                            <div className="pr-3 d-flex align-items-center">
                                <MokaInput
                                    as="checkbox"
                                    className="pr-1"
                                    id="package-season2-checkbox"
                                    inputProps={{ label: '시즌2', custom: true, checked: pkg.seasonOptions['season2'] === true }}
                                    onChange={(e) => setPkg({ ...pkg, seasonOptions: { ...pkg.seasonOptions, season2: e.target.checked } })}
                                />
                                <div style={{ width: 60 }}>
                                    <MokaInput
                                        value={pkg.seasonOptions.articleCount2}
                                        onChange={(e) => setPkg({ ...pkg, seasonOptions: { ...pkg.seasonOptions, articleCount2: e.target.value } })}
                                    />
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <MokaInput
                                    as="checkbox"
                                    className="pr-1"
                                    id="package-season3-checkbox"
                                    inputProps={{ label: '시즌3', custom: true, checked: pkg.seasonOptions['season3'] === true }}
                                    onChange={(e) => setPkg({ ...pkg, seasonOptions: { ...pkg.seasonOptions, season3: e.target.checked } })}
                                />
                                <div style={{ width: 60 }}>
                                    <MokaInput
                                        value={pkg.seasonOptions.articleCount3}
                                        onChange={(e) => setPkg({ ...pkg, seasonOptions: { ...pkg.seasonOptions, articleCount3: e.target.value } })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <div style={{ width: 100 }} className="pr-3">
                                <MokaInput
                                    as="checkbox"
                                    id="package-epiDiv-checkbox"
                                    name="epiDiv"
                                    inputProps={{ label: '회차 표시', custom: true, checked: pkg.epiDiv === 'Y' }}
                                    onChange={(e) => setPkg({ ...pkg, epiDiv: e.target.checked ? 'Y' : 'N' })}
                                />
                            </div>
                            <div style={{ width: 150 }}>
                                <MokaInput as="select" className="ft-12" value={pkg.mark} onChange={handleChangeValue}>
                                    <option value="once">1회 → 2회 → ..</option>
                                    <option value="prologue">프롤로그 → 1회 → ..</option>
                                </MokaInput>
                            </div>
                        </div>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-3 align-items-center">
                    <Col xs={3} className="p-0">
                        <MokaInputLabel as="none" label="카테고리 선택(N개)" required />
                    </Col>
                    <Col xs={9} className="p-0">
                        <Button variant="outline-neutral">카테고리 선택</Button>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-3 align-items-center">
                    <Col xs={3} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            id="package-subsYn-switch"
                            name="subsYn"
                            label="구독 가능 여부"
                            inputProps={{ custom: true, checked: pkg.subsYn === 'Y' }}
                            onChange={handleChangeSwitch}
                            required
                        />
                    </Col>
                    <Col xs={9} className="p-0">
                        <p className="mb-0">※ 구독 상품으로 등록되면, 구독 상품명이 자동으로 노출됩니다.</p>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-3 align-items-center">
                    <Col xs={3} className="p-0">
                        <MokaInputLabel as="none" label="패키지명" required />
                        <p className="mb-0 color-primary ft-12">※ 중복 등록 불가/수정 불가</p>
                    </Col>
                    <Col xs={9} className="p-0 d-flex">
                        <MokaInput name="title" className="mr-2" value={pkg.title} onChange={handleChangeValue} />
                        <Button variant="outline-neutral" style={{ width: 100, height: 31 }}>
                            중복 확인
                        </Button>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-3 align-items-center">
                    <Col xs={3} className="p-0">
                        <MokaInputLabel as="none" label="패키지 설명" />
                    </Col>
                    <Col xs={9} className="p-0">
                        <MokaInput name="desc" value={pkg.desc} onChange={handleChangeValue} />
                        <p className="mb-0">※ 이슈에 대한 간단한 설명과 키워드를 입력해주세요.</p>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-3 align-items-start" style={{ height: 250 }}>
                    <Col xs={3} className="p-0 h-100 d-flex align-items-center">
                        <div>
                            <MokaInputLabel as="none" label="이미지" required />
                            <p className="mb-0">가이드 보기 →</p>
                            <p className="mb-0">이용 영역</p>
                            <p className="mb-0">① 패키지 페이지 상단</p>
                            <p className="mb-0">② 패키지 페이지 공유</p>
                        </div>
                    </Col>
                    <Col xs={9} className="p-0 d-flex">
                        <div style={{ width: 180 }} className="pr-3">
                            <MokaInput as="select" className="ft-12" name="uploadType" value={pkg.uploadType} onChange={handleChangeValue}>
                                <option value="local">직접 등록</option>
                            </MokaInput>
                        </div>
                        <MokaInput name="img" className="mr-2" value={pkg.img} onChange={handleChangeValue} />
                        <Button variant="outline-neutral" style={{ width: 120 }}>
                            불러오기
                        </Button>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-3">
                    <Col xs={3} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            id="package-recomPkgYn-switch"
                            name="recomPkgYn"
                            label="추천 패키지(N개)"
                            inputProps={{ custom: true, checked: pkg.recomPkgYn === 'Y' }}
                            onChange={handleChangeSwitch}
                        />
                    </Col>
                    <Col xs={9} className="p-0 d-flex">
                        <MokaInput className="mr-2" value={pkg.recomIssue} inputProps={{ readOnly: true }} />
                        <Button variant="outline-neutral">추천 이슈 선택</Button>
                    </Col>
                </Form.Row>
                {/* 공통 검색어 */}
                <Form.Row className="mb-3">
                    <Col xs={3} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            name="keywordYn"
                            id="package-keywordYn-switch"
                            label="검색어"
                            inputProps={{ custom: true, checked: pkg.keywordYn === 'Y' }}
                            onChange={handleChangeSwitch}
                        />
                    </Col>
                </Form.Row>
                {pkg.keywordYn === 'Y' && (
                    <Form.Row className="mb-3">
                        <Col xs={3} className="p-0">
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <MokaInputLabel as="none" label="검색 범위" />
                            </div>
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <MokaInputLabel as="none" label="검색 기간" />
                            </div>
                            <MokaInputLabel
                                as="switch"
                                id="package-kwSearch-switch"
                                label="검색어(N개)"
                                name="kwSearch"
                                inputProps={{ custom: true, checked: pkg.kwSearch === 'Y' }}
                                onChange={handleChangeSwitch}
                            />
                        </Col>
                        <Col xs={9} className="p-0">
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <div style={{ width: 80 }} className="pr-3">
                                    <MokaInput
                                        as="checkbox"
                                        id="package-searchTitle-checkbox"
                                        inputProps={{ label: '제목', custom: true, checked: pkg.searchOptions['title'] || false }}
                                        onChange={(e) => setPkg({ ...pkg, searchOptions: { ...pkg.searchOptions, title: e.target.checked } })}
                                    />
                                </div>
                                <div style={{ width: 80 }}>
                                    <MokaInput
                                        as="checkbox"
                                        id="package-searchTag-checkbox"
                                        inputProps={{ label: '태그', custom: true, checked: pkg.searchOptions['tag'] || false }}
                                        onChange={(e) => setPkg({ ...pkg, searchOptions: { ...pkg.searchOptions, tag: e.target.checked } })}
                                    />
                                </div>
                            </div>
                            <div className="mb-3 d-flex align-items-center">
                                <div style={{ width: 228 }} className="pr-3">
                                    <MokaInputLabel
                                        as="dateTimePicker"
                                        label="시작"
                                        name="kwStartDt"
                                        inputProps={{ timeFormat: null }}
                                        value={pkg.kwStartDt}
                                        onChange={(date) => {
                                            let dt = date;
                                            if (typeof date === 'object') {
                                                setPkg({ ...pkg, kwStartDt: dt, sectionStartDt: dt, specialStartDt: dt, ovpStartDt: dt });
                                            } else if (date === '') {
                                                setPkg({ ...pkg, kwStartDt: null, sectionStartDt: null, specialStartDt: null, ovpStartDt: null });
                                            }
                                        }}
                                        required
                                    />
                                </div>
                                <div style={{ width: 80 }} className="pr-1">
                                    <MokaInput
                                        as="checkbox"
                                        id="package-kwEndYn-checkbox"
                                        inputProps={{ label: '종료', custom: true, checked: pkg.searchOptions['kwEndYn'] || false }}
                                        onChange={(e) => setPkg({ ...pkg, searchOptions: { ...pkg.searchOptions, kwEndYn: e.target.checked } })}
                                    />
                                </div>
                                <div style={{ width: 150 }}>
                                    <MokaInput
                                        as="dateTimePicker"
                                        name="kwEndDt"
                                        alue={pkg.kwEndDt}
                                        inputProps={{ timeFormat: null }}
                                        onChange={(date) => {
                                            let dt = date;
                                            if (typeof date === 'object') {
                                                setPkg({ ...pkg, kwEndDt: dt, sectionEndDt: dt, specialEndDt: dt, ovpEndDt: dt });
                                            } else if (date === '') {
                                                setPkg({ ...pkg, kwEndDt: null, sectionEndDt: null, specialEndDt: null, ovpEndDt: null });
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <MokaInput
                                as="autocomplete"
                                name="keywords"
                                value={keywordValue}
                                inputProps={{ options: options, isMulti: true, maxMenuHeight: 150 }}
                                onChange={(ct) => {
                                    let result = [];
                                    if (ct) {
                                        result = ct.map((ct) => ct.value);
                                    }
                                    setKeywordList(result);
                                }}
                            />
                        </Col>
                    </Form.Row>
                )}
                <Form.Row className="mb-3">
                    <Col xs={12} className="p-0 d-flex justify-content-between">
                        <MokaInputLabel
                            as="switch"
                            label="기자"
                            id="package-reporterYn-switch"
                            name="reporterYn"
                            inputProps={{ custom: true, checked: pkg.reporterYn === 'Y' }}
                            onChange={handleChangeSwitch}
                        />
                        <Button variant="positive" onClick={handleClickAddReporter}>
                            추가
                        </Button>
                    </Col>
                </Form.Row>
                {pkg.reporterYn === 'Y' && (
                    <>
                        <Form.Row className="mb-3">
                            <Col xs={3} className="p-0 d-flex align-items-center">
                                <MokaInputLabel as="none" label="검색 범위" />
                            </Col>
                            <Col xs={9} className="p-0 d-flex align-items-center">
                                <p style={{ width: 130 }} className="mb-0 pr-3">
                                    기자명(default)
                                </p>
                                <div style={{ width: 80 }} className="pr-3">
                                    <MokaInput
                                        as="checkbox"
                                        id="package-reporterTitle-checkbox"
                                        inputProps={{ label: '제목', custom: true, checked: pkg.reporterOptions['title'] || false }}
                                        onChange={(e) => setPkg({ ...pkg, reporterOptions: { ...pkg.reporterOptions, title: e.target.checked } })}
                                    />
                                </div>
                                <div style={{ width: 80 }}>
                                    <MokaInput
                                        as="checkbox"
                                        id="package-reporterTag-checkbox"
                                        inputProps={{ label: '태그', custom: true, checked: pkg.reporterOptions['tag'] }}
                                        onChange={(e) => setPkg({ ...pkg, reporterOptions: { ...pkg.reporterOptions, tag: e.target.checked } })}
                                    />
                                </div>
                            </Col>
                        </Form.Row>
                        {reporterList.map(({ reporterSearch, reporterStartDt, reporterOptions, reporterEndDt }, idx) => (
                            <Form.Row className="mb-3" key={idx}>
                                <Col xs={3} className="p-0 d-flex">
                                    <div style={{ width: 30 }} className="d-flex flex-column justify-content-center align-items-center">
                                        <p className="mb-0">{idx + 1}</p>
                                        <Button variant="white" className="px-05" onClick={handleClickDeleteReporter}>
                                            <MokaIcon iconName="fal-trash-alt" />
                                        </Button>
                                    </div>
                                    <div>
                                        <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                            <MokaInputLabel as="none" label="검색 기간" />
                                        </div>
                                        <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                            <MokaInputLabel as="none" label="기자명" />
                                        </div>
                                        <MokaInputLabel
                                            as="switch"
                                            id={`package-reporterSearch-switch${idx + 1}`}
                                            name="reporterSearch"
                                            label="검색어(N개)"
                                            inputProps={{ custom: true, checked: reporterSearch === 'Y' }}
                                            onChange={(e) => handleReporterList(e, idx)}
                                        />
                                    </div>
                                </Col>
                                <Col xs={9} className="p-0">
                                    <div className="mb-3 d-flex align-items-center">
                                        <div style={{ width: 228 }} className="pr-3 d-flex align-items-center">
                                            <MokaInputLabel
                                                as="dateTimePicker"
                                                label="시작"
                                                name="reporterStartDt"
                                                inputProps={{ timeFormat: null }}
                                                value={reporterStartDt}
                                                onChange={(date) => {
                                                    if (typeof date === 'object') {
                                                        produce(reporterList, (draft) => {
                                                            draft[idx].reporterStartDt = date;
                                                        });
                                                    } else if (date === '') {
                                                        produce(reporterList, (draft) => {
                                                            draft[idx].reporterStartDt = null;
                                                        });
                                                    }
                                                }}
                                                required
                                            />
                                        </div>
                                        <div style={{ width: 80 }} className="pr-1">
                                            <MokaInput
                                                as="checkbox"
                                                inputProps={{ label: '종료', custom: true, checked: reporterOptions['reporterEndYn'] || false }}
                                                onChange={(e) => {
                                                    produce(reporterList, (draft) => {
                                                        draft[idx].reporterOptions.reporterEndYn = e.target.checked;
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div style={{ width: 150 }}>
                                            <MokaInput
                                                as="dateTimePicker"
                                                value={reporterEndDt}
                                                inputProps={{ timeFormat: null }}
                                                onChange={(date) => {
                                                    if (typeof date === 'object') {
                                                        produce(reporterList, (draft) => {
                                                            draft[idx].reporterEndDt = date;
                                                        });
                                                    } else if (date === '') {
                                                        produce(reporterList, (draft) => {
                                                            draft[idx].reporterEndDt = null;
                                                        });
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <MokaInput
                                        as="autocomplete"
                                        name="reporterName"
                                        className="mb-3"
                                        value={reporterName}
                                        inputProps={{ options: rnOptions, isMulti: false, maxMenuHeight: 150 }}
                                        onChange={(rn) => setReporterName(rn)}
                                    />
                                    <MokaInput
                                        as="autocomplete"
                                        name="keywords"
                                        value={keywordValue}
                                        inputProps={{ options: options, isMulti: true, maxMenuHeight: 150 }}
                                        onChange={(ct) => {
                                            let result = [];
                                            if (ct) {
                                                result = ct.map((ct) => ct.value);
                                            }
                                            setKeywordList(result);
                                        }}
                                    />
                                </Col>
                            </Form.Row>
                        ))}
                    </>
                )}
                {/* 섹션 */}
                <Form.Row className="mb-3">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            label="섹션"
                            id="package-sectionYn-switch"
                            name="sectionYn"
                            inputProps={{ custom: true, checked: pkg.sectionYn === 'Y' }}
                            onChange={handleChangeSwitch}
                        />
                    </Col>
                </Form.Row>
                {pkg.sectionYn === 'Y' && (
                    <Form.Row className="mb-3">
                        <Col xs={3} className="p-0">
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <MokaInputLabel as="none" label="검색 범위" />
                            </div>
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <MokaInputLabel as="none" label="검색 기간" />
                            </div>
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <MokaInputLabel as="none" label="대상 섹션" />
                            </div>
                            <MokaInputLabel
                                as="switch"
                                id="package-sectionSearch-switch"
                                name="sectionSearch"
                                label="검색어(N개)"
                                inputProps={{ custom: true, checked: pkg.sectionSearch === 'Y' }}
                                onChange={handleChangeSwitch}
                            />
                        </Col>
                        <Col xs={9} className="p-0">
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <div style={{ width: 80 }} className="pr-3">
                                    <MokaInput
                                        as="checkbox"
                                        id="package-sectionTitle-checkbox"
                                        inputProps={{ label: '제목', custom: true, checked: pkg.sectionOptions['title'] || false }}
                                        onChange={(e) => setPkg({ ...pkg, sectionOptions: { ...pkg.sectionOptions, title: e.target.checked } })}
                                    />
                                </div>
                                <div style={{ width: 80 }}>
                                    <MokaInput
                                        as="checkbox"
                                        id="package-sectionTag-checkbox"
                                        inputProps={{ label: '태그', custom: true, checked: pkg.sectionOptions['tag'] }}
                                        onChange={(e) => setPkg({ ...pkg, sectionOptions: { ...pkg.sectionOptions, tag: e.target.checked } })}
                                    />
                                </div>
                            </div>
                            <div className="mb-3 d-flex align-items-center">
                                <div style={{ width: 228 }} className="pr-3 d-flex align-items-center">
                                    <MokaInputLabel
                                        as="dateTimePicker"
                                        label="시작"
                                        name="sectionStartDt"
                                        inputProps={{ timeFormat: null }}
                                        value={pkg.sectionStartDt}
                                        onChange={(date) => {
                                            if (typeof date === 'object') {
                                                setPkg({ ...pkg, sectionStartDt: date });
                                            } else if (date === '') {
                                                setPkg({ ...pkg, sectionStartDt: null });
                                            }
                                        }}
                                        required
                                    />
                                </div>
                                <div style={{ width: 80 }} className="pr-1">
                                    <MokaInput
                                        as="checkbox"
                                        inputProps={{ label: '종료', custom: true, checked: pkg.sectionOptions['sectionEndYn'] || false }}
                                        onChange={(e) => setPkg({ ...pkg, sectionOptions: { ...pkg.sectionOptions, sectionEndYn: e.target.checked } })}
                                    />
                                </div>
                                <div style={{ width: 150 }}>
                                    <MokaInput
                                        as="dateTimePicker"
                                        name="sectionEndDt"
                                        value={pkg.sectionEndDt}
                                        inputProps={{ timeFormat: null }}
                                        onChange={(date) => {
                                            if (typeof date === 'object') {
                                                setPkg({ ...pkg, sectionEndDt: date });
                                            } else if (date === '') {
                                                setPkg({ ...pkg, sectionEndDt: null });
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <Button variant="outline-neutral">섹션 선택</Button>
                            </div>
                            <MokaInput
                                as="autocomplete"
                                name="keywords"
                                value={sectionValue}
                                inputProps={{ options: options, isMulti: true, maxMenuHeight: 150 }}
                                onChange={(ct) => {
                                    let result = [];
                                    if (ct) {
                                        result = ct.map((ct) => ct.value);
                                    }
                                    setSectionkeywordList(result);
                                }}
                            />
                        </Col>
                    </Form.Row>
                )}
                {/* 디지털 스페셜 */}
                <Form.Row className="mb-3">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            label="디지털 스페셜"
                            id="package-specialYn-switch"
                            name="specialYn"
                            inputProps={{ custom: true, checked: pkg.specialYn === 'Y' }}
                            onChange={handleChangeSwitch}
                        />
                    </Col>
                </Form.Row>
                {pkg.specialYn === 'Y' && (
                    <Form.Row className="mb-3">
                        <Col xs={3} className="p-0">
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <MokaInputLabel as="none" label="검색 범위" />
                            </div>
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <MokaInputLabel as="none" label="검색 기간" />
                            </div>
                            <MokaInputLabel
                                as="switch"
                                id="package-specialSearch-switch"
                                name="specialSearch"
                                label="검색어(N개)"
                                inputProps={{ custom: true, checked: pkg.specialSearch === 'Y' }}
                                onChange={handleChangeSwitch}
                            />
                        </Col>
                        <Col xs={9} className="p-0">
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <div style={{ width: 80 }} className="pr-3">
                                    <MokaInput
                                        as="checkbox"
                                        id="package-specialTitle-checkbox"
                                        inputProps={{ label: '제목', custom: true, checked: pkg.specialOptions['title'] || false }}
                                        onChange={(e) => setPkg({ ...pkg, specialOptions: { ...pkg.specialOptions, title: e.target.checked } })}
                                    />
                                </div>
                                <div style={{ width: 80 }}>
                                    <MokaInput
                                        as="checkbox"
                                        id="package-specialTag-checkbox"
                                        inputProps={{ label: '태그', custom: true, checked: pkg.specialOptions['tag'] }}
                                        onChange={(e) => setPkg({ ...pkg, specialOptions: { ...pkg.specialOptions, tag: e.target.checked } })}
                                    />
                                </div>
                            </div>
                            <div className="mb-3 d-flex align-items-center">
                                <div style={{ width: 228 }} className="pr-3 d-flex align-items-center">
                                    <MokaInputLabel
                                        as="dateTimePicker"
                                        label="시작"
                                        name="specialStartDt"
                                        inputProps={{ timeFormat: null }}
                                        value={pkg.specialStartDt}
                                        onChange={(date) => {
                                            if (typeof date === 'object') {
                                                setPkg({ ...pkg, specialStartDt: date });
                                            } else if (date === '') {
                                                setPkg({ ...pkg, specialStartDt: null });
                                            }
                                        }}
                                        required
                                    />
                                </div>
                                <div style={{ width: 80 }} className="pr-1">
                                    <MokaInput
                                        as="checkbox"
                                        inputProps={{ label: '종료', custom: true, checked: pkg.specialOptions['specialEndYn'] || false }}
                                        onChange={(e) => setPkg({ ...pkg, specialOptions: { ...pkg.specialOptions, specialEndYn: e.target.checked } })}
                                    />
                                </div>
                                <div style={{ width: 150 }}>
                                    <MokaInput
                                        as="dateTimePicker"
                                        name="specialEndDt"
                                        value={pkg.specialEndDt}
                                        inputProps={{ timeFormat: null }}
                                        onChange={(date) => {
                                            if (typeof date === 'object') {
                                                setPkg({ ...pkg, specialEndDt: date });
                                            } else if (date === '') {
                                                setPkg({ ...pkg, specialEndDt: null });
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <MokaInput
                                as="autocomplete"
                                name="keywords"
                                value={specialValue}
                                inputProps={{ options: options, isMulti: true, maxMenuHeight: 150 }}
                                onChange={(ct) => {
                                    let result = [];
                                    if (ct) {
                                        result = ct.map((ct) => ct.value);
                                    }
                                    setSpecialKeywordList(result);
                                }}
                            />
                        </Col>
                    </Form.Row>
                )}
                {/* 영상 OVP */}
                <Form.Row className="mb-3">
                    <Col xs={12} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            label="영상(OVP)"
                            id="package-ovpYn-switch"
                            name="ovpYn"
                            inputProps={{ custom: true, checked: pkg.ovpYn === 'Y' }}
                            onChange={handleChangeSwitch}
                        />
                    </Col>
                </Form.Row>
                {pkg.ovpYn === 'Y' && (
                    <Form.Row>
                        <Col xs={3} className="p-0">
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <MokaInputLabel as="none" label="검색 범위" />
                            </div>
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <MokaInputLabel as="none" label="검색 기간" />
                            </div>
                            <MokaInputLabel
                                as="switch"
                                id="package-ovpSearch-switch"
                                name="ovpSearch"
                                label="검색어(N개)"
                                inputProps={{ custom: true, checked: pkg.ovpSearch === 'Y' }}
                                onChange={handleChangeSwitch}
                            />
                        </Col>
                        <Col xs={9} className="p-0">
                            <div style={{ height: 31 }} className="mb-3 d-flex align-items-center">
                                <div style={{ width: 120 }} className="pr-3">
                                    <MokaInput
                                        as="checkbox"
                                        id="package-ovpIssue-checkbox"
                                        inputProps={{ label: '연관 이슈', custom: true, checked: pkg.ovpOptions['issue'] || false }}
                                        onChange={(e) => setPkg({ ...pkg, ovpOptions: { ...pkg.ovpOptions, issue: e.target.checked } })}
                                    />
                                </div>
                                <div style={{ width: 80 }}>
                                    <MokaInput
                                        as="checkbox"
                                        id="package-ovpTag-checkbox"
                                        inputProps={{ label: '태그', custom: true, checked: pkg.ovpOptions['tag'] }}
                                        onChange={(e) => setPkg({ ...pkg, ovpOptions: { ...pkg.ovpOptions, tag: e.target.checked } })}
                                    />
                                </div>
                            </div>
                            <div className="mb-3 d-flex align-items-center">
                                <div style={{ width: 228 }} className="pr-3 d-flex align-items-center">
                                    <MokaInputLabel
                                        as="dateTimePicker"
                                        label="시작"
                                        name="ovpStartDt"
                                        inputProps={{ timeFormat: null }}
                                        value={pkg.ovpStartDt}
                                        onChange={(date) => {
                                            if (typeof date === 'object') {
                                                setPkg({ ...pkg, ovpStartDt: date });
                                            } else if (date === '') {
                                                setPkg({ ...pkg, ovpStartDt: null });
                                            }
                                        }}
                                        required
                                    />
                                </div>
                                <div style={{ width: 80 }} className="pr-1">
                                    <MokaInput
                                        as="checkbox"
                                        inputProps={{ label: '종료', custom: true, checked: pkg.ovpOptions['ovpEndYn'] || false }}
                                        onChange={(e) => setPkg({ ...pkg, ovpOptions: { ...pkg.ovpOptions, ovpEndYn: e.target.checked } })}
                                    />
                                </div>
                                <div style={{ width: 150 }}>
                                    <MokaInput
                                        as="dateTimePicker"
                                        name="ovpEndDt"
                                        value={pkg.ovpEndDt}
                                        inputProps={{ timeFormat: null }}
                                        onChange={(date) => {
                                            if (typeof date === 'object') {
                                                setPkg({ ...pkg, ovpEndDt: date });
                                            } else if (date === '') {
                                                setPkg({ ...pkg, ovpEndDt: null });
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <MokaInput
                                as="autocomplete"
                                name="keywords"
                                value={ovpValue}
                                inputProps={{ options: options, isMulti: true, maxMenuHeight: 150 }}
                                onChange={(ct) => {
                                    let result = [];
                                    if (ct) {
                                        result = ct.map((ct) => ct.value);
                                    }
                                    setOvpKeywordList(result);
                                }}
                            />
                        </Col>
                    </Form.Row>
                )}
            </Form>
        </MokaCard>
    );
};

export default PackageEdit;
