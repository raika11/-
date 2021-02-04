import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { clearMicAgenda, getMicAgenda } from '@store/mic';
import { MokaCard } from '@components';
import { messageBox } from '@utils/toastUtil';
import RelationPollModal from '@pages/Survey/Poll/modals/RelationPollModal';
import ArticleListModal from '@pages/Article/modals/ArticleListModal';
import MicAgendaForm from './components/MicAgendaForm/index';

/**
 * 시민 마이크 아젠다 등록, 수정
 */
const MicAgendaEdit = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { agndSeq } = useParams();
    const { agenda, categoryAllList } = useSelector(({ mic }) => ({
        agenda: mic.agenda,
        categoryAllList: mic.category.list,
    }));
    const [temp, setTemp] = useState({});
    const [showPollModal, setShowPollModal] = useState(false);
    const [showArtModal, setShowArtModal] = useState(false);

    const handleClickSave = () => {};

    /**
     * 취소
     */
    const handleClickCancel = () => history.push(match.path);

    const handleClickDelete = () => {};

    /**
     * 모달 state 변경
     */
    const handleChangeModal = ({ key, value }) => {
        if (key === 'poll') {
            setShowPollModal(value);
        } else if (key === 'article') {
            setShowArtModal(value);
        } else if (key === 'thumb') {
            // 썸네일 변경 모달
        }
    };

    /**
     * 아젠다 데이터 변경
     */
    const handleChangeValue = ({ key, value }) => {
        setTemp({ ...temp, [key]: value });
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
        setTemp(agenda);
    }, [agenda]);

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
                agndSeq && { text: '삭제', variant: 'negative', onClick: handleClickDelete },
            ]}
        >
            <MicAgendaForm agenda={temp} categoryAllList={categoryAllList.filter((cate) => cate.usedYn === 'Y')} onChange={handleChangeValue} onChangeModal={handleChangeModal} />
            <RelationPollModal show={showPollModal} onHide={() => setShowPollModal(false)} />
            <ArticleListModal show={showArtModal} onHide={() => setShowArtModal(false)} />
        </MokaCard>
    );
};

export default MicAgendaEdit;
