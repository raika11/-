import React, { useState, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel } from '@/components';

/**
 * 스케줄 서버 관리 > 배포 서버 관리 편집
 */
const DeployServerEdit = () => {
    const history = useHistory();
    const { seqNo } = useParams();
    const [data, setData] = useState({
        alias: '',
        ip: '',
        id: '',
        pwd: '',
        regDt: '2019-01-19 10:05:06',
        regAdmin: '관리자1(admin1)',
        modDt: '2019-01-20 10:05:11',
        modAdmin: '관리자1(admin1)',
    });

    const handleChangeValue = useCallback(
        (e) => {
            const { name, value } = e.target;
            setData({ ...data, [name]: value });
        },
        [data],
    );

    /**
     * 취소 버튼
     */
    const handleClickCancel = () => {
        history.push('/schedule');
    };

    return (
        <>
            <h2 style={{ marginBottom: '20px' }}>{seqNo ? '배포 서버 수정' : '배포 서버 등록'}</h2>
            <Form>
                <div className="mb-2" style={{ width: 380 }}>
                    <MokaInputLabel label="별칭" name="alias" value={data.alias} onChange={handleChangeValue} />
                </div>
                <div className="mb-2" style={{ width: 380 }}>
                    <MokaInputLabel label="서버IP" name="ip" value={data.ip} onChange={handleChangeValue} />
                </div>
                <div className="mb-2" style={{ width: 380 }}>
                    <MokaInputLabel label="로그인 계정" name="id" value={data.id} onChange={handleChangeValue} />
                </div>
                <div className={seqNo ? 'mb-2' : 'mb-4'} style={{ width: 380 }}>
                    <MokaInputLabel label="로그인 암호" name="pwd" value={data.pwd} onChange={handleChangeValue} />
                </div>
                {seqNo && (
                    <>
                        {/* <div className="mb-2" style={{ width: 450 }}> */}
                        <MokaInputLabel label="등록 정보" className="mb-2" value={`${data.regDt} ${data.regAdmin}`} inputProps={{ readOnly: true, plaintext: true }} />
                        {/* </div> */}
                        {/* <div className="mb-4" style={{ width: 450 }}> */}
                        <MokaInputLabel label="수정 정보" className="mb-4" value={`${data.modDt} ${data.modAdmin}`} inputProps={{ readOnly: true, plaintext: true }} />
                        {/* </div> */}
                    </>
                )}
                <div className="d-flex justify-content-center">
                    <Button variant="positive" className="mr-1">
                        {seqNo ? '수정' : '등록'}
                    </Button>
                    {seqNo && (
                        <Button variant="negative" className="mr-1">
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

export default DeployServerEdit;
