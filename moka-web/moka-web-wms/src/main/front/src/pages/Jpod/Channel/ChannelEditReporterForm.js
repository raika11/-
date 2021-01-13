import React, { useEffect, Suspense, useState, useRef } from 'react';
import { MokaCard, MokaInputLabel, MokaSearchInput, MokaInput } from '@components';
import { Form, Col, Button, Row } from 'react-bootstrap';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { PodtyChannelModal, RepoterModal } from '@pages/Jpod/JpodModal';
import { initialState, GET_REPORTER_LIST, saveJpodChannel, clearChannelInfo, getChannelInfo, getChannels } from '@store/jpod';
import { useSelector, useDispatch } from 'react-redux';
import toast, { messageBox } from '@utils/toastUtil';
import { useParams, useHistory } from 'react-router-dom';

const reporterCountConst = [0, 1, 2, 3, 4, 5];

const ChannelEditReporterForm = (props) => {
    const { reporter } = props;

    useEffect(() => {
        if (reporter) {
            console.log(reporter.memNm);
        }
    }, [props, reporter]);
    return <></>;
};

export default ChannelEditReporterForm;
