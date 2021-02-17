import React, { useEffect, useState, useRef } from 'react';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import { Form, Col, Button, Row } from 'react-bootstrap';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { PodtyEpisodeModal, RepoterModal, PodCastModal } from '@pages/Jpod/JpodModal';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initialState, GET_EPISODES_INFO, saveJpodEpisode, getEpisodesInfo, clearEpisodeInfo, getEpisodes } from '@store/jpod';
import { clearSelectArticleList, selectArticleListChange, selectArticleItemChange } from '@store/survey/quiz';
import toast, { messageBox } from '@utils/toastUtil';
import SortAgGrid from '@pages/Survey/component/SortAgGrid';

// 진행 기본 3명을 보여주기 위해 기본 init 데이터로 배열 3개를 추가 해줌.
const reporterCountConst = [0, 1, 2];
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

const ChannelEdit = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    const selectChnlSeq = useRef(null); // URL 채널 값 담아둘 ref
    const selectEpsdSeq = useRef(null); // url 에 선택된 에피소드 고유값 담아둘곳.
    const imgFileRef1 = useRef(null); // 메타 이미지 ref
    const imgFileRef2 = useRef(null); // 썸네일 이미지 ref
    const [shrImgFile, setShrImgFile] = useState(null); // 선택한 이미지 파일용 스테이트
    const [katalkImgFile, setKatalkImgFile] = useState(null); // 선택한 썸네일 용 이미지 스테이트

    const [editData, setEditData] = useState(initialState.episode.episodeInfo); // 기본 에피소드 정보.

    const [podtyEpisodeModalState, setPodtyEpisodeModalState] = useState(false); // 팟티 에피소드 모달 상태용
    const [reporterModalState, setReporterModalState] = useState(false); // 기자검색 모달용 스테이트.
    const [podCastModalState, setPodCastModalState] = useState(false); // 팟캐스트 모달용 스테이트
    const [selectRepoterType, setSelectRepoterType] = useState(null); // 리포터 타입 기자 선택시 타입꼬임 방지 위해 사용.
    const [editSelectCPRepoters, setEditSelectCPRepoters] = useState([]); // 선택된 진행자 고정 패널을(3명) 담아둘 스테이트
    const [editSelectEGRepoters, setEditSelectEGRepoters] = useState([]); // 선택된 진행자 게스트를(3명) 담아둘 스테이트

    // store 연결.
    const { channel_list, search, loading, selectReporter, selectPodtyEpisode, episodeInfo, selectBrightOvp } = useSelector((store) => ({
        channel_list: store.jpod.episode.channel.list,
        episodeInfo: store.jpod.episode.episodeInfo,
        selectReporter: store.jpod.selectReporter,
        selectPodtyEpisode: store.jpod.selectPodtyEpisode,
        search: store.jpod.episode.episodes.search,
        selectBrightOvp: store.jpod.selectBrightOvp,
        loading: store.loading[GET_EPISODES_INFO],
    }));

    const { selectArticleItem, selectArticleList } = useSelector((store) => ({
        selectArticleItem: store.quiz.selectArticle.item,
        selectArticleList: store.quiz.selectArticle.list,
    }));

    // 정보 기본 데이터 리셋시 사용할 함수.
    const resetEditData = () => {
        setEditData(initialState.episode.episodeInfo);
        setEditSelectCPRepoters([]);
        setEditSelectEGRepoters([]);
    };

    // 정보 창에서 값 변경시 스테이트에 저장.
    const handleEditDataChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'usedYn') {
            setEditData({
                ...editData,
                usedYn: checked ? 'Y' : 'N',
            });
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

    // 이미지 파일 변경시 해당 스테이트 업데이트.
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

    // 기사 검색 버튼 ( 추후에 추가 예정 )
    const handleClickArticleButton = () => {};

    // 정보창에서 팟티 에피소드 검색 버튼 클릭. ( 선택한 채널이 없을경우 채널을 선택해 주세요 alert)
    const handleClickPodtyEpisodeButton = () => {
        if (!editData.chnlSeq || editData.chnlSeq === '') {
            messageBox.alert('채널을 선택해 주세요.', () => {});
            return;
        }
        setPodtyEpisodeModalState(true);
    };

    // 진행자(기자) 검색 모달 버튼
    const handleClickSearchRepoterButton = () => {
        setReporterModalState(true);
    };

    // 파일 등록시 사용할 모달창
    const handleClickAddPodCast = () => {
        setPodCastModalState(true);
    };

    // 벨리데이션
    const checkValidation = () => {
        if (!editData.chnlSeq || editData.chnlSeq === '') {
            messageBox.alert('채널을 선택해 주세요.', () => {});
            return true;
        }

        return false;
    };

    // 정보 저장 버튼
    const handleClickSaveButton = () => {
        // 벨리데이션 체크.
        if (checkValidation()) {
            return;
        }

        // 진행자 배열을 담아둘 index 번호용
        let memberCount = 0;

        var formData = new FormData();

        const selectChnlSeq = editData.chnlSeq; // 업데이트 시 사용할 에피소트 고유 번호.

        // 사용유무
        formData.append(`usedYn`, editData.usedYn); // 사용유무
        formData.append(`chnlSeq`, editData.chnlSeq); // 채널
        formData.append(`podtyEpsdSrl`, editData.podtyEpsdSrl); // 채널 파티.
        formData.append(`epsdNm`, editData.epsdNm); // 에피소드 명.
        formData.append(`epsdMemo`, editData.epsdMemo); // 에피소드 내용.
        formData.append(`epsdNo`, editData.epsdNo); // 회차.
        formData.append(`epsdDate`, moment(editData.epsdDate).format('YYYY-MM-DD'));

        formData.append(`epsdFile`, editData.epsdFile); // 등록 파일?.
        formData.append(`playTime`, editData.playTime); // 재생시간.
        formData.append(`jpodType`, editData.jpodType); // 팟캐스트 타입.

        if (editData.shrImg) {
            formData.append(`shrImg`, editData.shrImg); // 이미지
        }
        if (editData.katalkImg) {
            formData.append(`katalkImg`, editData.katalkImg); // 카카오톡 이미지.
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

        // // formData 출력(테스트).
        // for (let [key, value] of formData) {
        //     console.log(`${key}: ${value}`);
        // }
        // return;

        dispatch(
            saveJpodEpisode({
                chnlSeq: selectChnlSeq,
                epsdSeq: selectEpsdSeq.current === 'add' ? null : selectEpsdSeq.current,
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

    // 진행자 3명이상 추가 할떄 alert 띄워 주는 함수.
    const handleRepoterAddAlert = () => {
        messageBox.alert(`${reporterCountConst.length}명 이상 등록할수 없습니다.`);
        return;
    };

    // 취소 버튼 클릭시 URL 이동.
    const handleClickCancleButton = () => {
        history.push(`${match.path}`);
    };

    // 진행자 삭제 버튼 처리.
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

    // 진행자(기자) 내용 수정 처리.
    const handleChangeReporters = ({ gubun, e, index }) => {
        const { name, value } = e.target;
        if (gubun === 'CP') {
            setEditSelectCPRepoters(editSelectCPRepoters.map((item, i) => (i === index ? { ...item, [name]: value } : item)));
        } else if (gubun === 'EG') {
            setEditSelectEGRepoters(editSelectEGRepoters.map((item, i) => (i === index ? { ...item, [name]: value } : item)));
        }
    };

    // 진행자 추가 버튼 클릭 처리.
    const handleClickRepoterAddButton = (gubun) => {
        if (gubun === 'CP') {
            if (editSelectCPRepoters.length === reporterCountConst.length) {
                handleRepoterAddAlert();
                return;
            }
            setEditSelectCPRepoters([...editSelectCPRepoters, reporterInit]);
        } else if (gubun === 'EG') {
            if (editSelectEGRepoters.length === reporterCountConst.length) {
                handleRepoterAddAlert();
                return;
            }
            setEditSelectEGRepoters([...editSelectEGRepoters, reporterInit]);
        }
    };

    // 진행자 배열 조합
    const reportCombine = (reporpter, setFunc) => {
        // 리스트 중에 값이 없는 필드가 있는지 체크.
        console.log(reporpter);
        const tmpCh = reporpter.filter((e) => e.memMemo === '' && e.memNm === '' && e.memRepSeq === '' && e.nickNm === '' && e.seqNo === '');

        if (tmpCh.length === 0) {
            if (reporpter.length === reporterCountConst.length) {
                handleRepoterAddAlert();
                return;
            }
            setFunc([...reporpter, selectReporter]);
        } else {
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

    // 기자 검색 모달 창에서 기자를 선택 하면 store 에 업데이트를 해주고
    // 스토어가 변경 되면 진행자 스테이트를 업데이트 해줌.
    useEffect(() => {
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

    // 최초 로딩 및 렌더링 직후 진행자 배열을 초기화 해준다.
    useEffect(() => {
        setEditSelectCPRepoters(reporterCountConst.map(() => reporterInit));
        setEditSelectEGRepoters(reporterCountConst.map(() => reporterInit));

        dispatch(clearSelectArticleList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // url 이 변경 되었을 경우 처리. ( 에피소드 고유 번호 및 add )
    useEffect(() => {
        if (selectChnlSeq.current !== params.chnlSeq) {
            selectChnlSeq.current = params.chnlSeq;
        }

        if (!isNaN(Number(params.epsdSeq)) && selectEpsdSeq.current !== params.epsdSeq) {
            selectEpsdSeq.current = params.epsdSeq;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    // store 에서 에피소드 값이 변경이 되변 정보 스테이트를 업데이트 해준다.
    useEffect(() => {
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
                jpodType: element.jpodType,
                katalkImg: element.katalkImg,
                playCnt: element.playCnt,
                shrImg: element.shrImg,
                keywords: element.keywords && Array.isArray(element.keywords) ? element.keywords.map((e) => e.keyword).join(', ') : element.keywords,
            });
        };

        // 진행자 리스트.
        const setMember = (element) => {
            const list_cp = element.filter((e) => e.memDiv === 'CP'); // 고정 패널.
            setEditSelectCPRepoters(
                reporterCountConst.map((index) => {
                    return {
                        chnlSeq: list_cp[index] && list_cp[index].chnlSeq ? list_cp[index].chnlSeq : '',
                        desc: list_cp[index] && list_cp[index].desc ? list_cp[index].desc : '',
                        epsdSeq: list_cp[index] && list_cp[index].epsdSeq ? list_cp[index].epsdSeq : '',
                        memDiv: list_cp[index] && list_cp[index].memDiv ? list_cp[index].memDiv : '',
                        memMemo: list_cp[index] && list_cp[index].memMemo ? list_cp[index].memMemo : '',
                        memNm: list_cp[index] && list_cp[index].memNm ? list_cp[index].memNm : '',
                        memRepSeq: list_cp[index] && list_cp[index].memRepSeq ? list_cp[index].memRepSeq : '',
                        nickNm: list_cp[index] && list_cp[index].nickNm ? list_cp[index].nickNm : '',
                        seqNo: list_cp[index] && list_cp[index].seqNo ? list_cp[index].seqNo : '',
                    };
                }),
            );

            const list_eg = element.filter((e) => e.memDiv === 'EG'); // 게스트.
            setEditSelectEGRepoters(
                reporterCountConst.map((index) => {
                    return {
                        chnlSeq: list_eg[index] && list_eg[index].chnlSeq ? list_eg[index].chnlSeq : '',
                        desc: list_eg[index] && list_eg[index].desc ? list_eg[index].desc : '',
                        epsdSeq: list_eg[index] && list_eg[index].epsdSeq ? list_eg[index].epsdSeq : '',
                        memDiv: list_eg[index] && list_eg[index].memDiv ? list_eg[index].memDiv : '',
                        memMemo: list_eg[index] && list_eg[index].memMemo ? list_eg[index].memMemo : '',
                        memNm: list_eg[index] && list_eg[index].memNm ? list_eg[index].memNm : '',
                        memRepSeq: list_eg[index] && list_eg[index].memRepSeq ? list_eg[index].memRepSeq : '',
                        nickNm: list_eg[index] && list_eg[index].nickNm ? list_eg[index].nickNm : '',
                        seqNo: list_eg[index] && list_eg[index].seqNo ? list_eg[index].seqNo : '',
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
                            constntId: e.id.totalId,
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
                            constntId: e.id.totalId,
                            title: e.relTitle,
                            linkUrl: e.relLink,
                            linkTarget: e.relLinkTarget,
                        };
                    }),
                ),
            );

            // dispatch(
            //     selectArticleListChange({
            //         constntId: element.id.totalId,
            //         title: element.relTitle,
            //         linkUrl: element.totalId,
            //         linkTarget: element.relLinkTarget,
            //     }),
            // );
            // dispatch(
            //     selectArticleItemChange({
            //         constntId: element.id.totalId,
            //         title: element.relTitle,
            //         linkUrl: element.totalId,
            //         linkTarget: element.relLinkTarget,
            //     }),
            // );
        };

        // store 에 episodeInfo 가 변경이 되었지만 초기값과 같다면 아무 것도 하지 않는다.
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

    // 브라이트 코브 값이 선택되서 store 가 변경되면 정보창에서 변경 시켜 준다.
    useEffect(() => {
        if (selectBrightOvp.id && selectBrightOvp.name) {
            setEditData({
                ...editData,
                epsdFile: selectBrightOvp.id,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectBrightOvp]);

    // 에피소드 리스트에서 채널 선택후 검색 하면 정보 창에도 해당 채널로 변경을 시켜준다 ( 등록 상태 일때)
    useEffect(() => {
        if (selectChnlSeq.current === 'add' && editData.chnlSeq !== search.chnlSeq) {
            setEditData({
                ...editData,
                chnlSeq: search.chnlSeq,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    // 팟티 에피소드검색 모달에서 선택시 해당 값을 정보창에도 변경 시켜준다.
    useEffect(() => {
        const setPodtyEpisodeSrl = (podtyepsdsrl) => {
            if (editData.podtyEpsdSrl !== podtyepsdsrl) {
                setEditData({
                    ...editData,
                    podtyEpsdSrl: podtyepsdsrl,
                });
            }
        };
        if (selectPodtyEpisode) {
            setPodtyEpisodeSrl(selectPodtyEpisode.episodeSrl);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectPodtyEpisode]);

    // 최초 로딩시에 에피소드 정보를 가지고 와야 할떄. ( url 에 에피소드 정보를 포함하고 페이지를 로딩 할떄..)
    useEffect(() => {
        if (selectChnlSeq.current && selectEpsdSeq.current && !isNaN(Number(selectChnlSeq.current)) && !isNaN(Number(selectEpsdSeq.current))) {
            dispatch(getEpisodesInfo({ chnlSeq: selectChnlSeq.current, epsdSeq: selectEpsdSeq.current }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sortGridSearchFrom = ({ HandleSearchClick, HandleAddClick }) => {
        return (
            <React.Fragment>
                <Form.Row className="mb-2">
                    <MokaInputLabel label={`관련 기사`} labelWidth={95} as="none" />
                    <Col xs={1} className="p-0">
                        <Button
                            variant="searching"
                            onClick={() => {
                                HandleSearchClick();
                            }}
                        >
                            검색
                        </Button>
                    </Col>
                    <Col xs={1} className="p-0">
                        <Button variant="positive" onClick={() => HandleAddClick()}>
                            추가
                        </Button>
                    </Col>
                </Form.Row>
            </React.Fragment>
        );
    };

    return (
        <MokaCard
            className="overflow-hidden flex-fill"
            title={`에피소드 ${selectChnlSeq.current === 'add' ? '등록' : '정보'}`}
            titleClassName="mb-0"
            loading={loading}
            footer
            footerClassName="d-flex justify-content-center"
            footerAs={
                <>
                    {(function () {
                        return (
                            <Row className="justify-content-md-center text-center">
                                <Col className="mp-0 pr-0">
                                    <Button variant="positive" onClick={() => handleClickSaveButton()}>
                                        저장
                                    </Button>
                                </Col>
                                <Col className="mp-0 pr-0">
                                    <Button variant="negative" onClick={() => handleClickCancleButton()}>
                                        취소
                                    </Button>
                                </Col>
                            </Row>
                        );
                    })()}
                </>
            }
        >
            <Form className="mb-gutter">
                {/* 사용여부 */}
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            as="switch"
                            name="usedYn"
                            id="usedYn"
                            label="사용여부"
                            labelWidth={90}
                            inputProps={{ checked: editData.usedYn === 'Y' ? true : false }}
                            onChange={(e) => handleEditDataChange(e)}
                        />
                    </Col>
                </Form.Row>
                {/* 채널 선택. */}
                <Form.Row className="mb-2">
                    <Col xs={5} className="p-0">
                        <MokaInputLabel label="채널명" as="select" id="chnlSeq" name="chnlSeq" labelWidth={90} value={editData.chnlSeq} onChange={(e) => handleEditDataChange(e)}>
                            <option value="">채널 전체</option>
                            {channel_list.map((item, index) => (
                                <option key={index} value={item.podtyChnlSrl}>
                                    {item.chnlNm}
                                </option>
                            ))}
                        </MokaInputLabel>
                    </Col>
                </Form.Row>
                {/* 팟티 에피소드 검색 */}
                <Form.Row className="mb-2">
                    <Col xs={9} className="p-0">
                        <MokaInputLabel
                            label={`팟티\n(에피소드 연결)`}
                            labelWidth={90}
                            className="mb-0"
                            id="podtyEpsdSrl"
                            name="podtyEpsdSrl"
                            placeholder=""
                            value={editData.podtyEpsdSrl}
                            onChange={(e) => handleEditDataChange(e)}
                        />
                    </Col>
                    <Col xs={3} className="p-0 pt-1 pl-1 text-right">
                        <Button variant="searching" className="mb-0" onClick={() => handleClickPodtyEpisodeButton()}>
                            팟티 에피소드 검색
                        </Button>
                    </Col>
                </Form.Row>
                {/* 에피소드 명 */}
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel
                            label={`에피소드명`}
                            labelWidth={90}
                            className="mb-0"
                            id="epsdNm"
                            name="epsdNm"
                            placeholder=""
                            value={editData.epsdNm}
                            onChange={(e) => handleEditDataChange(e)}
                        />
                    </Col>
                </Form.Row>
                {/* 에피소드 내용 */}
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel
                            label={`에피소드 내용`}
                            labelWidth={90}
                            as="textarea"
                            className="mb-2"
                            inputClassName="resize-none"
                            inputProps={{ rows: 6 }}
                            id="epsdMemo"
                            name="epsdMemo"
                            value={editData.epsdMemo}
                            onChange={(e) => handleEditDataChange(e)}
                        />
                    </Col>
                </Form.Row>
                {/* 시즌 회차. */}
                <Form.Row className="mb-2">
                    <MokaInputLabel label={`시즌 및 회차`} labelWidth={90} className="mb-0" as="none" />
                    <MokaInputLabel className="pr-5" as="select" id="chnlSeq" name="chnlSeq" value={editData.chnlSeq} onChange={(e) => handleEditDataChange(e)}>
                        <option value="">시즌 선택</option>
                        {channel_list.map((item, index) => (
                            <option key={index} value={item.podtyChnlSrl}>
                                {item.chnlNm}
                            </option>
                        ))}
                    </MokaInputLabel>
                    <Col xs={2}>
                        <MokaInputLabel
                            label={`회차`}
                            type="number"
                            labelWidth={25}
                            className="mb-0 w-10"
                            id="chnlMemo"
                            name="chnlMemo"
                            value={editData.chnlMemo}
                            onChange={(e) => console.log(e)}
                        />
                    </Col>
                    <Col xs={2} className="d-flex p-0 pl-4 justify-content-center align-items-center">
                        마지막 회차: {editData.playCnt && editData.playCnt > 0 ? `${editData.playCnt}회` : ``}
                    </Col>
                </Form.Row>
                <Form.Row className="mb-2">
                    <Col xs={4} className="p-0">
                        <MokaInputLabel
                            label={`방송일`}
                            labelWidth={90}
                            as="dateTimePicker"
                            className="mb-0"
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
                {/* <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel
                            label={`회차`}
                            labelWidth={90}
                            className="mb-0"
                            id="epsdNo"
                            name="epsdNo"
                            placeholder=""
                            value={editData.epsdNo}
                            onChange={(e) => handleEditDataChange(e)}
                        />
                    </Col>
                    <Col xs={3} className="d-flex p-0 pl-4 justify-content-center align-items-center">
                        마지막 회차: {editData.playCnt && editData.playCnt > 0 ? `${editData.playCnt}회` : ``}
                    </Col>
                    <Col xs={5} className="p-0">
                        <MokaInputLabel
                            label={`방송일`}
                            labelWidth={50}
                            as="dateTimePicker"
                            className="mb-0"
                            name="epsdDate"
                            id="epsdDate"
                            value={editData.epsdDate}
                            onChange={(param) => {
                                const selectDate = param._d;
                                const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                                let reDate = date && date.length > 10 ? date.substr(0, 10) : date;
                                handleEditDataChange({ target: { name: 'epsdDate', value: reDate } });
                            }}
                            inputProps={{ timeFormat: null }}
                        />
                    </Col>
                </Form.Row> */}
                {/* 태그 */}
                <Form.Row className="mb-2">
                    <Col className="p-0">
                        <MokaInputLabel
                            label={`태그`}
                            labelWidth={90}
                            className="mb-0"
                            id="keywords"
                            name="keywords"
                            placeholder=""
                            value={editData.keywords}
                            onChange={(e) => handleEditDataChange(e)}
                        />
                    </Col>
                </Form.Row>
                {/* 팟캐스트 구분( 오디오, 비디오 ) */}
                <Form.Row className="mb-2">
                    <div className="d-flex w-100 align-items-center">
                        <MokaInputLabel as="none" label="팻캐스트 구분" labelWidth={90} />
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
                                onChange={(e) => handleEditDataChange(e)}
                                value="A"
                                className="mb-0 h-100"
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
                                onChange={(e) => handleEditDataChange(e)}
                                value="V"
                                className="mb-0 h-100"
                                required
                            />
                        </Col>
                    </div>
                </Form.Row>
                <hr />
                {/* 팟캐스트 파일 등록. */}
                <Form.Row className="mb-2">
                    <div className="d-flex align-items-center form-group">
                        <div className="px-0 mb-0 position-relative flex-shrink-0 form-label" style={{ width: '110px' }}></div>
                    </div>
                    <Col className="p-0">
                        <Col className="d-flex p-0 align-items-center" style={{ backgroundColor: '#f4f7f9', height: '50px' }}>
                            <Col xs={4}>
                                <MokaInput name="epsdFile" id="epsdFile" className="ft-12" value={editData.epsdFile} onChange={(e) => handleEditDataChange(e)} placeholder={``} />
                            </Col>
                            <Col xs={2} className="pl-3">
                                <Button variant="positive" className="mb-0" onClick={() => handleClickAddPodCast()}>
                                    등록
                                </Button>
                            </Col>
                            <Col xs={6}>
                                <MokaInputLabel
                                    label="재생시간"
                                    inputClassName="flex-fill"
                                    name="playTime"
                                    className="ft-12"
                                    value={editData.playTime}
                                    onChange={(e) => handleEditDataChange(e)}
                                    placeholder={``}
                                />
                            </Col>
                        </Col>
                    </Col>
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
                                    labelWidth={90}
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
                <hr />
                {/* 진행자( 고정 패널 ) */}
                <Form.Row className="mb-2">
                    <MokaInputLabel label={`진행자(고정패널)`} labelWidth={95} as="none" />
                    <Col xs={1} className="p-0 pr-0">
                        <Button
                            variant="searching"
                            onClick={() => {
                                setSelectRepoterType('CP');
                                handleClickSearchRepoterButton();
                            }}
                        >
                            검색
                        </Button>
                    </Col>
                    <Col xs={1} className="p-0 pl-0">
                        <Button variant="positive" onClick={() => handleClickRepoterAddButton('CP')}>
                            추가
                        </Button>
                    </Col>
                </Form.Row>
                {/* 기본 3개 를 뿌려준다. */}
                {editSelectCPRepoters.map((element, index) => {
                    return (
                        <Form.Row className="mb-2" key={index}>
                            <label
                                className="px-0 mb-0 position-relative flex-shrink-0 form-label"
                                htmlFor="none"
                                style={{ width: '90px', minWidth: '90px', marginRight: '12px', marginLeft: '8px' }}
                            ></label>
                            <Col className="p-0">
                                <Col className="p-0" style={{ backgroundColor: '#f4f7f9', height: '100px' }}>
                                    <Col className="d-flex w-100 h-50 align-items-center">
                                        <div style={{ width: '70px' }}>
                                            <MokaInput
                                                name="memRepSeq"
                                                className="ft-12"
                                                value={element.memRepSeq}
                                                onChange={(e) => handleChangeReporters({ gubun: 'CP', e, index })}
                                                placeholder={`기자번호`}
                                                disabled={true}
                                            />
                                        </div>
                                        <div>
                                            <MokaInput
                                                name="memNm"
                                                className="ft-12"
                                                value={element.memNm}
                                                onChange={(e) => handleChangeReporters({ gubun: 'CP', e, index })}
                                                placeholder={`기자명`}
                                            />
                                        </div>
                                        <div className="pl-3">
                                            <MokaInput
                                                name="memMemo"
                                                className="ft-12"
                                                value={element.memMemo}
                                                onChange={(e) => handleChangeReporters({ gubun: 'CP', e, index })}
                                                placeholder={`직책`}
                                            />
                                        </div>
                                        <div className="pl-3">
                                            <MokaInput
                                                name="nickNm"
                                                className="ft-12"
                                                value={element.nickNm}
                                                onChange={(e) => handleChangeReporters({ gubun: 'CP', e, index })}
                                                placeholder={`닉네임`}
                                            />
                                        </div>
                                        <div className="pl-3">
                                            <Button variant="searching" className="mb-0" onClick={() => handleClickReporterDelete('CP', index)}>
                                                삭제
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col xs={12} className="p-0 h-50 d-flex align-items-center">
                                        <Col xs={12}>
                                            <MokaInput
                                                name="desc"
                                                className="ft-12"
                                                value={element.desc}
                                                onChange={(e) => handleChangeReporters({ gubun: 'CP', e, index })}
                                                placeholder={`설명`}
                                            />
                                        </Col>
                                    </Col>
                                </Col>
                            </Col>
                        </Form.Row>
                    );
                })}
                <hr />
                <Form.Row className="mb-2">
                    <MokaInputLabel label={`진행자(게스트)`} labelWidth={95} as="none" />
                    <Col xs={1} className="p-0">
                        <Button
                            variant="searching"
                            onClick={() => {
                                setSelectRepoterType('EG');
                                handleClickSearchRepoterButton();
                            }}
                        >
                            검색
                        </Button>
                    </Col>
                    <Col xs={1} className="p-0">
                        <Button variant="positive" onClick={() => handleClickRepoterAddButton('EG')}>
                            추가
                        </Button>
                    </Col>
                </Form.Row>
                {/* 기본 3개 를 뿌려준다. */}
                {editSelectEGRepoters.map((element, index) => {
                    return (
                        <Form.Row className="mb-2" key={index}>
                            <label
                                className="px-0 mb-0 position-relative flex-shrink-0 form-label"
                                htmlFor="none"
                                style={{ width: '90px', minWidth: '90px', marginRight: '12px', marginLeft: '8px' }}
                            ></label>
                            <Col className="p-0">
                                <Col className="p-0" style={{ backgroundColor: '#f4f7f9', height: '100px' }}>
                                    <Col className="d-flex w-100 h-50 align-items-center">
                                        <div style={{ width: '70px' }}>
                                            <MokaInput
                                                name="memRepSeq"
                                                className="ft-12"
                                                value={element.memRepSeq}
                                                onChange={(e) => handleChangeReporters({ gubun: 'EG', e, index })}
                                                placeholder={`기자번호`}
                                                disabled={true}
                                            />
                                        </div>
                                        <div>
                                            <MokaInput
                                                name="memNm"
                                                className="ft-12"
                                                value={element.memNm}
                                                onChange={(e) => handleChangeReporters({ gubun: 'EG', e, index })}
                                                placeholder={`기자명`}
                                            />
                                        </div>
                                        <div className="pl-3">
                                            <MokaInput
                                                name="memMemo"
                                                className="ft-12"
                                                value={element.memMemo}
                                                onChange={(e) => handleChangeReporters({ gubun: 'EG', e, index })}
                                                placeholder={`직책`}
                                            />
                                        </div>
                                        <div className="pl-3">
                                            <MokaInput
                                                name="nickNm"
                                                className="ft-12"
                                                value={element.nickNm}
                                                onChange={(e) => handleChangeReporters({ gubun: 'EG', e, index })}
                                                placeholder={`닉네임`}
                                            />
                                        </div>
                                        <div className="pl-3">
                                            <Button variant="searching" className="mb-0" onClick={() => handleClickReporterDelete('EG', index)}>
                                                삭제
                                            </Button>
                                        </div>
                                    </Col>
                                    <Col xs={12} className="p-0 h-50 d-flex align-items-center">
                                        <Col xs={12}>
                                            <MokaInput
                                                name="desc"
                                                className="ft-12"
                                                value={element.desc}
                                                onChange={(e) => handleChangeReporters({ gubun: 'EG', e, index })}
                                                placeholder={`설명`}
                                            />
                                        </Col>
                                    </Col>
                                </Col>
                            </Col>
                        </Form.Row>
                    );
                })}
                <hr />
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
                chnlSeq={editData.chnlSeq}
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
