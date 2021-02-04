import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import moment from 'moment';
import { initialState, clearMicAgenda, getMicAgenda, saveMicAgenda, GET_MIC_AGENDA, SAVE_MIC_AGENDA } from '@store/mic';
import { MokaCard } from '@components';
import { DB_DATEFORMAT } from '@/constants';
import toast, { messageBox } from '@utils/toastUtil';
import { escapeHtmlArticle, invalidListToError } from '@utils/convertUtil';
import MicAgendaForm from './components/MicAgendaForm/index';

moment.locale('ko');

/**
 * 시민 마이크 아젠다 등록, 수정
 */
const MicAgendaEdit = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { agndSeq } = useParams();
    const loading = useSelector(({ loading }) => loading[GET_MIC_AGENDA] || loading[SAVE_MIC_AGENDA]);
    const { agenda, categoryAllList, invalidList } = useSelector(({ mic }) => ({
        agenda: mic.agenda,
        categoryAllList: mic.category.list,
        invalidList: mic.invalidList,
    }));
    const AGENDA_ARTICLE_PROGRESS = useSelector(({ app }) => app.AGENDA_ARTICLE_PROGRESS); //  기사화 단계
    const [temp, setTemp] = useState(initialState.agenda);
    const [error, setError] = useState({});

    /**
     * validate
     */
    const validate = (save) => {
        let isInvalid = false;

        return !isInvalid;
    };

    /**
     * 저장
     */
    const handleClickSave = () => {
        // 관련기사 타이틀 escapeHtml 변환
        const relArticleList = temp.relArticleList.map((article) => ({
            ...article,
            artTitle: escapeHtmlArticle(article.artTitle),
        }));
        // 공개일 포맷 변환
        let agndServiceDt = moment(temp.agndServiceDt);
        agndServiceDt = agndServiceDt.isValid() ? agndServiceDt.format(DB_DATEFORMAT) : null;

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
     * 삭제
     */
    const handleClickDelete = () => {};

    /**
     * 아젠다 데이터 변경
     */
    const handleChangeValue = ({ key, value }) => {
        setTemp({ ...temp, [key]: value });
        if (error[key]) {
            setError({ ...error, [key]: false });
        }
    };

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
        }
    }, [agndSeq, dispatch]);

    useEffect(() => {
        const agndServiceDt = moment(agenda.agndServiceDt, DB_DATEFORMAT);
        setTemp({
            ...agenda,
            agndServiceDt: agndServiceDt.isValid() ? agndServiceDt : null,
        });
    }, [agenda]);

    useEffect(() => {
        setError(invalidListToError(invalidList));
    }, [invalidList]);

    useEffect(() => {
        return () => {
            dispatch(clearMicAgenda());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaCard
            title={agndSeq ? '아젠다 수정' : '아젠다 등록'}
            className="w-100"
            footerClassName="justify-content-center"
            footer
            footerButtons={[
                { text: '저장', variant: 'positive', className: 'mr-2', onClick: handleClickSave },
                { text: '취소', variant: 'negative', className: 'mr-2', onClick: handleClickCancel },
                !!agndSeq && { text: '삭제', variant: 'negative', onClick: handleClickDelete },
            ].filter((a) => a)}
            loading={loading}
        >
            <MicAgendaForm
                AGENDA_ARTICLE_PROGRESS={AGENDA_ARTICLE_PROGRESS}
                agenda={temp}
                error={error}
                categoryAllList={categoryAllList.filter((cate) => cate.usedYn === 'Y')}
                setError={setError}
                onChange={handleChangeValue}
            />
        </MokaCard>
    );
};

export default MicAgendaEdit;
