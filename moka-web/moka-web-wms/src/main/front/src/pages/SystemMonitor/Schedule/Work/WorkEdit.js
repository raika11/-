import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useHistory, useParams } from 'react-router-dom';
import { MokaInputLabel } from '@/components';

/**
 * 스케줄 서버 관리 > 작업 목록 등록, 수정
 */
const WorkEdit = () => {
    const history = useHistory();
    const { seqNo } = useParams();
    const [data, setData] = useState({
        group: 'all',
        cycle: 'all',
        type: 'all',
        ftpPort: '',
        passive: 'Y',
        server: 'all',
        usedYn: 'Y',
        url: '',
        route: '',
        desc: '',
        regDt: '2019-01-19 10:05:06',
        regAdmin: '관리자1(admin1)',
        modDt: '2019-01-20 10:05:11',
        modAdmin: '관리자1(admin1)',
        create: '200/78',
        deploy: '-1/94',
        lastDt: '2020-01-06 15:00:00',
    });

    /**
     * input value
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'usedYn') {
            setData({ ...data, usedYn: checked ? 'Y' : 'N' });
        } else if (name === 'passive') {
            setData({ ...data, passive: checked ? 'Y' : 'N' });
        } else {
            setData({ ...data, [name]: value });
        }
    };

    /**
     * 취소 버튼
     */
    const handleClickCancel = () => {
        history.push('/schedule');
    };

    useEffect(() => {
        if (!seqNo) {
            setData({
                ...data,
                group: 'all',
                cycle: 'all',
                type: 'all',
                ftpPort: '',
                passive: 'Y',
                server: 'all',
                usedYn: 'Y',
                url: '',
                route: '',
                desc: '',
                regDt: '2019-01-19 10:05:06',
                regAdmin: '관리자1(admin1)',
                modDt: '2019-01-20 10:05:11',
                modAdmin: '관리자1(admin1)',
                create: '200/78',
                deploy: '-1/94',
                lastDt: '2020-01-06 15:00:00',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seqNo]);

    return (
        <>
            <h2 style={{ marginBottom: '20px' }}>{seqNo ? '작업 수정' : '작업 등록'}</h2>
            <Form>
                <div className="mb-2 d-flex align-items-center">
                    <div className="mr-3" style={{ width: 200 }}>
                        <MokaInputLabel as="select" label="분류" name="group" value={data.group} onChange={handleChangeValue}>
                            <option value="all">전체</option>
                        </MokaInputLabel>
                    </div>
                    <MokaInputLabel
                        as="switch"
                        label="사용"
                        id="schedule-work-use"
                        name="usedYn"
                        inputProps={{ custom: true, checked: data.usedYn === 'Y' }}
                        onChange={handleChangeValue}
                    />
                </div>
                <div className="mb-2" style={{ width: 200 }}>
                    <MokaInputLabel label="주기" as="select" name="cycle" value={data.cycle} onChange={handleChangeValue}>
                        <option value="all">전체</option>
                        <option value="30s">30초</option>
                        <option value="1m">1분</option>
                        <option value="2m">2분</option>
                        <option value="5m">5분</option>
                        <option value="10m">10분</option>
                        <option value="20m">20분</option>
                        <option value="30m">30분</option>
                        <option value="1h">1시간</option>
                        <option value="12h">12시간</option>
                        <option value="24h">24시간</option>
                    </MokaInputLabel>
                </div>
                <div className="mb-2 d-flex align-items-center">
                    <div className={data.type === 'ftp' ? 'mr-3' : null} style={{ width: 200 }}>
                        <MokaInputLabel label="전송 타입" as="select" name="type" value={data.type} onChange={handleChangeValue}>
                            <option value="all">전체</option>
                            <option value="ftp">FTP</option>
                            <option value="copyNetwork">네트워크 복사</option>
                        </MokaInputLabel>
                    </div>
                    {data.type === 'ftp' && (
                        <div className="d-flex align-items-center">
                            <div style={{ width: 200 }}>
                                <MokaInputLabel label="FTP PORT" name="ftpPort" className="mr-3" value={data.ftpPort} onChange={handleChangeValue} />
                            </div>
                            <MokaInputLabel
                                label="PASSIVE 모드"
                                name="passive"
                                as="checkbox"
                                id="schedule-work-passive"
                                inputProps={{ label: '', custom: true, checked: data.passive === 'Y' }}
                                onChange={handleChangeValue}
                            />
                        </div>
                    )}
                </div>
                <div className="mb-2" style={{ width: 200 }}>
                    <MokaInputLabel label="배포 서버" as="select" name="server" value={data.server} onChange={handleChangeValue}>
                        <option value="all">전체</option>
                    </MokaInputLabel>
                </div>
                <MokaInputLabel label="호출 URL" className="mb-2" name="url" value={data.url} onChange={handleChangeValue} />
                <MokaInputLabel label="배포 경로" className="mb-2" name="route" value={data.route} onChange={handleChangeValue} />
                <MokaInputLabel label="설명" className={seqNo ? 'mb-2' : 'mb-4'} name="desc" value={data.desc} onChange={handleChangeValue} />
                {seqNo && (
                    <>
                        <MokaInputLabel
                            label="등록정보"
                            name="regInfo"
                            className="mb-2"
                            value={`${data.regDt} ${data.regAdmin}`}
                            inputProps={{ plaintext: true, readOnly: true }}
                        />
                        <MokaInputLabel
                            label="수정 정보"
                            name="modInfo"
                            className="mb-2"
                            value={`${data.modDt} ${data.modAdmin}`}
                            inputProps={{ plaintext: true, readOnly: true }}
                        />
                        <MokaInputLabel
                            label="마지막 실행 정보"
                            name="lastInfo"
                            className="mb-4"
                            value={`생성: ${data.create} 배포: ${data.deploy} ${data.lastDt}`}
                            inputProps={{ plaintext: true, readOnly: true }}
                        />
                    </>
                )}
                <div className="d-flex justify-content-center">
                    <Button variant="positive" className="mr-2">
                        {seqNo ? '수정' : '등록'}
                    </Button>
                    {seqNo && (
                        <Button variant="negative" className="mr-2">
                            삭제
                        </Button>
                    )}
                    <Button variant="negative" onClick={handleClickCancel}>
                        취소
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default WorkEdit;
