import React, { useState } from 'react';
import { useHistory } from 'react-router';
import moment from 'moment';
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
    const history = useHistory();
    const [search, setSearch] = useState({
        sendDt: null,
        endSendDt: null,
    });
    const [period, setPeriod] = useState([0, 'days']);

    /**
     * 입력값 변경
     */
    const handleChangeValue = (e) => {
        const { name, value } = e.target;
        if (name === 'period') {
            // 기간 설정
            const { number, date } = e.target.selectedOptions[0].dataset;
            setPeriod([Number(number), date]);

            const nd = new Date();
            const startDt = moment(nd).subtract(Number(number), date).startOf('day');
            const endDt = moment(nd).endOf('day');
            setSearch({ ...search, startDt, endDt });
        } else {
            setSearch({ ...search, [name]: value });
        }
    };

    /**
     * 취소
     */
    const handleClickCancel = () => {
        history.push(match.path);
    };

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
                    onClick: handleClickCancel,
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
                <Form.Row className="mb-2">
                    <Col xs={3} className="p-0 pr-2">
                        <MokaInputLabel as="select" name="period" label="발송일" value={period.join('')} onChange={handleChangeValue}>
                            <option value="7days" data-number="7" data-date="days">
                                1주
                            </option>
                            <option value="15days" data-number="15" data-date="days">
                                15일
                            </option>
                            <option value="1months" data-number="1" data-date="months">
                                1개월
                            </option>
                        </MokaInputLabel>
                    </Col>
                    <Col xs={7} className="p-0 pr-2 d-flex">
                        <MokaInput
                            as="dateTimePicker"
                            value={search.sendDt}
                            inputProps={{ timeFormat: null, timeDefault: 'start' }}
                            onChange={(date) => {
                                if (typeof date === 'object') {
                                    setSearch({ ...search, sendDt: date });
                                } else {
                                    setSearch({ ...search, sendDt: null });
                                }
                            }}
                        />
                        <p className="mb-0 mx-2 d-flex align-items-center">~</p>
                        <MokaInput
                            as="dateTimePicker"
                            value={search.endSendDt}
                            inputProps={{ timeFormat: null, timeDefault: 'end' }}
                            onChange={(date) => {
                                if (typeof date === 'object') {
                                    setSearch({ ...search, endSendDt: date });
                                } else {
                                    setSearch({ ...search, endSendDt: null });
                                }
                            }}
                        />
                    </Col>
                    <Button size="sm" variant="searching">
                        검색
                    </Button>
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
