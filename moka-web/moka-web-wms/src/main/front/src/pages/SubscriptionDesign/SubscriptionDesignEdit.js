import React from 'react';
import { useParams } from 'react-router-dom';
import { MokaCard } from '@components';

/**
 * 구독 관리 > 구독 설계 > 등록, 수정
 */
const SubscriptionDesignEdit = () => {
    const { seqNo } = useParams();

    return (
        <MokaCard title={`구독 ${seqNo ? '수정' : '등록'}`} className="w-100">
            <div>상세</div>
        </MokaCard>
    );
};

export default SubscriptionDesignEdit;
