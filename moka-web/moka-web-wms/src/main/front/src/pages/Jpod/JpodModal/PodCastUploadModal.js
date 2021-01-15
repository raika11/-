import React, { useEffect, useState, useRef } from 'react';
import { Form, Col, Button, Row } from 'react-bootstrap';
import { MokaModal, MokaTable, MokaInputLabel } from '@components';
import { columnDefs } from './PodCastModalGridColumns';
import { tempPodCastList } from '@pages/Jpod/JpodConst';
import { useSelector, useDispatch } from 'react-redux';
import { GET_PODTY_EPISODE_LIST, getPodtyEpisodeList, clearPodtyEpisode, selectPodtyEpisode, changePodtyEpisodeCastsrl } from '@store/jpod';

const PodCastUploadModal = (props) => {
    const dispatch = useDispatch();
    const { show, onHide, chnlseq } = props;
    const [rowData, setRowData] = useState([]);

    const fileinputRef = useRef(null);

    const { list, loading } = useSelector((store) => ({
        list: store.jpod.podtyEpisode.list,
        loading: store.loading[GET_PODTY_EPISODE_LIST],
    }));

    const tempEvent = () => {};

    // 닫기 버튼
    const handleClickHide = () => {
        onHide();
    };

    // 목록 클릭 store 를 업데이트후 모달창 닫기.
    const handleClickListRow = ({ info }) => {
        // dispatch(selectPodtyEpisode(info));
        onHide();
    };

    const handleClickSaveButton = () => {};

    // store list 가 변경되면 grid 목록 업데이트.
    // useEffect(() => {
    //     const initGridRow = (data) => {
    //         setRowData(
    //             data.map((element) => {
    //                 let crtDt = element.crtDt && element.crtDt.length > 10 ? element.crtDt.substr(0, 10) : element.crtDt;
    //                 return {
    //                     episodeSrl: element.episodeSrl,
    //                     title: element.title,
    //                     crtDt: crtDt,
    //                     castSrl: element.castSrl,
    //                     trackCnt: element.trackCnt,
    //                     author: element.author,
    //                     shareUrl: element.shareUrl,
    //                     info: element,
    //                 };
    //             }),
    //         );
    //     };

    //     if (list.length > 0) {
    //         initGridRow(list);
    //     }
    // }, [list]);
    useEffect(() => {
        const initGridRow = (data) => {
            setRowData(
                data.map((element) => {
                    let regDt = element.regDt && element.regDt.length > 10 ? element.regDt.substr(0, 10) : element.regDt;
                    return {
                        seq: element.seq,
                        title: element.title,
                        status: element.status,
                        regDt: regDt,
                    };
                }),
            );
        };

        if (tempPodCastList.list.length > 0) {
            initGridRow(tempPodCastList.list);
        }
    }, []);

    // 모달창이 열리면 팟티 목록 가져오고, 닫으면 목록 초기화.
    useEffect(() => {
        // if (show === true) {
        //     dispatch(getPodtyEpisodeList());
        // } else {
        //     dispatch(clearPodtyEpisode());
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    // 에피소드 정보에서 채널 선택해서 스토어 변경되면 Castsrl 값 설정.
    useEffect(() => {
        // if (chnlseq) {
        //     dispatch(changePodtyEpisodeCastsrl(chnlseq));
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chnlseq]);

    return (
        <>
            <MokaModal
                width={900}
                show={show}
                onHide={handleClickHide}
                title={`미디어 업로드`}
                size="md"
                bodyClassName="overflow-x-hidden custom-scroll"
                footerClassName="d-flex justify-content-center"
                buttons={[
                    { text: '저장', variant: 'positive', onClick: handleClickSaveButton },
                    { text: '닫기', variant: 'negative', onClick: handleClickHide },
                ]}
                draggable
            >
                <Form>
                    <Form.Row className="mb-2">
                        <Col className="p-0">
                            <MokaInputLabel label={`채널명`} labelWidth={64} className="mb-0" id="chnlNm" name="chnlNm" placeholder="" value={''} onChange={(e) => tempEvent(e)} />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mb-2">
                        <Col className="p-0">
                            <MokaInputLabel label={`제목`} labelWidth={64} className="mb-0" id="chnlNm" name="chnlNm" placeholder="" value={''} onChange={(e) => tempEvent(e)} />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mb-2">
                        <Col xs={10} className="p-0">
                            <MokaInputLabel label={`파일`} labelWidth={64} className="mb-0" id="chnlNm" name="chnlNm" placeholder="" value={''} onChange={(e) => tempEvent(e)} />
                        </Col>
                        <Col xs={2} className="p-0 text-right">
                            <div className="file btn btn-primary" style={{ position: 'relative', overflow: 'hidden' }}>
                                등록
                                <input
                                    type="file"
                                    name="file"
                                    ref={fileinputRef}
                                    // onClick={(e) => (fileinputRef.current = e)}
                                    onChange={(e) => tempEvent(e)}
                                    style={{
                                        position: 'absolute',
                                        fontSize: '50px',
                                        opacity: '0',
                                        right: '0',
                                        top: '0',
                                    }}
                                />
                            </div>
                        </Col>
                    </Form.Row>
                </Form>
            </MokaModal>
        </>
    );
};

export default PodCastUploadModal;
