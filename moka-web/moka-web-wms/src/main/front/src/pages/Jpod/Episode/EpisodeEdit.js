import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import produce from 'immer';
import moment from 'moment';
import { DB_DATEFORMAT } from '@/constants';
import { MokaCard } from '@components';
import { initialState, GET_EPSD, SAVE_EPSD, saveEpsd, getEpsd, clearEpsd, changeEpsdInvalidList } from '@store/jpod';
import { invalidListToError } from '@utils/convertUtil';
import toast, { messageBox } from '@utils/toastUtil';
import { getDisplayedRows } from '@utils/agGridUtil';
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
    const { episode, invalidList } = useSelector(({ jpod }) => jpod.episode);
    const loading = useSelector(({ loading }) => loading[GET_EPSD] || loading[SAVE_EPSD]);
    const [temp, setTemp] = useState(initialState.episode.episode);
    const [cpMembers, setCpMembers] = useState([]); // 출연진(고정패널)
    const [egMembers, setEgMembers] = useState([]); // 출연진(게스트)
    const [keywordText, setKeywordText] = useState('');
    const [error, setError] = useState({});
    const [selectedChannel, setSelectedChannel] = useState(initialState.channel.channel); // 선택한 채널 데이터
    const [gridInstance, setGridInstance] = useState(null); // 기사의 ag-grid instance

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'usedYn') {
            setTemp({ ...temp, [name]: checked ? 'Y' : 'N' });
        } else if (name === 'keywordText') {
            setKeywordText(value);
        } else {
            setTemp({ ...temp, [name]: value });
        }

        if (error[name]) setError({ ...error, [name]: false });
    };

    /**
     * 이미지 변경
     * @param {string} name field name
     * @param {*} file 파일데이터
     */
    const handleChangeImg = (name, file) => {
        if (file) {
            setTemp({
                ...temp,
                [name]: file,
            });
        } else {
            setTemp({
                ...temp,
                [name]: file,
                [name.replace('File', '')]: null,
            });
        }
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
     * @param {object} podtyData 팟티 데이터
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

        setError({
            ...error,
            epsdNm: false,
            epsdMemo: false,
        });
    };

    /**
     * 팟캐스트 선택 시 에피소드 데이터 변경 => jpodType은 어떻게 되는건지??
     * @param {object} podcastData 팟캐스트 데이터
     */
    const handleSelectPodcast = (podcastData) => {
        setTemp({
            ...temp,
            epsdFile: podcastData.id,
            playTime: podcastData.duration,
        });
    };

    /**
     * 유효성 검사
     * @param {object} episode 검증 대상
     */
    const validate = (episode) => {
        let isInvalid = false;
        let errList = [];

        // 채널
        if (!episode.chnlSeq) {
            errList.push({
                field: 'chnlSeq',
                reason: '채널을 선택하세요',
            });
            isInvalid = isInvalid || true;
            toast.warning('채널을 선택하세요');
        }

        // 에피소드명
        if (!episode.epsdNm) {
            errList.push({
                field: 'epsdNm',
                reason: '',
            });
            isInvalid = isInvalid || true;
        }

        // 에피소드 소개
        if (!episode.epsdMemo) {
            errList.push({
                field: 'epsdMemo',
                reason: '',
            });
            isInvalid = isInvalid || true;
        }

        dispatch(changeEpsdInvalidList(errList));
        return !isInvalid;
    };

    /**
     * 정보 저장 버튼
     */
    const handleSave = () => {
        const cs = selectedChannel?.chnlSeq;
        let saveData = { ...temp, chnlSeq: cs };

        // keyword 셋팅
        const keywords = keywordText
            .split(',')
            .filter((k) => k.trim())
            .map((k, idx) => ({
                keyword: k.trim(),
                chnlSeq: cs,
                epsdSeq,
                ordNo: idx + 1,
            }));
        saveData.keywords = keywords;

        // 출연자 셋팅
        const cpm = cpMembers.filter((m) => m.memNm).map((m) => ({ ...m, chnlSeq: cs, epsdSeq }));
        const egm = egMembers.filter((m) => m.memNm).map((m) => ({ ...m, chnlSeq: cs, epsdSeq }));
        saveData.members = [...cpm, ...egm];

        // articles 셋팅
        const articles = getDisplayedRows(gridInstance.api).map((row, idx) => ({
            ...row,
            id: { ...row.id, chnlSeq: cs, epsdSeq },
            ordNo: idx + 1,
        }));
        saveData.articles = articles;

        // 방송일
        const epsdDate = moment(saveData.epsdDate).isValid() ? moment(saveData.epsdDate).format('YYYY-MM-DD') : null;
        saveData.epsdDate = epsdDate;

        if (validate(saveData)) {
            dispatch(
                saveEpsd({
                    epsd: saveData,
                    callback: ({ header: { success, message }, body }) => {
                        if (success) {
                            toast.success(message);
                            history.push(`${match.path}/${body.chnlSeq}/${body.epsdSeq}`);
                        } else {
                            messageBox.alert(message);
                        }
                    },
                }),
            );
        }
    };

    /**
     * 취소
     */
    const handleCancle = () => history.push(`${match.path}`);

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
        setError({});
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
        setError(invalidListToError(invalidList));
    }, [invalidList]);

    useEffect(() => {
        return () => {
            dispatch(clearEpsd());
            dispatch(changeEpsdInvalidList([]));
        };
    }, [dispatch]);

    return (
        <MokaCard
            className="overflow-hidden w-100 flex-fill"
            title={`에피소드 ${epsdSeq ? '수정' : '등록'}`}
            loading={loading}
            footerButtons={[
                {
                    text: epsdSeq ? '수정' : '등록',
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
                error={error}
                cpMembers={cpMembers}
                egMembers={egMembers}
                keywordText={keywordText}
                // field 변경
                onChange={handleChangeValue}
                onChangeImg={handleChangeImg}
                onSelectPodty={handleSelectPodty}
                onSelectPodcast={handleSelectPodcast}
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
