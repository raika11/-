import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput, MokaTable } from '@/components';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 결과 관리 > 뉴스레터별 발송 결과
 */
const NewsLetterResultEdit = ({ match }) => {
    // const { letterSeq } = useParams();
    const history = useHistory();
    const [total] = useState(0);
    const [search] = useState({ page: 1, size: 10 });

    return (
        <MokaCard
            className="w-100"
            title="뉴스레터 아카이브 정보"
            bodyClassName="d-flex flex-column"
            footer
            footerButtons={[
                {
                    text: '취소',
                    variant: 'negative',
                    onClick: () => {
                        history.push(match.path);
                    },
                },
            ]}
        >
            {/* 기본 정보 */}
            <div className="mb-2 d-flex justify-content-end">
                <Button variant="outline-neutral">Excel 다운로드</Button>
            </div>
            <MokaTable
                className="mb-2"
                agGridHeight={70}
                columnDefs={[
                    {
                        headerName: '유형',
                        field: 'type',
                        width: 60,
                    },
                    {
                        headerName: '뉴스레터 명',
                        field: 'newsLetter',
                        flex: 1,
                    },
                    {
                        headerName: '발송 시작일',
                        field: 'sendDt',
                        width: 120,
                    },
                    {
                        headerName: '최근 발송일',
                        field: 'sendResentDt',
                        width: 120,
                    },
                    {
                        headerName: '총 구독자수',
                        field: 'subscriber',
                        width: 100,
                    },
                    {
                        headerName: '상태',
                        field: 'state',
                        width: 60,
                    },
                    {
                        headerName: '등록일',
                        field: 'regDt',
                        width: 120,
                    },
                    {
                        headerName: '등록자',
                        field: 'regMember',
                        width: 70,
                    },
                ]}
                rowData={[
                    {
                        no: '1',
                        type: '오리지널',
                        newsLetter: '팩플',
                        title: '제목',
                        sendDt: '2021-03-22 10:00',
                        sendResentDt: '2021-03-22 10:00',
                        subscriber: '4',
                        state: '예약',
                        regDt: '2021-03-22 10:00',
                        regMember: '박중앙',
                    },
                ]}
                onRowNodeId={(data) => data.no}
                paging={false}
            />
            <hr className="divider" />

            {/* 이력 정보 */}
            <p className="mb-2">※ 이력 정보</p>
            <div className="mb-14 d-flex align-items-end justify-content-between">
                <p className="mb-0">
                    전체 발송 건수 {total}건 / 발송 성공 건수 {total}건(00%) / 오픈 건수 {total}건(00%) / 클릭 건수 {total}건(00%)
                </p>
                <div>
                    <MokaInput as="select" disabled>
                        <option value="">20개 보기</option>
                    </MokaInput>
                </div>
            </div>
            <MokaTable
                className="mb-2 overflow-hidden flex-fill"
                paginationClassName="justify-content-center"
                columnDefs={[
                    {
                        headerName: '발송일',
                        field: 'sendDt',
                        width: 120,
                    },
                    {
                        headerName: '제목',
                        field: 'title',
                        flex: 1,
                    },
                    {
                        headerName: '발송 건수',
                        field: 'sendTotal',
                        width: 100,
                    },
                    {
                        headerName: '발송 성공률',
                        field: 'successRate',
                        width: 120,
                    },
                    {
                        headerName: '오픈률',
                        field: 'openRate',
                        width: 120,
                    },
                    {
                        headerName: '클릭률',
                        field: 'clickRate',
                        width: 120,
                    },
                    {
                        headerName: '해당 레터 독자 수',
                        field: 'subscriber',
                        width: 120,
                    },
                    {
                        headerName: '콘텐츠 확인',
                        field: '',
                        width: 80,
                    },
                    {
                        headerName: '노출 여부',
                        field: '',
                        flex: 1,
                        width: 80,
                    },
                ]}
                rowData={[
                    {
                        no: '1',
                        sendDt: '2021-03-22 10:00',
                        title: '테스트',
                        sendTotal: '100',
                        successRate: '-',
                        openRate: '-',
                        clickRate: '-',
                        subscriber: '5102',
                    },
                ]}
                onRowNodeId={(data) => data.no}
                // loading={loading}
                page={search.page}
                pageSizes={false}
                showTotalString={false}
                // loading={loading}
            />
        </MokaCard>
    );
};

export default NewsLetterResultEdit;
