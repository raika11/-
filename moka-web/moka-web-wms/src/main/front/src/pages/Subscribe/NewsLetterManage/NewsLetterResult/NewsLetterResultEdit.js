import React from 'react';
// import { useParams } from 'react-router';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaInput, MokaInputLabel, MokaTable } from '@/components';

/**
 * 뉴스레터 관리 > 뉴스레터 발송 결과 관리 > 뉴스레터별 발송 결과
 */
const NewsLetterResultEdit = ({ match }) => {
    // const { letterSeq } = useParams();

    return (
        <MokaCard
            className="w-100"
            title="뉴스레터 별 발송 결과"
            footer
            footerButtons={[
                {
                    text: '목록 이동',
                    variant: 'outline-neutral',
                    className: 'mr-1',
                },
                {
                    text: '취소',
                    variant: 'negative',
                },
            ]}
        >
            {/* 기본 정보 */}
            <p className="mb-2">※ 기본 정보</p>
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
                        width: 100,
                    },
                    {
                        headerName: '제목',
                        field: 'title',
                        flex: 1,
                    },
                    {
                        headerName: '발송일',
                        field: 'sendDt',
                        width: 120,
                    },
                    {
                        headerName: '구독자 수',
                        field: 'subscriber',
                        width: 100,
                    },
                    {
                        headerName: '상태',
                        field: 'state',
                        width: 60,
                    },
                    {
                        headerName: 'A/B TEST',
                        field: 'ab',
                        width: 70,
                    },
                ]}
                rowData={[
                    {
                        type: '오리지널',
                        newsLetter: '테스트',
                        title: '제목',
                        sendDt: '2021-03-22 10:00',
                        subscriber: '4',
                        state: '예약',
                        ab: 'N',
                    },
                ]}
                onRowNodeId={(data) => data.type}
                paging={false}
            />
            <Form className="mb-2">
                <Form.Row>
                    <Col xs={8} className="p-0 pr-2 d-flex">
                        <MokaInputLabel as="none" label="발송일" />
                        <MokaInput as="dateTimePicker" className="mr-1" inputProps={{ timeFormat: null, timeDefault: 'start' }} />
                        <p className="mb-0 mx-2 d-flex align-items-center">~</p>
                        <MokaInput as="dateTimePicker" className="ml-1" inputProps={{ timeFormat: null, timeDefault: 'end' }} />
                    </Col>
                    <Col xs={4} className="p-0 d-flex">
                        <div style={{ width: 50 }} className="mr-1">
                            <Button size="sm" variant="outline-neutral" className="w-100 h-100">
                                1주
                            </Button>
                        </div>
                        <div style={{ width: 50 }} className="mr-1">
                            <Button size="sm" variant="outline-neutral" className="w-100 h-100">
                                15일
                            </Button>
                        </div>
                        <div style={{ width: 50 }} className="mr-1">
                            <Button size="sm" variant="outline-neutral" className="w-100 h-100">
                                1개월
                            </Button>
                        </div>
                        <Button size="sm" variant="searching">
                            검색
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
            <hr className="divider" />

            {/* 발송 결과 */}
            <p className="mb-2">※ 발송 결과</p>
            <MokaTable
                className="mb-2"
                agGridHeight={220}
                paginationClassName="justify-content-center"
                columnDefs={[
                    {
                        headerName: '발송일',
                        field: 'sendDt',
                        width: 120,
                    },
                    {
                        headerName: '발송 건수',
                        field: 'sendTotal',
                        flex: 1,
                    },
                    {
                        headerName: '발송 결과',
                        field: 'sendResult',
                        children: [{ headerName: '성공률', field: 'successRate', width: 130 }],
                    },
                    {
                        headerName: '오픈 결과',
                        field: 'openResult',
                        children: [{ headerName: '오픈률', field: 'openRate', width: 130 }],
                    },
                    {
                        headerName: '클릭 결과',
                        field: 'clickResult',
                        children: [{ headerName: '클릭률', field: 'clickRate', width: 130 }],
                    },
                ]}
                rowData={[
                    {
                        no: '1',
                        sendDt: '2021-03-22 10:00',
                        sendTotal: '100',
                        successRate: '-',
                        openRate: '-',
                        clickRate: '-',
                    },
                    {
                        no: '2',
                        sendDt: '2021-03-20 10:00',
                        sendTotal: '2500',
                        successRate: '-',
                        openRate: '-',
                        clickRate: '-',
                    },
                ]}
                onRowNodeId={(data) => data.no}
                // loading={loading}
                paging={false}
            />
            <div className="overflow-hidden flex-fill">
                <p className="mb-0">차트 구현 예정</p>
            </div>
        </MokaCard>
    );
};

export default NewsLetterResultEdit;
