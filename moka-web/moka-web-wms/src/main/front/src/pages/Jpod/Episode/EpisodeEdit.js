import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import produce from 'immer';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { MokaCard } from '@components';
import { initialState, GET_EPSD, SAVE_EPSD, saveEpsd, getEpsd, clearEpsd } from '@store/jpod';
import toast, { messageBox } from '@utils/toastUtil';
import EpisodeForm from './component/EpisodeForm';

// 출연진 기본값
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
 * J팟 관리 > 에피소드 > 등록, 수정
 */
const ChannelEdit = (props) => {
    const { match } = props;
    const { chnlSeq, epsdSeq } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const channelList = useSelector(({ jpod }) => jpod.totalChannel.list);
    const episode = useSelector(({ jpod }) => jpod.episode.episode);
    const loading = useSelector(({ loading }) => loading[GET_EPSD] || loading[SAVE_EPSD]);
    const [temp, setTemp] = useState(initialState.episode.episode);
    const [cpMembers, setCpMembers] = useState([]);
    const [egMembers, setEgMembers] = useState([]);
    const [keywordText, setKeywordText] = useState('');
    const [error, setError] = useState({});
    const [selectedChannel, setSelectedChannel] = useState(initialState.channel.channel);
    const [gridInstance, setGridInstance] = useState(null);

    // const selectBrightOvp = useSelector((store) => store.jpod.selectBrightOvp);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'usedYn') {
            setTemp({ ...temp, [name]: checked ? 'Y' : 'N' });
        } else {
            setTemp({ ...temp, [name]: value });
        }
    };

    /**
     * 이미지 변경
     * @param {string} name field name
     * @param {*} file 파일데이터
     */
    const handleChangeImg = (name, file) => {
        setTemp({
            ...temp,
            [name]: file,
        });
    };

    /**
     * 진행자 추가
     */
    const addMember = (memDiv) => {
        const members = memDiv === 'CP' ? cpMembers : egMembers;
        const setMembers = memDiv === 'CP' ? setCpMembers : setEgMembers;
        if (members.length < 3) {
            setMembers(
                produce(members, (draft) => {
                    draft.push({
                        ...reporterInit,
                        memDiv,
                    });
                }),
            );
        } else {
            toast.warning('3명을 초과하여 등록할 수 없습니다');
        }
    };

    /**
     * 진행자 변경
     * @param {object} e 이벤트
     * @param {number} index 변경할 데이터의 순번
     * @param {string} memDiv memDiv
     */
    const handleChangeMember = (e, index, memDiv) => {
        const { name, value } = e.target;
        const members = memDiv === 'CP' ? cpMembers : egMembers;
        const setMembers = memDiv === 'CP' ? setCpMembers : setEgMembers;

        setMembers(
            produce(members, (draft) => {
                draft[index][name] = value;
            }),
        );
        if (error.members) {
            setError({ ...error, members: false });
        }
    };

    /**
     * 진행자 삭제
     * @param {number} index 지울 데이터의 순번
     * @param {string} memDiv memDiv
     */
    const handleDeleteMember = (index, memDiv) => {
        const members = memDiv === 'CP' ? cpMembers : egMembers;
        const setMembers = memDiv === 'CP' ? setCpMembers : setEgMembers;

        setMembers(
            produce(members, (draft) => {
                draft.splice(index, 1);
            }),
        );
        if (error.members) {
            setError({ ...error, members: false });
        }
    };

    /**
     * 진행자 리셋
     * @param {number} index 초기화할 데이터의 순번
     * @param {string} memDiv memDiv
     */
    const handleResetMember = (index, memDiv) => {
        const members = memDiv === 'CP' ? cpMembers : egMembers;
        const setMembers = memDiv === 'CP' ? setCpMembers : setEgMembers;

        setMembers(
            produce(members, (draft) => {
                draft[index] = { ...reporterInit, memDiv: draft[index].memDiv };
            }),
        );
        if (error.members) {
            setError({ ...error, members: false });
        }
    };

    /**
     * 기자를 진행자로 추가
     */
    const reporterToMember = useCallback(
        (reporter, memDiv) => {
            const members = memDiv === 'CP' ? cpMembers : egMembers;
            const setMembers = memDiv === 'CP' ? setCpMembers : setEgMembers;

            const fakeIdx = members.findIndex((e) => !e.memMemo && !e.memNm && !e.memRepSeq && !e.nickNm && !e.seqNo);
            const insertIdx = members.length < 6 ? (fakeIdx > -1 ? fakeIdx || members.length : fakeIdx && members.length) : fakeIdx;
            if (insertIdx < 0 || insertIdx > 2) {
                toast.warning('3명을 초과하여 등록할 수 없습니다');
                return;
            }

            const duplicated = members.filter((mem) => mem.memRepSeq === reporter.repSeq);
            if (duplicated.length > 0) {
                toast.warning('중복된 출연자는 등록할 수 없습니다');
                return;
            }

            const nm = produce(members, (draft) => {
                draft[insertIdx] = {
                    seqNo: null,
                    chnlSeq: chnlSeq ? Number(chnlSeq) : null,
                    epsdSeq: epsdSeq ? Number(epsdSeq) : null,
                    memDiv,
                    memRepSeq: reporter.repSeq,
                    memNm: reporter.repName,
                    nickNm: '',
                    memMemo: reporter.repTitle,
                    desc: '',
                };
            });
            setMembers(nm);
            if (error.members) {
                setError({ ...error, memebers: false });
            }
        },
        [chnlSeq, cpMembers, egMembers, epsdSeq, error],
    );

    /**
     * 팟티 선택 시 에피소드 데이터 변경
     */
    const handleSelectPodty = (podtyData) => {
        setTemp({
            ...temp,
            podtyEpsdSrl: podtyData.episodeSrl,
            epsdNm: podtyData.title,
            epsdMemo: podtyData.summary,
            jpodType: (podtyData?.type || 'a').slice(0, 1).toUpperCase(),
            epsdFile: podtyData.enclosure,
            playTime: podtyData.duration,
        });
    };

    /**
     * 유효성 검사
     * @param {object} episode 검증 대상
     */
    const validate = (episode) => {
        // if (!editData.chnlSeq || editData.chnlSeq === '') {
        //     messageBox.alert('채널을 선택해 주세요.', () => {});
        //     return true;
        // }

        return false;
    };

    /**
     * 정보 저장 버튼
     */
    const handleSave = () => {
        let saveData = temp;

        if (validate(saveData)) {
            return;
        }

        // 진행자 배열을 담아둘 index 번호용
        // let memberCount = 0;

        // var formData = new FormData();

        // // const selectChnlSeq = editData.chnlSeq; // 업데이트 시 사용할 에피소트 고유 번호.

        // formData.append(`chnlSeq`, editData.chnlSeq); // 채널
        // formData.append(`epsdSeq`, editData.epsdSeq); // 채널

        // formData.append(`epsdNo`, editData.epsdNo); // 에피소드 회차
        // formData.append(`usedYn`, editData.usedYn); // 사용유무
        // formData.append(`playTime`, editData.playTime); // 재생시간
        // formData.append(`epsdDate`, moment(editData.epsdDate).format('YYYY-MM-DD')); // 에피소드 등록일
        // formData.append(`podtyEpsdSrl`, editData.podtyEpsdSrl); // 파티 에피소드SRL
        // formData.append(`jpodType`, editData.jpodType); // 팟캐스트 타입

        // formData.append(`epsdNm`, editData.epsdNm); // 에피소드 명
        // formData.append(`epsdFile`, editData.epsdFile); // 에피소드 파일 링크
        // formData.append(`epsdMemo`, editData.epsdMemo); // 에피소드 소개
        // formData.append(`seasonNo`, editData.seasonNo); // 시즌 번호

        // if (editData.shrImg) {
        //     formData.append(`shrImg`, editData.shrImg); // 이미지
        // }

        // if (editData.katalkImg) {
        //     formData.append(`katalkImg`, editData.katalkImg); // 카카오톡 이미지
        // }

        // // 태그
        // editData.keywords &&
        //     editData.keywords.length > 0 &&
        //     editData.keywords.split(',').map((e, index) => {
        //         formData.append(`keywords[${index}].ordNo`, index);
        //         formData.append(`keywords[${index}].keyword`, e);
        //         return false;
        //     });

        // // 선택한 진행자(고정패널)가 있을경우 form 값에 순서대로 추가.
        // editSelectCPRepoters.map((element) => {
        //     const memDiv = !element.memDiv || element.memDiv === undefined ? 'CP' : element.memDiv;
        //     const memNm = !element.memNm || element.memNm === undefined ? '' : element.memNm;
        //     const memRepSeq = !element.memRepSeq || element.memRepSeq === undefined ? '' : element.memRepSeq;
        //     const nickNm = !element.nickNm || element.nickNm === undefined ? '' : element.nickNm;
        //     const memMemo = !element.memMemo || element.memMemo === undefined ? '' : element.memMemo;
        //     const desc = !element.desc || element.desc === undefined ? '' : element.desc;

        //     if (memNm) {
        //         formData.append(`members[${memberCount}].memDiv`, memDiv);
        //         formData.append(`members[${memberCount}].memNm`, memNm);
        //         formData.append(`members[${memberCount}].memRepSeq`, memRepSeq);
        //         formData.append(`members[${memberCount}].nickNm`, nickNm);
        //         formData.append(`members[${memberCount}].memMemo`, memMemo);
        //         formData.append(`members[${memberCount}].desc`, desc);
        //         memberCount++;
        //     }
        //     return [];
        // });

        // // 선택한 진행자(게스트)가 있을경우 form 값에 순서대로 추가.
        // editSelectEGRepoters.map((element) => {
        //     const memDiv = !element.memDiv || element.memDiv === undefined ? 'EG' : element.memDiv;
        //     const memNm = !element.memNm || element.memNm === undefined ? '' : element.memNm;
        //     const memRepSeq = !element.memRepSeq || element.memRepSeq === undefined ? '' : element.memRepSeq;
        //     const nickNm = !element.nickNm || element.nickNm === undefined ? '' : element.nickNm;
        //     const memMemo = !element.memMemo || element.memMemo === undefined ? '' : element.memMemo;
        //     const desc = !element.desc || element.desc === undefined ? '' : element.desc;

        //     if (memNm) {
        //         formData.append(`members[${memberCount}].memDiv`, memDiv);
        //         formData.append(`members[${memberCount}].memNm`, memNm);
        //         formData.append(`members[${memberCount}].memRepSeq`, memRepSeq);
        //         formData.append(`members[${memberCount}].nickNm`, nickNm);
        //         formData.append(`members[${memberCount}].memMemo`, memMemo);
        //         formData.append(`members[${memberCount}].desc`, desc);
        //         memberCount++;
        //     }
        //     return [];
        // });

        // // 파일 추가.
        // if (shrImgFile) {
        //     formData.append(`shrImgFile`, shrImgFile[0]);
        // }

        // // 파일 추가.
        // if (katalkImgFile) {
        //     formData.append(`katalkImgFile`, katalkImgFile[0]);
        // }

        // selectArticleItem.map((item, index) => {
        //     if (item.contentId) {
        //         formData.append(`articles[${index}].id.totalId`, item.contentId);
        //     }
        //     formData.append(`articles[${index}].ordNo`, index);
        //     formData.append(`articles[${index}].relTitle`, item.title);
        //     formData.append(`articles[${index}].relLink`, item.linkUrl);
        //     formData.append(`articles[${index}].relLinkTarget`, item.linkTarget ? item.linkTarget : 'S');
        //     return item;
        // });

        // dispatch(
        //     saveEpsd({
        //         chnlSeq: Number(editData.chnlSeq),
        //         epsdSeq: Number(editData.epsdSeq),
        //         episodeinfo: formData,
        //         callback: ({ header: { success, message }, body }) => {
        //             if (success === true) {
        //                 toast.success(message);
        //                 const { chnlSeq, epsdSeq } = body;
        //                 if ((chnlSeq, epsdSeq)) {
        //                     // 등록 및 수정 성공시 store 값 초기화 후 다시 데이터를 가지고 옴.
        //                     dispatch(clearEpsd());
        //                     dispatch(getEpsd({ chnlSeq: chnlSeq, epsdSeq: epsdSeq }));
        //                     history.push(`${match.path}/${chnlSeq}/${epsdSeq}`);
        //                 }
        //             } else {
        //                 const { totalCnt, list } = body;
        //                 if (totalCnt > 0 && Array.isArray(list)) {
        //                     // 에러 메시지 확인.
        //                     messageBox.alert(list[0].reason, () => {});
        //                 } else {
        //                     // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
        //                     messageBox.alert(message, () => {});
        //                 }
        //             }
        //         },
        //     }),
        // );
    };

    /**
     * 취소
     */
    const handleCancle = () => history.push(`${match.path}`);

    // useEffect(() => {
    //     // 브라이트 코브 값이 선택되서 store 가 변경되면 정보창에서 변경 시켜 준다.
    //     if (selectBrightOvp.id && selectBrightOvp.name) {
    //         setEditData({
    //             ...editData,
    //             epsdFile: selectBrightOvp.id,
    //         });
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [selectBrightOvp]);

    useEffect(() => {
        if (chnlSeq && epsdSeq) {
            dispatch(
                getEpsd({
                    chnlSeq,
                    epsdSeq,
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        } else {
            dispatch(clearEpsd());
        }
    }, [chnlSeq, dispatch, epsdSeq]);

    useEffect(() => {
        const epsdDate = moment(episode.epsdDate, DB_DATEFORMAT);

        setTemp({
            ...episode,
            epsdDate: epsdDate.isValid() ? epsdDate : null,
        });
        setCpMembers((episode.members || []).filter((m) => m.memDiv === 'CP'));
        setEgMembers((episode.members || []).filter((m) => m.memDiv === 'EG'));
        setKeywordText((episode.keywords || []).map((k) => k.keyword).join(', '));
    }, [episode]);

    useEffect(() => {
        if (temp.chnlSeq) {
            setSelectedChannel(channelList.find((ch) => String(ch.chnlSeq) === String(temp.chnlSeq)) || initialState.channel.channel);
        }
    }, [temp.chnlSeq, channelList]);

    useEffect(() => {
        return () => {
            dispatch(clearEpsd());
        };
    }, [dispatch]);

    return (
        <MokaCard
            className="overflow-hidden w-100 flex-fill"
            title={`에피소드 ${epsdSeq ? '수정' : '등록'}`}
            loading={loading}
            footerButtons={[
                {
                    text: epsdSeq ? '수정' : '삭제',
                    variant: 'positive',
                    onClick: handleSave,
                    className: 'mr-1',
                    useAuth: true,
                },
                { text: '취소', variant: 'negative', onClick: handleCancle },
            ]}
        >
            <EpisodeForm
                // 채널 목록
                channelList={channelList}
                selectedChannel={selectedChannel}
                episode={temp}
                cpMembers={cpMembers}
                egMembers={egMembers}
                keywordText={keywordText}
                // field 변경
                onChange={handleChangeValue}
                onChangeImg={handleChangeImg}
                onSelectPodty={handleSelectPodty}
                // 출연자 변경 함수
                addMember={addMember}
                reporterToMember={reporterToMember}
                onChangeMember={handleChangeMember}
                onDeleteMember={handleDeleteMember}
                onResetMember={handleResetMember}
                // grid
                gridInstance={gridInstance}
                setGridInstance={setGridInstance}
            />
        </MokaCard>
    );
};

export default ChannelEdit;
