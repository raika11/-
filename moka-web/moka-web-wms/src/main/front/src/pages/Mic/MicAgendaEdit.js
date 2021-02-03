import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { clearMicAgenda, getMicAgenda } from '@store/mic';
import { MokaCard } from '@components';
import { messageBox } from '@utils/toastUtil';
import RelationPollModal from '@pages/Survey/Poll/modals/RelationPollModal';
import ArticleListModal from '@pages/Article/modals/ArticleListModal';
import { EditThumbModal } from '@pages/Desking/modals';
import MicAgendaForm from './components/MicAgendaForm';

const deskingData = {
    artType: 'B',
    bodyHead: null,
    componentSeq: 55,
    componentWorkSeq: 15583,
    contentId: '23854068',
    contentOrd: 1,
    contentOrdEx: '01',
    contentType: null,
    datasetSeq: 73,
    deskingPart: 'THUMB_FILE_NAME,TITLE_LOC,TITLE,SUB_TITLE,BODY_HEAD',
    deskingSeq: 7712,
    distDt: '2020-08-21 21:26:24',
    gridType: 'DESKING',
    iconFileName: null,
    irThumbFileName: 'https://stg-wimage.joongang.co.kr/1000/politics/202012/23854068_73_20201222154141.jpeg',
    lang: 'KR',
    linkTarget: null,
    linkUrl: null,
    nameplate: null,
    nameplateTarget: null,
    nameplateUrl: null,
    parentContentId: null,
    regDt: '2021-01-12 14:13:14',
    rel: false,
    relOrd: 1,
    relOrdEx: '',
    relSeqs: [77360],
    seq: 77359,
    sourceCode: '3',
    subTitle: null,
    thumbFileName: 'https://stg-wimage.joongang.co.kr/1000/politics/202012/23854068_73_20201222154141.jpeg',
    thumbHeight: 180,
    thumbSize: 50149,
    thumbWidth: 290,
    title: '檢, ‘공금으로 어록집 발간 의혹’ 이찬희 변협회장 불기소 처분',
    titleLoc: null,
    titlePrefix: null,
    titlePrefixLoc: null,
    titleSize: null,
    vodUrl: null,
};

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
    const [defaultValue, setDefaultValue] = useState(null);
    const [showPollModal, setShowPollModal] = useState(false);
    const [showAsModal, setShowAsModal] = useState(false);
    const [showEtModal, setShowEtModal] = useState(false);

    const handleClickSave = () => {};

    /**
     * 취소
     */
    const handleClickCancel = () => history.push(match.path);

    const handleClickDelete = () => {};

    const handleClickPoll = () => {
        setShowPollModal(true);
    };

    const handleClickArticleSearch = () => {
        setShowAsModal(true);
    };

    const handleClickThumbAdd = () => {
        setShowEtModal(true);
    };

    /**
     * 아젠다 데이터 변경
     * @param {object} param0 { key, value }
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
            <MicAgendaForm agenda={temp} categoryAllList={categoryAllList.filter((cate) => cate.usedYn === 'Y')} onChange={handleChangeValue} />
            <RelationPollModal show={showPollModal} onHide={() => setShowPollModal(false)} />
            <ArticleListModal show={showAsModal} onHide={() => setShowAsModal(false)} />
            <EditThumbModal show={showEtModal} onHide={() => setShowEtModal(false)} deskingWorkData={deskingData} />
        </MokaCard>
    );
};

export default MicAgendaEdit;
