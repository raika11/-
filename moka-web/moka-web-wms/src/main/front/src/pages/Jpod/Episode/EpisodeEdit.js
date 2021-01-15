import React, { useEffect, useState, useRef } from 'react';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import { Form, Col, Button, Row } from 'react-bootstrap';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { selectItem } from '@pages/Jpod/JpodConst';
import { PodtyEpisodeModal, RepoterModal, PodCastModal } from '@pages/Jpod/JpodModal';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initialState, GET_REPORTER_LIST, getReporterList, clearReporter, changeReporterSearchOption } from '@store/jpod';

const reporterCountConst = [0, 1, 2, 3, 4, 5];

const ChannelEdit = ({ match }) => {
    const params = useParams();
    const tempEvent = () => {};
    const loading = false;
    const selectChnlSeq = useRef(null);
    const selectEpsdSeq = useRef(null);
    const imgFileRef1 = useRef(null); // 커버 이미지 ref
    const imgFileRef2 = useRef(null); // 썸네일 이미지 ref
    const imgFileRef3 = useRef(null); // 모바일용 이미지 ref
    const [Imgfile, setImgfile] = useState(null); // 선택한 이미지 파일용 스테이트
    const [Thumbfile, setThumbfile] = useState(null); // 선택한 썸네일 용 이미지 스테이트
    const [Mobfile, setMobfile] = useState(null); // 선택한 모바일용 이미지 스테이트

    const [editData, setEditData] = useState(initialState.episode.episodeInfo);

    const [editSelectRepoters, setEditSelectRepoters] = useState([]);
    const [podtyEpisodeModalState, setPodtyEpisodeModalState] = useState(false);
    const [reporterModalState, setReporterModalState] = useState(false);
    const [podCastModalState, setPodCastModalState] = useState(false);
    const [selectRepoterType, setSelectRepoterType] = useState(null);

    const { channel } = useSelector((store) => ({
        channel: store.jpod.episode.channel,
    }));

    const handleEditDataChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'usedYn') {
            setEditData({
                ...editData,
                usedYn: checked ? 'Y' : 'N',
            });
        } else {
            setEditData({
                ...editData,
                [name]: value,
            });
        }
    };

    const handleDateChange = (name, e) => {};
    // 이미지 파일 변경시 해당 스테이트 업데이트.
    const handleChangeFIle = ({ name, file }) => {
        switch (name) {
            case 'chnlImgFile':
                setImgfile(file);
                break;
            case 'chnlThumbFile':
                setThumbfile(file);
                break;
            case 'chnlImgMobFile':
                setMobfile(file);
                break;
            default:
                break;
        }
    };

    const handleClickPodtyEpisodeButton = () => {
        setPodtyEpisodeModalState(true);
    };

    const handleClickSearchRepoterButton = () => {
        setReporterModalState(true);
    };

    const handleClickAddPodCast = () => {
        setPodCastModalState(true);
    };

    useEffect(() => {
        setEditSelectRepoters(
            reporterCountConst.map(() => {
                return {
                    chnlSeq: '',
                    desc: '',
                    epsdSeq: '',
                    memDiv: '',
                    memMemo: '',
                    memNm: '',
                    memRepSeq: '',
                    nickNm: '',
                    seqNo: '',
                };
            }),
        );
    }, []);

    // url 이 변경 되었을 경우 처리. ( 채널 고유 번호 및 add)
    useEffect(() => {
        if (!isNaN(Number(params.chnlSeq)) && selectChnlSeq.current !== params.chnlSeq) {
            selectChnlSeq.current = params.chnlSeq;
        }
        if (!isNaN(Number(params.epsdSeq)) && selectEpsdSeq.current !== params.epsdSeq) {
            selectEpsdSeq.current = params.epsdSeq;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    return (
        <MokaCard
            className="overflow-hidden flex-fill"
            title={`에피소드 ${selectChnlSeq.current === 'add' ? '등록' : '정보'}`}
            titleClassName="mb-0"
            loading={loading}
            footer
            footerClassName="d-flex justify-content-center"
            footerAs={
                <>
                    {(function () {
                        return (
                            <Row className="justify-content-md-center text-center">
                                <Col className="mp-0 pr-0">
                                    <Button variant="positive" onClick={() => tempEvent()}>
                                        저장
                                    </Button>
                                </Col>
                                <Col className="mp-0 pr-0">
                                    <Button variant="negative" onClick={() => tempEvent()}>
                                        취소
                                    </Button>
                                </Col>
                            </Row>
                        );
                    })()}
                </>
            }
        >
            <Form className="mb-gutter">
                {/* 사용여부 */}
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel as="switch" name="usedYn" label="사용여부" labelWidth={90} inputProps={{ checked: false }} onChange={(e) => tempEvent(e)} />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel label="채널명" as="select" name="chnlSeq" labelWidth={90} value={editData.chnlSeq} onChange={(e) => handleEditDataChange(e)}>
                            <option>채널 전체</option>
                            {channel.map((item, index) => (
                                <option key={index} value={item.castSrl}>
                                    {item.getCastName}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                {/* 팟티 채널 */}
                <Form.Row className="mb-2">
                    <Col xs={9} className="p-0">
                        <MokaInputLabel
                            label={`팟티\n(에피소드 연결)`}
                            labelWidth={90}
                            className="mb-0"
                            id="podtyChnlSrl"
                            name="podtyChnlSrl"
                            placeholder=""
                            value={editData.podtyChnlSrl}
                            onChange={(e) => tempEvent(e)}
                        />
                    </Col>
                    <Col xs={3} className="p-0 pt-1 pl-1 text-right">
                        <Button variant="searching" className="mb-0" onClick={() => handleClickPodtyEpisodeButton()}>
                            팟티 에피소드 검색
                        </Button>
                    </Col>
                </Form.Row>
                {/* 채널명 */}
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel
                            label={`에피소드명`}
                            labelWidth={90}
                            className="mb-0"
                            id="chnlNm"
                            name="chnlNm"
                            placeholder=""
                            value={editData.chnlNm}
                            onChange={(e) => tempEvent(e)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel
                            label={`에피소드 내용`}
                            labelWidth={90}
                            as="textarea"
                            className="mb-2"
                            inputClassName="resize-none"
                            inputProps={{ rows: 6 }}
                            id="chnlMemo"
                            name="chnlMemo"
                            value={editData.chnlMemo}
                            onChange={(e) => tempEvent(e)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel
                            label={`회차`}
                            labelWidth={90}
                            className="mb-0"
                            id="chnlNm"
                            name="chnlNm"
                            placeholder=""
                            value={editData.chnlNm}
                            onChange={(e) => tempEvent(e)}
                        />
                    </Col>
                    <Col xs={3} className="d-flex p-0 pl-4 justify-content-center align-items-center">
                        마지막 회차: 200회
                    </Col>
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            label={`방송일`}
                            labelWidth={50}
                            as="dateTimePicker"
                            className="mb-0"
                            name="chnlSdt"
                            id="chnlSdt"
                            value={editData.chnlSdt}
                            onChange={(param) => {
                                const selectDate = param._d;
                                const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                                handleDateChange('chnlSdt', date);
                            }}
                            inputProps={{ timeFormat: null }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel
                            label={`테그`}
                            labelWidth={90}
                            className="mb-0"
                            id="keywords"
                            name="keywords"
                            placeholder=""
                            value={editData.keywords}
                            onChange={(e) => tempEvent(e)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <div className="d-flex w-100 align-items-center">
                        <MokaInputLabel as="none" label="예약" labelWidth={90} />
                        <Col xs={2} className="p-0">
                            <MokaInputLabel
                                as="radio"
                                inputProps={{
                                    custom: true,
                                    label: '오디오',
                                    checked: editData.jpodType === 'A',
                                }}
                                id="jpodType-audio"
                                name="jpodType"
                                onChange={(e) => handleEditDataChange(e)}
                                value="A"
                                className="mb-0 h-100"
                                required
                            />
                        </Col>
                        <Col xs={4} className="p-0">
                            <MokaInputLabel
                                as="radio"
                                inputProps={{
                                    custom: true,
                                    label: '비디오',
                                    checked: editData.jpodType === 'V',
                                }}
                                id="jpodType-video"
                                name="jpodType"
                                onChange={(e) => handleEditDataChange(e)}
                                value="V"
                                className="mb-0 h-100"
                                required
                            />
                        </Col>
                    </div>
                </Form.Row>
                <hr />
                <Form.Row className="mb-2">
                    <div className="d-flex align-items-center form-group">
                        <div className="px-0 mb-0 position-relative flex-shrink-0 form-label" style={{ width: '110px' }}></div>
                    </div>
                    <Col className="p-0">
                        <Col className="d-flex p-0 align-items-center" style={{ backgroundColor: '#f4f7f9', height: '50px' }}>
                            <Col xs={4}>
                                <MokaInput name="memRepSeq" className="ft-12" value={editData.memRepSeq} onChange={(e) => tempEvent({ e })} placeholder={``} />
                            </Col>
                            <Col xs={2} className="pl-3">
                                <Button variant="positive" className="mb-0" onClick={() => handleClickAddPodCast()}>
                                    등록
                                </Button>
                            </Col>
                            <Col xs={6}>
                                <MokaInputLabel
                                    label="재생시간"
                                    inputClassName="flex-fill"
                                    name="memNm"
                                    className="ft-12"
                                    value={editData.memNm}
                                    onChange={(e) => tempEvent({ e })}
                                    placeholder={``}
                                />
                            </Col>
                        </Col>
                    </Col>
                </Form.Row>
                {/* 모바일용 */}
                {editData.jpodType === 'V' && (
                    <>
                        <Form.Row className="mb-2">
                            <Col xs={6}>
                                <MokaInputLabel
                                    as="imageFile"
                                    className="mb-2"
                                    name="chnlThumbFile"
                                    isInvalid={null}
                                    inputClassName="flex-fill"
                                    labelWidth={90}
                                    label={
                                        <React.Fragment>
                                            메타이미지
                                            <br />
                                            (1200*627)
                                            <br />
                                            <Button
                                                className="mt-1"
                                                size="sm"
                                                variant="negative"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    imgFileRef3.current.deleteFile();
                                                    setThumbfile(null);
                                                    setEditData({
                                                        ...editData,
                                                        chnlImgMob: null,
                                                    });
                                                }}
                                            >
                                                삭제
                                            </Button>
                                        </React.Fragment>
                                    }
                                    ref={imgFileRef3}
                                    inputProps={{
                                        height: 80,
                                        // width: 400, // width: '100%' number type 에러남.
                                        img: editData.chnlImgMob,
                                    }}
                                    onChange={(file) =>
                                        handleChangeFIle({
                                            name: 'chnlImgMobFile',
                                            file: file,
                                        })
                                    }
                                    labelClassName="justify-content-end"
                                />
                            </Col>
                            {/* 썸네일 이미지 */}
                            <Col xs={6} className="p-0 pt-1 pl-1">
                                <MokaInputLabel
                                    as="imageFile"
                                    className="w-100 mb-2"
                                    name="chnlImgMobFile"
                                    id="chnlImgMobFile"
                                    isInvalid={null}
                                    inputClassName="d-flex flex-fill"
                                    label={
                                        <React.Fragment>
                                            썸네일
                                            <br />
                                            (1200*627)
                                            <br />
                                            <Button
                                                className="mt-1"
                                                size="sm"
                                                variant="negative"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    imgFileRef2.current.deleteFile();
                                                    setMobfile(null);
                                                    setEditData({
                                                        ...editData,
                                                        chnlThumb: null,
                                                    });
                                                }}
                                            >
                                                삭제
                                            </Button>
                                        </React.Fragment>
                                    }
                                    ref={imgFileRef2}
                                    inputProps={{
                                        height: 80,
                                        img: editData.chnlThumb,
                                    }}
                                    onChange={(file) =>
                                        handleChangeFIle({
                                            name: 'chnlThumbFile',
                                            file: file,
                                        })
                                    }
                                />
                            </Col>
                        </Form.Row>
                    </>
                )}
                <hr />
                <Form.Row className="mb-2">
                    <MokaInputLabel label={`진행자(고정패널)`} labelWidth={90} as="none" />
                    <Button
                        xs={12}
                        variant="searching"
                        className="mb-0"
                        onClick={() => {
                            setSelectRepoterType('CP');
                            handleClickSearchRepoterButton();
                        }}
                    >
                        검색
                    </Button>
                </Form.Row>
                {/* 기본 6개 를 뿌려준다. */}
                {editSelectRepoters.map((element, index) => {
                    return (
                        <Form.Row className="mb-2" key={index}>
                            <label
                                className="px-0 mb-0 position-relative flex-shrink-0 form-label"
                                htmlFor="none"
                                style={{ width: '90px', minWidth: '90px', marginRight: '12px', marginLeft: '8px' }}
                            ></label>
                            <Col className="p-0">
                                <Col className="p-0" style={{ backgroundColor: '#f4f7f9', height: '100px' }}>
                                    <Col className="d-flex w-100 h-50 align-items-center">
                                        <div>
                                            <MokaInput
                                                name="memRepSeq"
                                                className="ft-12"
                                                value={element.memRepSeq}
                                                onChange={(e) => tempEvent({ e, index })}
                                                placeholder={`기자번호`}
                                                disabled={true}
                                            />
                                        </div>
                                        <div>
                                            <MokaInput name="memNm" className="ft-12" value={element.memNm} onChange={(e) => tempEvent({ e, index })} placeholder={`기자명`} />
                                        </div>
                                        <div className="pl-3">
                                            <MokaInput name="memMemo" className="ft-12" value={element.memMemo} onChange={(e) => tempEvent({ e, index })} placeholder={`직책`} />
                                        </div>
                                        <div className="pl-3">
                                            <MokaInput name="nickNm" className="ft-12" value={element.nickNm} onChange={(e) => tempEvent({ e, index })} placeholder={`닉네임`} />
                                        </div>
                                        <div className="pl-3">
                                            <Button variant="searching" className="mb-0" onClick={() => tempEvent(index)}>
                                                삭제
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col xs={12} className="p-0 h-50 d-flex align-items-center">
                                        <Col xs={12}>
                                            <MokaInput name="desc" className="ft-12" value={element.desc} onChange={(e) => tempEvent({ e, index })} placeholder={`설명`} />
                                        </Col>
                                    </Col>
                                </Col>
                            </Col>
                        </Form.Row>
                    );
                })}
                <hr />
                <Form.Row className="mb-2">
                    <MokaInputLabel label={`진행자(게스트)`} labelWidth={90} as="none" />
                    <Button
                        xs={12}
                        variant="searching"
                        className="mb-0"
                        onClick={() => {
                            setSelectRepoterType('EG');
                            handleClickSearchRepoterButton();
                        }}
                    >
                        검색
                    </Button>
                </Form.Row>
                {/* 기본 6개 를 뿌려준다. */}
                {editSelectRepoters.map((element, index) => {
                    return (
                        <Form.Row className="mb-2" key={index}>
                            <label
                                className="px-0 mb-0 position-relative flex-shrink-0 form-label"
                                htmlFor="none"
                                style={{ width: '90px', minWidth: '90px', marginRight: '12px', marginLeft: '8px' }}
                            ></label>
                            <Col className="p-0">
                                <Col className="p-0" style={{ backgroundColor: '#f4f7f9', height: '100px' }}>
                                    <Col className="d-flex w-100 h-50 align-items-center">
                                        <div>
                                            <MokaInput
                                                name="memRepSeq"
                                                className="ft-12"
                                                value={element.memRepSeq}
                                                onChange={(e) => tempEvent({ e, index })}
                                                placeholder={`기자번호`}
                                                disabled={true}
                                            />
                                        </div>
                                        <div>
                                            <MokaInput name="memNm" className="ft-12" value={element.memNm} onChange={(e) => tempEvent({ e, index })} placeholder={`기자명`} />
                                        </div>
                                        <div className="pl-3">
                                            <MokaInput name="memMemo" className="ft-12" value={element.memMemo} onChange={(e) => tempEvent({ e, index })} placeholder={`직책`} />
                                        </div>
                                        <div className="pl-3">
                                            <MokaInput name="nickNm" className="ft-12" value={element.nickNm} onChange={(e) => tempEvent({ e, index })} placeholder={`닉네임`} />
                                        </div>
                                        <div className="pl-3">
                                            <Button variant="searching" className="mb-0" onClick={() => tempEvent(index)}>
                                                삭제
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col xs={12} className="p-0 h-50 d-flex align-items-center">
                                        <Col xs={12}>
                                            <MokaInput name="desc" className="ft-12" value={element.desc} onChange={(e) => tempEvent({ e, index })} placeholder={`설명`} />
                                        </Col>
                                    </Col>
                                </Col>
                            </Col>
                        </Form.Row>
                    );
                })}
                <hr />
                <Form.Row className="mb-2">
                    <MokaInputLabel label={`관련기사`} labelWidth={90} as="none" />
                    <Button xs={12} variant="searching" className="mb-0" onClick={() => tempEvent()}>
                        검색
                    </Button>
                </Form.Row>
            </Form>
            <PodtyEpisodeModal
                show={podtyEpisodeModalState}
                chnlseq={editData.chnlSeq}
                onHide={() => {
                    setPodtyEpisodeModalState(false);
                }}
            />
            <RepoterModal
                show={reporterModalState}
                selectType={selectRepoterType}
                onHide={() => {
                    setReporterModalState(false);
                }}
            />
            <PodCastModal
                show={podCastModalState}
                onHide={() => {
                    setPodCastModalState(false);
                }}
            />
        </MokaCard>
    );
};

export default ChannelEdit;
