import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { useHistory, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput, MokaInputLabel } from '@/components';

const options = [
    { value: 'test1', label: '정치' },
    { value: 'test2', label: '사회' },
    { value: 'test3', label: '경제' },
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
    });
    const [defaultValue, setDefaultValue] = useState(null);
    const [keywordList, setKeywordList] = useState([]);

    const handleClickCancel = () => {
        history.push('/package');
    };

    /**
     * input value
     */
    const handleChangeValue = useCallback(
        (e) => {
            const { name, value, checked } = e.target;
            if (name === 'expoYn') {
                setPkg({ ...pkg, [name]: checked ? 'Y' : 'N' });
            } else if (name === 'epiDiv') {
                setPkg({ ...pkg, [name]: checked ? 'Y' : 'N' });
            } else if (name === 'subsYn') {
                setPkg({ ...pkg, [name]: checked ? 'Y' : 'N' });
            } else if (name === 'recomPkgYn') {
                setPkg({ ...pkg, [name]: checked ? 'Y' : 'N' });
            } else if (name === 'keywordYn') {
                setPkg({ ...pkg, [name]: checked ? 'Y' : 'N' });
            } else {
                setPkg({ ...pkg, [name]: value });
            }
        },
        [pkg],
    );

    /**
     * date value
     */
    const handleChangeDate = useCallback(
        (e) => {
            const { name, date } = e.target;
            if (typeof date === 'object') {
                setPkg({ ...pkg, [name]: date });
            } else if (date === '') {
                setPkg({ ...pkg, [name]: null });
            }
        },
        [pkg],
    );

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
        setDefaultValue(cts);
    }, [keywordList]);

    return (
        <MokaCard
            title={seqNo ? '패키지 수정' : '패키지 생성'}
            className="w-100"
            footerClassName="justify-content-center"
            footer
            footerButtons={[
                { text: '종료', variant: 'negative', className: 'mr-2' },
                { text: seqNo ? '수정' : '생성', variant: 'positive', className: 'mr-2' },
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
                            onChange={handleChangeValue}
                            required
                        />
                    </Col>
                    <Col xs={9} className="p-0 d-flex">
                        <div style={{ width: 60 }} className="pr-2">
                            <MokaInput
                                as="radio"
                                id="package-imedi-radio"
                                value="Y"
                                inputProps={{ label: '즉시', custom: true, checked: pkg.expoImd === 'Y' }}
                                onChange={(e) => setPkg({ ...pkg, expoImd: e.target.value })}
                            />
                        </div>
                        <div style={{ width: 60 }} className="pr-1">
                            <MokaInput
                                as="radio"
                                id="package-reserved-radio"
                                value="N"
                                inputProps={{ label: '예약', custom: true, checked: pkg.expoImd === 'N' }}
                                onChange={(e) => setPkg({ ...pkg, expoImd: e.target.value })}
                            />
                        </div>
                        <div style={{ width: 150 }} className="pr-1">
                            <MokaInput as="dateTimePicker" name="expoResrvDT" inputProps={{ timeFormat: null }} value={pkg.expoResrvDT} onChange={handleChangeDate} />
                        </div>
                        <div style={{ width: 150 }}>
                            <MokaInput as="dateTimePicker" name="expoResrvTm" inputProps={{ dateFormat: null }} value={pkg.expoResrvTm} onChange={handleChangeDate} />
                        </div>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-3 align-items-center">
                    <Col xs={3} className="p-0">
                        <MokaInputLabel as="none" label="유형 선택" required />
                    </Col>
                    <Col xs={9} className="p-0 d-flex align-items-center">
                        <div style={{ width: 60 }} className="pr-2">
                            <MokaInput
                                as="radio"
                                id="package-topic-radio"
                                value="topic"
                                inputProps={{ label: '토픽', custom: true, checked: pkg.type === 'topic' }}
                                onChange={(e) => setPkg({ ...pkg, type: e.target.value })}
                            />
                        </div>
                        <div style={{ width: 60 }} className="pr-2">
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
                    <MokaInputLabel as="none" label="시즌/회차\n표시" />
                    <Col xs={10} className="p-0">
                        <div className="mb-2 d-flex align-items-center">
                            <MokaInputLabel as="none" label="시즌" />
                            <div className="pr-3 d-flex align-tiems-center">
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
                            <div className="pr-3 d-flex align-tiems-center">
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
                            <div className="d-flex align-tiems-center">
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
                        <div className="d-flex">
                            <MokaInputLabel as="none" label="회차" />
                            <div style={{ width: 100 }} className="pr-2">
                                <MokaInput
                                    as="checkbox"
                                    id="package-epiDiv-checkbox"
                                    name="epiDiv"
                                    inputProps={{ label: '회차 표시', custom: true, checked: pkg.epiDiv === 'Y' }}
                                    onChange={handleChangeValue}
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
                            onChange={handleChangeValue}
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
                        <div style={{ width: 150 }} className="pr-2">
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
                            onChange={handleChangeValue}
                        />
                    </Col>
                    <Col xs={9} className="p-0 d-flex">
                        <MokaInput className="mr-2" value={pkg.recomIssue} inputProps={{ readOnly: true }} />
                        <Button variant="outline-neutral">추천 이슈 선택</Button>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-3">
                    <Col xs={3} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            name="keywordYn"
                            id="package-keywordYn-switch"
                            label="검색어"
                            inputProps={{ custom: true, checked: pkg.keywordYn === 'Y' }}
                            onChange={handleChangeValue}
                        />
                    </Col>
                </Form.Row>
                {pkg.keywordYn === 'Y' && (
                    <>
                        <Form.Row className="mb-3">
                            <Col xs={3} className="p-0">
                                <MokaInputLabel as="none" label="검색 범위" />
                            </Col>
                            <Col xs={9} className="p-0 d-flex">
                                <div style={{ width: 60 }} className="pr-2">
                                    <MokaInput
                                        as="checkbox"
                                        id="package-searchTitle-checkbox"
                                        inputProps={{ label: '제목', custom: true, checked: pkg.searchOptions['title'] || false }}
                                        onChange={(e) => setPkg({ ...pkg, searchOptions: { ...pkg.seasonOptions, title: e.target.checked } })}
                                    />
                                </div>
                                <div style={{ width: 60 }} className="pr-2">
                                    <MokaInput
                                        as="checkbox"
                                        id="package-searchTag-checkbox"
                                        inputProps={{ label: '태그', custom: true, checked: pkg.seasonOptions['tag'] || false }}
                                        onChange={(e) => setPkg({ ...pkg, seasonOptions: { ...pkg.seasonOptions, tag: e.target.checked } })}
                                    />
                                </div>
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-3">
                            <Col xs={3} className="p-0">
                                <MokaInputLabel as="none" label="검색 기간" />
                            </Col>
                            <Col xs={9} className="p-0 d-flex align-items-center">
                                <div style={{ width: 228 }} className="pr-2">
                                    <MokaInputLabel as="dateTimePicker" label="시작" inputProps={{ timeFormat: null }} value={pkg.kwStartDt} onChange={handleChangeDate} required />
                                </div>
                                <div style={{ width: 60 }} className="pr-1">
                                    <MokaInput as="checkbox" inputProps={{ label: '종료', custom: true, checked: true }} onChange={handleChangeValue} />
                                </div>
                                <div style={{ width: 150 }}>
                                    <MokaInput as="dateTimePicker" value={pkg.kwEndDt} inputProps={{ timeFormat: null }} onChange={handleChangeDate} />
                                </div>
                            </Col>
                        </Form.Row>
                        <Form.Row className="mb-3">
                            <Col xs={3} className="p-0">
                                <MokaInputLabel as="switch" label="검색어(N개)" inputProps={{ custom: true, checked: true }} onChange={handleChangeValue} />
                            </Col>
                            <Col xs={9} className="p-0">
                                <MokaInput
                                    as="autocomplete"
                                    name="keywords"
                                    value={defaultValue}
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
                    </>
                )}

                {/* <Form.Row>
                    <Col xs={12} className="p-0 d-flex justify-content-between">
                        <MokaInputLabel as="switch" label="기자" inputProps={{ custom: true, checked: true }} onChange={handleChangeValue} />
                        <Button variant="outline-neutral">추가</Button>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={2} className="p-0">
                        <MokaInputLabel as="none" label="검색 범위" />
                    </Col>
                    <Col xs={4} className="p-0">
                        <p className="mb-0">기자명(default)</p>
                        <MokaInput as="checkbox" className="mr-2" inputProps={{ label: '제목', custom: true, checked: true }} onChange={handleChangeValue} />
                        <MokaInput as="checkbox" className="mr-2" inputProps={{ label: '태그', custom: true, checked: true }} onChange={handleChangeValue} />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={2} className="p-0 d-flex">
                        <div>
                            <p className="mb-0">1</p>
                            <p className="mb-0">ic</p>
                        </div>
                        <div>
                            <MokaInputLabel as="none" label="검색 기간" />
                            <MokaInputLabel as="none" label="기자명" />
                            <MokaInputLabel as="switch" label="검색어(N개)" inputProps={{ custom: true, checked: true }} onChange={handleChangeValue} />
                        </div>
                    </Col>
                    <Col xs={5} className="p-0">
                        <div className="d-flex">
                            <MokaInputLabel as="dateTimePicker" label="시작" className="mr-2" inputProps={{ timeFormat: null }} value={pkg.kwStartDt} onChange={handleChangeValue} required />
                            <MokaInput as="checkbox" className="mr-2" inputProps={{ label: '종료', custom: true, checked: true }} onChange={handleChangeValue} />
                            <MokaInput as="dateTimePicker" value={pkg.kwEndDt} inputProps={{ timeFormat: null }} onChange={handleChangeValue} />
                        </div>
                        <MokaInput
                            as="autocomplete"
                            name="keywords"
                            value={defaultValue}
                            inputProps={{ options: options, isMulti: true, maxMenuHeight: 150 }}
                            onChange={(ct) => {
                                let result = [];
                                if (ct) {
                                    result = ct.map((ct) => ct.value);
                                }
                                setKeywordList(result);
                            }}
                        />
                        <MokaInput
                            as="autocomplete"
                            name="keywords"
                            value={defaultValue}
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
                <Form.Row>
                    <Col xs={2} className="p-0 d-flex">
                        <div>
                            <p className="mb-0">2</p>
                            <p className="mb-0">ic</p>
                        </div>
                        <div>
                            <MokaInputLabel as="none" label="검색 기간" />
                            <MokaInputLabel as="none" label="기자명" />
                            <MokaInputLabel as="switch" label="검색어(N개)" inputProps={{ custom: true, checked: true }} onChange={handleChangeValue} />
                        </div>
                    </Col>
                    <Col xs={10} className="p-0">
                        <div className="d-flex">
                            <MokaInputLabel as="dateTimePicker" label="시작" className="mr-2" inputProps={{ timeFormat: null }} value={pkg.kwStartDt} onChange={handleChangeValue} required />
                            <MokaInput as="checkbox" className="mr-2" inputProps={{ label: '종료', custom: true, checked: true }} onChange={handleChangeValue} />
                            <MokaInput as="dateTimePicker" value={pkg.kwEndDt} inputProps={{ timeFormat: null }} onChange={handleChangeValue} />
                        </div>
                        <MokaInput
                            as="autocomplete"
                            name="keywords"
                            value={defaultValue}
                            inputProps={{ options: options, isMulti: true, maxMenuHeight: 150 }}
                            onChange={(ct) => {
                                let result = [];
                                if (ct) {
                                    result = ct.map((ct) => ct.value);
                                }
                                setKeywordList(result);
                            }}
                        />
                        <MokaInput
                            as="autocomplete"
                            name="keywords"
                            value={defaultValue}
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
                <Form.Row>
                    <Col xs={2} className="p-0">
                        <MokaInputLabel as="switch" label="섹션" inputProps={{ custom: true, checked: true }} onChange={handleChangeValue} />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={2} className="p-0">
                        <MokaInputLabel as="none" label="검색 범위" />
                    </Col>
                    <Col xs={4} className="p-0 d-flex">
                        <p className="mb-0">섹션코드(default)</p>
                        <MokaInput as="checkbox" className="mr-2" inputProps={{ label: '제목', custom: true, checked: true }} onChange={handleChangeValue} />
                        <MokaInput as="checkbox" className="mr-2" inputProps={{ label: '태그', custom: true, checked: true }} onChange={handleChangeValue} />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={2} className="p-0">
                        <MokaInputLabel as="none" label="검색 기간" />
                    </Col>
                    <Col xs={5} className="p-0 d-flex">
                        <MokaInputLabel as="dateTimePicker" label="시작" className="mr-2" inputProps={{ timeFormat: null }} value={pkg.kwStartDt} onChange={handleChangeValue} required />
                        <MokaInput as="checkbox" className="mr-2" inputProps={{ label: '종료', custom: true, checked: true }} onChange={handleChangeValue} />
                        <MokaInput as="dateTimePicker" value={pkg.kwEndDt} inputProps={{ timeFormat: null }} onChange={handleChangeValue} />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={2} className="p-0">
                        <MokaInputLabel as="none" label="대상 섹션" />
                    </Col>
                    <Col xs={1} className="p-0">
                        <Button variant="outline-neutral">섹션 선택</Button>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={2} className="p-0 d-flex">
                        <MokaInputLabel as="switch" label="검색어(N개)" inputProps={{ custom: true, checked: true }} onChange={handleChangeValue} />
                    </Col>
                    <Col xs={10} className="p-0">
                        <MokaInput
                            as="autocomplete"
                            name="keywords"
                            value={defaultValue}
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
                <Form.Row>
                    <Col xs={2} className="p-0">
                        <MokaInputLabel as="switch" label="디지털 스페셜" inputProps={{ custom: true, checked: true }} onChange={handleChangeValue} />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={2} className="p-0">
                        <MokaInputLabel as="none" label="검색 범위" />
                        <MokaInputLabel as="none" label="검색 기간" />
                        <MokaInputLabel as="switch" label="검색어(N개)" inputProps={{ custom: true, checked: true }} onChange={handleChangeValue} />
                    </Col>
                    <Col xs={10} className="p-0 d-flex">
                        <div className="d-flex">
                            <MokaInput as="checkbox" className="mr-2" inputProps={{ label: '제목', custom: true, checked: true }} onChange={handleChangeValue} />
                            <MokaInput as="checkbox" className="mr-2" inputProps={{ label: '태그', custom: true, checked: true }} onChange={handleChangeValue} />
                        </div>
                        <div className="d-flex">
                            <MokaInputLabel as="dateTimePicker" label="시작" className="mr-2" inputProps={{ timeFormat: null }} value={pkg.kwStartDt} onChange={handleChangeValue} required />
                            <MokaInput as="checkbox" className="mr-2" inputProps={{ label: '종료', custom: true, checked: true }} onChange={handleChangeValue} />
                            <MokaInput as="dateTimePicker" value={pkg.kwEndDt} inputProps={{ timeFormat: null }} onChange={handleChangeValue} />
                        </div>
                        <MokaInput
                            as="autocomplete"
                            name="keywords"
                            value={defaultValue}
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
                <Form.Row>
                    <Col xs={2} className="p-0">
                        <MokaInputLabel as="switch" label="영상(OVP)" inputProps={{ custom: true, checked: true }} onChange={handleChangeValue} />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xs={2} className="p-0">
                        <MokaInputLabel as="none" label="검색 범위" />
                        <MokaInputLabel as="none" label="검색 기간" />
                        <MokaInputLabel as="switch" label="검색어(N개)" inputProps={{ custom: true, checked: true }} onChange={handleChangeValue} />
                    </Col>
                    <Col xs={10} className="p-0 d-flex">
                        <div className="d-flex">
                            <MokaInput as="checkbox" className="mr-2" inputProps={{ label: '연관 이슈', custom: true, checked: true }} onChange={handleChangeValue} />
                            <MokaInput as="checkbox" className="mr-2" inputProps={{ label: '태그', custom: true, checked: true }} onChange={handleChangeValue} />
                        </div>
                        <div className="d-flex">
                            <MokaInputLabel as="dateTimePicker" label="시작" className="mr-2" inputProps={{ timeFormat: null }} value={pkg.kwStartDt} onChange={handleChangeValue} required />
                            <MokaInput as="checkbox" className="mr-2" inputProps={{ label: '종료', custom: true, checked: true }} onChange={handleChangeValue} />
                            <MokaInput as="dateTimePicker" value={pkg.kwEndDt} inputProps={{ timeFormat: null }} onChange={handleChangeValue} />
                        </div>
                        <MokaInput
                            as="autocomplete"
                            name="keywords"
                            value={defaultValue}
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
                </Form.Row> */}
            </Form>
        </MokaCard>
    );
};

export default PackageEdit;
