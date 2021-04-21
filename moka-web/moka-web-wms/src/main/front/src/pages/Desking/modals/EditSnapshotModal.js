import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API_BASE_URL } from '@/constants';
import { MokaInputLabel, MokaModal, MokaLoader } from '@components';
import MokaEditor from '@components/MokaEditor/MokaEditorCore';
import {
    putSnapshotComponentWork,
    postSaveComponentWork,
    PUT_SNAPSHOT_COMPONENT_WORK,
    POST_SAVE_COMPONENT_WORK,
    PREVIEW_SNAPSHOT_MODAL,
    previewSnapshotModal,
    onHideSnapshotModal,
} from '@store/desking';
import { previewComponentModal, PREVIEW_COMPONENT_MODAL } from '@store/merge';
import toast, { messageBox } from '@utils/toastUtil';

/**
 * Html 수동 편집(스냅샷) 모달
 */
const EditSnapshotModal = (props) => {
    const { show, onHide, component } = props;
    const dispatch = useDispatch();
    const loading = useSelector(
        ({ loading }) => loading[PREVIEW_COMPONENT_MODAL] || loading[PUT_SNAPSHOT_COMPONENT_WORK] || loading[POST_SAVE_COMPONENT_WORK] || loading[PREVIEW_SNAPSHOT_MODAL],
    );
    const area = useSelector(({ desking }) => desking.area);
    const [defaultValue, setDefaultValue] = useState('');
    const [body, setBody] = useState('');
    const changeFlag = useRef(false); // snapshotYn이 변경되었는지 파악

    /**
     * 임시저장 콜백
     */
    const saveCallback = ({ componentWorkSeq }) => {
        dispatch(
            postSaveComponentWork({
                componentWorkSeq,
                callback: ({ header }) => {
                    if (!header.success) {
                        toast.fail(header.message);
                    } else {
                        toast.success(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 임시저장 버튼
     */
    const handleClickSave = () => {
        messageBox.confirm(
            '임시저장 하시겠습니까?',
            () => {
                dispatch(
                    putSnapshotComponentWork({
                        componentWorkSeq: component.seq,
                        snapshotYn: 'Y',
                        snapshotBody: body,
                        callback: ({ header }) => {
                            if (header.success) {
                                saveCallback({ componentWorkSeq: component.seq });
                            } else {
                                toast.fail(header.message);
                            }
                        },
                    }),
                );
            },
            () => {},
        );
    };

    /**
     * 미리보기 버튼
     */
    const handleClickPreview = () => {
        dispatch(
            previewSnapshotModal({
                areaSeq: area.areaSeq,
                componentWorkSeq: component.seq,
                snapshotYn: 'Y',
                snapshotBody: body,
                callback: ({ header }) => {
                    if (header.success && area.areaSeq) {
                        // let win = window.open('', '스냅샷 미리보기');
                        // win.document.body.innerHTML = body;
                        window.open(`${API_BASE_URL}/preview/desking/area?areaSeq=${area.areaSeq}`, '미리보기');
                    } else {
                        toast.fail(header.message);
                    }
                    changeFlag.current = true;
                },
            }),
        );
    };

    /**
     * 닫기 버튼
     * @desc
     * component.snapshotYn === 'N' && changeFlag.current 이면 워크의 snapshotYn = 'N'으로 변경한다
     */
    const handleClickClose = () => {
        if (component.snapshotYn === 'N' && changeFlag.current) {
            dispatch(
                onHideSnapshotModal({
                    componentWorkSeq: component.seq,
                    snapshotYn: 'N',
                    snapshotBody: null,
                    callback: ({ header }) => {
                        if (header.success) {
                            setBody('');
                            setDefaultValue(null);
                            onHide();
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        } else {
            setBody('');
            setDefaultValue(null);
            onHide();
        }
    };

    useEffect(() => {
        if (!show) return;
        dispatch(
            previewComponentModal({
                areaSeq: area.areaSeq,
                componentWorkSeq: component.seq,
                resourceYn: 'N',
                callback: ({ header, body }) => {
                    if (header.success) {
                        setBody(body);
                        setDefaultValue(body);
                    } else {
                        toast.fail(header.message);
                    }
                },
            }),
        );
    }, [show, area, dispatch, component.seq]);

    return (
        <MokaModal
            title="HTML 수동 편집"
            size="xl"
            show={show}
            onHide={onHide}
            width={700}
            height={770}
            buttons={[
                { variant: 'positive-a', text: '임시저장', onClick: handleClickSave },
                { variant: 'outline-neutral', text: '미리보기', onClick: handleClickPreview },
                { variant: 'negative', text: '닫기', onClick: handleClickClose },
            ]}
            bodyClassName="position-relative h-100 w-100 overflow-hidden"
            footerClassName="d-flex justify-content-center"
            draggable
        >
            {loading && <MokaLoader />}
            <MokaInputLabel
                label="컴포넌트명"
                labelWidth={80}
                className="w-100"
                labelClassName="font-weight-bold mr-3"
                inputProps={{ readOnly: true, plaintext: true }}
                value={component.componentName}
            />
            <MokaEditor defaultValue={defaultValue} value={body} onBlur={(value) => setBody(value)} />
        </MokaModal>
    );
};

export default EditSnapshotModal;
