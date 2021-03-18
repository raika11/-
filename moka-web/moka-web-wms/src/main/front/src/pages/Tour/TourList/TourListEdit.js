import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput, MokaInputLabel } from '@/components';
import { getTourAge } from '@store/codeMgt';
import { getTourSetup, putTourApply, getTourApply, deleteTourApply, getTourDenyPossibleList, postResetPwd, previewTourMail } from '@/store/tour';
import toast, { messageBox } from '@/utils/toastUtil';

const TourListEdit = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const tourApply = useSelector((store) => store.tour.tourApply);
    const tourPossibleList = useSelector((store) => store.tour.tourPossibleList);
    const tourStatus = useSelector((store) => store.app.TOUR_STATUS);
    const tourAgeRows = useSelector((store) => store.codeMgt.tourAgeRows);
    const tourSetup = useSelector((store) => store.tour.tourSetup);
    const { tourSeq } = useParams();

    const [temp, setTemp] = useState({});
    const [personNum, setPersonNum] = useState(0);

    /**
     * input value
     */
    const handleChangeValue = useCallback(
        (e) => {
            const { name, value } = e.target;
            setTemp({ ...temp, [name]: value });
        },
        [temp],
    );

    /**
     * 비밀번호 초기화 버튼
     */
    const handleClickReset = () => {
        let resetPwd;
        if (temp.writerPhone) {
            resetPwd = temp.writerPhone.slice(-4);
            dispatch(
                postResetPwd({
                    phone: resetPwd,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            toast.success(header.message);
                            setTemp({ ...temp, writerPwd: body });
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        }
    };

    /**
     * 수정
     */
    const handleClickSave = useCallback(() => {
        let savetemp = {
            ...temp,
            tourDate: moment(temp.tourDate).format('YYYY-MM-DD HH:mm:ss'),
            regDt: moment(temp.regDt).format('YYYY-MM-DD HH:mm:ss'),
        };
        dispatch(
            putTourApply({
                tourApply: savetemp,
                callback: ({ header, body }) => {
                    if (header.success) {
                        toast.success(header.message);
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    }, [dispatch, temp]);

    /**
     * 삭제
     */
    const handleClickDelete = useCallback(() => {
        messageBox.confirm('해당 신청 내역을 삭제하시겠습니까?', () => {
            dispatch(
                deleteTourApply({
                    tourSeq: temp.tourSeq,
                    callback: ({ header }) => {
                        if (header.success) {
                            toast.success(header.message);
                            history.push(`${match.path}`);
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        });
    }, [dispatch, history, match.path, temp.tourSeq]);
    /**
     * 취소 버튼
     */
    const handleClickCancel = () => {
        history.push(match.url);
    };

    /**
     * 메일 미리보기 버튼
     */
    const handleClickPreview = (temp) => {
        let savetemp = {
            ...temp,
            tourDate: moment(temp.tourDate).format('YYYY-MM-DD HH:mm:ss'),
            regDt: moment(temp.regDt).format('YYYY-MM-DD HH:mm:ss'),
        };
        dispatch(
            previewTourMail({
                tourApply: savetemp,
                callback: ({ header, body }) => {
                    if (header.success) {
                        const previewMail = window.open(``, '메일 미리보기');
                        previewMail.document.body.innerHTML = body;
                        //toast.success(header.message);
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    };
    /*
    useImperativeHandle(
        ref,
        () => ({
            onSave: onSave,
            onDelete: onDelete,
        }),
        [onSave, onDelete],
    );*/

    useEffect(() => {
        if (Object.keys(tourApply).length < 1) {
            dispatch(getTourApply({ tourSeq: tourSeq }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (tourPossibleList.length < 1) {
            dispatch(getTourDenyPossibleList());
        }
    }, [dispatch, tourPossibleList.length]);

    useEffect(() => {
        if (tourSeq && tourApply.tourSeq) {
            setTemp({
                ...tourApply,
                tourDate: tourApply.tourDate.substr(0, 10),
                regDt: moment(tourApply.regDt, 'YYYY-MM-DD HH:mm:ss'),
            });
        }
    }, [tourApply, tourSeq]);

    useEffect(() => {
        if (!tourAgeRows) {
            dispatch(getTourAge());
        }
    }, [dispatch, tourAgeRows]);

    useEffect(() => {
        if (Object.keys(tourSetup).length < 1) {
            dispatch(getTourSetup());
        }

        if (Object.keys(tourSetup).length > 0) {
            setPersonNum(tourSetup.tourNumTo - tourSetup.tourNumFrom + 1);
        }
    }, [dispatch, tourSetup]);

    return (
        <MokaCard
            className="flex-fill"
            title="견학 신청서"
            footerClassName="justify-content-center"
            footer
            footerButtons={[
                {
                    text: '수정',
                    variant: 'positive',
                    className: 'mr-1',
                    onClick: handleClickSave,
                },
                {
                    text: '삭제',
                    variant: 'negative',
                    className: 'mr-1',
                    onClick: handleClickDelete,
                },
                {
                    text: '취소',
                    variant: 'negative',
                    className: 'mr-1',
                    onClick: handleClickCancel,
                },
                {
                    text: '메일 미리보기',
                    variant: 'outline-neutral',
                    onClick: () => handleClickPreview(temp),
                },
            ]}
        >
            <Form>
                <Form.Row className="mb-2">
                    <div style={{ width: 280 }}>
                        <MokaInputLabel as="select" name="tourDate" label="신청 일시" className="mb-0 mr-2" value={temp.tourDate} onChange={handleChangeValue}>
                            {tourPossibleList.map((date, idx) => (
                                <option key={idx} value={idx === 0 ? temp.tourDate : date.possDate.substr(0, 10)}>
                                    {idx === 0 ? temp.tourDate : date.possDate.substr(0, 10)}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </div>
                    <div style={{ width: 120 }}>
                        <MokaInput as="select" name="tourTime" value={temp.tourTime} onChange={handleChangeValue}>
                            <option value="10">오전 10시 30분</option>
                            <option value="14">오후 2시</option>
                        </MokaInput>
                    </div>
                </Form.Row>
                <div style={{ width: 220 }}>
                    <MokaInputLabel as="select" label="신청 상태" className="mb-2" value={temp.tourStatus} name="tourStatus" onChange={handleChangeValue}>
                        {tourStatus &&
                            tourStatus.map((s) => (
                                <option key={s.code} value={s.code}>
                                    {s.name}
                                </option>
                            ))}
                    </MokaInputLabel>
                </div>
                {temp.tourStatus === 'R' && (
                    <MokaInputLabel
                        as="textarea"
                        label="반려 사유"
                        className="mb-2"
                        inputClassName="resize-none"
                        inputProps={{ rows: 4 }}
                        value={temp.returnReason}
                        name="returnReason"
                        onChange={handleChangeValue}
                    />
                )}
                <div style={{ width: 400 }}>
                    <MokaInputLabel label="단체명" className="mb-2" name="tourGroupNm" value={temp.tourGroupNm} onChange={handleChangeValue} />
                </div>
                <Form.Row className="mb-2">
                    <div style={{ width: 280 }}>
                        <MokaInputLabel as="select" label="견학 인원" className="mb-0 mr-2" value={temp.tourAge} name="tourAge" onChange={handleChangeValue}>
                            {tourAgeRows &&
                                tourAgeRows.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.name}
                                    </option>
                                ))}
                        </MokaInputLabel>
                    </div>
                    <div style={{ width: 120 }}>
                        <MokaInput as="select" name="tourPersons" value={temp.tourPersons} onChange={handleChangeValue}>
                            {[...Array(personNum)].map((d, idx) => {
                                return (
                                    <option key={idx} value={idx + tourSetup.tourNumFrom}>
                                        {idx + tourSetup.tourNumFrom}명
                                    </option>
                                );
                            })}
                        </MokaInput>
                    </div>
                </Form.Row>
                <MokaInputLabel
                    as="textarea"
                    label="견학 목적"
                    inputClassName=" resize-none"
                    inputProps={{ rows: 4 }}
                    value={temp.tourPurpose}
                    name="tourPurpose"
                    onChange={handleChangeValue}
                />

                <hr />

                <MokaInputLabel label="신청자 정보" className="mb-2" as="none" />
                <Form.Row className="mb-2">
                    <MokaInputLabel
                        label="성명"
                        className="mb-0 mr-2"
                        inputProps={{ readOnly: true, plaintext: true }}
                        name="writerNm"
                        value={temp.writerNm}
                        onChange={handleChangeValue}
                    />
                    <MokaInputLabel
                        label="연락처"
                        className="mb-0"
                        inputProps={{ readOnly: true, plaintext: true }}
                        name="writerPhone"
                        value={temp.writerPhone}
                        onChange={handleChangeValue}
                    />
                </Form.Row>
                <MokaInputLabel
                    label="이메일"
                    className="mb-2"
                    inputProps={{ readOnly: true, plaintext: true }}
                    name="writerEmail"
                    value={temp.writerEmail}
                    onChange={handleChangeValue}
                />
                <Form.Row className="mb-2">
                    <Col xs={6} className="px-0">
                        <MokaInputLabel label="비밀번호\n(4자리)" inputProps={{ readOnly: true }} className="mb-0 mr-2" name="writerPwd" type="password" value="****" />
                        <MokaInput inputProps={{ readOnly: true }} name="writerPwd" type="hidden" value={temp.writerPwd} />
                    </Col>
                    <Col xs={6} className="px-0 d-flex align-items-center">
                        <Button variant="negative" onClick={handleClickReset}>
                            비밀번호 초기화
                        </Button>
                    </Col>
                </Form.Row>

                <hr />

                <MokaInputLabel label="담당자 정보" className="mb-2" as="none" />
                <MokaInputLabel label="부서" className="mb-2" name="chargeDept" value={temp.chargeDept} onChange={handleChangeValue} />
                <MokaInputLabel label="성명" className="mb-2" name="chargeStaffNm" value={temp.chargeStaffNm} onChange={handleChangeValue} />
                <MokaInputLabel label="연락처" className="mb-2" name="chargePhone" value={temp.chargePhone} onChange={handleChangeValue} />

                <div className="mt-3 color-secondary">
                    <p className="m-0">※ 최초 한번의 승인/반려 시에만 메일이 발송됩니다.</p>
                    <p className="m-0">※ 신청자의 이메일 정보는 아이디 개념이라 수정할 수 없습니다.</p>
                </div>
            </Form>
        </MokaCard>
    );
};

export default TourListEdit;
