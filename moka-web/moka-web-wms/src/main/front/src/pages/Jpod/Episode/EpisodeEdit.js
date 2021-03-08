import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import produce from 'immer';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { MokaCard, MokaInputLabel, MokaInput, MokaIcon } from '@components';
import { PodtyEpisodeModal, RepoterModal, PodCastModal } from '@pages/Jpod/JpodModal';
import { initialState, GET_EPISODES_INFO, saveJpodEpisode, getEpisodesInfo, clearEpisodeInfo, getEpisodes } from '@store/jpod';
import { clearSelectArticleList, selectArticleListChange, selectArticleItemChange } from '@store/survey/quiz';
import toast, { messageBox } from '@utils/toastUtil';
import SortAgGrid from '@pages/Survey/component/SortAgGrid';

// 진행 기본 3명을 보여주기 위해 기본 init 데이터로 배열 3개를 추가 해줌.
// const reporterCountConst = [0, 1, 2];
const reporterCountConst = 3;
// 진행자 선택 삭제시에 필요한 Object
const reporterInit = {
    chnlSeq: '',
    desc: '',
    epsdSeq: '',
    memDiv: '',
    memMemo: '',
    memNm: '',
    memRepSeq: '',
    nickNm: '',
    seqNo: '',
};

/**
 * J팟 관리 - 에피소드 등록 / 수정
 */
