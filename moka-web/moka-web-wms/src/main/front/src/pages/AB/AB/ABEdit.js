import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaCardTabs } from '@components';
import { ABMainForm, ABEtcForm, ABStatusRow } from '../components';
import { useSelector } from 'react-redux';

/**
 * A/B 테스트 > 전체 목록 > 탭 > 정보
 */

const ABEdit = () => {
    const { ab: data } = useSelector((store) => store.ab.ab);

    return (
        <MokaCard title="AB테스트명" headerClassName="pb-0" className="w-100 shadow-none" bodyClassName="p-0 m-0">
            <MokaCardTabs
                className="w-100 h-100 shadow-none"
                tabNavs={['주요 설정', '기타 설정']}
                tabs={[
                    <div>
                        <div className="d-flex justify-content-end mb-2">
                            <Button variant="outline-neutral" className="flex-shrink-0 mr-1">
                                복사
                            </Button>
                            <Button variant="negative">종료</Button>
                        </div>

                        <ABStatusRow />
                        <ABMainForm data={data} />
                    </div>,
                    <ABEtcForm />,
                ]}
            />
        </MokaCard>
    );
};

export default ABEdit;
