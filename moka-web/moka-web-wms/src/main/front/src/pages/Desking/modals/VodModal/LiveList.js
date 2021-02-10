import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLiveList, GET_LIVE_LIST } from '@store/bright';
import { MokaTable, MokaCloseButton } from '@components';
import columnDefs from './LiveListColumns';
import OptionRenderer from './LiveOptionRenderer';

const LiveList = ({ show, resultVId, setResultVId, OVP_PREVIEW_URL }) => {
    const dispatch = useDispatch();
    const loading = useSelector((store) => store.loading[GET_LIVE_LIST]);
    const liveList = useSelector((store) => store.bright.live.list);
    const [rowData, setRowData] = useState([]);
    const [previewOn, setPreviewOn] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    /**
     * 미리보기
     */
    const handleClickPreview = useCallback(
        (data) => {
            setPreviewOn(true);
            setPreviewUrl(`${OVP_PREVIEW_URL}?videoId=${data.id}`);
        },
        [OVP_PREVIEW_URL],
    );

    /**
     * 테이블 row select 시
     */
    const handleSelectionChanged = useCallback(
        (params) => {
            if (params.length < 1 || !params[0].data) return;
            const { id } = params[0].data;
            setResultVId(id);
        },
        [setResultVId],
    );

    useEffect(() => {
        if (show) {
            dispatch(getLiveList());
        }
    }, [dispatch, show]);

    useEffect(() => {
        setRowData(
            liveList.map((vod, idx) => ({
                ...vod,
                handleClickPreview,
                liveTitle: `OVP_LIVE_CH${idx + 1}`,
                stateText: vod.status === 'processing' ? 'ON' : 'OFF',
            })),
        );
    }, [handleClickPreview, liveList]);

    return (
        <div>
            <MokaTable
                loading={loading}
                agGridHeight={190}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(data) => data.id}
                paging={false}
                selected={resultVId}
                frameworkComponents={{ optionRenderer: OptionRenderer }}
                onSelectionChanged={handleSelectionChanged}
                className="mb-3"
            />
            {previewOn && (
                <div className="absolute-top bg-white border p-3" style={{ width: 330, height: 356, left: 91 }}>
                    <MokaCloseButton onClick={() => setPreviewOn(false)} />
                    <iframe src={previewUrl} title="미리보기" frameBorder="0" className="w-100" style={{ height: 300 }} />
                </div>
            )}
            <p className="text-positive mb-0">※&nbsp;주의사항</p>
            <p className="text-positive mb-0">※&nbsp;미리보기 확인 후, 채널 선택 바랍니다.</p>
            <p className="mb-0">※&nbsp;온라인 송출 상태가 [on]이어야 서비스가 가능합니다. 아닌 경우 담당자에게 문의해주세요.</p>
            <p className="mb-0">※&nbsp;미리보기를 통해 라이브 영상이 정상적으로 재생되는지 확인 후 채널을 선택해주세요.</p>
            <p className="mb-0">※&nbsp;모바일에서는 서비스 정책 상 자동재생 기능이 불가합니다. (데이터요금 과다발생 이슈)</p>
        </div>
    );
};

export default LiveList;
