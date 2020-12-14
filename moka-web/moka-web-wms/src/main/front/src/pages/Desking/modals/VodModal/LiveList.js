import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLiveList, GET_LIVE_LIST } from '@store/bright';
import { MokaLoader } from '@components';

const LiveList = ({ show }) => {
    const dispatch = useDispatch();

    const loading = useSelector((store) => store.loading[GET_LIVE_LIST]);
    // const liveList = useSelector((store) => store.bright.live.list);

    useEffect(() => {
        if (show) {
            dispatch(getLiveList());
        }
    }, [dispatch, show]);

    return (
        <div className="positive-relative h-100 w-100 px-3">
            {loading && <MokaLoader />}
            <div style={{ height: 260 }}>테이블영역</div>
            <p className="text-positive mb-0">※&nbsp;주의사항</p>
            <p className="text-positive mb-0">※&nbsp;미리보기 확인 후, 채널 선택 바랍니다.</p>
            <p className="mb-0">※&nbsp;온라인 송출 상태가 [on]이어야 서비스가 가능합니다. 아닌 경우 담당자에게 문의해주세요.</p>
            <p className="mb-0">※&nbsp;미리보기를 통해 라이브 영상이 정상적으로 재생되는지 확인 후 채널을 선택해주세요.</p>
            <p className="mb-0">※&nbsp;모바일에서는 서비스 정책 상 자동재생 기능이 불가합니다. (데이터요금 과다발생 이슈)</p>
        </div>
    );
};

export default LiveList;
