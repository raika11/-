import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import toast from '@utils/toastUtil';
import { MokaIcon, MokaModal } from '@components';

const GroupNumberRenderer = forwardRef((params, ref) => {
    const OVP_PREVIEW_URL = useSelector(({ app }) => app.OVP_PREVIEW_URL);
    const [previewOn, setPreviewOn] = useState(false);
    const [data, setData] = useState(params.node.data);

    // 테스트용 데이터
    // const artGroupNum = (data.totalId % 8) + 1;
    // const youtubeYn = data.totalId % 2 === 0 ? 'Y' : 'N';
    // const ovpYn = data.totalId % 3 === 0 ? 'Y' : 'N';

    useImperativeHandle(ref, () => ({
        refresh: (params) => {
            setData(params.node.data);
            return true;
        },
    }));

    return (
        <div className="d-flex flex-column overflow-hidden h-100 py-1">
            <div className="article-group-number mb-1" data-group-number={data.artGroupNum}>
                {data.artGroupNum}
            </div>
            {(data.youtubeYn === 'Y' || data.ovpYn === 'Y') && (
                <div
                    className={clsx('article-media', {
                        youtube: data.youtubeYn === 'Y' && data.ovpYn !== 'Y',
                        ovp: data.youtubeYn !== 'Y' && data.ovpYn === 'Y',
                    })}
                    data-ovp={data.ovpYn}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.currentTarget.dataset['ovp'] === 'Y') {
                            setPreviewOn(true);
                        } else {
                            toast.warning('유투브 영상은 미리보기가 지원되지 않습니다');
                        }
                    }}
                >
                    <MokaIcon iconName="fas-play-circle" />
                </div>
            )}

            {/* ovp 미리보기 */}
            <MokaModal show={previewOn} onHide={() => setPreviewOn(false)} width={500} size="md" title="영상보기" centered>
                <iframe src={`${OVP_PREVIEW_URL}${(data.ovpLink || '').replaceAll('?', '&')}`} title="미리보기" frameBorder="0" className="w-100" style={{ height: 300 }} />
            </MokaModal>
        </div>
    );
});

export default GroupNumberRenderer;
