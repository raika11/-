import React, { useEffect, useState, useRef } from 'react';
import { Form, Col } from 'react-bootstrap';
import { MokaModal, MokaInputLabel } from '@components';
import { useDispatch } from 'react-redux';
import { savePodcast } from '@store/jpod';
import toast, { messageBox } from '@utils/toastUtil';

// 기본 정보 설정.
const editinitialState = {
    epsdNm: '',
};

/**
 * J팟 관리 > 에피소드 > 팟캐스트 모달 > 팟캐스트 업로드 모달
 */
const PodcastUploadModal = (props) => {
    const { show, onHide, epsdNm } = props;
    const dispatch = useDispatch();

    const fileinputRef = useRef(null);
    const [editData, setEditData] = useState(editinitialState);
    const [selectFile, setSelectFile] = useState(null);

    // 닫기 버튼
    const handleClickHide = () => {
        onHide();
    };

    // 저장 버튼 클릭.
    const handleClickSaveButton = () => {
        var formData = new FormData();
        formData.append(`mediaFile`, selectFile);
        formData.append(`name`, editData.title);

        dispatch(
            savePodcast({
                ovpdata: formData,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        const { chnlSeq, epsdSeq } = body;
                        if ((chnlSeq, epsdSeq)) {
                        }
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

    // 정보 변경 처리.
    const handleChangeEditData = (e) => {
        const { name, value } = e.target;
        setEditData({
            ...editData,
            [name]: value,
        });
    };

    // 파일 선택시 처리.
    const handleChangeSelectFile = (e) => {
        setSelectFile(e.target.files[0]);
        setEditData({
            ...editData,
            input_file: e.target.files[0].name,
        });
    };

    // 최초 모달창 로딩시 채널명 설정.
    useEffect(() => {
        setEditData({
            ...editData,
            epsdNm: epsdNm,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <MokaModal
                width={900}
                show={show}
                onHide={handleClickHide}
                title={`브라이트 코브 업로드`}
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
                            <MokaInputLabel
                                label={`채널명`}
                                labelWidth={64}
                                className="mb-0"
                                id="epsdNm"
                                name="epsdNm"
                                placeholder=""
                                value={editData.epsdNm}
                                onChange={(e) => handleChangeEditData(e)}
                            />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mb-2">
                        <Col className="p-0">
                            <MokaInputLabel
                                label={`제목`}
                                labelWidth={64}
                                className="mb-0"
                                id="title"
                                name="title"
                                placeholder=""
                                value={editData.title}
                                onChange={(e) => handleChangeEditData(e)}
                            />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mb-2">
                        <Col xs={10} className="p-0">
                            <MokaInputLabel
                                label={`파일`}
                                labelWidth={64}
                                className="mb-0"
                                id="input_file"
                                name="input_file"
                                placeholder=""
                                ref={fileinputRef}
                                value={editData.input_file}
                                onChange={(e) => handleChangeEditData(e)}
                            />
                        </Col>
                        <Col xs={2} className="p-0 text-right">
                            <div className="file btn btn-primary" style={{ position: 'relative', overflow: 'hidden' }}>
                                파일선택
                                <input
                                    type="file"
                                    name="file"
                                    ref={fileinputRef}
                                    // onClick={(e) => (fileinputRef.current = e)}
                                    onChange={(e) => handleChangeSelectFile(e)}
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

export default PodcastUploadModal;
