import React, { useEffect, Suspense, useState, useRef } from 'react';
import { MokaCard, MokaInputLabel, MokaSearchInput, MokaInput } from '@components';
import { Form, Col, Button, Row } from 'react-bootstrap';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { PodtyChannelModal, RepoterModal } from '@pages/Jpod/JpodModal';
import { initialState, GET_REPORTER_LIST, saveJpodChannel } from '@store/jpod';
import { useSelector, useDispatch } from 'react-redux';
import toast, { messageBox } from '@utils/toastUtil';

const ChannelEdit = ({ match }) => {
    const dispatch = useDispatch();
    const [editName] = useState(false);
    const imgFileRef1 = useRef(null);
    const imgFileRef2 = useRef(null);
    const imgFileRef3 = useRef(null);

    const [podtyChannelModalState, setPodtyChannelModalState] = useState(false);
    const [repoterModalState, setRepoterModalState] = useState(false);

    const [editData, setEditData] = useState(initialState.channel.channelInfo);
    const [editSelectRepoters, setEditSelectRepoters] = useState([]);
    const [editDays, setEditDays] = useState([]);

    const [Imgfile, setImgfile] = useState(null);
    const [Thumbfile, setThumbfile] = useState(null);
    const [Mobfile, setMobfile] = useState(null);

    const { selectReporter, selectPodty, loading } = useSelector((store) => ({
        selectReporter: store.jpod.channel.selectReporter,
        selectPodty: store.jpod.channel.selectPodty,
        loading: store.loading[GET_REPORTER_LIST],
    }));

    const handleClickPadtySearch = () => {
        setPodtyChannelModalState(true);
    };

    const handleClickSearchRepoterButton = () => {
        setRepoterModalState(true);
    };

    // 진행자(기자) 선택 및 내용 수정 처리.
    const handleChangeReporters = ({ e, index }) => {
        const { name, value } = e.target;
        setEditSelectRepoters(editSelectRepoters.map((item, i) => (i === index ? { ...item, [name]: value } : item)));
    };

    // 등록 정보 변경 처리.
    const handleChangeChannelEditData = (e) => {
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

    // 날짜 변경 처리.
    const handleDateChange = (name, date) => {
        if (name === 'chnlSdt') {
            const startDt = new Date(date);
            const endDt = new Date(editData.chnlEdt);

            if (startDt > endDt) {
                toast.warning('시작일은 종료일 보다 클 수 없습니다.');
                return;
            }
        } else if (name === 'chnlEdt') {
            const startDt = new Date(editData.chnlSdt);
            const endDt = new Date(date);

            if (endDt < startDt) {
                toast.warning('종료일은 시작일 보다 작을 수 없습니다.');
                return;
            }
        }

        setEditData({
            ...editData,
            [name]: date,
        });
    };

    // 방송요일 변경 처리.
    const handleChannelDay = (e) => {
        const { name, checked } = e.target;
        if (checked === true) {
            if (name === 'day0') {
                setEditDays(['day0', 'day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7']);
            } else {
                setEditDays([...editDays.filter((e) => e !== 'day0'), name]);
            }
        } else {
            if (name === 'day0') {
                setEditDays([]);
            } else {
                setEditDays(editDays.filter((e) => e !== 'day0').filter((e) => e !== name));
            }
        }
    };

    // 진행자 삭제 버튼 처리.
    const handleClickReporterDelete = (index) => {
        setEditSelectRepoters(editSelectRepoters.filter((e, i) => i !== index));
    };

    // 저장버튼
    const handleClickSaveButton = () => {
        // post 데이터를 조합 하기 힘들어서 redux 타기전에 폼을 만듬.
        console.log('handleClickSaveButton');

        var formData = new FormData();
        // let formData = {};
        formData.append('keywords[0].ordNo', 0);
        formData.append('keywords[0].keyword', !editData.keywords || editData.keywords === undefined ? '' : editData.keywords);

        editSelectRepoters.map((element, index) => {
            const memDiv = !element.memDiv || element.memDiv === undefined ? 'CM' : element.memDiv;
            const memNm = !element.memNm || element.memNm === undefined ? '' : element.memNm;
            const memRepSeq = !element.memRepSeq || element.memRepSeq === undefined ? '' : element.memRepSeq;
            const nickNm = !element.nickNm || element.nickNm === undefined ? '' : element.nickNm;
            const memMemo = !element.memMemo || element.memMemo === undefined ? '' : element.memMemo;

            formData.append(`members[${index}].memDiv`, memDiv);
            formData.append(`members[${index}].memNm`, memNm);
            formData.append(`members[${index}].memRepSeq`, memRepSeq);
            formData.append(`members[${index}].nickNm`, nickNm);
            formData.append(`members[${index}].memMemo`, memMemo);
            formData.append(`members[${index}].desc`, index);
        });

        if (Imgfile) {
            formData.append(`chnlImgFile`, Imgfile);
        }
        if (Thumbfile) {
            formData.append(`chnlThumbFile`, Thumbfile);
        }
        if (Mobfile) {
            formData.append(`chnlImgMobFile`, Mobfile);
        }

        formData.append(`usedYn`, editData.usedYn);
        formData.append(`chnlNm`, editData.chnlNm);
        formData.append(`chnlMemo`, editData.chnlMemo);

        let chnlSdt = editData.chnlSdt && editData.chnlSdt.length > 10 ? editData.chnlSdt.substr(0, 10) : editData.chnlSdt;
        let chnlEdt = editData.chnlEdt && editData.chnlEdt.length > 10 ? editData.chnlEdt.substr(0, 10) : editData.chnlEdt;

        formData.append(`chnlSdt`, chnlSdt);
        formData.append(`chnlEdt`, chnlEdt);
        // formData.append(`chnlImg`, editData.chnlImg);
        // formData.append(`chnlThumb`, editData.chnlThumb);
        // formData.append(`chnlImgMob`, editData.chnlImgMob);
        // formData.append(`chnlImg`, ' ');
        // formData.append(`chnlThumb`, ' ');
        // formData.append(`chnlImgMob`, ' ');

        const chnlDy = editDays.join('').replace(/day/gi, '').replace('0', '');
        formData.append(`chnlDy`, chnlDy);

        formData.append(`podtyChnlSrl`, editData.podty_castSrl);
        formData.append(`podtyUrl`, editData.channel_podty);

        dispatch(
            saveJpodChannel({
                type: 'save',
                channelinfo: formData,
                callback: ({ header: { success, message }, body }) => {
                    console.log(success, message);
                    if (success === true) {
                        toast.success(message);
                        // const { boardId } = body;
                        // if (body.boardId) {
                        // 리스트를 다시 가지고 옴.
                        // dispatch(getSetmenuBoardsList());
                        // 게시판 정보 값도 다시 가지고 옴.
                        // dispatch(getBoardInfo({ boardId: body.boardId }));
                        // history.push(`/${pagePathName}/${boardId}`);
                        // }
                    } else {
                        const { totalCnt, list } = body;
                        if (totalCnt > 0 && Array.isArray(list)) {
                            // 에러 메시지 확인.
                            messageBox.alert(list[0].reason, () => {});
                        } else {
                            // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
                            messageBox.alert(message, () => {});
                        }
                    }
                },
            }),
        );
    };

    // 취소 버튼
    const handleCancleSaveButton = () => {};

    // 이미지 파일 변경시 각 스테이트 업데이트.
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

    useEffect(() => {
        if (selectReporter && selectReporter.length > 0) {
            console.log(selectReporter);
            setEditSelectRepoters(selectReporter);
        }
    }, [selectReporter]);

    useEffect(() => {
        if (selectPodty && selectPodty.castSrl) {
            const { castSrl, shareUrl } = selectPodty;
            setEditData({
                ...editData,
                podty_castSrl: castSrl,
                channel_podty: shareUrl,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectPodty]);

    useEffect(() => {
        // console.log(editData);
    }, [editData]);

    return (
        <MokaCard
            className="overflow-hidden flex-fill"
            title={`J팟 채널 ${editName ? '정보' : '등록'}`}
            titleClassName="mb-0"
            loading={loading}
            footer
            footerClassName="d-flex justify-content-center"
            footerButtons={[
                {
                    text: '저장',
                    variant: 'positive',
                    className: 'mr-2',
                    onClick: handleClickSaveButton,
                },
                { text: '취소', variant: 'negative', onClick: handleCancleSaveButton },
            ]}
        >
            <Form className="mb-gutter">
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            name="usedYn"
                            id="usedYn"
                            label="사용여부"
                            inputProps={{ checked: editData.usedYn === 'Y' ? true : false }}
                            onChange={(e) => handleChangeChannelEditData(e)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={10} className="p-0">
                        <MokaInputLabel
                            label={`팟티\n(채널연결)`}
                            labelWidth={60}
                            className="mb-0"
                            id="channel_podty"
                            name="channel_podty"
                            placeholder=""
                            value={editData.channel_podty}
                            onChange={(e) => handleChangeChannelEditData(e)}
                        />
                    </Col>
                    <Col xs={2} className="p-0 pt-1 pl-1 text-right">
                        <Button variant="searching" className="mb-0" onClick={() => handleClickPadtySearch()}>
                            팟티검색
                        </Button>
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel
                            label={`외부 채널\n(URL)`}
                            labelWidth={60}
                            className="mb-0"
                            id="channel_out"
                            name="channel_out"
                            placeholder=""
                            value={editData.channel_out}
                            onChange={(e) => handleChangeChannelEditData(e)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel
                            label={`채널명`}
                            labelWidth={60}
                            className="mb-0"
                            id="chnlNm"
                            name="chnlNm"
                            placeholder=""
                            value={editData.chnlNm}
                            onChange={(e) => handleChangeChannelEditData(e)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <div className="pl-2" style={{ width: '60px', minWidth: '60px', marginRight: '12px', marginLeft: '8px' }}></div>
                    <Col className="p-0">* 등록된 에피소드: 사용(201) | 중지(1) * 마지막 회차 정보 : E.99</Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel
                            label={`채널 소개`}
                            labelWidth={60}
                            as="textarea"
                            className="mb-2"
                            inputClassName="resize-none"
                            inputProps={{ rows: 6 }}
                            id="chnlMemo"
                            name="chnlMemo"
                            value={editData.chnlMemo}
                            onChange={(e) => handleChangeChannelEditData(e)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            label={`개설일`}
                            labelWidth={60}
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
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            label={`종료일`}
                            labelWidth={60}
                            as="dateTimePicker"
                            className="mb-0"
                            name="chnlEdt"
                            id="chnlEdt"
                            value={editData.chnlEdt}
                            onChange={(param) => {
                                const selectDate = param._d;
                                const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                                handleDateChange('chnlEdt', date);
                            }}
                            inputProps={{ timeFormat: null }}
                        />
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <MokaInputLabel label={`방송요일`} labelWidth={60} as="none" />
                    <MokaInputLabel
                        className="d-felx p-0 pl-0 pr-0"
                        as="switch"
                        name="day0"
                        id="day0"
                        label="매일"
                        labelWidth={30}
                        inputProps={{ checked: editDays.includes('day0') }}
                        onChange={(e) => handleChannelDay(e)}
                    />
                    <MokaInputLabel
                        labelClassName="pl-0 pr-0"
                        className="pr-0"
                        as="switch"
                        name="day1"
                        id="day1"
                        label="월"
                        labelWidth={10}
                        inputProps={{ checked: editDays.includes('day1') }}
                        onChange={(e) => handleChannelDay(e)}
                    />
                    <MokaInputLabel
                        className="pr-0"
                        as="switch"
                        name="day2"
                        id="day2"
                        label="화"
                        labelWidth={10}
                        inputProps={{ checked: editDays.includes('day2') }}
                        onChange={(e) => handleChannelDay(e)}
                    />
                    <MokaInputLabel
                        className="pr-0"
                        as="switch"
                        name="day3"
                        id="day3"
                        label="수"
                        labelWidth={10}
                        inputProps={{ checked: editDays.includes('day3') }}
                        onChange={(e) => handleChannelDay(e)}
                    />
                    <MokaInputLabel
                        className="pr-0"
                        as="switch"
                        name="day4"
                        id="day4"
                        label="목"
                        labelWidth={10}
                        inputProps={{ checked: editDays.includes('day4') }}
                        onChange={(e) => handleChannelDay(e)}
                    />
                    <MokaInputLabel
                        className="pr-0"
                        as="switch"
                        name="day5"
                        id="day5"
                        label="금"
                        labelWidth={10}
                        inputProps={{ checked: editDays.includes('day5') }}
                        onChange={(e) => handleChannelDay(e)}
                    />
                    <MokaInputLabel
                        className="pr-0"
                        as="switch"
                        name="day6"
                        id="day6"
                        label="토"
                        labelWidth={10}
                        inputProps={{ checked: editDays.includes('day6') }}
                        onChange={(e) => handleChannelDay(e)}
                    />
                    <MokaInputLabel
                        className="pr-0"
                        as="switch"
                        name="day7"
                        id="day7"
                        label="일"
                        labelWidth={10}
                        inputProps={{ checked: editDays.includes('day7') }}
                        onChange={(e) => handleChannelDay(e)}
                    />
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel
                            label={`태그`}
                            labelWidth={60}
                            className="mb-0"
                            id="keywords"
                            name="keywords"
                            placeholder=""
                            value={editData.keywords}
                            onChange={(e) => handleChangeChannelEditData(e)}
                        />
                    </Col>
                </Form.Row>
                <hr />
                <Form.Row className="mb-2">
                    <MokaInputLabel label={`진행자`} labelWidth={60} as="none" />
                    <Button xs={12} variant="searching" className="mb-0" onClick={() => handleClickSearchRepoterButton()}>
                        검색
                    </Button>
                </Form.Row>
                {(function () {
                    // 강제 6개.
                    return [0, 1, 2, 3, 4, 5].map((e, index) => {
                        return (
                            <Form.Row className="mb-2" key={index}>
                                <div className="d-flex align-items-center form-group">
                                    <div
                                        className="px-0 mb-0 position-relative flex-shrink-0 form-label"
                                        style={{ width: '60px', minWidth: '60px', marginRight: '12px', marginLeft: '8px' }}
                                    ></div>
                                </div>
                                <Col className="p-0">
                                    <Col className="p-0" style={{ backgroundColor: '#f4f7f9', height: '100px' }}>
                                        <Col className="d-flex w-100 h-50 align-items-center">
                                            <div style={{ width: '60px' }}>
                                                <MokaInput
                                                    id="memRepSeq"
                                                    name="memRepSeq"
                                                    className="ft-12"
                                                    value={editSelectRepoters[index] && editSelectRepoters[index].memRepSeq}
                                                    onChange={(e) => handleChangeReporters({ e, index })}
                                                    placeholder={`기자번호`}
                                                    disabled={true}
                                                />
                                            </div>
                                            <div style={{ width: '160px' }}>
                                                <MokaInput
                                                    id="memNm"
                                                    name="memNm"
                                                    className="ft-12"
                                                    value={editSelectRepoters[index] && editSelectRepoters[index].memNm}
                                                    onChange={(e) => handleChangeReporters({ e, index })}
                                                    placeholder={`기자명`}
                                                />
                                            </div>
                                            <div className="pl-3" style={{ width: '115px' }}>
                                                <MokaInput
                                                    id="repTitle"
                                                    name="repTitle"
                                                    className="ft-12"
                                                    value={editSelectRepoters[index] && editSelectRepoters[index].repTitle}
                                                    onChange={(e) => handleChangeReporters({ e, index })}
                                                    placeholder={`직책`}
                                                />
                                            </div>
                                            <div className="pl-3" style={{ width: '115px' }}>
                                                <MokaInput
                                                    id="nickNm"
                                                    name="nickNm"
                                                    className="ft-12"
                                                    value={editSelectRepoters[index] && editSelectRepoters[index].nickNm}
                                                    onChange={(e) => handleChangeReporters({ e, index })}
                                                    placeholder={`닉네임`}
                                                />
                                            </div>
                                            <div className="pl-3" style={{ width: '70px' }}>
                                                <Button variant="searching" className="mb-0" onClick={() => handleClickReporterDelete(index)}>
                                                    삭제
                                                </Button>
                                            </div>
                                        </Col>
                                        <Col xs={12} className="p-0 h-50 d-flex align-items-center">
                                            <Col xs={12}>
                                                <MokaInput
                                                    id="memMemo"
                                                    name="memMemo"
                                                    className="ft-12"
                                                    value={editSelectRepoters[index] && editSelectRepoters[index].memMemo}
                                                    onChange={(e) => handleChangeReporters({ e, index })}
                                                    placeholder={`설명`}
                                                />
                                            </Col>
                                        </Col>
                                    </Col>
                                </Col>
                            </Form.Row>
                        );
                    });
                })()}
                <hr />
                <Form.Row className="mb-2">
                    <MokaInputLabel className="pr-0" as="none" label="첨부파일" labelWidth={60} />
                </Form.Row>
                {/* 이미지 */}
                <MokaInputLabel
                    as="imageFile"
                    className="w-100 mb-2"
                    name="chnlImgMobFile"
                    isInvalid={null}
                    label={
                        <React.Fragment>
                            이미지
                            <br />
                            (1920*360)
                            <br />
                            <Button
                                className="mt-1"
                                size="sm"
                                variant="negative"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // imgFileRef1.current.deleteFile();
                                }}
                            >
                                삭제
                            </Button>
                        </React.Fragment>
                    }
                    ref={imgFileRef1}
                    inputProps={{
                        height: 80,
                        width: 600, // width: '100%' number type 에러남.
                        img: null,
                        selectAccept: ['image/jpeg'], // 이미지중 업로드 가능한 타입 설정.
                    }}
                    onChange={(file) =>
                        handleChangeFIle({
                            name: 'chnlImgFile',
                            file: file,
                        })
                    }
                    labelClassName="justify-content-end"
                />
                <Form.Row className="mb-2">
                    <Col xs={7}>
                        <MokaInputLabel
                            as="imageFile"
                            className="w-100 mb-2"
                            name="chnlThumbFile"
                            isInvalid={null}
                            label={
                                <React.Fragment>
                                    이미지
                                    <br />
                                    (750*330)
                                    <br />
                                    <Button
                                        className="mt-1"
                                        size="sm"
                                        variant="negative"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            // imgFileRef2.current.deleteFile();
                                        }}
                                    >
                                        삭제
                                    </Button>
                                </React.Fragment>
                            }
                            ref={imgFileRef2}
                            inputProps={{
                                height: 80,
                                width: 400, // width: '100%' number type 에러남.
                            }}
                            onChange={(file) =>
                                handleChangeFIle({
                                    name: 'chnlThumbFile',
                                    file: file,
                                })
                            }
                            labelClassName="justify-content-end"
                        />
                    </Col>
                    <Col xs={5}>
                        <MokaInputLabel
                            as="imageFile"
                            className="w-100 mb-2"
                            name="chnlImgMobFile"
                            id="chnlImgMobFile"
                            isInvalid={null}
                            label={
                                <React.Fragment>
                                    이미지
                                    <br />
                                    (150*150)
                                    <br />
                                    <Button
                                        className="mt-1"
                                        size="sm"
                                        variant="negative"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            // imgFileRef3.current.deleteFile();
                                        }}
                                    >
                                        삭제
                                    </Button>
                                </React.Fragment>
                            }
                            ref={imgFileRef3}
                            inputProps={{
                                height: 80,
                                width: 200, // width: '100%' number type 에러남.
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
                </Form.Row>
            </Form>
            <PodtyChannelModal
                show={podtyChannelModalState}
                onHide={() => {
                    setPodtyChannelModalState(false);
                }}
            />
            <RepoterModal
                show={repoterModalState}
                onHide={() => {
                    setRepoterModalState(false);
                }}
            />
        </MokaCard>
    );
};

export default ChannelEdit;
