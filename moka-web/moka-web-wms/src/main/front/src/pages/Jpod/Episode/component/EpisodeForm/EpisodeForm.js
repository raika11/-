import React, { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { messageBox } from '@utils/toastUtil';
import { MokaInputLabel, MokaInput } from '@components';
import { PodtyEpisodeModal, PodcastModal } from '@pages/Jpod/modals';
import PannelForm from './PannelForm';
import RelArticleTable from './RelArticleTable';

const EpisodeForm = ({
    selectedChannel,
    channelList,
    episode,
    error,
    cpMembers,
    egMembers,
    keywordText,
    onChange,
    onChangeImg,
    onSelectPodty,
    onSelectPodcast,
    addMember,
    reporterToMember,
    onChangeMember,
    onDeleteMember,
    onResetMember,
    gridInstance,
    setGridInstance,
}) => {
    const [podtyShow, setPodtyShow] = useState(false);
    const [podcastshow, setPodcastShow] = useState(false);
    const img1Ref = useRef(null); // 메타 이미지 ref
    const img2Ref = useRef(null); // 카톡 이미지 ref

    /**
     * 팟티 팝업
     */
    const findPodty = () => {
        if (!episode.chnlSeq || episode.chnlSeq === '') {
            messageBox.alert('채널을 선택해 주세요.');
            return;
        } else {
            setPodtyShow(true);
        }
    };

    useEffect(() => {
        // 키가 바뀌면 이미지미리보기 제거
        if (img1Ref.current && !episode.shrImg) {
            img1Ref.current.deleteFile();
        }
        if (img2Ref.current && !episode.katalkImg) {
            img2Ref.current.deleteFile();
        }
    }, [episode.epsdSeq, episode.katalkImg, episode.shrImg]);

    return (
        <div>
            {/* 사용여부 */}
            <MokaInputLabel
                as="switch"
                name="usedYn"
                id="usedYn"
                className="mb-2"
                label="사용여부"
                inputProps={{ checked: episode.usedYn === 'Y' ? true : false }}
                onChange={onChange}
            />

            {/* 채널 선택 */}
            <Form.Row className="mb-2">
                <Col xs={6} className="p-0">
                    <MokaInputLabel label="채널명" as="select" id="chnlSeq" name="chnlSeq" value={episode.chnlSeq} onChange={onChange} isInvalid={error.chnlSeq} required>
                        <option hidden>채널 선택</option>
                        {channelList.map((ch) => (
                            <option key={ch.chnlSeq} value={ch.chnlSeq} data-podtychnlsrl={ch.podtyChnlSrl}>
                                {ch.chnlNm}
                            </option>
                        ))}
                    </MokaInputLabel>
                </Col>
            </Form.Row>

            {/* 팟티 에피소드 검색 */}
            <Form.Row className="mb-2 align-items-center">
                <MokaInputLabel
                    label="팟티 연결"
                    id="podtyEpsdSrl"
                    className="mr-2 flex-fill"
                    name="podtyEpsdSrl"
                    placeholder=""
                    value={episode.podtyEpsdSrl}
                    onChange={onChange}
                />
                <Button variant="searching" className="flex-shrink-0" onClick={findPodty}>
                    팟티 에피소드 검색
                </Button>
                <PodtyEpisodeModal show={podtyShow} castSrl={selectedChannel?.podtyChnlSrl} onHide={() => setPodtyShow(false)} onRowClicked={onSelectPodty} />
            </Form.Row>

            {/* 에피소드 명 */}
            <MokaInputLabel
                label="에피소드명"
                id="epsdNm"
                name="epsdNm"
                placeholder=""
                className="mb-2"
                value={episode.epsdNm}
                onChange={onChange}
                isInvalid={error.epsdNm}
                required
            />

            {/* 에피소드 내용 */}
            <MokaInputLabel
                label="에피소드 내용"
                as="textarea"
                className="mb-2"
                inputProps={{ rows: 6 }}
                id="epsdMemo"
                name="epsdMemo"
                value={episode.epsdMemo}
                onChange={onChange}
                isInvalid={error.epsdMemo}
                required
            />

            {/* 시즌, 회차 */}
            <Form.Row className="mb-2">
                <Col xs={5} className="p-0 pr-32">
                    <MokaInputLabel label="시즌 및 회차" className="flex-fill" as="select" name="seasonNo" id="seasonNo" value={episode.seasonNo} onChange={onChange}>
                        <option value="0">시즌 해당 없음</option>
                        {[...Array(selectedChannel.seasonCnt || 0)].map((n, idx) => {
                            return (
                                <option key={idx} value={idx + 1}>
                                    시즌 {idx + 1}
                                </option>
                            );
                        })}
                    </MokaInputLabel>
                </Col>
                <Col xs={3} className="p-0 pr-2">
                    <MokaInputLabel label="회차" labelWidth={35} name="epsdNo" id="epsdNo" value={episode.epsdNo} onChange={onChange} />
                </Col>
                <Col xs={4} className="p-0 d-flex align-items-center">
                    <p className="mb-0">마지막 회차: {selectedChannel?.episodeStat?.lastEpsoNo ? `${selectedChannel?.episodeStat?.lastEpsoNo}회` : ''}</p>
                </Col>
            </Form.Row>

            {/* 방송일 */}
            <Form.Row className="mb-2">
                <Col xs={5} className="p-0">
                    <MokaInputLabel
                        label="방송일"
                        as="dateTimePicker"
                        name="epsdDate"
                        id="epsdDate"
                        value={episode.epsdDate}
                        inputClassName="top"
                        onChange={(date) => {
                            onChange({ target: { name: 'epsdDate', value: date } });
                        }}
                        inputProps={{ timeFormat: null, timeDefault: 'start' }}
                    />
                </Col>
            </Form.Row>

            {/* 태그 */}
            <MokaInputLabel className="mb-2" label="태그" id="keywordText" name="keywordText" placeholder="" value={keywordText} onChange={onChange} />

            {/* 팟캐스트 구분 */}
            <Form.Row>
                <MokaInputLabel
                    label="팟캐스트 구분"
                    as="radio"
                    inputProps={{
                        custom: true,
                        label: '오디오',
                        checked: episode.jpodType === 'A',
                    }}
                    id="jpodType1"
                    name="jpodType"
                    className="mr-32"
                    onChange={onChange}
                    value="A"
                    required
                />
                <MokaInputLabel
                    as="radio"
                    inputProps={{
                        custom: true,
                        label: '비디오',
                        checked: episode.jpodType === 'V',
                    }}
                    id="jpodType2"
                    name="jpodType"
                    onChange={onChange}
                    value="V"
                    required
                />
            </Form.Row>

            <hr />

            {/* 팟캐스트 파일 등록 */}
            <Form.Row className="mb-2">
                <MokaInputLabel as="none" label="URL" />
                <div className="px-2 flex-fill d-flex align-items-center" style={{ backgroundColor: '#f4f7f9', height: '50px' }}>
                    <MokaInput name="epsdFile" className="mr-2" id="epsdFile" value={episode.epsdFile} onChange={onChange} />
                    <Button variant="positive" className="mr-3 flex-shrink-0" onClick={() => setPodcastShow(true)}>
                        등록
                    </Button>
                    <PodcastModal show={podcastshow} onHide={() => setPodcastShow(false)} onRowClicked={onSelectPodcast} selectedChannel={selectedChannel} />

                    <div style={{ width: 250 }}>
                        <MokaInputLabel label="재생시간" labelWidth={50} name="playTime" value={episode.playTime} onChange={onChange} />
                    </div>
                </div>
            </Form.Row>

            <hr />

            {/* 메타이미지, 카톡 이미지 */}
            {episode.jpodType === 'V' && (
                <React.Fragment>
                    <Form.Row className="mb-2">
                        <Col xs={6} className="p-0 pr-3">
                            <MokaInputLabel
                                as="imageFile"
                                name="shrImg"
                                inputClassName="flex-fill"
                                labelClassName="justify-content-end"
                                label={
                                    <React.Fragment>
                                        메타 이미지
                                        <br />
                                        (1200*627)
                                        <br />
                                        <Button className="mt-1" size="sm" variant="gray-700" onClick={(e) => img1Ref.current.rootRef.onClick(e)}>
                                            신규등록
                                        </Button>
                                    </React.Fragment>
                                }
                                ref={img1Ref}
                                inputProps={{
                                    img: episode.shrImg,
                                    accept: 'image/jpeg, image/png',
                                    setFileValue: (file) => onChangeImg('shrImgFile', file),
                                    deleteButton: true,
                                }}
                            />
                        </Col>
                        <Col xs={6} className="p-0 pl-3">
                            <MokaInputLabel
                                as="imageFile"
                                name="katalkImg"
                                inputClassName="d-flex flex-fill"
                                label={
                                    <React.Fragment>
                                        카톡 이미지
                                        <br />
                                        (1200*627)
                                        <br />
                                        <Button className="mt-1" size="sm" variant="gray-700" onClick={(e) => img2Ref.current.rootRef.onClick(e)}>
                                            신규등록
                                        </Button>
                                    </React.Fragment>
                                }
                                ref={img2Ref}
                                inputProps={{
                                    img: episode.katalkImg,
                                    setFileValue: (file) => onChangeImg('katalkImgFile', file),
                                    deleteButton: true,
                                    accept: 'image/jpeg, image/png',
                                }}
                            />
                        </Col>
                    </Form.Row>

                    <hr />
                </React.Fragment>
            )}

            {/* 출연진 (고정패널) */}
            <PannelForm
                label="출연진(고정패널)"
                memDiv="CP"
                members={cpMembers}
                addMember={addMember}
                reporterToMember={reporterToMember}
                onChangeMember={onChangeMember}
                onDeleteMember={onDeleteMember}
                onResetMember={onResetMember}
            />

            <hr />

            {/* 출연진 (게스트) */}
            <PannelForm
                label="출연진(게스트)"
                memDiv="EG"
                members={egMembers}
                addMember={addMember}
                reporterToMember={reporterToMember}
                onChangeMember={onChangeMember}
                onDeleteMember={onDeleteMember}
                onResetMember={onResetMember}
            />

            <hr />

            {/* 관련기사 테이블 */}
            <RelArticleTable articles={episode.articles || []} gridInstance={gridInstance} setGridInstance={setGridInstance} />
        </div>
    );
};

export default EpisodeForm;
