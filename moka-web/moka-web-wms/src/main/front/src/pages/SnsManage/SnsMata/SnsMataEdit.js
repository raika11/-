import React from 'react';
import { MokaCard, MokaInputLabel } from '@components';

const SnsMataEdit = () => {
    return (
        <MokaCard width={535} title={`메타 ${true ? '정보' : '등록'}`} titleClassName="mb-0" loading={null}>
            메타 정보 들어갈 자리.
        </MokaCard>
    );
};

export default SnsMataEdit;
