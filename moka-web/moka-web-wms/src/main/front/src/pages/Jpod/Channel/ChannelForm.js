import React, { useState, useRef, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel, MokaInput } from '@components';
import ReporterListModal from '@pages/Reporter/modals/ReporterListModal';
import PodtyChannelModal from '@pages/Jpod/modals/PodtyChannelModal';
import MemberForm from './MemberForm';

const ChannelForm = (props) => {
    const {
        channel,
        error,
        keywordText,
        members,
        onChange,
        onChangeDate,
        onChangeImg,
        addMember,
        reporterToMember,
        onChangeMember,
        onDeleteMember,
        onResetMember,
        podtyToChannel,
    } = props;
    const [showPodtyModal, setShowPodtyModal] = useState(false);
    const [showReporterModal, setShowReporterModal] = useState(false);
    const img1Ref = useRef(null); // 커버 이미지 ref
    const img2Ref = useRef(null); // 모바일용 이미지 ref
    const img3Ref = useRef(null); // 썸네일 이미지 ref

    useEffect(() => {
        // 키가 바뀌면 이미지미리보기 제거
        if (img1Ref.current && !channel.chnlImg) {
            img1Ref.current.deleteFile();
        }
        if (img2Ref.current && !channel.chnlImgMob) {
            img2Ref.current.deleteFile();
        }
        if (img3Ref.current && !channel.chnlThumb) {
            img3Ref.current.deleteFile();
        }
    }, [channel.chnlImg, channel.chnlImgMob, channel.chnlSeq, channel.chnlThumb]);

    return (
        <div>
            {/* 사용여부 */}
            <MokaInputLabel
                className="mb-2"
                as="switch"
                name="usedYn"
                id="usedYn"
                label="사용여부"
                inputProps={{ checked: channel.usedYn === 'Y' ? true : false }}
                onChange={onChange}
            />

            {/* 팟티 채널 */}
            <Form.Row className="mb-2">
                <MokaInputLabel
                    label="팟티\n(채널연결)"
                    id="podtyChnlSrl"
                    name="podtyChnlSrl"
                    className="flex-fill mr-2"
                    value={channel.podtyChnlSrl === '0' ? '' : channel.podtyChnlSrl}
                    disabled
                />
                <Button variant="searching" className="flex-shrink-0" onClick={() => setShowPodtyModal(true)}>
                    팟티검색
                </Button>
                <PodtyChannelModal show={showPodtyModal} onHide={() => setShowPodtyModal(false)} onRowClicked={podtyToChannel} />
            </Form.Row>

            {/* 외부 채널 */}
            <MokaInputLabel label="팟티 채널\n(URL)" className="mb-2" id="podtyUrl" name="podtyUrl" placeholder="" value={channel.podtyUrl} onChange={onChange} />

            {/* 채널명 */}
            <MokaInputLabel label="채널명" className="mb-2" id="chnlNm" name="chnlNm" placeholder="" value={channel.chnlNm} onChange={onChange} isInvalid={error.chnlNm} required />

            {/* 에피소드 정보 */}
            {channel.episodeStat && (
                <div className="mb-2 d-flex">
                    <MokaInputLabel label=" " as="none" />
                    <div>
                        <span>* 등록된 에피소드: 사용({channel.episodeStat.usedCnt ? channel.episodeStat.usedCnt : 0})</span>
                        <span> | </span>
                        <span>중지({channel.episodeStat.unusedCnt ? channel.episodeStat.unusedCnt : 0})</span>
                        <span>* 마지막 회차 정보: {channel.episodeStat.lastEpsoNo ? channel.episodeStat.lastEpsoNo : ``}</span>
                    </div>
                </div>
            )}

            {/* 시즌 */}
            <Form.Row className="mb-2">
                <Col xs={9} className="p-0 pr-32">
                    <MokaInputLabel label="시즌명" id="seasonNm" name="seasonNm" value={channel.seasonNm} onChange={onChange} />
                </Col>
                <Col xs={3} className="p-0">
                    <MokaInputLabel label="총시즌" labelWidth={40} id="seasonCnt" name="seasonCnt" value={channel.seasonCnt} onChange={onChange} type="number" />
                </Col>
            </Form.Row>

            {channel.seasonNm && (
                <div className="mb-2 d-flex">
                    <MokaInputLabel label=" " as="none" />
                    <div>
                        <span>* {`${channel.seasonNm} ${channel.seasonCnt}`}</span>
                    </div>
                </div>
            )}

            {/* 채널 소개 */}
            <MokaInputLabel label="채널 소개" as="textarea" className="mb-2" inputProps={{ rows: 4 }} id="chnlMemo" name="chnlMemo" value={channel.chnlMemo} onChange={onChange} />

            {/* 개설일, 종료일 */}
            <Form.Row className="mb-2">
                <Col xs={6} className="p-0 pr-3">
                    <MokaInputLabel
                        label="개설일"
                        as="dateTimePicker"
                        name="chnlSdt"
                        id="chnlSdt"
                        value={channel.chnlSdt}
                        inputClassName="top"
                        onChange={(date) => onChangeDate('chnlSdt', date)}
                        inputProps={{ timeFormat: null, timeDefault: 'start' }}
                        isInvalid={error.chnlSdt}
                        required
                    />
                </Col>
                <Col xs={6} className="p-0 pl-3">
                    <MokaInputLabel
                        label="종료일"
                        as="dateTimePicker"
                        name="chnlEdt"
                        id="chnlEdt"
                        value={channel.chnlEdt}
                        inputClassName="top right"
                        onChange={(date) => onChangeDate('chnlEdt', date)}
                        inputProps={{ timeFormat: null, timeDefault: 'start' }}
                    />
                </Col>
            </Form.Row>

            {/* 방송요일 */}
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel label="방송요일" as="none" required />
                <div className="d-flex pt-1 flex-fill">
                    <MokaInput
                        as="checkbox"
                        name="chnlDy"
                        value="1234567"
                        id="day0"
                        onChange={onChange}
                        isInvalid={error.chnlDy}
                        inputProps={{ label: '매일', custom: true, checked: (channel.chnlDy || '').includes('1234567') }}
                    />
                    <MokaInput
                        as="checkbox"
                        name="chnlDy"
                        id="day1"
                        value="1"
                        onChange={onChange}
                        isInvalid={error.chnlDy}
                        inputProps={{ label: '월', custom: true, checked: (channel.chnlDy || '').includes('1') }}
                    />
                    <MokaInput
                        as="checkbox"
                        name="chnlDy"
                        id="day2"
                        value="2"
                        onChange={onChange}
                        isInvalid={error.chnlDy}
                        inputProps={{ label: '화', custom: true, checked: (channel.chnlDy || '').includes('2') }}
                    />
                    <MokaInput
                        as="checkbox"
                        name="chnlDy"
                        id="day3"
                        value="3"
                        onChange={onChange}
                        isInvalid={error.chnlDy}
                        inputProps={{ label: '수', custom: true, checked: (channel.chnlDy || '').includes('3') }}
                    />
                    <MokaInput
                        as="checkbox"
                        name="chnlDy"
                        id="day4"
                        value="4"
                        onChange={onChange}
                        isInvalid={error.chnlDy}
                        inputProps={{ label: '목', custom: true, checked: (channel.chnlDy || '').includes('4') }}
                    />
                    <MokaInput
                        as="checkbox"
                        name="chnlDy"
                        id="day5"
                        value="5"
                        onChange={onChange}
                        isInvalid={error.chnlDy}
                        inputProps={{ label: '금', custom: true, checked: (channel.chnlDy || '').includes('5') }}
                    />
                    <MokaInput
                        as="checkbox"
                        name="chnlDy"
                        id="day6"
                        value="6"
                        onChange={onChange}
                        isInvalid={error.chnlDy}
                        inputProps={{ label: '토', custom: true, checked: (channel.chnlDy || '').includes('6') }}
                    />
                    <MokaInput
                        as="checkbox"
                        name="chnlDy"
                        id="day7"
                        value="7"
                        onChange={onChange}
                        isInvalid={error.chnlDy}
                        inputProps={{ label: '일', custom: true, checked: (channel.chnlDy || '').includes('7') }}
                    />
                </div>
            </Form.Row>

            {/* 태그 */}
            <MokaInputLabel label="태그" className="mb-2" id="keywordText" name="keywordText" placeholder="" value={keywordText} onChange={onChange} />

            <hr />

            {/* 진행자 검색(모달) */}
            <Form.Row className="mb-14">
                <MokaInputLabel label="진행자" as="none" />
                <Button xs={12} variant="searching" className="mb-0 mr-1" onClick={() => setShowReporterModal(true)}>
                    기자 검색
                </Button>
                <ReporterListModal show={showReporterModal} onHide={() => setShowReporterModal(false)} onRowClicked={reporterToMember} />

                <Button variant="positive" onClick={addMember}>
                    추가
                </Button>
            </Form.Row>

            {members.length === 0 && (
                <div className="d-flex mb-2 p-3 d-flex justify-content-center rounded-lg color-gray-900" style={{ backgroundColor: '#f4f7f9' }}>
                    진행자가 없습니다
                </div>
            )}
            {members.map((member, index) => (
                <div className="d-flex mb-2 rounded-lg" key={index} style={{ backgroundColor: '#f4f7f9' }}>
                    <MemberForm index={index} member={member} onChangeMember={onChangeMember} onDeleteMember={onDeleteMember} onResetMember={onResetMember} />
                </div>
            ))}

            <hr />

            {/* 첨부파일 (커버이미지, 모바일용, 썸네일) */}
            <MokaInputLabel className="mb-2" as="none" label="첨부파일" />
            <MokaInputLabel
                as="imageFile"
                className="mb-2"
                name="chnlImgFile"
                inputClassName="flex-fill"
                labelClassName="justify-content-end"
                label={
                    <React.Fragment>
                        커버이미지
                        <br />
                        (1920*360)
                        <br />
                        <Button className="mt-1" size="sm" variant="gray-700" onClick={(e) => img1Ref.current.rootRef.onClick(e)}>
                            신규등록
                        </Button>
                    </React.Fragment>
                }
                ref={img1Ref}
                inputProps={{
                    height: 80,
                    img: channel.chnlImg,
                    accept: 'image/jpeg, image/png',
                    setFileValue: (file) => onChangeImg('chnlImgFile', file),
                    deleteButton: true,
                }}
            />
            <Form.Row>
                <Col xs={8} className="p-0 pr-32">
                    <MokaInputLabel
                        as="imageFile"
                        name="chnlImgMobFile"
                        inputClassName="flex-fill"
                        labelClassName="justify-content-end"
                        label={
                            <React.Fragment>
                                모바일용
                                <br />
                                (750*330)
                                <br />
                                <Button className="mt-1" size="sm" variant="gray-700" onClick={(e) => img2Ref.current.rootRef.onClick(e)}>
                                    신규등록
                                </Button>
                            </React.Fragment>
                        }
                        ref={img2Ref}
                        inputProps={{
                            height: 80,
                            img: channel.chnlImgMob,
                            accept: 'image/jpeg, image/png',
                            setFileValue: (file) => onChangeImg('chnlImgMobFile', file),
                            deleteButton: true,
                        }}
                    />
                </Col>
                <Col xs={4} className="p-0">
                    <MokaInputLabel
                        as="imageFile"
                        name="chnlThumbFile"
                        inputClassName="d-flex flex-fill"
                        label={
                            <React.Fragment>
                                썸네일
                                <br />
                                (150*150)
                                <br />
                                <Button className="mt-1" size="sm" variant="gray-700" onClick={(e) => img3Ref.current.rootRef.onClick(e)}>
                                    신규등록
                                </Button>
                            </React.Fragment>
                        }
                        ref={img3Ref}
                        inputProps={{
                            height: 80,
                            img: channel.chnlThumb,
                            accept: 'image/jpeg, image/png',
                            setFileValue: (file) => onChangeImg('chnlThumbFile', file),
                            deleteButton: true,
                        }}
                    />
                </Col>
            </Form.Row>
        </div>
    );
};

export default ChannelForm;
