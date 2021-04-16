import React, { useState, useEffect, useCallback } from 'react';
import qs from 'qs';
import { useDispatch, useSelector } from 'react-redux';
import { MokaModal, MokaCardTabs } from '@components';
import { changeVodOptions, clearVodOptions } from '@store/bright';
import LiveList from './LiveList';
import OvpList from './OvpList';
import YoutubeList from './YoutubeList';
import { messageBox } from '@utils/toastUtil';

/**
 * vod url 검색&입력 모달
 */
const VodModal = ({ show, onHide, vodUrl, onSave }) => {
    const dispatch = useDispatch();
    const vodOptions = useSelector((store) => store.bright.vodOptions);
    const OVP_PREVIEW_URL = useSelector((store) => store.app.OVP_PREVIEW_URL);
    const [activeKey, setActivekey] = useState(0);
    const [selected, setSelected] = useState({});
    const [youtubeUrl, setYoutubeUrl] = useState({ url: '', option: '' });

    /**
     * 취소, 닫기
     */
    const handleHide = useCallback(() => {
        setActivekey(0);
        setSelected({});
        setYoutubeUrl({ url: '', option: '' });
        dispatch(clearVodOptions());
        if (onHide) onHide();
    }, [dispatch, onHide]);

    /**
     * 저장
     */
    const handleSave = () => {
        let url = '';

        // 유튜브 예외처리
        if (activeKey === 0) {
            url = `${youtubeUrl.url}${youtubeUrl.option}`;
        } else {
            if (!selected) {
                messageBox.warn('선택된 URL이 없습니다');
                return;
            } else {
                const op = vodOptions[selected.id];
                // options[loop]=true 이런 형식
                url = `${OVP_PREVIEW_URL}?videoId=${selected.id}&${qs.stringify({ options: op }, { encode: false })}`;
            }
        }
        if (onSave) onSave(url, selected || {});
        handleHide();
    };

    useEffect(() => {
        try {
            if (show && vodUrl && vodUrl !== '') {
                const url = vodUrl.split('?');

                // 유튜브 영상인지 체크
                if (url[0].indexOf('.youtu') > -1) {
                    // youtubeUrl 유지 안돼도 됨
                } else {
                    if (url[1]) {
                        const searchParams = qs.parse(url[1]);
                        // string value => boolean으로 변경
                        const convert = Object.keys(searchParams.options).reduce((all, cv) => ({ ...all, [cv]: searchParams.options[cv] === 'true' }), {});
                        dispatch(
                            changeVodOptions({
                                key: searchParams.videoId,
                                value: convert,
                            }),
                        );
                    }
                }
            }
        } catch (e) {}
    }, [dispatch, show, vodUrl]);

    useEffect(() => {
        return () => {
            handleHide();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaModal
            width={500}
            height={610}
            title="동영상 URL 선택"
            show={show}
            onHide={handleHide}
            bodyClassName="p-0"
            buttons={[
                { text: '등록', onClick: handleSave, variant: 'positive' },
                { text: '취소', onClick: handleHide, variant: 'negative' },
            ]}
            id="vod"
            centered
            draggable
        >
            <MokaCardTabs
                fill
                onSelectNav={(idx) => setActivekey(Number(idx))}
                tabNavs={['YOUTUBE', 'LIVE', 'OVP']}
                className="w-100 h-100"
                tabs={[
                    <YoutubeList show={show && activeKey === 0} youtubeUrl={youtubeUrl} setYoutubeUrl={setYoutubeUrl} />,
                    <LiveList show={show && activeKey === 1} selected={selected} setSelected={setSelected} OVP_PREVIEW_URL={OVP_PREVIEW_URL} />,
                    <OvpList show={show && activeKey === 2} selected={selected} setSelected={setSelected} />,
                ]}
            />
        </MokaModal>
    );
};

export default VodModal;
