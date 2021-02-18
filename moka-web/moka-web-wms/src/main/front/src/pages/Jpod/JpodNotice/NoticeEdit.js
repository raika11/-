import React, { useEffect, useState, useRef } from 'react';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import { Form, Col, Button, Row } from 'react-bootstrap';
// import moment from 'moment';
// import { DB_DATEFORMAT } from '@/constants';
// import { PodtyChannelModal, RepoterModal } from '@pages/Jpod/JpodModal';
// import { initialState, GET_REPORTER_LIST, saveJpodChannel, clearChannelInfo, getChannelInfo, getChEpisodes, getChannels, clearReporter } from '@store/jpod';
// import { useSelector, useDispatch } from 'react-redux';
// import toast, { messageBox } from '@utils/toastUtil';
// import { useParams, useHistory } from 'react-router-dom';

const NoticeEdit = ({ match }) => {
    // const dispatch = useDispatch();
    // const history = useHistory();
    // const params = useParams();

    return (
        <MokaCard
            className="overflow-hidden flex-fill w-100"
            title={`게시글 ${'add' === 'add' ? '등록' : '정보'}`}
            titleClassName="mb-0"
            loading={false}
            footer
            footerClassName="d-flex justify-content-center"
            footerAs={
                <>
                    {(function () {
                        return (
                            <Row className="justify-content-md-center text-center">
                                <Col className="mp-0 pr-0">
                                    <Button variant="positive" onClick={(e) => console.log(e)}>
                                        저장
                                    </Button>
                                </Col>
                                <Col className="mp-0 pr-0">
                                    <Button variant="negative" onClick={(e) => console.log(e)}>
                                        취소
                                    </Button>
                                </Col>
                            </Row>
                        );
                    })()}
                </>
            }
        >
            <Form className="mb-gutter"></Form>
        </MokaCard>
    );
};

export default NoticeEdit;
