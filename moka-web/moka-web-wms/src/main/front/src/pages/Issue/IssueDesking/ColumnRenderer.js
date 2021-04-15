import React, { forwardRef, useImperativeHandle } from 'react';
import Button from 'react-bootstrap/Button';
import { MokaIcon, MokaImage, MokaInputLabel } from '@components';

const labelWidth = 50;

/**
 * 기사 렌더러
 */
const ArticleRenderer = forwardRef((params, ref) => {
    /**
     * 관련기사 삭제
     */
    const handleDeleteArticle = () => {
        params.api.applyTransaction({ remove: [{ ...params.node.data }] });
    };

    useImperativeHandle(
        ref,
        () => ({
            refresh: () => true,
        }),
        [],
    );

    return (
        <div className="w-100 h-100 d-flex align-items-center">
            <div className="flex-fill d-flex">
                <div className="flex-shrink-0 d-flex flex-column mr-3">
                    <MokaImage width={115} img={params.node.data.artThumb} ratio={[6, 4]} />
                    <div className="d-flex justify-content-between mt-1">
                        <Button size="sm" variant="gray-700" className="mr-1">
                            신규 등록
                        </Button>
                        <Button size="sm" variant="outline-gray-700">
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
                        <Button variant="searching" className="flex-shrink-0">
                            영상검색
                        </Button>
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
