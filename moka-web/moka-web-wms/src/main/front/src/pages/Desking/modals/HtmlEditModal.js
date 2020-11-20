import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaInputLabel, MokaModal } from '@components';
import MokaEditor from '@/components/MokaEditor/MokaEditorCore';
import { putComponentWork } from '@store/desking';
import toast from '@utils/toastUtil';

/**
 * Html 수동 편집 모달 컴포넌트
 */
const HtmlEditModal = (props) => {
    const { show, onHide, data } = props;
    const dispatch = useDispatch();

    // state
    const [body, setBody] = useState(data.snapshotBody);

    /**
     * 저장 버튼
     * @param {object} data 컴포넌트 데이터
     */
    const handleClickSave = (e) => {
        const option = {
            componentWorkSeq: data.seq,
            snapshotYn: 'Y',
            snapshotBody: body,
            templateSeq: data.templateSeq,
            callback: ({ header }) => {
                if (header.success) {
                    toast.success(header.message);
                } else {
                    toast.warn(header.message);
                }
            },
        };
        if (e) {
            toast.confirm(
                `선택하신 ${data.componentSeq} ${data.componentName}을 전송하시겠습니까?`,
                () => {
                    dispatch(putComponentWork(option));
                    onHide();
                },
                () => {},
            );
        }
    };

    /**
     * 닫기 버튼
     */
    const handleClickClose = () => {
        setBody('');
        onHide();
    };

    return (
        <MokaModal
            title="Html 수동 편집"
            size="xl"
            show={show}
            onHide={onHide}
            width={700}
            height={770}
            buttons={[
                { variant: 'positive', text: '저장 후 등록', onClick: handleClickSave },
                { variant: 'outline-neutral', text: '미리보기' },
                { variant: 'negative', text: '닫기', onClick: handleClickClose },
            ]}
            bodyClassName="position-relative h-100 w-100 overflow-hidden"
            footerClassName="d-flex justify-content-center"
            draggable
        >
            <MokaInputLabel label="컴포넌트명" className="w-100" inputProps={{ readOnly: true, plaintext: true }} value={`${data.componentSeq} ${data.componentName}`} />
            <MokaEditor defaultValue={data.snapshotBody} value={body} onBlur={(value) => setBody(value)} />
        </MokaModal>
    );
};

export default HtmlEditModal;
