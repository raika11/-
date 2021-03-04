import React, { useImperativeHandle, forwardRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import commonUtil from '@utils/commonUtil';
import imageEditer from '@utils/imageEditorUtil';
import { messageBox } from '@utils/toastUtil';
import { MokaInputLabel, MokaImage, MokaIcon } from '@components';
import { EditThumbModal } from '@pages/Desking/modals';

const RelArticleRenderer = forwardRef((params, ref) => {
    const [arcShow, setArcShow] = useState(false);
    const [article, setArticle] = useState(params.node.data);

    /**
     * 제목 변경
     * @param {object} e 이벤트
     */
    const handleChangeTitle = (e) => {
        setArticle({
            ...article,
            artTitle: e.target.value,
        });
    };

    /**
     * 제목 변경 blur
     * @param {object} e 이벤트
     */
    const handleChangeBlur = (e) => {
        params.api.applyTransaction({ update: [{ ...params.node.data, artTitle: e.target.value }] });
    };

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
        params.api.applyTransaction({ delete: [{ ...params.node.data, artThumb: imageSrc, artThumbFile: file }] });
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
                                const file = commonUtil.blobToFile(blobFile, new Date().getTime());
                                setArticle({
                                    ...article,
                                    artThumb: editImageSrc,
                                    artThumbFile: file,
                                });
                                params.api.applyTransaction({ delete: [{ ...params.node.data, artThumb: editImageSrc, artThumbFile: file }] });
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
        <div key={article.totalId} className="py-1 pl-1 pr-2 d-flex align-items-center">
            {/* 썸네일 변경/편집 버튼 */}
            <div className="d-flex flex-column mr-3">
                <Button variant="gray-700" size="sm" className="w-100" onClick={() => setArcShow(true)}>
                    신규등록
                </Button>
                <Button variant="outline-gray-700" size="sm" className="mt-1 w-100" onClick={handleEditClick}>
                    편집
                </Button>
            </div>
            {/* 썸네일 이미지 */}
            <MokaImage img={article.artThumb} width={115} />
            {/* 기사 ID, 제목 노출 */}
            <div className="flex-fill ml-3">
                <MokaInputLabel label="기사ID" className="mb-1" labelWidth={40} name="totalId" value={article.totalId} disabled />
                <MokaInputLabel label="제목" labelWidth={40} name="artTitle" value={article.artTitle} onChange={handleChangeTitle} inputProps={{ onBlur: handleChangeBlur }} />
            </div>
            {/* 기사 삭제버튼 */}
            <div className="ml-3 flex-shrink-0">
                <Button variant="white" className="border-0 p-0 bg-transparent" onClick={handleDeleteArticle}>
                    <MokaIcon iconName="fas-minus-circle" />
                </Button>
            </div>

            {/* 포토 아카이브 모달 */}
            <EditThumbModal
                show={arcShow}
                cropHeight={300}
                cropWidth={300}
                onHide={() => setArcShow(false)}
                totalId={article.totalId}
                thumbFileName={article.artThumb}
                apply={handleThumbFileApply}
            />
        </div>
    );
});

export default RelArticleRenderer;
