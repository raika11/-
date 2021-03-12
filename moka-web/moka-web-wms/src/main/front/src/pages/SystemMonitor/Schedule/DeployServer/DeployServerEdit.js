import React, { useState, useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import { MokaInputLabel } from '@/components';
import { DB_DATEFORMAT } from '@/constants';
import { invalidListToError } from '@/utils/convertUtil';
import { REQUIRED_REGEX } from '@/utils/regexUtil';
import toast, { messageBox } from '@/utils/toastUtil';
import { getDistributeServer, clearServer, saveDistributeServer, deleteServer } from '@/store/schedule';

/**
 * 스케줄 서버 관리 > 배포 서버 관리 편집
 */
const DeployServerEdit = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { serverSeq } = useParams();
    const server = useSelector((store) => store.schedule.deployServer.server);
    const [data, setData] = useState({});
    const [error, setError] = useState({});

    const handleChangeValue = useCallback(
        (e) => {
            const { name, value } = e.target;
            setData({ ...data, [name]: value });
        },
        [data],
    );

    /**
     * 유효성 검사
     * @param {object} 검사 대상
     */
    const validate = (obj) => {
        let isInvalid = false,
            errList = [];

        // 별칭 체크
        if (!REQUIRED_REGEX.test(obj.serverNm)) {
            errList.push({
                field: 'serverNm',
                reason: '별칭을 입력하세요',
            });
            isInvalid = isInvalid || true;
        }
        // IP 체크
        if (!REQUIRED_REGEX.test(obj.serverIp)) {
            errList.push({
                field: 'serverIp',
                reason: '서버 IP를 입력하세요',
            });
            isInvalid = isInvalid || true;
        }
        // 계정 체크
        if (!REQUIRED_REGEX.test(obj.accessId)) {
            errList.push({
                field: 'accessId',
                reason: '로그인 계정을 입력하세요',
            });
            isInvalid = isInvalid || true;
        }
        // 암호 체크
        if (!!REQUIRED_REGEX.test(obj.accessPwd)) {
            errList.push({
                field: 'accessPwd',
                reason: '로그인 암호를 입력하세요',
            });
            isInvalid = isInvalid || true;
        }

        setError(invalidListToError(errList));
        return !isInvalid;
    };

    /**
     * 저장 버튼
     */
    const handleClickSave = () => {
        if (validate(data)) {
            dispatch(
                saveDistributeServer({
                    job: data,
                    jobSeq: serverSeq ? Number(serverSeq) : null,
                    callback: ({ header }) => {
                        if (header.success) {
                            toast.success(header.message);
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        } else {
            console.log('저장 실패');
        }
    };

    /**
     * 삭제 버튼
     */
    const handleClickDelete = () => {
        messageBox.confirm(
            '작업을 삭제하시겠습니까?',
            () =>
                dispatch(
                    deleteServer({
                        serverSeq: Number(serverSeq),
                        callback: ({ header }) => {
                            if (header.success) {
                                toast.success('삭제되었습니다.');
                                history.push(`${match.path}`);
                            } else {
                                messageBox.alert(header.message);
                            }
                        },
                    }),
                ),
            () => {},
        );
    };

    /**
     * 취소 버튼
     */
    const handleClickCancel = () => {
        history.push(`${match.path}`);
    };

    useEffect(() => {
        setData({ ...server });
    }, [server]);

    useEffect(() => {
        if (serverSeq) {
            dispatch(getDistributeServer(serverSeq));
        } else {
            dispatch(clearServer());
        }
    }, [dispatch, serverSeq]);

    return (
        <>
            <Card.Header>
                <Card.Title as="h2">{serverSeq ? '배포 서버 수정' : '배포 서버 등록'}</Card.Title>
            </Card.Header>
            <Card.Body className="custom-scroll" style={{ height: 496 }}>
                <Form>
                    <Form.Row className="mb-2">
                        <Col xs={7} className="p-0">
                            <MokaInputLabel label="별칭" name="serverNm" value={data.serverNm} onChange={handleChangeValue} isInvalid={error.serverNm} />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mb-2">
                        <Col xs={7} className="p-0">
                            <MokaInputLabel label="서버IP" name="serverIp" value={data.serverIp} onChange={handleChangeValue} isInvalid={error.serverIp} />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mb-2">
                        <Col xs={7} className="p-0">
                            <MokaInputLabel label="로그인 계정" name="accessId" value={data.accessId} onChange={handleChangeValue} isInvalid={error.accessId} />
                        </Col>
                    </Form.Row>
                    <Form.Row className={serverSeq && 'mb-2'}>
                        <Col xs={7} className="p-0">
                            <MokaInputLabel label="로그인 암호" name="accessPwd" value={data.accessPwd} onChange={handleChangeValue} isInvalid={error.accessPwd} />
                        </Col>
                    </Form.Row>
                    {serverSeq && (
                        <>
                            <Form.Row className="mb-2">
                                <Col xs={7} className="p-0">
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip id="server-reg-info">
                                                {`${moment(data.regDt).format(DB_DATEFORMAT)} ${data.regMember ? `${data.regMember.memberNm} (${data.regMember.memberId})` : ''}`}
                                            </Tooltip>
                                        }
                                    >
                                        <MokaInputLabel
                                            label="등록 정보"
                                            inputClassName="text-truncate"
                                            value={
                                                data.regDt
                                                    ? `${moment(data.regDt).format(DB_DATEFORMAT)} ${
                                                          data.regMember ? `${data.regMember.memberNm} (${data.regMember.memberId})` : ''
                                                      }`
                                                    : ''
                                            }
                                            inputProps={{ readOnly: true, plaintext: true }}
                                        />
                                    </OverlayTrigger>
                                </Col>
                            </Form.Row>
                            <Form.Row className="mb-2">
                                <Col xs={7} className="p-0">
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip id="server-reg-info">
                                                {`${moment(data.modDt).format(DB_DATEFORMAT)} ${data.modMember ? `${data.modMember.memberNm} (${data.modMember.memberId})` : ''}`}
                                            </Tooltip>
                                        }
                                    >
                                        <MokaInputLabel
                                            label="수정 정보"
                                            inputClassName="text-truncate"
                                            value={
                                                data.modDt
                                                    ? `${moment(data.modDt).format(DB_DATEFORMAT)} ${
                                                          data.modMember ? `${data.modMember.memberNm} (${data.modMember.memberId})` : ''
                                                      }`
                                                    : ''
                                            }
                                            inputProps={{ readOnly: true, plaintext: true }}
                                        />
                                    </OverlayTrigger>
                                </Col>
                            </Form.Row>
                        </>
                    )}
                </Form>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-center card-footer">
                <Button variant="positive" className="mr-1" onClick={handleClickSave}>
                    {serverSeq ? '수정' : '등록'}
                </Button>
                {serverSeq && (
                    <Button variant="negative" className="mr-1" onClick={handleClickDelete}>
                        삭제
                    </Button>
                )}
                <Button variant="negative" onClick={handleClickCancel}>
                    취소
                </Button>
            </Card.Footer>
        </>
    );
};

export default DeployServerEdit;
