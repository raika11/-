import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MokaCard, MokaCardTabs } from '@components';

/**
 * 구독 관리 > 구독 설계 > 등록, 수정
 */
const SubscriptionDesignEdit = () => {
    const { seqNo } = useParams();
    const [activeKey, setActiveKey] = useState(0);

    return (
        <MokaCard
            title={`구독 ${seqNo ? '수정' : '등록'}`}
            className="w-100"
            headerClassName="pb-0"
            bodyClassName="p-0 m-0"
            footerClassName="position-relative"
            footerButtons={[
                seqNo && {
                    text: '복사',
                    variant: 'outline-neutral',
                    className: 'mr-1',
                },
                seqNo && {
                    text: '수정',
                    variant: 'positive',
                    className: 'mr-1',
                },
                seqNo && {
                    text: '취소',
                    variant: 'negative',
                    className: 'mr-1',
                },
                seqNo && {
                    text: '중지',
                    variant: 'negative',
                },
                !seqNo && {
                    text: '임시저장',
                    variant: 'temp',
                    className: 'mr-1',
                },
                !seqNo && {
                    text: '취소',
                    variant: 'negative',
                    className: 'mr-1',
                },
                !seqNo && {
                    text: '등록',
                    variant: 'positive',
                },
                activeKey !== 3 && {
                    text: '다음',
                    variant: 'negative',
                    onClick: () => setActiveKey(Number(activeKey + 1)),
                    style: { position: 'absolute', right: 0 },
                },
            ].filter(Boolean)}
        >
            <MokaCardTabs
                fill
                activeKey={activeKey}
                onSelectNav={(key) => setActiveKey(key)}
                className="w-100 h-100 shadow-none"
                tabs={[<div>상세</div>]}
                tabNavs={['STEP 1\n기본정보 설정', 'STEP 2\n대상고객 설정', 'STEP 3\n구독제안 설정', 'STEP 4\n제안방법 설정']}
            />
        </MokaCard>
    );
};

export default SubscriptionDesignEdit;
