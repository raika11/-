import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { MokaInputLabel, MokaModal } from '@components';
import { MokaLoader } from '@components';
import MokaEditor from '@/components/MokaEditor/MokaEditorCore';
import { putSnapshotComponentWork, postSaveComponentWork, PUT_SNAPSHOT_COMPONENT_WORK, POST_SAVE_COMPONENT_WORK } from '@store/desking';
import { previewComponentModal, PREVIEW_COMPONENT_MODAL } from '@store/merge';
import toast from '@utils/toastUtil';

/**
 * Html 수동 편집 모달 컴포넌트
 */
const HtmlEditModal = (props) => {
    const { show, onHide, data } = props;
    const dispatch = useDispatch();
    const { area, loading } = useSelector(
        (store) => ({
            area: store.desking.area,
            loading: store.loading[PREVIEW_COMPONENT_MODAL] || store.loading[PUT_SNAPSHOT_COMPONENT_WORK] || store.loading[POST_SAVE_COMPONENT_WORK],
        }),
        [shallowEqual],
    );

    // state
    const [defaultValue, setDefaultValue] = useState(null);
    const [body, setBody] = useState('');

    /**
     * 임시저장 콜백
     */
    const saveCallback = ({ componentWorkSeq }) => {
        dispatch(
            postSaveComponentWork({
                componentWorkSeq,
                callback: ({ header }) => {
                    if (!header.success) {
                        toast.warn(header.message);
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
        toast.confirm(
            '임시저장 하시겠습니까?',
            () => {
                dispatch(
                    putSnapshotComponentWork({
                        componentWorkSeq: data.seq,
                        snapshotYn: 'Y',
                        snapshotBody: body,
                        callback: ({ header }) => {
                            if (header.success) {
                                saveCallback({ componentWorkSeq: data.seq });
                            } else {
                                toast.warn(header.message);
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
            previewComponentModal({
                pageSeq: area.page.pageSeq,
                componentWorkSeq: data.seq,
                resourceYn: 'Y',
                callback: ({ header, body }) => {
                    if (header.success) {
                        let win = window.open('', '스냅샷 미리보기');
                        win.document.body.innerHTML = body;
                    } else {
                        toast.warn(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 닫기 버튼
     */
    const handleClickClose = () => {
        setBody('');
        setDefaultValue(null);
        onHide();
    };

    useEffect(() => {
        if (show) {
            dispatch(
                previewComponentModal({
                    pageSeq: area.page.pageSeq,
                    componentWorkSeq: data.seq,
                    resourceYn: 'N',
                    callback: ({ header, body }) => {
                        if (header.success) {
                            setBody(body);
                            setDefaultValue(body);
                        }
                    },
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, area]);

    return (
        <MokaModal
            title="HTML 수동 편집"
            size="xl"
            show={show}
            onHide={onHide}
            width={700}
            height={770}
            buttons={[
                { variant: 'positive', text: '임시저장', onClick: handleClickSave },
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
                labelClassName="ft-12 font-weight-bold mr-3"
                inputClassName="ft-12"
                inputProps={{ readOnly: true, plaintext: true }}
                value={`${data.componentName}`}
            />
            <MokaEditor defaultValue={defaultValue} value={body} onBlur={(value) => setBody(value)} />
        </MokaModal>
    );
};

export default HtmlEditModal;
