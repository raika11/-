import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { MokaModal } from '@components';
import { getEditForm, saveEditFormXml } from '@/store/editForm';
import { useDispatch, useSelector } from 'react-redux';
import toast from '@utils/toastUtil';
/**
 * 신규 폼 xml 파일 업로드
 */
const EditFormImportModal = (props) => {
    const { show, onHide } = props;
    const dispatch = useDispatch();

    const [fileValue, setFileValue] = useState(null);

    const { importForm } = useSelector((store) => ({
        importForm: store.editForm.importForm,
    }));

    const handleChangeValue = async (event) => {
        const files = event.target.files;
        setFileValue(files);
    };

    /**
     * 닫기
     */
    const handleHide = () => {
        onHide();
    };

    /**
     * 퍼블리시
     */
    const handleUpload = () => {
        if (fileValue && fileValue.length > 0) {
            dispatch(
                saveEditFormXml(fileValue[0], importForm, (response) => {
                    toast.result(response, () => {
                        handleHide();
                    });
                }),
            );
        }
    };

    return (
        <MokaModal
            width={600}
            show={show}
            onHide={handleHide}
            title={importForm ? `${importForm.title} - 편집 폼 XML 업로드` : `신규 편집 폼 XML 업로드`}
            size="md"
            buttons={[
                { text: '저장', variant: 'positive', onClick: handleUpload },
                { text: '취소', variant: 'negative', onClick: handleHide },
            ]}
            footerClassName="justify-content-center"
            draggable
        >
            <Form>
                <Form.Group>
                    <Form.File id="xmlFile" label="업로드 할 xml파일을 선택하세요." onChange={handleChangeValue} />
                </Form.Group>
            </Form>
        </MokaModal>
    );
};

export default EditFormImportModal;
