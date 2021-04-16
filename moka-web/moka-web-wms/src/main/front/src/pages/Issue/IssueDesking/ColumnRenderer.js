import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Button from 'react-bootstrap/Button';
import commonUtil from '@utils/commonUtil';
import imageEditer from '@utils/imageEditorUtil';
import { messageBox } from '@utils/toastUtil';
import { VodModal, EditThumbModal } from '@pages/Desking/modals';
import { MokaIcon, MokaImage, MokaInputLabel } from '@components';

const labelWidth = 50;
const cropHeight = 300;
const cropWidth = 300;

/**
 * 기사 렌더러
 */
const ArticleRenderer = forwardRef((params, ref) => {
    const [show, setShow] = useState(false);
    const [vodShow, setVodShow] = useState(false);
    const [article, setArticle] = useState(params.node.data);

    /**
     * 관련기사 삭제
     */
    const handleDeleteArticle = () => {
        params.api.applyTransaction({ remove: [{ ...params.node.data }] });
    };

    /**
     * 이미지 신규등록
     * @param {string} imageSrc 이미지 src
     * @param {*} file 파일데이터
     */
    const handleThumbFileApply = (imageSrc, file) => {
        setArticle({
            ...article,
            artThumb: imageSrc,
            artThumbFile: file,
        });
        params.api.applyTransaction({ update: [{ ...params.node.data, artThumb: imageSrc, artThumbFile: file }] });
    };

    /**
     * 이미지 편집
     */
    const handleEditClick = () => {
        if (article.artThumb) {
            imageEditer.create(
                article.artThumb,
                (editImageSrc) => {
                    (async () => {
                        await fetch(editImageSrc)
                            .then((r) => r.blob())
                            .then((blobFile) => {
                                const file = commonUtil.blobToFile(blobFile, commonUtil.getUniqueKey);
                                setArticle({
                                    ...article,
                                    artThumb: editImageSrc,
                                    artThumbFile: file,
                                });
                                params.api.applyTransaction({ update: [{ ...params.node.data, artThumb: editImageSrc, artThumbFile: file }] });
                            });
                    })();
                },
                { cropWidth: 300, cropHeight: 300 },
            );
        } else {
            messageBox.alert('편집할 이미지가 없습니다');
        }
    };

    useImperativeHandle(
        ref,
        () => ({
            refresh: (params) => {
                setArticle(params.node.data || {});
                return true;
            },
        }),
        [],
    );

    return (
        <div className="w-100 h-100 d-flex align-items-center">
            <div className="flex-fill d-flex">
                <div className="flex-shrink-0 d-flex flex-column mr-3">
                    <MokaImage width={115} img={params.node.data.artThumb} ratio={[6, 4]} />
                    <div className="d-flex justify-content-between mt-1">
                        <Button size="sm" variant="gray-700" className="mr-1" onClick={() => setShow(true)}>
                            신규 등록
                        </Button>
                        <EditThumbModal
                            show={show}
                            cropHeight={cropHeight}
                            cropWidth={cropWidth}
                            onHide={() => setShow(false)}
                            totalId={params.node.data.totalId}
                            thumbFileName={params.node.data.artThumb}
                            apply={handleThumbFileApply}
                        />
                        <Button size="sm" variant="outline-gray-700" onClick={handleEditClick}>
                            편집
                        </Button>
                    </div>
                </div>
                <div className="d-flex flex-fill flex-column">
                    <MokaInputLabel label="제목" labelWidth={labelWidth} value={params.node.data.artTitle} disabled className="mb-2" />
                    <MokaInputLabel label="URL" labelWidth={labelWidth} value={params.node.data.artTitle} disabled className="mb-2" />
                    <MokaInputLabel label="리드문" labelWidth={labelWidth} as="textarea" value={params.node.data.artTitle} disabled className="mb-2" inputProps={{ rows: 3 }} />
                    <div className="d-flex">
                        <MokaInputLabel label="영상 URL" labelWidth={labelWidth} value={params.node.data.artTitle} disabled className="flex-fill mr-2" />
                        <Button variant="searching" className="flex-shrink-0" onClick={() => setVodShow(true)}>
                            영상검색
                        </Button>
                        <VodModal show={vodShow} onHide={() => setVodShow(false)} />
                    </div>
                </div>
            </div>
            <div className="pl-2 pr-1 flex-shrink-0">
                <Button variant="white" className="border-0 p-0 bg-transparent" onClick={handleDeleteArticle}>
                    <MokaIcon iconName="fas-minus-circle" />
                </Button>
            </div>
        </div>
    );
});

export { ArticleRenderer };
