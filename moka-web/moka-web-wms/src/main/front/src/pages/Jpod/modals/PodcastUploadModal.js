import React, { useEffect, useState, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { MokaModal, MokaInputLabel } from '@components';
import { useDispatch, useSelector } from 'react-redux';
import { savePodcast, SAVE_PODCAST } from '@store/jpod';
import toast, { messageBox } from '@utils/toastUtil';

/**
 * J팟 관리 > 에피소드 > 팟캐스트 모달 > 팟캐스트 업로드 모달
 *
 * 브라이트코브 서버가 실서버라 테스트 못함!!!
 */
const PodcastUploadModal = (props) => {
    const { show, onHide, selectedChannel } = props;
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[SAVE_PODCAST]);
    const fileRef = useRef(null);
    const [temp, setTemp] = useState({});
    const [tag, setTag] = useState('');
    const [error, setError] = useState({});

    /**
     * 닫기
     */
    const handleHide = () => {
        setTemp({});
        setTag('');
        setError({});
        onHide();
    };

    /**
     * 저장
     */
    const handleSave = () => {
        const saveData = { ...temp, tag: [tag] };

        if (!saveData.title || saveData.title === '') {
            setError({ ...error, title: true });
            return;
        }

        dispatch(
            savePodcast({
                ovpdata: saveData,
                callback: ({ header: { success, message }, body }) => {
                    if (success) {
                        toast.success(message);
                        handleHide();
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

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value, files } = e.target;

        if (name === 'tag') {
            setTag(value);
        } else if (name === 'mediaFile') {
            setTemp({
                ...temp,
                [name]: files[0],
            });
        } else {
            setTemp({
                ...temp,
                [name]: value,
            });
        }

        if (error[name]) setError({ ...error, [name]: false });
    };

    useEffect(() => {
        if (show) {
            setTag(selectedChannel.chnlNm);
        }
    }, [selectedChannel.chnlNm, show]);

    return (
        <MokaModal
            width={600}
            show={show}
            onHide={handleHide}
            title="미디어 업로드"
            size="md"
            bodyClassName="overflow-x-hidden custom-scroll"
            buttons={[
                { text: '저장', variant: 'positive', onClick: handleSave },
                { text: '닫기', variant: 'negative', onClick: handleHide },
            ]}
            loading={loading}
            id="podcast-upload-modal"
            centered
        >
            <MokaInputLabel label="채널명" className="mb-2" id="tag" name="tag" placeholder="" value={tag} onChange={handleChangeValue} />
            <MokaInputLabel label="제목" className="mb-2" id="title" name="title" placeholder="" value={temp.title} onChange={handleChangeValue} isInvalid={error.title} required />
            <Form.Row className="mb-2">
                <MokaInputLabel label="파일" id="filename" className="flex-fill mr-2" value={temp.mediaFile?.name} disabled />
                <input type="file" className="d-none" name="mediaFile" ref={fileRef} onChange={handleChangeValue} />
                <Button variant="searching" className="flex-shrink-0" onClick={() => fileRef.current.click()}>
                    파일선택
                </Button>
            </Form.Row>
        </MokaModal>
    );
};

export default PodcastUploadModal;
