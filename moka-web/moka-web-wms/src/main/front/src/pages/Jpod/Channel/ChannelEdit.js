import React, { useEffect, useState, useCallback } from 'react';
import produce from 'immer';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import moment from 'moment';
import { initialState, GET_CHNL, SAVE_CHNL, saveChnl, changeChnlInvalidList, clearChnl, getChnl, getChnlEpsdList } from '@store/jpod';
import { DB_DATEFORMAT } from '@/constants';
import { MokaCard } from '@components';
import toast, { messageBox } from '@utils/toastUtil';
import { invalidListToError } from '@utils/convertUtil';
import ChannelForm from './ChannelForm';

// 진행자 기본데이터
const initMember = {
    chnlSeq: '',
    desc: '',
    epsdSeq: '',
    memDiv: '',
    memMemo: '',
    memNm: '',
    memRepSeq: null,
    nickNm: '',
    seqNo: '',
};

/**
 * J팟 관리 > 채널 > 수정
 */
const ChannelEdit = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { chnlSeq } = useParams();
    const loading = useSelector(({ loading }) => loading[GET_CHNL] || loading[SAVE_CHNL]);
    const { invalidList, channel } = useSelector(({ jpod }) => jpod.channel);
    const [temp, setTemp] = useState(initialState.channel.channel); // temp
    const [members, setMembers] = useState([]); // 진행자 목록(channel.members)
    const [keywordText, setKeywordText] = useState(''); // 키워드목록을 text로 만든 것 (channel.keywords => join(','))
    const [error, setError] = useState({}); // error

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'usedYn') {
            setTemp({ ...temp, [name]: checked ? 'Y' : 'N' });
        } else if (name === 'chnlDy') {
            // 요일 변경
            if (value === '1234567') setTemp({ ...temp, [name]: checked ? '1234567' : '' });
            else {
                let nv = checked ? `${temp.chnlDy}${value}` : temp.chnlDy.replace(value, '');
                nv = (nv || '')
                    .match(/\d/g)
                    .sort(function (a, b) {
                        return a - b;
                    })
                    .join('');
                setTemp({ ...temp, [name]: nv });
            }
        } else if (name === 'keywordText') {
            setKeywordText(value);
        } else {
            setTemp({ ...temp, [name]: value });
        }
        if (error[name]) setError({ ...error, [name]: false });
    };

    /**
     * 개설일, 종료일 변경
     * @param {string} name name
     * @param {*} date 날짜객체
     */
    const handleChangeDate = (name, date) => {
        if (name === 'chnlSdt') {
            const diff = moment(date).diff(moment(temp.chnlEdt));
            if (diff > 0) {
                toast.warning('시작일은 종료일보다 클 수 없습니다.');
                return;
            }
        } else if (name === 'chnlEdt') {
            const diff = moment(date).diff(moment(temp.chnlSdt));
            if (diff < 0) {
                toast.warning('종료일은 시작일보다 작을 수 없습니다.');
                return;
            }
        }
        setTemp({ ...temp, [name]: date });
        if (error[name]) setError({ ...error, [name]: false });
    };

    /**
     * 진행자 추가
     */
    const addMember = () => {
        if (members.length < 6) {
            setMembers(
                produce(members, (draft) => {
                    draft.push(initMember);
                }),
            );
        } else {
            toast.warning('6명을 초과하여 등록할 수 없습니다.');
        }
    };

    /**
     * 진행자 변경
     * @param {object} e 이벤트
     * @param {number} index 변경할 데이터의 순번
     */
    const handleChangeMember = (e, index) => {
        const { name, value } = e.target;
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
     */
    const handleDeleteMember = (index) => {
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
     */
    const handleResetMember = (index) => {
        setMembers(
            produce(members, (draft) => {
                draft[index] = initMember;
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
        (reporter) => {
            const fakeIdx = members.findIndex((e) => !e.memMemo && !e.memNm && !e.memRepSeq && !e.nickNm && !e.seqNo);
            const insertIdx = members.length < 6 ? (fakeIdx > -1 ? fakeIdx || members.length : fakeIdx && members.length) : fakeIdx;
            if (insertIdx < 0 || insertIdx > 5) {
                toast.warning('진행자는 6명까지 선택할 수 있습니다');
                return;
            }

            const duplicated = members.filter((mem) => mem.memRepSeq === reporter.repSeq);
            if (duplicated.length > 0) {
                toast.warning('중복된 진행자는 등록할 수 없습니다');
                return;
            }

            const nm = produce(members, (draft) => {
                draft[insertIdx] = {
                    seqNo: null,
                    chnlSeq: chnlSeq ? Number(chnlSeq) : null,
                    selectType: 'CM',
                    memRepSeq: reporter.repSeq,
                    joinsId: reporter.joinsId,
                    memNm: reporter.repName,
                    nickNm: '',
                    memMemo: reporter.repTitle,
                    desc: '',
                };
            });
            setMembers(nm);
            if (error.members) {
                setError({ ...error, members: false });
            }
        },
        [chnlSeq, error, members],
    );

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
     * 팟티 데이터를 채널에 셋팅
     * @param {object} podty podty 데이터
     */
    const podtyToChannel = (podty) => {
        const { castSrl, shareUrl, getCastName, summary, keywords, crtDt } = podty;
        setTemp({
            ...temp,
            podtyChnlSrl: castSrl,
            podtyUrl: shareUrl,
            chnlNm: getCastName,
            chnlMemo: summary,
            chnlSdt: moment(crtDt),
        });
        setKeywordText(keywords);
    };

    /**
     * 유효성 검증
     * @param {object} channel 검증 대상
     */
    const validate = (channel) => {
        let isInvalid = false;
        let errList = [];

        // if (editData.podtyUrl === '' || editData.podtyChnlSrl === '') {
        //     messageBox.alert('팟티를 입력해 주세요.', () => {});
        //     return true;
        // }

        // 채널명 체크
        if (channel.chnlNm === '') {
            errList.push({
                field: 'chnlNm',
                reason: '채널명을 입력하세요',
            });
            isInvalid = isInvalid || true;
        }

        // 진행자 체크
        if (channel.members.length < 1) {
            toast.warning('진행자를 1명 이상 등록하세요');
            errList.push({
                field: 'members',
                reason: '',
            });
            isInvalid = isInvalid || true;
        }

        // 방송요일 체크
        if (!channel.chnlDy) {
            toast.warning('방송 요일을 선택하세요');
            errList.push({
                field: 'chnlDy',
                reason: '방송 요일을 선택해주세요',
            });
            isInvalid = isInvalid || true;
        }

        // 개설일 필수
        if (!channel.chnlSdt) {
            errList.push({
                field: 'chnlSdt',
                reason: '개설일을 선택해주세요',
            });
            isInvalid = isInvalid || true;
        }

        dispatch(changeChnlInvalidList(errList));
        return !isInvalid;
    };

    /**
     * 저장버튼
     */
    const handleSave = () => {
        let saveData = temp;

        // keyword 셋팅
        const keywords = keywordText
            .split(',')
            .filter((k) => k.trim())
            .map((k, idx) => ({
                keyword: k.trim(),
                chnlSeq,
                epsdSeq: 0,
                ordNo: idx + 1,
            }));
        saveData.keywords = keywords;

        // 진행자 셋팅
        saveData.members = members.filter((m) => m.memNm);

        // 시작일, 종료일
        const chnlSdt = moment(saveData.chnlSdt).isValid() ? moment(saveData.chnlSdt).format('YYYY-MM-DD') : null;
        const chnlEdt = moment(saveData.chnlEdt).isValid() ? moment(saveData.chnlEdt).format('YYYY-MM-DD') : null;
        saveData.chnlSdt = chnlSdt;
        saveData.chnlEdt = chnlEdt;

        if (validate(saveData)) {
            dispatch(
                saveChnl({
                    chnl: saveData,
                    callback: ({ header, body }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        } else {
                            toast.success(header.message);
                            history.push(`${match.path}/${body.chnlSeq}`);
                        }
                    },
                }),
            );
        }
    };

    /**
     * 취소
     */
    const handleCancle = () => history.push(match.path);

    useEffect(() => {
        const chnlSdt = moment(channel.chnlSdt, DB_DATEFORMAT);
        const chnlEdt = moment(channel.chnlEdt, DB_DATEFORMAT);

        setTemp({
            ...channel,
            chnlSdt: chnlSdt.isValid() ? chnlSdt : null,
            chnlEdt: chnlEdt.isValid() ? chnlEdt : null,
        });
        setMembers(channel.members || []);
        // 진행자 기본 6명 => 왜 이렇게 해야하는지?;; 기획서 상에 적힌 조건이 없어서 이건 제거함
        // setMembers([...(channel.members || []), ...[1, 2, 3, 4, 5, 6].map(() => initMember)].slice(0, 6));
        setKeywordText((channel.keywords || []).map((k) => k.keyword).join(', '));
    }, [channel]);

    useEffect(() => {
        if (chnlSeq) {
            // 채널 상세
            dispatch(getChnl({ chnlSeq }));
            // 채널의 에피소드 목록 조회
            dispatch(getChnlEpsdList({ search: { ...initialState.channel.channelEpisode.search, chnlSeq } }));
        } else {
            dispatch(clearChnl());
        }
        setError({});
    }, [chnlSeq, dispatch]);

    useEffect(() => {
        setError(invalidListToError(invalidList));
    }, [invalidList]);

    useEffect(() => {
        return () => {
            dispatch(clearChnl());
            dispatch(changeChnlInvalidList([]));
        };
    }, [dispatch]);

    return (
        <MokaCard
            className="w-100 flex-fill"
            title={`J팟 채널 ${!chnlSeq ? '등록' : '수정'}`}
            loading={loading}
            footerButtons={[
                {
                    text: !chnlSeq ? '등록' : '수정',
                    variant: 'positive',
                    onClick: handleSave,
                    className: 'mr-1',
                    useAuth: true,
                },
                { text: '취소', variant: 'negative', onClick: handleCancle },
            ]}
        >
            <ChannelForm
                channel={temp}
                members={members}
                error={error}
                keywordText={keywordText}
                // field 변경
                onChange={handleChangeValue}
                onChangeDate={handleChangeDate}
                onChangeImg={handleChangeImg}
                // 진행자 변경 함수
                addMember={addMember}
                reporterToMember={reporterToMember}
                onChangeMember={handleChangeMember}
                onDeleteMember={handleDeleteMember}
                onResetMember={handleResetMember}
                // 팟티
                podtyToChannel={podtyToChannel}
            />
        </MokaCard>
    );
};

export default ChannelEdit;
