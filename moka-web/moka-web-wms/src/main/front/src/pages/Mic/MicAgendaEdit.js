import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import moment from 'moment';
import { initialState, clearMicAgenda, getMicAgenda, saveMicAgenda, GET_MIC_AGENDA, SAVE_MIC_AGENDA, changeInvalidList } from '@store/mic';
import { DB_DATEFORMAT } from '@/constants';
import util from '@utils/commonUtil';
import toast, { messageBox } from '@utils/toastUtil';
import { invalidListToError } from '@utils/convertUtil';
import { getDisplayedRows } from '@utils/agGridUtil';
import { MokaCard } from '@components';
import MicAgendaForm from './components/MicAgendaForm/index';

moment.locale('ko');

/**
 * 시민 마이크 > 아젠다 등록, 수정
 */
const MicAgendaEdit = ({ match, setActiveTabIdx }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { agndSeq } = useParams();
    const loading = useSelector(({ loading }) => loading[GET_MIC_AGENDA] || loading[SAVE_MIC_AGENDA]);
    const { agenda, invalidList } = useSelector(({ mic }) => mic);
    const categoryAllList = useSelector(({ mic }) => mic.category.list);
    const AGENDA_ARTICLE_PROGRESS = useSelector(({ app }) => app.AGENDA_ARTICLE_PROGRESS); //  기사화 단계
    const codes = useSelector(({ poll }) => poll.codes); // 투표 모달에 쓰는 데이터
    const [temp, setTemp] = useState(initialState.agenda); // 수정가능한 데이터
    const [gridInstance, setGridInstance] = useState(null); // 기사 ag-grid
    const [error, setError] = useState({});

    /**
     * 유효성 검사
     * @param {object} save 데이터
     */
    const validate = (save) => {
        let isInvalid = false;
        let errList = [];

        // 제목 체크
        if (util.isEmpty(save.agndTitle)) {
            errList.push({
                field: 'agndTitle',
                reason: '',
            });
            isInvalid = isInvalid || true;
        }
        // 본문 체크
        if (util.isEmpty(save.agndMemo)) {
            errList.push({
                field: 'agndMemo',
                reason: '',
            });
            isInvalid = isInvalid || true;
        }

        dispatch(changeInvalidList(errList));
        return !isInvalid;
    };

    /**
     * 저장
     */
    const handleClickSave = () => {
        // 공개일 포맷 변환
        let agndServiceDt = moment(temp.agndServiceDt);
        agndServiceDt = agndServiceDt.isValid() ? agndServiceDt.format(DB_DATEFORMAT) : null;
        // 관련기사 목록
        const relArticleList = getDisplayedRows(gridInstance.api);
        const saveObj = { ...temp, agndServiceDt, relArticleList };

        if (validate(saveObj)) {
            dispatch(
                saveMicAgenda({
                    agenda: saveObj,
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        } else {
                            toast.success(header.message);
                            if (!saveObj.agndSeq) {
                                history.push(match.path);
                            }
                        }
                    },
                }),
            );
        }
    };

    /**
     * 취소
     */
    const handleClickCancel = () => history.push(match.path);

    /**
     * 아젠다 데이터 변경
     */
    const handleChangeValue = useCallback(
        (newData) => {
            setTemp({ ...temp, ...newData });
            Object.keys(newData).forEach((key) => {
                if (error[key]) {
                    setError({ ...error, [key]: false });
                }
            });
        },
        [error, temp],
    );

    useEffect(() => {
        if (agndSeq) {
            dispatch(
                getMicAgenda({
                    agndSeq,
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        } else {
            dispatch(clearMicAgenda());
            setActiveTabIdx(0);
        }
    }, [agndSeq, setActiveTabIdx, dispatch]);

    useEffect(() => {
        const agndServiceDt = moment(agenda.agndServiceDt, DB_DATEFORMAT);
        setTemp({
            ...initialState.agenda,
            ...agenda,
            agndServiceDt: agndServiceDt.isValid() ? agndServiceDt : moment(new Date()),
        });
        setError({});
    }, [agenda]);

    useEffect(() => {
        setError(invalidListToError(invalidList));
    }, [invalidList]);

    useEffect(() => {
        return () => {
            dispatch(clearMicAgenda());
        };
    }, [dispatch]);

    return (
        <MokaCard
            title={agndSeq ? '아젠다 수정' : '아젠다 등록'}
            className="w-100"
            footerClassName="justify-content-center"
            footer
            footerButtons={[
                { text: agndSeq ? '수정' : '저장', variant: 'positive', className: 'mr-1', onClick: handleClickSave },
                { text: '취소', variant: 'negative', onClick: handleClickCancel },
            ]}
            loading={loading}
        >
            <MicAgendaForm
                AGENDA_ARTICLE_PROGRESS={AGENDA_ARTICLE_PROGRESS}
                agenda={temp}
                error={error}
                categoryAllList={categoryAllList.filter((cate) => cate.usedYn === 'Y')}
                setError={setError}
                onChange={handleChangeValue}
                gridInstance={gridInstance}
                setGridInstance={setGridInstance}
                codes={codes}
            />
        </MokaCard>
    );
};

export default MicAgendaEdit;
