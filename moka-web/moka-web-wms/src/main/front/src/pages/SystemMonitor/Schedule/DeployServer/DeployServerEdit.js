import React, { useState, useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaCard, MokaInputLabel } from '@/components';
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
            setError({});
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
        if (!obj.serverNm || !REQUIRED_REGEX.test(obj.serverNm)) {
            errList.push({
                field: 'serverNm',
                reason: '별칭을 입력하세요',
            });
            isInvalid = isInvalid || true;
        }
        // IP 체크
        if (!obj.serverIp || !REQUIRED_REGEX.test(obj.serverIp)) {
            errList.push({
                field: 'serverIp',
                reason: '서버 IP를 입력하세요',
            });
            isInvalid = isInvalid || true;
        }
        // 계정 체크
        if (!obj.accessId || !REQUIRED_REGEX.test(obj.accessId)) {
            errList.push({
                field: 'accessId',
                reason: '로그인 계정을 입력하세요',
            });
            isInvalid = isInvalid || true;
        }
        // 암호 체크
        if (!serverSeq) {
            if (!obj.accessPwd || !REQUIRED_REGEX.test(obj.accessPwd)) {
                errList.push({
                    field: 'accessPwd',
                    reason: '로그인 암호를 입력하세요',
                });
                isInvalid = isInvalid || true;
            }
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
                    server: data,
                    serverSeq: serverSeq ? Number(serverSeq) : null,
                    callback: ({ header, body }) => {
                        if (header.success) {
                            toast.success(header.message);
                            history.push(`${match.path}/deploy-server/${body.serverSeq}`);
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        }
    };

    /**
     * 삭제 버튼
     */
    const handleClickDelete = () => {
        messageBox.confirm(
            '서버를 삭제하시겠습니까?',
            () =>
                dispatch(
                    deleteServer({
                        serverSeq: Number(serverSeq),
                        callback: ({ header }) => {
                            if (header.success) {
                                toast.success('삭제되었습니다.');
                                history.push(`${match.path}/deploy-server`);
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
        history.push(`${match.path}/deploy-server`);
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
        <MokaCard
            title={serverSeq ? '배포 서버 수정' : '배포 서버 등록'}
            className="flex-fill"
            bodyClassName="d-flex flex-column"
            footer
            footerButtons={[
                {
                    text: serverSeq ? '수정' : '저장',
                    onClick: handleClickSave,
                    variant: 'positive',
                    className: 'mr-1',
                },
                serverSeq && {
                    text: '삭제',
                    onClick: handleClickDelete,
                    variant: 'negative',
                    className: 'mr-1',
                },
                {
                    text: '취소',
                    onClick: handleClickCancel,
                    variant: 'negative',
                },
            ].filter((a) => a)}
        >
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
                            <MokaInputLabel
                                label="등록 정보"
                                inputClassName="text-truncate"
                                className="flex-fill"
                                value={
                                    data.regDt
                                        ? `${moment(data.regDt).format(DB_DATEFORMAT)} ${data.regMember?.memberNm || ''} ${
                                              data.regMember?.memberId ? `(${data.regMember?.memberId})` : ''
                                          }`
                                        : ''
                                }
                                inputProps={{ readOnly: true, plaintext: true }}
                            />
                        </Form.Row>
                        <Form.Row className="mb-2">
                            <MokaInputLabel
                                label="수정 정보"
                                inputClassName="text-truncate"
                                className="flex-fill"
                                value={
                                    data.modDt
                                        ? `${moment(data.modDt).format(DB_DATEFORMAT)} ${data.modMember?.memberNm || ''} ${
                                              data.modMember?.memberId ? `(${data.modMember?.memberId})` : ''
                                          }`
                                        : ''
                                }
                                inputProps={{ readOnly: true, plaintext: true }}
                            />
                        </Form.Row>
                    </>
                )}
            </Form>
        </MokaCard>
    );
};

export default DeployServerEdit;
