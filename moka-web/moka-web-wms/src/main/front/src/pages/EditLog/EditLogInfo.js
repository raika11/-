import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { MokaCard } from '@components';
import { getEditLog, clearEditLog, GET_EDIT_LOG } from '@store/editLog';
import { messageBox } from '@utils/toastUtil';
import { Table } from 'react-bootstrap';

/**
 * 로그 정보
 */
const EditLogInfo = ({ match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { seqNo } = useParams();
    const loading = useSelector(({ loading }) => loading[GET_EDIT_LOG]);
    const editLog = useSelector(({ editLog }) => editLog.editLog);

    useEffect(() => {
        if (seqNo) {
            dispatch(
                getEditLog({
                    seqNo,
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        } else {
            dispatch(clearEditLog());
        }
    }, [dispatch, seqNo]);

    return (
        <MokaCard
            title="로그 정보"
            className="flex-fill"
            footer
            footerClassName="justify-content-center"
            footerButtons={[{ text: '취소', onClick: () => history.push(match.path), variant: 'negative' }]}
            loading={loading}
            bodyClassName="d-flex flex-column color-gray-900"
        >
            <Row className="mx-0 border-top border-left border-right">
                <Col xs={2} className="p-0 border-right">
                    <div className="p-3 font-weight-bold">작업로그 ID</div>
                </Col>
                <Col xs={4} className="p-0 border-right">
                    <div className="p-3 user-select-text">{editLog.seqNo}</div>
                </Col>
                <Col xs={2} className="p-0 border-right">
                    <div className="p-3 font-weight-bold">성공 여부</div>
                </Col>
                <Col xs={4} className="p-0">
                    <div className="p-3 user-select-text">{editLog.successYn === 'Y' ? '성공' : '실패'}</div>
                </Col>
            </Row>
            <Row className="mx-0 border-top border-left border-right">
                <Col xs={2} className="p-0 border-right">
                    <div className="p-3 font-weight-bold">작업자 ID</div>
                </Col>
                <Col xs={4} className="p-0 border-right">
                    <div className="p-3 user-select-text">{editLog.memberId}</div>
                </Col>
                <Col xs={2} className="p-0 border-right">
                    <div className="p-3 font-weight-bold">액션명</div>
                </Col>
                <Col xs={4} className="p-0">
                    <div className="p-3 user-select-text">{editLog.action}</div>
                </Col>
            </Row>
            <Row className="mx-0 border-top border-left border-right">
                <Col xs={2} className="p-0 border-right">
                    <div className="p-3 font-weight-bold">작업자 IP</div>
                </Col>
                <Col xs={4} className="p-0 border-right">
                    <div className="p-3 user-select-text">{editLog.regIp}</div>
                </Col>
                <Col xs={2} className="p-0 border-right">
                    <div className="p-3 font-weight-bold">메뉴명</div>
                </Col>
                <Col xs={4} className="p-0">
                    <div className="p-3 user-select-text">{editLog.menuNm}</div>
                </Col>
            </Row>
            <Row className="mx-0 border-top border-left border-right">
                <Col xs={2} className="p-0 border-right">
                    <div className="p-3 font-weight-bold">실행시간</div>
                </Col>
                <Col xs={4} className="p-0 border-right">
                    <div className="p-3 user-select-text">{editLog.executedTime}</div>
                </Col>
                <Col xs={2} className="p-0 border-right">
                    <div className="p-3 font-weight-bold">작업일시</div>
                </Col>
                <Col xs={4} className="p-0">
                    <div className="p-3 user-select-text">{editLog.regDt}</div>
                </Col>
            </Row>
            <Row className="mx-0 border-top border-left border-right">
                <Col xs={2} className="p-0 border-right">
                    <div className="p-3 font-weight-bold">API 경로</div>
                </Col>
                <Col xs={10} className="p-0">
                    <div className="p-3 user-select-text">{editLog.apiPath}</div>
                </Col>
            </Row>
            <Row className="mx-0 border-top border-left border-right">
                <Col xs={12} className="p-0">
                    <div className="p-3 font-weight-bold">실행 파라미터</div>
                </Col>
            </Row>
            <Row className="mx-0 border-top border-left border-right">
                <Col xs={12} className="p-0 custom-scroll" style={{ height: 140 }}>
                    <div className="p-3 user-select-text">{editLog.param}</div>
                </Col>
            </Row>
            <Row className="mx-0 border-top border-left border-right">
                <Col xs={12} className="p-0">
                    <div className="p-3 font-weight-bold">오류 메시지</div>
                </Col>
            </Row>
            <Row className="mx-0 border flex-fill overflow-hidden">
                <Col xs={12} className="p-0 custom-scroll h-100">
                    <div className="p-3 user-select-text">{editLog.errMsg}</div>
                </Col>
            </Row>
        </MokaCard>
    );
};

export default EditLogInfo;