const ChannelEdit = (props) => {
    const { match } = props;
    const { chnlSeq, epsdSeq } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const imgFileRef1 = useRef(null); // 메타 이미지 ref
    const imgFileRef2 = useRef(null); // 썸네일 이미지 ref
    const [shrImgFile, setShrImgFile] = useState(null); // 선택한 이미지 파일용 스테이트
    const [katalkImgFile, setKatalkImgFile] = useState(null); // 선택한 썸네일 용 이미지 스테이트

    const [editData, setEditData] = useState(initialState.episode.episodeInfo); // 기본 에피소드 정보.
    const [podtyChnlSrl, setPodtyChnlSrl] = useState('');
    const [seasonCnt, setSeasonCnt] = useState(0);

    const [podtyEpisodeModalState, setPodtyEpisodeModalState] = useState(false); // 팟티 에피소드 모달 상태용
    const [reporterModalState, setReporterModalState] = useState(false); // 기자검색 모달용 스테이트.
    const [podCastModalState, setPodCastModalState] = useState(false); // 팟캐스트 모달용 스테이트
    const [selectRepoterType, setSelectRepoterType] = useState(null); // 리포터 타입 기자 선택시 타입꼬임 방지 위해 사용.
    const [editSelectCPRepoters, setEditSelectCPRepoters] = useState([]); // 선택된 진행자 고정 패널을(3명) 담아둘 스테이트
    const [editSelectEGRepoters, setEditSelectEGRepoters] = useState([]); // 선택된 진행자 게스트를(3명) 담아둘 스테이트

    // store 연결
    const channelList = useSelector((store) => store.jpod.episode.channel.list);
    const channelInfo = useSelector((store) => store.jpod.channel.channelInfo);
    // const search = useSelector((store) => store.jpod.episode.episodes.search);
    const episodeInfo = useSelector((store) => store.jpod.episode.episodeInfo);
    const selectReporter = useSelector((store) => store.jpod.selectReporter);
    const selectPodtyEpisode = useSelector((store) => store.jpod.selectPodtyEpisode);
    const selectBrightOvp = useSelector((store) => store.jpod.selectBrightOvp);
    const loading = useSelector((store) => store.loading[GET_EPISODES_INFO]);

    const selectArticleItem = useSelector((store) => store.quiz.selectArticle.item);
    // const selectArticleList = useSelector((store) => store.quiz.selectArticle.list);

    /**
     * 정보 기본 데이터 리셋시 사용할 함수.
     */
    const resetEditData = () => {
        setEditData(initialState.episode.episodeInfo);
        setEditSelectCPRepoters([]);
        setEditSelectEGRepoters([]);
    };

    /**
     * 정보 창에서 값 변경시 스테이트에 저장.
     */
    const handleEditDataChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'usedYn') {
            setEditData({
                ...editData,
                usedYn: checked ? 'Y' : 'N',
            });
        } else if (name === 'seasonCnt') {
            setSeasonCnt(value);
        } else if (name === 'jpodType') {
            setEditData({
                ...editData,
                jpodType: value,
            });
        } else {
            setEditData({
                ...editData,
                [name]: value,
            });
        }
    };

    /**
     * 이미지 파일 변경시 해당 스테이트 업데이트.
     */
    const handleChangeFIle = ({ name, file }) => {
        switch (name) {
            case 'shrImgFile':
                setShrImgFile(file);
                break;
            case 'katalkImgFile':
                setKatalkImgFile(file);
                break;
            default:
                break;
        }
    };

    /**
     * 채널 셀렉트 박스 선택시 팟티 채널 셋팅
     */
    const handleChangeChnl = (e) => {
        const { value } = e.target;
        try {
            const { podtychnlsrl } = e.target.selectedOptions[0].dataset;
            setEditData({ ...editData, chnlSeq: value });
            setPodtyChnlSrl(String(podtychnlsrl));
        } catch (err) {
            setEditData({ ...editData, chnlSeq: '' });
            setPodtyChnlSrl('');
        }
    };

    // 기사 검색 버튼 ( 추후에 추가 예정 )
    // const handleClickArticleButton = () => {};

    /**
     * 정보창에서 팟티 에피소드 검색 버튼 클릭. ( 선택한 채널이 없을경우 채널을 선택해 주세요 alert)
     */
    const handleClickPodtyEpisodeButton = () => {
        if (!editData.chnlSeq || editData.chnlSeq === '') {
            messageBox.alert('채널을 선택해 주세요.', () => {});
            return;
        } else {
            setPodtyEpisodeModalState(true);
        }
    };

    /**
     * 진행자(기자) 검색 모달 버튼
     */
    const handleClickSearchRepoterButton = () => {
        setReporterModalState(true);
    };

    /**
     * 파일 등록시 사용할 모달창
     */
    const handleClickAddPodCast = () => {
        setPodCastModalState(true);
    };

    /**
     * 벨리데이션
     */
    const checkValidation = () => {
        if (!editData.chnlSeq || editData.chnlSeq === '') {
            messageBox.alert('채널을 선택해 주세요.', () => {});
            return true;
        }

        return false;
    };

    /**
     * 정보 저장 버튼
     */
    const handleClickSaveButton = () => {
        // 벨리데이션 체크.
        if (checkValidation()) {
            return;
        }

        // 진행자 배열을 담아둘 index 번호용
        let memberCount = 0;

        var formData = new FormData();

        // const selectChnlSeq = editData.chnlSeq; // 업데이트 시 사용할 에피소트 고유 번호.

        formData.append(`chnlSeq`, editData.chnlSeq); // 채널
        formData.append(`epsdSeq`, editData.epsdSeq); // 채널

        formData.append(`epsdNo`, editData.epsdNo); // 에피소드 회차
        formData.append(`usedYn`, editData.usedYn); // 사용유무
        formData.append(`playTime`, editData.playTime); // 재생시간
        formData.append(`epsdDate`, moment(editData.epsdDate).format('YYYY-MM-DD')); // 에피소드 등록일
        formData.append(`podtyEpsdSrl`, editData.podtyEpsdSrl); // 파티 에피소드SRL
        formData.append(`jpodType`, editData.jpodType); // 팟캐스트 타입

        formData.append(`epsdNm`, editData.epsdNm); // 에피소드 명
        formData.append(`epsdFile`, editData.epsdFile); // 에피소드 파일 링크
        formData.append(`epsdMemo`, editData.epsdMemo); // 에피소드 소개
        formData.append(`seasonNo`, editData.seasonNo); // 시즌 번호

        if (editData.shrImg) {
            formData.append(`shrImg`, editData.shrImg); // 이미지
        }

        if (editData.katalkImg) {
            formData.append(`katalkImg`, editData.katalkImg); // 카카오톡 이미지
        }

        // 태그
        editData.keywords &&
            editData.keywords.length > 0 &&
            editData.keywords.split(',').map((e, index) => {
                formData.append(`keywords[${index}].ordNo`, index);
                formData.append(`keywords[${index}].keyword`, e);
                return false;
            });

        // 선택한 진행자(고정패널)가 있을경우 form 값에 순서대로 추가.
        editSelectCPRepoters.map((element) => {
            const memDiv = !element.memDiv || element.memDiv === undefined ? 'CP' : element.memDiv;
            const memNm = !element.memNm || element.memNm === undefined ? '' : element.memNm;
            const memRepSeq = !element.memRepSeq || element.memRepSeq === undefined ? '' : element.memRepSeq;
            const nickNm = !element.nickNm || element.nickNm === undefined ? '' : element.nickNm;
            const memMemo = !element.memMemo || element.memMemo === undefined ? '' : element.memMemo;
            const desc = !element.desc || element.desc === undefined ? '' : element.desc;

            if (memNm) {
                formData.append(`members[${memberCount}].memDiv`, memDiv);
                formData.append(`members[${memberCount}].memNm`, memNm);
                formData.append(`members[${memberCount}].memRepSeq`, memRepSeq);
                formData.append(`members[${memberCount}].nickNm`, nickNm);
                formData.append(`members[${memberCount}].memMemo`, memMemo);
                formData.append(`members[${memberCount}].desc`, desc);
                memberCount++;
            }
            return [];
        });

        // 선택한 진행자(게스트)가 있을경우 form 값에 순서대로 추가.
        editSelectEGRepoters.map((element) => {
            const memDiv = !element.memDiv || element.memDiv === undefined ? 'EG' : element.memDiv;
            const memNm = !element.memNm || element.memNm === undefined ? '' : element.memNm;
            const memRepSeq = !element.memRepSeq || element.memRepSeq === undefined ? '' : element.memRepSeq;
            const nickNm = !element.nickNm || element.nickNm === undefined ? '' : element.nickNm;
            const memMemo = !element.memMemo || element.memMemo === undefined ? '' : element.memMemo;
            const desc = !element.desc || element.desc === undefined ? '' : element.desc;

            if (memNm) {
                formData.append(`members[${memberCount}].memDiv`, memDiv);
                formData.append(`members[${memberCount}].memNm`, memNm);
                formData.append(`members[${memberCount}].memRepSeq`, memRepSeq);
                formData.append(`members[${memberCount}].nickNm`, nickNm);
                formData.append(`members[${memberCount}].memMemo`, memMemo);
                formData.append(`members[${memberCount}].desc`, desc);
                memberCount++;
            }
            return [];
        });

        // 파일 추가.
        if (shrImgFile) {
            formData.append(`shrImgFile`, shrImgFile[0]);
        }

        // 파일 추가.
        if (katalkImgFile) {
            formData.append(`katalkImgFile`, katalkImgFile[0]);
        }

        selectArticleItem.map((item, index) => {
            if (item.contentId) {
                formData.append(`articles[${index}].id.totalId`, item.contentId);
            }
            formData.append(`articles[${index}].ordNo`, index);
            formData.append(`articles[${index}].relTitle`, item.title);
            formData.append(`articles[${index}].relLink`, item.linkUrl);
            formData.append(`articles[${index}].relLinkTarget`, item.linkTarget ? item.linkTarget : 'S');
            return item;
        });

        dispatch(
            saveJpodEpisode({
                chnlSeq: Number(editData.chnlSeq),
                epsdSeq: Number(editData.epsdSeq),
                episodeinfo: formData,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        const { chnlSeq, epsdSeq } = body;
                        if ((chnlSeq, epsdSeq)) {
                            // 등록 및 수정 성공시 store 값 초기화 후 다시 데이터를 가지고 옴.
                            dispatch(clearEpisodeInfo());
                            dispatch(getEpisodes());
                            dispatch(getEpisodesInfo({ chnlSeq: chnlSeq, epsdSeq: epsdSeq }));
                            history.push(`${match.path}/${chnlSeq}/${epsdSeq}`);
                        }
                    } else {
                        const { totalCnt, list } = body;
                        if (totalCnt > 0 && Array.isArray(list)) {
                            // 에러 메시지 확인.
                            messageBox.alert(list[0].reason, () => {});
                        } else {
                            // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
                            messageBox.alert(message, () => {});
                        }
                    }
                },
            }),
        );
    };

    /**
     * 진행자 3명이상 추가 할떄 alert 띄워 주는 함수.
     */
    const handleRepoterAddAlert = () => {
        messageBox.alert(`${reporterCountConst}명 이상 등록할수 없습니다.`);
        return;
    };

    /**
     * 취소 버튼 클릭시 URL 이동.
     */
    const handleClickCancleButton = () => {
        history.push(`${match.path}`);
    };

    /**
     * 진행자 삭제 버튼 처리.
     */
    const handleClickReporterDelete = (gubun, index) => {
        let tempReporterList = gubun === 'CP' ? editSelectCPRepoters : editSelectEGRepoters;

        let tempList = tempReporterList.filter((e, i) => i !== index);
        tempList = [...tempList, reporterInit];

        // 고정 패널 일경우
        if (gubun === 'CP') {
            setEditSelectCPRepoters(tempList);
        } else if (gubun === 'EG') {
            // 게스트일 경우
            setEditSelectEGRepoters(tempList);
        }
    };

    /**
     * 진행자 행 삭제 버튼
     */
    const handleClickReporterRowDelete = (gubun, index) => {
        // 고정 패널 일경우
        if (gubun === 'CP') {
            setEditSelectCPRepoters(
                produce(editSelectCPRepoters, (draft) => {
                    draft.splice(index, 1);
                }),
            );
        } else if (gubun === 'EG') {
            // 게스트일 경우
            setEditSelectEGRepoters(
                produce(editSelectEGRepoters, (draft) => {
                    draft.splice(index, 1);
                }),
            );
        }
    };

    /**
     * 진행자(기자) 내용 수정 처리.
     */
    const handleChangeReporters = ({ gubun, e, index }) => {
        const { name, value } = e.target;
        if (gubun === 'CP') {
            setEditSelectCPRepoters(editSelectCPRepoters.map((item, i) => (i === index ? { ...item, [name]: value } : item)));
        } else if (gubun === 'EG') {
            setEditSelectEGRepoters(editSelectEGRepoters.map((item, i) => (i === index ? { ...item, [name]: value } : item)));
        }
    };

    /**
     * 진행자 추가 버튼 클릭 처리.
     */
    const handleClickRepoterAddButton = (gubun) => {
        if (gubun === 'CP') {
            if (editSelectCPRepoters.length === reporterCountConst) {
                handleRepoterAddAlert();
                return;
            }
            setEditSelectCPRepoters([...editSelectCPRepoters, reporterInit]);
        } else if (gubun === 'EG') {
            if (editSelectEGRepoters.length === reporterCountConst) {
                handleRepoterAddAlert();
                return;
            }
            setEditSelectEGRepoters([...editSelectEGRepoters, reporterInit]);
        }
    };

    /**
     * 진행자 배열 조합
     */
    const reportCombine = (reporpter, setFunc) => {
        // 리스트 중에 값이 없는 필드가 있는지 체크.
        const tmpCh = reporpter.filter((e) => e.memMemo === '' && e.memNm === '' && e.memRepSeq === '' && e.nickNm === '' && e.seqNo === '');

        // 빈 필드가 없으면 추가.
        if (tmpCh.length === 0) {
            if (reporpter.length === reporterCountConst) {
                handleRepoterAddAlert();
                return;
            }
            setFunc([...reporpter, selectReporter]);
        } else {
            // 빈 필드가 있으면 빈필드에 진행자 정보 추가.
            let status = false;
            setFunc(
                reporpter.map((e) => {
                    const { memMemo, memNm, memRepSeq, nickNm, seqNo } = e;

                    if (status === false && memMemo === '' && memNm === '' && memRepSeq === '' && nickNm === '' && seqNo === '') {
                        status = true;
                        return selectReporter;
                    } else {
                        return e;
                    }
                }),
            );
        }
    };

    useEffect(() => {
        // 최초 로딩시에 에피소드 정보를 가지고 와야 할떄. ( url params가 존재하고, 스토어에 에피소드 정보가 없을 때)
        if (chnlSeq && epsdSeq && episodeInfo.chnlSeq === '') {
            dispatch(getEpisodesInfo({ chnlSeq: chnlSeq, epsdSeq: epsdSeq }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // 선택된 채널의 시즌 정보를 가져와 시즌 목록 생성
        const targetIdx = channelList.findIndex((c) => editData.chnlSeq === c.chnlSeq);
        if (targetIdx > -1) {
            setSeasonCnt(channelList[targetIdx].seasonCnt);
            setPodtyChnlSrl(String(channelList[targetIdx].podtyChnlSrl));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editData.chnlSeq]);

    useEffect(() => {
        // store 에서 에피소드 값이 변경이 되변 정보 스테이트를 업데이트 해준다.
        const setBasic = (element) => {
            // 에피소드 기본 데이터.
            setEditData({
                usedYn: element.usedYn,
                chnlSeq: element.chnlSeq,
                podtyEpsdSrl: element.podtyEpsdSrl,
                epsdNm: element.epsdNm,
                epsdMemo: element.epsdMemo,
                epsdNo: element.epsdNo,
                epsdDate: element.epsdDate,
                epsdFile: element.epsdFile,
                playTime: element.playTime,
                jpodType: element.jpodType === null ? 'A' : element.jpodType,
                katalkImg: element.katalkImg,
                playCnt: element.playCnt,
                shrImg: element.shrImg,
                epsdSeq: element.epsdSeq,
                likeCnt: element.likeCnt,
                replyCnt: element.replyCnt,
                scbCnt: element.scbCnt,
                shareCnt: element.shareCnt,
                viewCnt: element.viewCnt,
                seasonNo: element.seasonNo,
                keywords: element.keywords && Array.isArray(element.keywords) ? element.keywords.map((e) => e.keyword).join(', ') : element.keywords,
            });
        };

        // 진행자 리스트.
        const setMember = (element) => {
            const listCp = element.filter((e) => e.memDiv === 'CP'); // 고정 패널.
            setEditSelectCPRepoters(
                listCp.map((element) => {
                    return {
                        chnlSeq: element?.chnlSeq || '',
                        desc: element?.desc || '',
                        epsdSeq: element?.epsdSeq || '',
                        memDiv: element?.memDiv || '',
                        memMemo: element?.memMemo || '',
                        memNm: element?.memNm || '',
                        memRepSeq: element?.memRepSeq || '',
                        nickNm: element?.nickNm || '',
                        seqNo: element?.seqNo || '',
                    };
                }),
            );

            const listEg = element.filter((e) => e.memDiv === 'EG'); // 게스트.
            setEditSelectEGRepoters(
                listEg.map((element) => {
                    return {
                        chnlSeq: element?.chnlSeq || '',
                        desc: element?.desc || '',
                        epsdSeq: element?.epsdSeq || '',
                        memDiv: element?.memDiv || '',
                        memMemo: element?.memMemo || '',
                        memNm: element?.memNm || '',
                        memRepSeq: element?.memRepSeq || '',
                        nickNm: element?.nickNm || '',
                        seqNo: element?.seqNo || '',
                    };
                }),
            );
        };

        // 기사 정보 설정.
        const setArticle = (element) => {
            dispatch(
                selectArticleListChange(
                    element.map((e) => {
                        return {
                            contentId: e.id.totalId,
                            title: e.relTitle,
                            linkUrl: e.relLink,
                            linkTarget: e.relLinkTarget,
                        };
                    }),
                ),
            );
            dispatch(
                selectArticleItemChange(
                    element.map((e) => {
                        return {
                            contentId: e.id.totalId,
                            title: e.relTitle,
                            linkUrl: e.relLink,
                            linkTarget: e.relLinkTarget,
                        };
                    }),
                ),
            );
        };

        // store 에 episodeInfo가 변경이 되었지만 초기값과 같다면 아무 것도 하지 않는다.
        if (episodeInfo === initialState.episode.episodeInfo) {
            resetEditData();
            return;
        }

        // 값 변경시 state 변경 처리.
        if (episodeInfo && episodeInfo !== initialState.episode.episodeInfo) {
            setBasic(episodeInfo);
            setMember(episodeInfo.members);
            setArticle(episodeInfo.articles);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [episodeInfo]);

    useEffect(() => {
        // 팟티 에피소드검색 모달에서 선택시 해당 값을 정보창에도 변경 시켜준다.
        if (Object.keys(selectPodtyEpisode).length > 0) {
            setEditData({
                ...editData,
                podtyEpsdSrl: selectPodtyEpisode.episodeSrl,
                epsdNm: selectPodtyEpisode.title,
                epsdMemo: selectPodtyEpisode.summary,
                epsdFile: selectPodtyEpisode.enclosure,
                playTime: selectPodtyEpisode.duration,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectPodtyEpisode]);

    useEffect(() => {
        // 기자 검색 모달 창에서 기자를 선택 하면 store 에 업데이트를 해주고
        // 스토어가 변경 되면 진행자 스테이트를 업데이트 해줌.
        if (selectReporter) {
            if (selectReporter.selectType === 'CP') {
                reportCombine(editSelectCPRepoters, setEditSelectCPRepoters);
            } else if (selectReporter.selectType === 'EG') {
                reportCombine(editSelectEGRepoters, setEditSelectEGRepoters);
            }
        }
        // 기자 선택 스토어가 변경 되었을 경우만 실행.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectReporter]);

    useEffect(() => {
        // 최초 로딩 및 렌더링 직후 진행자 배열을 초기화 해준다.
        dispatch(clearSelectArticleList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // 브라이트 코브 값이 선택되서 store 가 변경되면 정보창에서 변경 시켜 준다.
        if (selectBrightOvp.id && selectBrightOvp.name) {
            setEditData({
                ...editData,
                epsdFile: selectBrightOvp.id,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectBrightOvp]);

    const sortGridSearchFrom = ({ HandleSearchClick, HandleAddClick }) => {
        return (
            <React.Fragment>
                <Form.Row className="mb-2">
                    <MokaInputLabel label={`관련 기사`} as="none" />
                    <Button
                        variant="searching"
                        size="sm"
                        className="mr-1"
                        onClick={() => {
                            if (selectArticleItem.length >= 4) {
                                toast.warning('관련기사는 4개를 초과하여 추가 할 수 없습니다.');
                            } else {
                                HandleSearchClick();
                            }
                        }}
                    >
                        검색
                    </Button>
                    <Button
                        variant="positive"
                        size="sm"
                        onClick={() => {
                            if (selectArticleItem.length >= 4) {
                                toast.warning('관련기사는 4개를 초과하여 추가 할 수 없습니다.');
                            } else {
                                HandleAddClick();
                            }
                        }}
                    >
                        추가
                    </Button>
                </Form.Row>
            </React.Fragment>
        );
    };

    return (
        <MokaCard
            className="overflow-hidden w-100 flex-fill"
            title={`에피소드 ${chnlSeq && epsdSeq ? '수정' : '등록'}`}
            loading={loading}
            footer
            footerClassName="justify-content-center"
            footerAs={
                <>
                    <Button variant="positive" className="mr-1" onClick={handleClickSaveButton}>
                        {chnlSeq && epsdSeq ? '수정' : '저장'}
                    </Button>
                    <Button variant="negative" onClick={handleClickCancleButton}>
                        취소
                    </Button>
                </>
            }
        >
            <Form>
                {/* 사용 */}
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            name="usedYn"
                            id="usedYn"
                            label="사용"
                            inputProps={{ checked: editData.usedYn === 'Y' ? true : false }}
                            onChange={handleEditDataChange}
                        />
                    </Col>
                </Form.Row>
                {/* 채널 선택. */}
                <Form.Row className="mb-2">
                    <Col xs={6} className="p-0">
                        <MokaInputLabel label="채널명" as="select" id="chnlSeq" name="chnlSeq" value={editData.chnlSeq} onChange={handleChangeChnl}>
                            <option value="">채널 전체</option>
                            {channelList.map((item) => (
                                <option key={item.chnlSeq} value={item.chnlSeq} data-podtychnlsrl={item.podtyChnlSrl}>
                                    {item.chnlNm}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                {/* 팟티 에피소드 검색 */}
                <Form.Row className="mb-2 align-items-center">
                    <MokaInputLabel
                        label={`팟티\n(에피소드 연결)`}
                        id="podtyEpsdSrl"
                        className="mr-2 flex-fill"
                        name="podtyEpsdSrl"
                        placeholder=""
                        value={editData.podtyEpsdSrl}
                        onChange={handleEditDataChange}
                    />
                    <Button variant="searching" onClick={handleClickPodtyEpisodeButton}>
                        팟티 에피소드 검색
                    </Button>
                </Form.Row>
                {/* 에피소드 명 */}
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel label={`에피소드명`} id="epsdNm" name="epsdNm" placeholder="" value={editData.epsdNm} onChange={handleEditDataChange} />
                    </Col>
                </Form.Row>
                {/* 에피소드 내용 */}
                <MokaInputLabel
                    label={`에피소드 내용`}
                    as="textarea"
                    className="mb-2"
                    inputClassName="resize-none"
                    inputProps={{ rows: 6 }}
                    id="epsdMemo"
                    name="epsdMemo"
                    value={editData.epsdMemo}
                    onChange={handleEditDataChange}
                />
                {/* 시즌 회차. */}
                <Form.Row className="mb-2 align-items-center">
                    <div style={{ width: 350 }}>
                        <MokaInputLabel label={`시즌 및 회차`} className="mr-2" as="select" name="seasonNo" id="seasonNo" value={editData.seasonNo} onChange={handleEditDataChange}>
                            <option value="">{seasonCnt === 0 ? '-' : '시즌 선택'}</option>
                            {seasonCnt > 0 &&
                                [...Array(seasonCnt)].map((n, idx) => {
                                    return (
                                        <option key={idx} value={idx + 1}>
                                            시즌 {idx + 1}
                                        </option>
                                    );
                                })}
                        </MokaInputLabel>
                    </div>
                    <div style={{ width: 150 }}>
                        <MokaInputLabel label={`회차`} className="mr-2" name="epsdNo" id="epsdNo" value={editData.epsdNo} onChange={handleEditDataChange} />
                    </div>
                    <p className="mb-0">마지막 회차: {channelInfo.episodeStat.lastEpsoNo ? `${channelInfo.episodeStat.lastEpsoNo}회` : ''}</p>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            label={`방송일`}
                            as="dateTimePicker"
                            name="epsdDate"
                            id="epsdDate"
                            value={editData.epsdDate}
                            onChange={(param) => {
                                handleEditDataChange({ target: { name: 'epsdDate', value: param } });
                            }}
                            inputProps={{ timeFormat: null }}
                        />
                    </Col>
                </Form.Row>
                {/* 태그 */}
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel label={`태그`} id="keywords" name="keywords" placeholder="" value={editData.keywords} onChange={handleEditDataChange} />
                    </Col>
                </Form.Row>
                {/* 팟캐스트 구분( 오디오, 비디오 ) */}
                <Form.Row className="mb-2">
                    <div className="d-flex w-100 align-items-center">
                        <MokaInputLabel as="none" label="팟캐스트 구분" />
                        <Col xs={2} className="p-0">
                            <MokaInputLabel
                                as="radio"
                                inputProps={{
                                    custom: true,
                                    label: '오디오',
                                    checked: editData.jpodType === 'A',
                                }}
                                id="jpodType1"
                                name="jpodType"
                                onChange={handleEditDataChange}
                                value="A"
                                required
                            />
                        </Col>
                        <Col xs={4} className="p-0">
                            <MokaInputLabel
                                as="radio"
                                inputProps={{
                                    custom: true,
                                    label: '비디오',
                                    checked: editData.jpodType === 'V',
                                }}
                                id="jpodType2"
                                name="jpodType"
                                onChange={handleEditDataChange}
                                value="V"
                                required
                            />
                        </Col>
                    </div>
                </Form.Row>
                <hr className="divider" />
                {/* 팟캐스트 파일 등록. */}
                <Form.Row className="mb-2">
                    <MokaInputLabel as="none" label="url" />
                    <div className="px-2 flex-fill d-flex align-items-center" style={{ backgroundColor: '#f4f7f9', height: '50px' }}>
                        <MokaInput name="epsdFile" className="mr-2" id="epsdFile" value={editData.epsdFile} onChange={handleEditDataChange} />
                        <div>
                            <Button variant="positive" className="mr-2" onClick={handleClickAddPodCast}>
                                등록
                            </Button>
                        </div>
                        <div style={{ width: 250 }}>
                            <MokaInputLabel label="재생시간" name="playTime" value={editData.playTime} onChange={handleEditDataChange} />
                        </div>
                    </div>
                </Form.Row>
                {/* 이미지 */}
                {editData.jpodType === 'V' && (
                    <>
                        {/* 메타이미지 */}
                        <Form.Row className="mb-2">
                            <Col xs={6}>
                                <MokaInputLabel
                                    as="imageFile"
                                    className="mb-2"
                                    name="shrImgFile"
                                    id="shrImgFile"
                                    isInvalid={null}
                                    inputClassName="flex-fill"
                                    label={
                                        <React.Fragment>
                                            메타이미지
                                            <br />
                                            (1200*627)
                                            <br />
                                            <Button
                                                className="mt-1"
                                                size="sm"
                                                variant="negative"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    imgFileRef1.current.deleteFile();
                                                    setShrImgFile(null);
                                                    setEditData({
                                                        ...editData,
                                                        shrImg: null,
                                                    });
                                                }}
                                            >
                                                삭제
                                            </Button>
                                        </React.Fragment>
                                    }
                                    ref={imgFileRef1}
                                    inputProps={{
                                        height: 80,
                                        // width: 400, // width: '100%' number type 에러남.
                                        img: editData.shrImg,
                                    }}
                                    onChange={(file) =>
                                        handleChangeFIle({
                                            name: 'shrImgFile',
                                            file: file,
                                        })
                                    }
                                    labelClassName="justify-content-end"
                                />
                            </Col>
                            {/* 썸네일 이미지 */}
                            <Col xs={6} className="p-0 pt-1 pl-1">
                                <MokaInputLabel
                                    as="imageFile"
                                    className="w-100 mb-2"
                                    name="katalkImgFile"
                                    id="katalkImgFile"
                                    isInvalid={null}
                                    inputClassName="d-flex flex-fill"
                                    label={
                                        <React.Fragment>
                                            썸네일
                                            <br />
                                            (1200*627)
                                            <br />
                                            <Button
                                                className="mt-1"
                                                size="sm"
                                                variant="negative"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    imgFileRef2.current.deleteFile();
                                                    setKatalkImgFile(null);
                                                    setEditData({
                                                        ...editData,
                                                        katalkImg: null,
                                                    });
                                                }}
                                            >
                                                삭제
                                            </Button>
                                        </React.Fragment>
                                    }
                                    ref={imgFileRef2}
                                    inputProps={{
                                        height: 80,
                                        img: editData.katalkImg,
                                    }}
                                    onChange={(file) =>
                                        handleChangeFIle({
                                            name: 'katalkImgFile',
                                            file: file,
                                        })
                                    }
                                />
                            </Col>
                        </Form.Row>
                    </>
                )}
                <hr className="divider" />
                {/* 진행자( 고정 패널 ) */}
                <Form.Row className="mb-2">
                    <MokaInputLabel label={`출연진(고정패널)`} as="none" />
                    <Button
                        variant="searching"
                        size="sm"
                        className="mr-1"
                        onClick={() => {
                            setSelectRepoterType('CP');
                            handleClickSearchRepoterButton();
                        }}
                    >
                        검색
                    </Button>
                    <Button variant="positive" size="sm" onClick={() => handleClickRepoterAddButton('CP')}>
                        추가
                    </Button>
                </Form.Row>
                {/* 기본 3개 를 뿌려준다. */}
                {editSelectCPRepoters.map((element, index) => {
                    return (
                        <Form.Row className="mb-2" key={index}>
                            <MokaInputLabel label=" " as="none" />
                            <div className="px-2 flex-fill d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f4f7f9', height: '100px' }}>
                                <Col xs={11} className="p-0 d-flex flex-column">
                                    <div className="mb-2 d-flex align-items-center justify-content-center ">
                                        <MokaInput
                                            name="memRepSeq"
                                            style={{ width: 120 }}
                                            value={element.memRepSeq}
                                            onChange={(e) => handleChangeReporters({ gubun: 'CP', e, index })}
                                            placeholder={`ID:`}
                                            disabled
                                        />
                                        <MokaInput
                                            name="memNm"
                                            className="mr-2"
                                            value={element.memNm}
                                            onChange={(e) => handleChangeReporters({ gubun: 'CP', e, index })}
                                            placeholder={`기자명`}
                                        />
                                        <div className="mr-2">
                                            <MokaInput
                                                name="memMemo"
                                                value={element.memMemo}
                                                onChange={(e) => handleChangeReporters({ gubun: 'CP', e, index })}
                                                placeholder={`직책`}
                                            />
                                        </div>
                                        <div className="mr-2">
                                            <MokaInput
                                                name="nickNm"
                                                value={element.nickNm}
                                                onChange={(e) => handleChangeReporters({ gubun: 'CP', e, index })}
                                                placeholder={`닉네임`}
                                            />
                                        </div>
                                        <div>
                                            <Button variant="searching" onClick={() => handleClickReporterDelete('CP', index)}>
                                                삭제
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <MokaInput name="desc" value={element.desc} onChange={(e) => handleChangeReporters({ gubun: 'CP', e, index })} placeholder={`설명`} />
                                    </div>
                                </Col>
                                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-table-del-button">삭제</Tooltip>}>
                                        <Button
                                            variant="white"
                                            className="border-0 p-0 moka-table-button bg-transparent shadow-none"
                                            onClick={() => handleClickReporterRowDelete('CP', index)}
                                        >
                                            <MokaIcon iconName="fal-minus-circle" />
                                        </Button>
                                    </OverlayTrigger>
                                </div>
                            </div>
                        </Form.Row>
                    );
                })}
                <hr className="divider" />
                <Form.Row className="mb-2">
                    <MokaInputLabel label={`출연진(게스트)`} as="none" />
                    <Button
                        variant="searching"
                        size="sm"
                        className="mr-1"
                        onClick={() => {
                            setSelectRepoterType('EG');
                            handleClickSearchRepoterButton();
                        }}
                    >
                        검색
                    </Button>
                    <Button variant="positive" size="sm" onClick={() => handleClickRepoterAddButton('EG')}>
                        추가
                    </Button>
                </Form.Row>
                {/* 기본 3개 를 뿌려준다. */}
                {editSelectEGRepoters.map((element, index) => {
                    return (
                        <Form.Row className="mb-2" key={index}>
                            <MokaInputLabel label=" " as="none" />
                            <div className="px-2 flex-fill d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f4f7f9', height: '100px' }}>
                                <Col xs={11} className="p-0 d-flex flex-column">
                                    <div className="mb-2 d-flex align-items-center justify-content-center ">
                                        <MokaInput
                                            name="memRepSeq"
                                            style={{ width: 120 }}
                                            value={element.memRepSeq}
                                            onChange={(e) => handleChangeReporters({ gubun: 'EG', e, index })}
                                            placeholder={`ID:`}
                                            disabled
                                        />
                                        <MokaInput
                                            name="memNm"
                                            className="mr-2"
                                            value={element.memNm}
                                            onChange={(e) => handleChangeReporters({ gubun: 'EG', e, index })}
                                            placeholder={`기자명`}
                                        />
                                        <div className="mr-2">
                                            <MokaInput
                                                name="memMemo"
                                                value={element.memMemo}
                                                onChange={(e) => handleChangeReporters({ gubun: 'EG', e, index })}
                                                placeholder={`직책`}
                                            />
                                        </div>
                                        <div className="mr-2">
                                            <MokaInput
                                                name="nickNm"
                                                value={element.nickNm}
                                                onChange={(e) => handleChangeReporters({ gubun: 'EG', e, index })}
                                                placeholder={`닉네임`}
                                            />
                                        </div>
                                        <div>
                                            <Button variant="searching" onClick={() => handleClickReporterDelete('EG', index)}>
                                                삭제
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <MokaInput name="desc" value={element.desc} onChange={(e) => handleChangeReporters({ gubun: 'EG', e, index })} placeholder={`설명`} />
                                    </div>
                                </Col>
                                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-table-del-button">삭제</Tooltip>}>
                                        <Button
                                            variant="white"
                                            className="border-0 p-0 moka-table-button bg-transparent shadow-none"
                                            onClick={() => handleClickReporterRowDelete('EG', index)}
                                        >
                                            <MokaIcon iconName="fal-minus-circle" />
                                        </Button>
                                    </OverlayTrigger>
                                </div>
                            </div>
                        </Form.Row>
                    );
                })}
                <hr className="divider" />
                {/* <Form.Row className="mb-2">
                    <MokaInputLabel label={`관련기사`} labelWidth={95} as="none" />
                    <Button xs={12} variant="searching" className="mb-0" onClick={() => handleClickArticleButton()}>
                        검색
                    </Button>
                </Form.Row> */}
                <SortAgGrid SearchForm={sortGridSearchFrom} />
            </Form>
            {/* <ArticleAgGrid /> */}
            {/* 팟티 에피소드 검색 */}
            <PodtyEpisodeModal
                show={podtyEpisodeModalState}
                podtyChnlSrl={podtyChnlSrl}
                onHide={() => {
                    setPodtyEpisodeModalState(false);
                }}
            />
            {/* 진행자 검색 모달. */}
            <RepoterModal
                show={reporterModalState}
                selectType={selectRepoterType}
                onHide={() => {
                    setReporterModalState(false);
                }}
            />
            {/* 팟캐스트 등록 검색 모달. */}
            <PodCastModal
                show={podCastModalState}
                epsdNm={editData.epsdNm}
                onHide={() => {
                    setPodCastModalState(false);
                }}
            />
        </MokaCard>
    );
};

export default ChannelEdit;
