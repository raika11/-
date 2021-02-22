import React, { useEffect, useState, useRef } from 'react';
import { MokaCard, MokaInputLabel, MokaInput } from '@components';
import { Form, Col, Button, Row } from 'react-bootstrap';
import moment from 'moment';
// import { DB_DATEFORMAT } from '@/constants';
import { PodtyChannelModal, RepoterModal } from '@pages/Jpod/JpodModal';
import { initialState, GET_REPORTER_LIST, saveJpodChannel, clearChannelInfo, getChannelInfo, getChEpisodes, getChannels, clearReporter } from '@store/jpod';
import { useSelector, useDispatch } from 'react-redux';
import toast, { messageBox } from '@utils/toastUtil';
import { useParams, useHistory } from 'react-router-dom';
import commonUtil from '@utils/commonUtil';

const reporterCountConst = [0, 1, 2, 3, 4, 5];

const ChannelEdit = ({ match }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    const imgFileRef1 = useRef(null); // 커버 이미지 ref
    const imgFileRef2 = useRef(null); // 썸네일 이미지 ref
    const imgFileRef3 = useRef(null); // 모바일용 이미지 ref
    const selectChnlSeq = useRef(null); // 선택한 채널 번호.

    const [podtyChannelModalState, setPodtyChannelModalState] = useState(false); // 팟티 검색 모달에서 선택한 팟티 정보.
    const [repoterModalState, setRepoterModalState] = useState(false); // 기자검색 모달에서 선택한 기자 정보.

    const [editData, setEditData] = useState(initialState.channel.channelInfo); // 기본 채널 등록 정보.
    const [editSelectRepoters, setEditSelectRepoters] = useState([]); // 하단 친행자 리스트
    const [editDays, setEditDays] = useState([]); // 방송 요일용 스테이트

    const [Imgfile, setImgfile] = useState(null); // 선택한 이미지 파일용 스테이트
    const [Thumbfile, setThumbfile] = useState(null); // 선택한 썸네일 용 이미지 스테이트
    const [Mobfile, setMobfile] = useState(null); // 선택한 모바일용 이미지 스테이트

    // 스토어 연결.
    const { selectReporter, selectPodtyChannel, loading, channelInfo } = useSelector((store) => ({
        selectReporter: store.jpod.selectReporter,
        selectPodtyChannel: store.jpod.selectPodtyChannel,
        channelInfo: store.jpod.channel.channelInfo,
        loading: store.loading[GET_REPORTER_LIST],
    }));

    // 팟티검색 버튼 (모달)
    const handleClickPadtySearch = () => {
        setPodtyChannelModalState(true);
    };

    // 기자검색 버튼
    const handleClickSearchRepoterButton = () => {
        setRepoterModalState(true);
    };

    // 기자 추가 버튼.
    const handleClickRepoterAddButton = () => {
        if (editSelectRepoters.length === 6) {
            toast.warning('6명 이상 등록할수 없습니다.');
            return;
        }

        setEditSelectRepoters([
            ...editSelectRepoters,
            {
                chnlSeq: '',
                desc: '',
                epsdSeq: '',
                memDiv: '',
                memMemo: '',
                memNm: '',
                memRepSeq: '',
                nickNm: '',
                seqNo: '',
            },
        ]);
    };

    // 진행자(기자) 선택 및 내용 수정 처리.
    const handleChangeReporters = ({ e, index }) => {
        const { name, value } = e.target;
        setEditSelectRepoters(editSelectRepoters.map((item, i) => (i === index ? { ...item, [name]: value } : item)));
    };

    // 기본 진행자 스테트 리셋용.
    const resetReporter = () => {
        setEditSelectRepoters(
            reporterCountConst.map(() => {
                return {
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
            }),
        );
    };

    // 기본 데이터 리셋용
    const handleResetEditBasicData = () => {
        dispatch(clearReporter());
        setEditData(initialState.channel.channelInfo);
        resetReporter();
        setEditDays([]);
        setImgfile(null);
        setThumbfile(null);
        setMobfile(null);
        imgFileRef1.current.deleteFile();
        imgFileRef2.current.deleteFile();
        imgFileRef3.current.deleteFile();
    };

    // 등록 정보 변경 처리.
    const handleChangeChannelEditData = (e) => {
        const { name, value, checked } = e.target;

        if (name === 'usedYn') {
            setEditData({
                ...editData,
                usedYn: checked ? 'Y' : 'N',
            });
        } else {
            setEditData({
                ...editData,
                [name]: value,
            });
        }
    };

    // 날짜 변경 처리.
    const handleDateChange = (name, date) => {
        if (name === 'chnlSdt') {
            const startDt = new Date(date);
            const endDt = new Date(editData.chnlEdt);

            if (startDt > endDt) {
                toast.warning('시작일은 종료일 보다 클 수 없습니다.');
                return;
            }
        } else if (name === 'chnlEdt') {
            const startDt = new Date(editData.chnlSdt);
            const endDt = new Date(date);

            if (endDt < startDt) {
                toast.warning('종료일은 시작일 보다 작을 수 없습니다.');
                return;
            }
        }

        setEditData({
            ...editData,
            [name]: date,
        });
    };

    // 방송요일 변경 처리.
    const handleChannelDay = (e) => {
        const { name, checked } = e.target;
        console.log(name, checked);

        if (checked === true) {
            // 매일 일떄 모든 요일을 스테이트에 담아둔다.
            if (name === 'day0') {
                setEditDays(['day0', 'day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7']);
            } else {
                // 단건일 경우 해당 정보만 업데이트
                setEditDays([...editDays.filter((e) => e !== 'day0'), name]);
            }
        } else {
            if (name === 'day0') {
                setEditDays([]); // 메일 true -> false 로 변경시 스테이트 초기화.
            } else {
                setEditDays(editDays.filter((e) => e !== 'day0').filter((e) => e !== name));
            }
        }
    };

    // 진행자 삭제 버튼 처리.
    const handleClickReporterDelete = (index) => {
        // 삭제를 누르면 배열에서 삭제 후 마지막을 디폴트 값으로 채움
        let tempList = editSelectRepoters.filter((e, i) => i !== index);
        tempList = [
            ...tempList,
            {
                chnlSeq: '',
                desc: '',
                epsdSeq: '',
                memDiv: '',
                memMemo: '',
                memNm: '',
                memRepSeq: '',
                nickNm: '',
                seqNo: '',
            },
        ];
        setEditSelectRepoters(tempList);
    };

    // 벨리데이션 처리.
    const checkValidation = () => {
        // if (editData.podtyUrl === '' || editData.podtyChnlSrl === '') {
        //     messageBox.alert('팟티를 입력해 주세요.', () => {});
        //     return true;
        // }

        if (editData.chnlNm === '') {
            messageBox.alert('채널명을 입력해 주세요.', () => {});
            return true;
        }

        const tmpCh = editSelectRepoters.filter((e) => e.memMemo === '' && e.memNm === '' && e.memRepSeq === '' && e.nickNm === '' && e.seqNo === '');
        if (tmpCh.length === reporterCountConst.length) {
            messageBox.alert('진행자를 1명 이상 선택해 주세요.', () => {});
            return true;
        }

        // if (editDays.length === 0) {
        //     messageBox.alert('방송 요일을 선택해 주세요.', () => {});
        //     return true;
        // }

        return false;
    };

    // 저장버튼
    const handleClickSaveButton = () => {
        // post 데이터를 조합 하기 힘들어서 redux 타기전에 폼값을 만듬.

        // 벨리데이션 체크.
        if (checkValidation()) {
            return;
        }
        var formData = new FormData();

        // 그리드에서 선택한 채널 정보(seq값)가 있으면 업데이트 간주.
        if (selectChnlSeq.current && selectChnlSeq.current !== 'add') {
            formData.append('chnlSeq', selectChnlSeq.current);
        }

        // 키워드 처리.
        formData.append('keywords[0].ordNo', 0);
        formData.append('keywords[0].keyword', !editData.keywords || editData.keywords === undefined ? '' : editData.keywords);

        // 선택한 진행자가 있을경우 form 값에 순서대로 추가.
        editSelectRepoters.map((element, index) => {
            const memDiv = !element.memDiv || element.memDiv === undefined ? 'CM' : element.memDiv;
            const memNm = !element.memNm || element.memNm === undefined ? '' : element.memNm;
            const memRepSeq = !element.memRepSeq || element.memRepSeq === undefined ? '' : element.memRepSeq;
            const nickNm = !element.nickNm || element.nickNm === undefined ? '' : element.nickNm;
            const memMemo = !element.memMemo || element.memMemo === undefined ? '' : element.memMemo;
            const desc = !element.desc || element.desc === undefined ? '' : element.desc;

            if (memNm) {
                formData.append(`members[${index}].memDiv`, memDiv);
                formData.append(`members[${index}].memNm`, memNm);
                formData.append(`members[${index}].memRepSeq`, memRepSeq);
                formData.append(`members[${index}].nickNm`, nickNm);
                formData.append(`members[${index}].memMemo`, memMemo);
                formData.append(`members[${index}].desc`, desc);
            }
            return [];
        });

        // 기존 데이터에 업로드한 이미지가 있을경우..
        if (Imgfile) {
            formData.append(`chnlImgFile`, Imgfile[0]);
        }

        // 기존 데이터에  업로드한 썸네일이 있을경우
        if (Thumbfile) {
            formData.append(`chnlThumbFile`, Thumbfile[0]);
        }

        // 기존 데이터에 업로드한 모바일 용 이미지가 있을경우.
        if (Mobfile) {
            formData.append(`chnlImgMobFile`, Mobfile[0]);
        }

        formData.append(`usedYn`, editData.usedYn); // 사용유무
        formData.append(`chnlNm`, editData.chnlNm); // 채널명
        formData.append(`chnlMemo`, editData.chnlMemo); // 채널 소개.

        // 개설일, 종료일 처리.
        if (editData.chnlSdt && typeof editData.chnlSdt === 'object') {
            // let chnlSdt = editData.chnlSdt && editData.chnlSdt.length > 10 ? editData.chnlSdt.substr(0, 10) : editData.chnlSdt;
            // let chnlSdt = editData.chnlSdt ? moment(editData.chnlSdt).format('YYYY-MM-DD') : '';
            formData.append(`chnlSdt`, moment(editData.chnlSdt).format('YYYY-MM-DD'));
        }
        if (editData.chnlEdt && typeof editData.chnlEdt === 'object') {
            // let chnlEdt = editData.chnlEdt && editData.chnlEdt.length > 10 ? editData.chnlEdt.substr(0, 10) : editData.chnlEdt;
            // let chnlEdt = editData.chnlEdt ? moment(editData.chnlEdt).format('YYYY-MM-DD') : '';
            formData.append(`chnlEdt`, moment(editData.chnlEdt).format('YYYY-MM-DD'));
        }

        // 이미지, 썸네일, 모바일용 이미지를 선택 한 경우.
        if (editData.chnlImg) {
            formData.append(`chnlImg`, editData.chnlImg);
        }
        if (editData.chnlThumb) {
            formData.append(`chnlThumb`, editData.chnlThumb);
        }
        if (editData.chnlImgMob) {
            formData.append(`chnlImgMob`, editData.chnlImgMob);
        }

        // 방송요일 배열을 조합해서 숫자만 남겨서 등록. (ex. 1234)
        const chnlDy = editDays.join('').replace(/day/gi, '').replace('0', '');
        formData.append(`chnlDy`, chnlDy);

        // 채널 정보.
        formData.append(`podtyChnlSrl`, editData.podtyChnlSrl);
        if (editData.podtyUrl && editData.podtyUrl.length > 0 && editData.podtyUrl.trim().length > 0) {
            formData.append(`podtyUrl`, editData.podtyUrl);
        }

        if (editData.seasonNm && editData.seasonNm.length > 0 && editData.seasonNm.trim().length > 0) {
            formData.append(`seasonNm`, editData.seasonNm);
        }

        // 시즌 번호
        if (editData.seasonCnt && editData.seasonCnt > 0) {
            formData.append(`seasonCnt`, editData.seasonCnt);
        } else {
            formData.append(`seasonCnt`, 0);
        }

        // // formData 출력(테스트).
        // for (let [key, value] of formData) {
        //     console.log(`${key}: ${value}`);
        // }
        // return;

        dispatch(
            saveJpodChannel({
                chnlSeq: selectChnlSeq.current === 'add' ? null : selectChnlSeq.current,
                channelinfo: formData,
                callback: ({ header: { success, message }, body }) => {
                    if (success === true) {
                        toast.success(message);
                        const { chnlSeq } = body;
                        if (chnlSeq) {
                            // 리스트를 다시 가지고 옴.
                            dispatch(getChannels());
                            // 채널 정보 값도 다시 가지고 옴.
                            dispatch(clearChannelInfo());
                            dispatch(getChannelInfo({ chnlSeq: chnlSeq }));
                            history.push(`${match.path}/${chnlSeq}`);
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

    // 취소 버튼
    const handleClickCancleButton = () => {
        history.push(`${match.path}`);
    };

    // 삭제 버튼 - 임시 -
    // const handleClickDeleteButton = () => {
    //     dispatch(
    //         deleteJpodChannel({
    //             chnlSeq: selectChnlSeq.current,
    //             callback: ({ header: { success, message }, body }) => {
    //                 if (success === true) {
    //                     toast.success(message);
    //                     const { chnlSeq } = body;
    //                     if (chnlSeq) {
    //                         // 리스트를 다시 가지고 옴.
    //                         dispatch(getChannels());
    //                         // 채널 정보 값도 다시 가지고 옴.
    //                         dispatch(clearChannelInfo());
    //                         dispatch(getChannelInfo({ chnlSeq: chnlSeq }));
    //                         history.push(`${match.path}/${chnlSeq}`);
    //                     }
    //                 } else {
    //                     const { totalCnt, list } = body;
    //                     if (totalCnt > 0 && Array.isArray(list)) {
    //                         // 에러 메시지 확인.
    //                         messageBox.alert(list[0].reason, () => {});
    //                     } else {
    //                         // 에러이지만 에러메시지가 없으면 서버 메시지를 alert 함.
    //                         messageBox.alert(message, () => {});
    //                     }
    //                 }
    //             },
    //         }),
    //     );
    // };

    // 이미지 파일 변경시 해당 스테이트 업데이트.
    const handleChangeFIle = ({ name, file }) => {
        switch (name) {
            case 'chnlImgFile':
                setImgfile(file);
                break;
            case 'chnlThumbFile':
                setThumbfile(file);
                break;
            case 'chnlImgMobFile':
                setMobfile(file);
                break;
            default:
                break;
        }
    };

    // 기자 검색 모달 창에서 기자를 선택 하면 store 에 업데이트를 해주고
    // 스토어가 변경 되면 진행자 스테이트를 업데이트 해줌.
    useEffect(() => {
        if (selectReporter) {
            // const tmpCh = editSelectRepoters.filter((e) => e.memMemo === '' && e.memNm === '' && e.memRepSeq === '' && e.nickNm === '' && e.seqNo === '');
            // if (tmpCh.length === 0) {
            //     toast.warning('진행자는 6명까지 선택 할수 있습니다.');
            //     return;
            // }

            if (editSelectRepoters.length === 6) {
                toast.warning('진행자는 6명까지 선택 할수 있습니다.');
                return;
            }

            const tmpCh = editSelectRepoters.filter((e) => e.memMemo === '' && e.memNm === '' && e.memRepSeq === '' && e.nickNm === '' && e.seqNo === '');

            // 추가 버튼을 눌렀을경우 데이터가 없이 폼이 있기 떄문에
            // 데이터가 없는 폼이 있으면 해당 폼에 입력 아니면 추가.
            if (tmpCh.length === 0) {
                setEditSelectRepoters([...editSelectRepoters, selectReporter]);
            } else {
                let status = false;
                setEditSelectRepoters(
                    editSelectRepoters.map((e) => {
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
        }
        // 기자 선택 스토어가 변경 되었을 경우만 실행.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectReporter]);

    // 팟티 검색 모달 창에서 팟티가 선택이 되면 스토어에 등록후 스토어가 업데이트가 되면
    // 해당값을 스테이트에 등록.
    useEffect(() => {
        if (selectPodtyChannel && selectPodtyChannel.castSrl) {
            const { castSrl, shareUrl } = selectPodtyChannel;
            setEditData({
                ...editData,
                podtyChnlSrl: castSrl,
                podtyUrl: shareUrl,
            });
        }
        // 팟티가 선택되었을 경우만 실행.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectPodtyChannel]);

    // 그리드에서 리스트 클릭후 스토어 업데이트 되었을떄.
    useEffect(() => {
        const setBasic = ({ usedYn, chnlNm, chnlMemo, chnlSdt, chnlEdt, podtyChnlSrl, podtyUrl, keywords, chnlImg, chnlImgMob, chnlThumb, episodeStat, seasonCnt, seasonNm }) => {
            // 키워드 업데이트시 ordNo 를 어떻게 할껀지?
            const keyword = Array.isArray(keywords) && keywords.length > 0 ? keywords[0].keyword : '';

            setEditData({
                ...editData,
                usedYn: usedYn,
                chnlNm: chnlNm,
                chnlMemo: chnlMemo,
                chnlSdt: chnlSdt && chnlSdt !== '' ? moment(chnlSdt) : '',
                chnlEdt: chnlEdt && chnlEdt !== '' ? moment(chnlEdt) : '',
                podtyChnlSrl: podtyChnlSrl === 0 ? `0` : podtyChnlSrl,
                podtyUrl: podtyUrl,
                keywords: keyword,
                chnlImg: chnlImg,
                chnlImgMob: chnlImgMob,
                chnlThumb: chnlThumb,
                episodeStat: episodeStat,
                seasonCnt: seasonCnt,
                seasonNm: seasonNm,
            });
        };

        // 진행자 설정.
        // reporterCountConst 고정 개수로 6를 값이 있든 없든 배열을 생성 하준다.
        // const setMember = (members) => {
        //     if (Array.isArray(members) && members.length > 0) {
        //         setEditSelectRepoters(
        //             reporterCountConst.map((index) => {
        //                 return {
        //                     chnlSeq: members[index] && members[index].chnlSeq ? members[index].chnlSeq : '',
        //                     desc: members[index] && members[index].desc ? members[index].desc : '',
        //                     epsdSeq: members[index] && members[index].epsdSeq ? members[index].epsdSeq : '',
        //                     memDiv: members[index] && members[index].memDiv ? members[index].memDiv : '',
        //                     memMemo: members[index] && members[index].memMemo ? members[index].memMemo : '',
        //                     memNm: members[index] && members[index].memNm ? members[index].memNm : '',
        //                     memRepSeq: members[index] && members[index].memRepSeq ? members[index].memRepSeq : '',
        //                     nickNm: members[index] && members[index].nickNm ? members[index].nickNm : '',
        //                     seqNo: members[index] && members[index].seqNo ? members[index].seqNo : '',
        //                 };
        //             }),
        //         );
        //     }
        // };

        // 진행자 설정.
        const setMember = (members) => {
            if (Array.isArray(members)) {
                setEditSelectRepoters(
                    members.map((element, index) => {
                        return {
                            chnlSeq: element.chnlSeq ? element.chnlSeq : '',
                            desc: element.desc ? element.desc : '',
                            epsdSeq: element.epsdSeq ? element.epsdSeq : '',
                            memDiv: element.memDiv ? element.memDiv : '',
                            memMemo: element.memMemo ? element.memMemo : '',
                            memNm: element.memNm ? element.memNm : '',
                            memRepSeq: element.memRepSeq ? element.memRepSeq : '',
                            nickNm: element.nickNm ? element.nickNm : '',
                            seqNo: element.seqNo ? element.seqNo : '',
                        };
                    }),
                );
            }
        };

        // 방송요일 설정.
        const setChnlDy = (chnlDy) => {
            const tempArray = [];
            if (chnlDy === null) {
                setEditDays([]);
                return;
            }
            if (chnlDy.length === 7) {
                // 길이가 7이면 전체 매일 이기 때문에 day0(매일을 먼저 등록.)
                tempArray.push('day0');
            }

            for (var i = 0; i < chnlDy.length; i++) {
                // 개수 많큼 배열에 day를 추가 해줌.
                let tmpChar = chnlDy.charAt(i);
                tempArray.push(`day${tmpChar}`);
            }
            setEditDays(tempArray);
        };

        // channelInfo 스토어가 변경 되었지만 initial 값과 같으면 기본 정보 state 를 리셋.
        if (channelInfo === initialState.channel.channelInfo) {
            handleResetEditBasicData();
            return;
        }

        setBasic(channelInfo);
        setMember(channelInfo.members);
        setChnlDy(channelInfo.chnlDy);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channelInfo]);

    // url 이 변경 되었을 경우 처리. ( 채널 고유 번호 및 add)
    useEffect(() => {
        if (!isNaN(Number(params.chnlSeq)) && selectChnlSeq.current !== params.chnlSeq) {
            dispatch(clearChannelInfo());
            dispatch(getChannelInfo({ chnlSeq: params.chnlSeq }));
            dispatch(getChEpisodes({ chnlSeq: params.chnlSeq }));
        } else if (selectChnlSeq.current !== params.chnlSeq && params.chnlSeq === 'add') {
            dispatch(clearChannelInfo());
            handleResetEditBasicData();
        }
        selectChnlSeq.current = params.chnlSeq;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    useEffect(() => {
        resetReporter(); // 최초에 한번 혹시 몰라서 진행자 배열 스테이트를 초기화 해줌.
    }, []);

    return (
        <div className="d-flex">
            <MokaCard
                className="w-100 flex-fill"
                title={`J팟 채널 ${selectChnlSeq.current === 'add' ? '등록' : '정보'}`}
                titleClassName="mb-0"
                loading={loading}
                footer
                footerClassName="d-flex justify-content-center"
                footerButtons={[
                    {
                        text: params.chnlSeq === 'add' ? '등록' : '수정',
                        variant: 'positive',
                        onClick: handleClickSaveButton,
                        className: 'mr-05',
                        useAuth: true,
                    },
                    { text: '취소', variant: 'negative', onClick: () => handleClickCancleButton, className: 'mr-05' },
                ]}
            >
                <Form className="">
                    {/* 사용여부 */}
                    <Form.Row className="mb-2">
                        <Col xs={5} className="p-0">
                            <MokaInputLabel
                                as="switch"
                                name="usedYn"
                                id="usedYn"
                                label="사용여부"
                                inputProps={{ checked: editData.usedYn === 'Y' ? true : false }}
                                onChange={(e) => handleChangeChannelEditData(e)}
                            />
                        </Col>
                    </Form.Row>
                    {/* 팟티 채널 */}
                    <Form.Row className="mb-2">
                        <Col xs={10} className="p-0">
                            <MokaInputLabel
                                label={`팟티\n(채널연결)`}
                                labelWidth={64}
                                className="mb-0"
                                id="podtyChnlSrl"
                                name="podtyChnlSrl"
                                placeholder=""
                                value={editData.podtyChnlSrl === '0' ? '' : editData.podtyChnlSrl}
                                inputProps={{ readOnly: true }}
                                onChange={(e) => handleChangeChannelEditData(e)}
                            />
                        </Col>
                        <Col xs={2} className="p-0 pt-1 pl-1 text-right">
                            <Button variant="searching" className="mb-0" onClick={() => handleClickPadtySearch()}>
                                팟티검색
                            </Button>
                        </Col>
                    </Form.Row>
                    {/* 외부 채널 */}
                    <Form.Row className="mb-2">
                        <Col className="p-0">
                            <MokaInputLabel
                                label={`팟티 채널\n(URL)`}
                                labelWidth={64}
                                className="mb-0"
                                id="podtyUrl"
                                name="podtyUrl"
                                placeholder=""
                                value={editData.podtyUrl}
                                onChange={(e) => handleChangeChannelEditData(e)}
                            />
                        </Col>
                    </Form.Row>
                    {/* 채널명 */}
                    <Form.Row className="mb-2">
                        <Col className="p-0">
                            <MokaInputLabel
                                label={`채널명`}
                                labelWidth={64}
                                className="mb-0"
                                id="chnlNm"
                                name="chnlNm"
                                placeholder=""
                                value={editData.chnlNm}
                                onChange={(e) => handleChangeChannelEditData(e)}
                            />
                        </Col>
                    </Form.Row>
                    {editData.episodeStat && (
                        <Form.Row className="mb-2">
                            <div className="pl-2" style={{ width: '60px', minWidth: '60px', marginRight: '12px', marginLeft: '8px' }}></div>
                            {/* <Col className="p-0">* 등록된 에피소드: 사용(201) | 중지(1) * 마지막 회차 정보 : E.99</Col> */}
                            <Col className="p-0">{`* 등록된 에피소드: 사용(${editData.episodeStat.usedCnt ? editData.episodeStat.usedCnt : 0}) | 중지(${
                                editData.episodeStat.unusedCnt ? editData.episodeStat.unusedCnt : 0
                            }) * 마지막 회차 정보 : ${editData.episodeStat.lastEpsoNo ? editData.episodeStat.lastEpsoNo : ``}`}</Col>
                        </Form.Row>
                    )}

                    <Form.Row className="mb-2">
                        <Col xs={8} className="p-0">
                            {/* 시즌명 */}
                            <MokaInputLabel
                                label={`시즌명`}
                                labelWidth={64}
                                className="mb-2 pr-2"
                                inputClassName="resize-none"
                                inputProps={{ rows: 6 }}
                                id="seasonNm"
                                name="seasonNm"
                                value={editData.seasonNm}
                                onChange={(e) => handleChangeChannelEditData(e)}
                            />
                        </Col>
                        <Col xs={4} className="p-0">
                            {/* 총시즌 */}
                            <MokaInputLabel
                                label={`총시즌`}
                                type="number"
                                labelWidth={30}
                                className="mb-2"
                                inputClassName="resize-none"
                                inputProps={{ rows: 6 }}
                                id="seasonCnt"
                                name="seasonCnt"
                                value={editData.seasonCnt}
                                onChange={(e) => handleChangeChannelEditData(e)}
                            />
                        </Col>
                    </Form.Row>

                    {/* 채널 소개 */}
                    <Form.Row className="mb-2">
                        <Col className="p-0">
                            <MokaInputLabel
                                label={`채널 소개`}
                                labelWidth={64}
                                as="textarea"
                                className="mb-2"
                                inputClassName="resize-none"
                                inputProps={{ rows: 6 }}
                                id="chnlMemo"
                                name="chnlMemo"
                                value={editData.chnlMemo}
                                onChange={(e) => handleChangeChannelEditData(e)}
                            />
                        </Col>
                    </Form.Row>
                    <Form.Row className="mb-2">
                        {/* 개설일 */}
                        <Col xs={5} className="p-0 pr-2">
                            <MokaInputLabel
                                label={`개설일`}
                                labelWidth={64}
                                as="dateTimePicker"
                                className="mb-0"
                                name="chnlSdt"
                                id="chnlSdt"
                                value={editData.chnlSdt}
                                onChange={(param) => {
                                    // const selectDate = param._d;
                                    // const date = moment(new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate(), 0, 0, 0)).format(DB_DATEFORMAT);
                                    handleDateChange('chnlSdt', param);
                                }}
                                inputProps={{ timeFormat: null }}
                            />
                        </Col>
                        {/* 종료일 */}
                        <Col xs={5} className="p-0">
                            <MokaInputLabel
                                label={`종료일`}
                                labelWidth={64}
                                as="dateTimePicker"
                                className="mb-0"
                                name="chnlEdt"
                                id="chnlEdt"
                                value={editData.chnlEdt}
                                onChange={(param) => {
                                    handleDateChange('chnlEdt', param);
                                }}
                                inputProps={{ timeFormat: null }}
                            />
                        </Col>
                    </Form.Row>
                    {/* 방송요일 */}
                    <Form.Row className="mb-2">
                        <MokaInputLabel label={`방송요일`} labelWidth={64} as="none" />
                        <MokaInput
                            as="checkbox"
                            name="day0"
                            id="day0"
                            onChange={(e) => handleChannelDay(e)}
                            inputProps={{ label: '매일', custom: true, checked: editDays.includes('day0') }}
                        />
                        <MokaInput
                            as="checkbox"
                            name="day1"
                            id="day1"
                            onChange={(e) => handleChannelDay(e)}
                            inputProps={{ label: '월', custom: true, checked: editDays.includes('day1') }}
                        />
                        <MokaInput
                            as="checkbox"
                            name="day2"
                            id="day2"
                            onChange={(e) => handleChannelDay(e)}
                            inputProps={{ label: '화', custom: true, checked: editDays.includes('day2') }}
                        />
                        <MokaInput
                            as="checkbox"
                            name="day3"
                            id="day3"
                            onChange={(e) => handleChannelDay(e)}
                            inputProps={{ label: '수', custom: true, checked: editDays.includes('day3') }}
                        />
                        <MokaInput
                            as="checkbox"
                            name="day4"
                            id="day4"
                            onChange={(e) => handleChannelDay(e)}
                            inputProps={{ label: '목', custom: true, checked: editDays.includes('day4') }}
                        />
                        <MokaInput
                            as="checkbox"
                            name="day5"
                            id="day5"
                            onChange={(e) => handleChannelDay(e)}
                            inputProps={{ label: '금', custom: true, checked: editDays.includes('day5') }}
                        />
                        <MokaInput
                            as="checkbox"
                            name="day6"
                            id="day6"
                            onChange={(e) => handleChannelDay(e)}
                            inputProps={{ label: '토', custom: true, checked: editDays.includes('day6') }}
                        />
                        <MokaInput
                            as="checkbox"
                            name="day7"
                            id="day7"
                            onChange={(e) => handleChannelDay(e)}
                            inputProps={{ label: '일', custom: true, checked: editDays.includes('day7') }}
                        />
                    </Form.Row>
                    {/* 테그 */}
                    <Form.Row className="mb-2">
                        <Col className="p-0">
                            <MokaInputLabel
                                label={`태그`}
                                labelWidth={64}
                                className="mb-0"
                                id="keywords"
                                name="keywords"
                                placeholder=""
                                value={editData.keywords}
                                onChange={(e) => handleChangeChannelEditData(e)}
                            />
                        </Col>
                    </Form.Row>
                    <hr />
                    {/* 진행자 검색(모달) */}
                    <Form.Row className="mb-2">
                        <MokaInputLabel label={`진행자`} labelWidth={64} as="none" />
                        <Col xs={4} className="p-0">
                            <Button xs={12} variant="searching" className="mb-0 mr-2" onClick={() => handleClickSearchRepoterButton()}>
                                기자 검색
                            </Button>
                            <Button variant="positive" onClick={(e) => handleClickRepoterAddButton()}>
                                추가
                            </Button>
                        </Col>
                    </Form.Row>
                    {/* 기본 6개 를 뿌려준다. */}
                    {editSelectRepoters.map((element, index) => {
                        return (
                            <Form.Row className="mb-2" key={index}>
                                <div className="d-flex align-items-center form-group">
                                    <div className="px-0 mb-0 position-relative flex-shrink-0 form-label" style={{ width: '60px' }}></div>
                                </div>
                                <Col className="p-0" xs={11}>
                                    <Col className="p-0" style={{ backgroundColor: '#f4f7f9', height: '100px' }}>
                                        <Col className="d-flex w-100 h-50 align-items-center">
                                            <div style={{ width: '70px' }}>
                                                <MokaInput
                                                    name="memRepSeq"
                                                    className="ft-12"
                                                    value={element.memRepSeq}
                                                    onChange={(e) => handleChangeReporters({ e, index })}
                                                    placeholder={`기자번호`}
                                                    disabled={true}
                                                />
                                            </div>
                                            <div style={{ width: '160px' }}>
                                                <MokaInput
                                                    name="memNm"
                                                    className="ft-12"
                                                    value={element.memNm}
                                                    onChange={(e) => handleChangeReporters({ e, index })}
                                                    placeholder={`기자명`}
                                                />
                                            </div>
                                            <div className="pl-3" style={{ width: '115px' }}>
                                                <MokaInput
                                                    name="memMemo"
                                                    className="ft-12"
                                                    value={element.memMemo}
                                                    onChange={(e) => handleChangeReporters({ e, index })}
                                                    placeholder={`직책`}
                                                />
                                            </div>
                                            <div className="pl-3" style={{ width: '115px' }}>
                                                <MokaInput
                                                    name="nickNm"
                                                    className="ft-12"
                                                    value={element.nickNm}
                                                    onChange={(e) => handleChangeReporters({ e, index })}
                                                    placeholder={`닉네임`}
                                                />
                                            </div>
                                            <div className="pl-3" style={{ width: '70px' }}>
                                                <Button variant="searching" className="mb-0" onClick={() => handleClickReporterDelete(index)}>
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
                                                    onChange={(e) => handleChangeReporters({ e, index })}
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
                        <MokaInputLabel className="pr-0" as="none" label="첨부파일" labelWidth={64} />
                    </Form.Row>

                    {/* 이미지 */}
                    <Form.Row className="mb-2">
                        <MokaInputLabel
                            as="imageFile"
                            className="w-100 mb-2"
                            name="chnlImgMobFile"
                            isInvalid={null}
                            inputClassName="flex-fill"
                            label={
                                <React.Fragment>
                                    커버이미지
                                    <br />
                                    (1920*360)
                                    <br />
                                    {/* <Button
                                    className="mt-1"
                                    size="sm"
                                    variant="negative"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        imgFileRef1.current.deleteFile();
                                        setImgfile(null);
                                        setEditData({
                                            ...editData,
                                            chnlImg: null,
                                        });
                                    }}
                                >
                                    삭제
                                </Button> */}
                                    <Button
                                        className="mt-0"
                                        size="sm"
                                        variant="positive"
                                        onClick={(e) => {
                                            imgFileRef1.current.rootRef.onClick(e);
                                        }}
                                    >
                                        신규등록
                                    </Button>
                                </React.Fragment>
                            }
                            ref={imgFileRef1}
                            inputProps={{
                                height: 80,
                                // width: 600, // width: '100%' number type 에러남.
                                img: editData.chnlImg,
                                selectAccept: ['image/jpeg'], // 이미지중 업로드 가능한 타입 설정.
                                deleteButton: true,
                            }}
                            onChange={(file) =>
                                handleChangeFIle({
                                    name: 'chnlImgFile',
                                    file: file,
                                })
                            }
                            labelClassName="justify-content-end"
                        />
                    </Form.Row>
                    {/* 모바일용 */}
                    <Form.Row className="mb-2">
                        <Col xs={7}>
                            <MokaInputLabel
                                as="imageFile"
                                className="mb-2"
                                name="chnlThumbFile"
                                isInvalid={null}
                                inputClassName="flex-fill"
                                labelWidth={65}
                                label={
                                    <React.Fragment>
                                        모바일용
                                        <br />
                                        (750*330)
                                        <br />
                                        {/* <Button
                                        className="mt-1"
                                        size="sm"
                                        variant="negative"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            imgFileRef3.current.deleteFile();
                                            setThumbfile(null);
                                            setEditData({
                                                ...editData,
                                                chnlImgMob: null,
                                            });
                                        }}
                                    >
                                        삭제
                                    </Button> */}
                                        <Button
                                            className="mt-0"
                                            size="sm"
                                            variant="positive"
                                            onClick={(e) => {
                                                imgFileRef3.current.rootRef.onClick(e);
                                                // imgFileRef3.current.deleteFile();
                                                setThumbfile(null);
                                                setEditData({
                                                    ...editData,
                                                    chnlImgMob: null,
                                                });
                                            }}
                                        >
                                            신규등록
                                        </Button>
                                    </React.Fragment>
                                }
                                ref={imgFileRef3}
                                inputProps={{
                                    height: 80,
                                    // width: 400, // width: '100%' number type 에러남.
                                    img: editData.chnlImgMob,
                                    deleteButton: true,
                                }}
                                onChange={(file) =>
                                    handleChangeFIle({
                                        name: 'chnlImgMobFile',
                                        file: file,
                                    })
                                }
                                labelClassName="justify-content-end"
                            />
                        </Col>
                        {/* 썸네일 이미지 */}
                        <Col xs={5} className="p-0 pt-1 pl-1">
                            <MokaInputLabel
                                as="imageFile"
                                className="w-100 mb-2"
                                name="chnlImgMobFile"
                                id="chnlImgMobFile"
                                isInvalid={null}
                                inputClassName="d-flex flex-fill"
                                label={
                                    <React.Fragment>
                                        썸네일
                                        <br />
                                        (150*150)
                                        <br />
                                        {/* <Button
                                        className="mt-1"
                                        size="sm"
                                        variant="negative"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            imgFileRef2.current.deleteFile();
                                            setMobfile(null);
                                            setEditData({
                                                ...editData,
                                                chnlThumb: null,
                                            });
                                        }}
                                    >
                                        삭제
                                    </Button> */}
                                        <Button
                                            className="mt-0"
                                            size="sm"
                                            variant="positive"
                                            onClick={(e) => {
                                                // e.preventDefault();
                                                // e.stopPropagation();
                                                imgFileRef2.current.rootRef.onClick(e);
                                                setMobfile(null);
                                                setEditData({
                                                    ...editData,
                                                    chnlThumb: null,
                                                });
                                            }}
                                        >
                                            신규등록
                                        </Button>
                                    </React.Fragment>
                                }
                                ref={imgFileRef2}
                                inputProps={{
                                    height: 80,
                                    img: editData.chnlThumb,
                                    deleteButton: true,
                                }}
                                onChange={(file) =>
                                    handleChangeFIle({
                                        name: 'chnlThumbFile',
                                        file: file,
                                    })
                                }
                                // labelClassName="justify-content-end"
                            />
                        </Col>
                    </Form.Row>
                </Form>
                {/* 팟티 채널 모달 창. */}
                <PodtyChannelModal
                    show={podtyChannelModalState}
                    onHide={() => {
                        setPodtyChannelModalState(false);
                    }}
                />
                {/* 진행자(기자) 검색 모달 창. */}
                <RepoterModal
                    show={repoterModalState}
                    selectType={`CM`}
                    onHide={() => {
                        setRepoterModalState(false);
                    }}
                />
            </MokaCard>
        </div>
    );
};

export default ChannelEdit;
