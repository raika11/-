import React, { useImperativeHandle, forwardRef, useState } from 'react';
import clsx from 'clsx';
import { MokaIcon, MokaModal } from '@components';

const GroupNumberRenderer = forwardRef((params, ref) => {
    const { data } = params;
    const { artGroupNum, ovpYn, youtubeYn } = data;
    const [previewOn, setPreviewOn] = useState(false);

    // 테스트용 데이터
    // const artGroupNum = (data.totalId % 8) + 1;
    // const youtubeYn = data.totalId % 2 === 0 ? 'Y' : 'N';
    // const ovpYn = data.totalId % 3 === 0 ? 'Y' : 'N';

    // 리턴 ref 설정
    useImperativeHandle(ref, () => ({
        refresh: (params) => params.data.artGroupNum !== artGroupNum || params.data.youtubeYn !== youtubeYn || params.data.ovpYn !== ovpYn,
    }));

    return (
        <div className="d-flex flex-column overflow-hidden h-100 py-1">
            <div className="article-group-number mb-1" data-group-number={artGroupNum}>
                {artGroupNum}
            </div>
            {(youtubeYn === 'Y' || ovpYn === 'Y') && (
                <div
                    className={clsx('article-media', {
                        youtube: youtubeYn === 'Y' && ovpYn !== 'Y',
                        ovp: youtubeYn !== 'Y' && ovpYn === 'Y',
                    })}
                    data-ovp={ovpYn}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.currentTarget.dataset['ovp'] === 'Y') {
                            setPreviewOn(true);
                        }
                    }}
                >
                    <MokaIcon iconName="fas-play-circle" />
                </div>
            )}

            {/* ovp 미리보기 */}
            <MokaModal show={previewOn} onHide={() => setPreviewOn(false)} width={500} size="md" title="영상보기" centered>
                <iframe src={data.ovpLink} title="미리보기" frameBorder="0" className="w-100" style={{ height: 300 }} />
            </MokaModal>
        </div>
    );
});

export default GroupNumberRenderer;
