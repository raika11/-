import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import imageEditer from '@utils/imageEditorUtil';
import commonUtil from '@utils/commonUtil';
import { MokaImage, MokaInputLabel } from '@components';
import { EditThumbModal } from '@pages/Desking/modals';

/**
 * 대표이미지 폼
 */
const ImageForm = ({ component, contentId, partKey, temp, onChange, fileName }) => {
    const [show, setShow] = useState(false);

    /**
     * 이미지 편집기 생성
     */
    const handleEditThumb = () => {
        imageEditer.create(
            temp.thumbFileName,
            (imageSrc) => {
                (async () => {
                    await fetch(imageSrc)
                        .then((r) => r.blob())
                        .then((blobFile) => {
                            const file = commonUtil.blobToFile(blobFile, String(fileName));
                            onChange({ thumbnailFile: file, imageSrc });
                        });
                })();
            },
            { cropWidth: component?.cropWidth || 300, cropHeight: component?.cropHeight || 300 },
        );
    };

    /**
     * 신규등록 모달 => apply
     */
    const handleThumbFileApply = (imageSrc, file) => {
        onChange({ thumbnailFile: file, imageSrc });
    };

    return (
        <Form.Row key={partKey} className="mb-2">
            <div className="d-flex">
                <MokaInputLabel as="none" label="대표\n이미지" className="mb-0" />
                <MokaImage img={temp.irImg} width={216} />
            </div>
            <div className="d-flex flex-column justify-content-end ml-2">
                <Button variant="gray-700" size="sm" onClick={() => setShow(true)} className="mb-1">
                    신규등록
                </Button>
                <Button variant="outline-gray-700" size="sm" onClick={handleEditThumb}>
                    편집
                </Button>
            </div>

            {/* 대표이미지 신규등록 모달 */}
            <EditThumbModal
                show={show}
                cropHeight={component?.cropHeight}
                cropWidth={component?.cropWidth}
                onHide={() => setShow(false)}
                totalId={contentId}
                saveFileName={String(fileName)}
                thumbFileName={temp.thumbFileName}
                apply={handleThumbFileApply}
                accept="image/jpeg, image/gif"
            />
        </Form.Row>
    );
};

export default ImageForm;
