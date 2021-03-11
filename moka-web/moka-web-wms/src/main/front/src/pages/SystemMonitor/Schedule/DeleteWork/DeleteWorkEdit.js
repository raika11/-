import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { MokaInputLabel } from '@/components';
import { messageBox } from '@/utils/toastUtil';

/**
 * 스케줄 서버 관리 > 삭제 작업 조회
 */
const DeleteWorkEdit = () => {
    const history = useHistory();
    const [data] = useState({
        group: '중앙1',
        cycle: '10분',
        type: 'FTP',
        ftpPort: '21',
        passive: 'Y',
        server: 'FTP_STATIC_JOINS',
        usedYn: 'Y',
        url: 'http://iserver.joins.com/webbulk/kbcard/article_list/JA',
        route: '/data/bulk/kbcard/JA.xml',
        desc: '[KB카드]중앙일보 골프 데이터',
        regDt: '2019-01-19 10:05:06',
        regAdmin: '관리자1(admin1)',
        modDt: '2019-01-20 10:05:11',
        modAdmin: '관리자1(admin1)',
        create: '200/78',
        deploy: '-1/94',
        lastDt: '2020-01-06 15:00:00',
        delDt: '2019-10-19 10:05',
        delAdmin: '관리자1(admin1)',
    });

    /**
     * 복원 버튼
     */
    const handleClickRestore = () => {
        messageBox.confirm('작업을 복원하시겠습니까?', () => {});
    };

    /**
     * 취소 버튼
     */
    const handleClickCancel = () => {
        history.push('/schedule');
    };

    return (
        <>
            <Card.Header>
                <Card.Title as="h2">삭제 작업 조회</Card.Title>
            </Card.Header>
            <Card.Body className="custom-scroll" style={{ height: 496 }}>
                <Form className="d-flex flex-column">
                    <div className="mb-2" style={{ width: 200 }}>
                        <MokaInputLabel label="분류" name="group" value={data.group} inputProps={{ readOnly: true }} />
                    </div>
                    <div className="mb-2" style={{ width: 200 }}>
                        <MokaInputLabel label="주기" name="cycle" value={data.cycle} inputProps={{ readOnly: true }} />
                    </div>
                    <div className="mb-2 d-flex align-items-center">
                        <div className="mr-3" style={{ width: 200 }}>
                            <MokaInputLabel label="전송 타입" name="type" value={data.type} inputProps={{ readOnly: true }} />
                        </div>
                        <div style={{ width: 200 }}>
                            <MokaInputLabel label="FTP PORT" name="ftpPort" className="mr-3" value={data.ftpPort} inputProps={{ readOnly: true }} />
                        </div>
                        <MokaInputLabel
                            label="PASSIVE 모드"
                            name="passive"
                            as="checkbox"
                            id="schedule-work-passive"
                            inputProps={{ label: '', custom: true, checked: data.passive === 'Y', readOnly: true }}
                        />
                    </div>
                    <div className="mb-2" style={{ width: 200 }}>
                        <MokaInputLabel label="배포 서버" name="server" value={data.server} inputProps={{ readOnly: true }} />
                    </div>
                    <MokaInputLabel label="호출 URL" className="mb-2" name="url" value={data.url} inputProps={{ readOnly: true }} />
                    <MokaInputLabel label="배포 경로" className="mb-2" name="route" value={data.route} inputProps={{ readOnly: true }} />
                    <MokaInputLabel label="설명" className="mb-2" name="desc" value={data.desc} inputProps={{ readOnly: true }} />
                    <MokaInputLabel label="삭제 정보" name="delInfo" className="mb-4" value={`${data.delDt} ${data.delAdmin}`} inputProps={{ readOnly: true }} />
                </Form>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-center card-footer">
                <Button variant="positive" className="mr-1" onClick={handleClickRestore}>
                    복원
                </Button>
                <Button variant="negative" onClick={handleClickCancel}>
                    취소
                </Button>
            </Card.Footer>
        </>
    );
};

export default DeleteWorkEdit;
