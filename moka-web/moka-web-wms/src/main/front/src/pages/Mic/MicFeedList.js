import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaTable } from '@components';
import { initialState, getMicFeedList, getMicFeed, putMicAnswerTop, putMicAnswerUsed, saveMicFeed, changeFeedSearchOption, clearMicFeed, GET_MIC_FEED_LIST } from '@store/mic';
import toast, { messageBox } from '@utils/toastUtil';
import columnDefs from './MicFeedListColumns';
import FeedEditModal from './modals/FeedEditModal';

/**
 * 아젠다 피드 목록
 */
const MicFeedList = () => {
    const dispatch = useDispatch();
    const { agndSeq } = useParams();
    const { total, search, list, feed } = useSelector(({ mic }) => mic.feed);
    const loading = useSelector(({ loading }) => loading[GET_MIC_FEED_LIST]);
    const agenda = useSelector(({ mic }) => mic.agenda);
    const [show, setShow] = useState(false);
    const [temp, setTemp] = useState({});
    const [rowData, setRowData] = useState([]);

    /**
     * 검색
     */
    const handleSearch = useCallback(
        (search) => {
            dispatch(changeFeedSearchOption(search));
            dispatch(
                getMicFeedList({
                    search: search,
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        },
        [dispatch],
    );

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let ns = { ...search, [key]: value };
        if (key !== 'page') {
            ns['page'] = 0;
        }
        handleSearch(ns);
    };

    /**
     * 테이블 row 클릭
     * @param {object} row 데이터
     */
    const handleRowClicked = (row) => {
        // 상세 데이터 조회
        dispatch(
            getMicFeed({
                answSeq: row.answSeq,
                callback: ({ header }) => {
                    if (!header.success) {
                        messageBox.alert(header.message);
                    }
                },
            }),
        );
        setShow(true);
    };

    /**
     * 피드 상세 데이터 변경
     */
    const handleChangeValue = ({ key, value }) => setTemp({ ...temp, [key]: value });

    /**
     * 피드 상세 수정/등록
     * @param {object} feed 피드 데이터
     */
    const handleSave = (feed) => {
        dispatch(
            saveMicFeed({
                feed: {
                    ...feed,
                    answerRel: feed.answerRel ? (feed.answerRel?.relDiv ? feed.answerRel : undefined) : undefined,
                },
                callback: ({ header, body }) => {
                    if (header.success && body) {
                        toast.success(header.message);
                        setShow(false);
                    } else {
                        messageBox.alert(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 최상위 수정
     */
    const handleChangeAnswTop = useCallback(
        (data) => {
            dispatch(
                putMicAnswerTop({
                    answSeq: data.answSeq,
                    answTop: data.answTop,
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        },
        [dispatch],
    );

    /**
     * 사용여부 수정
     */
    const handleChangeUsedYn = useCallback(
        (data) => {
            dispatch(
                putMicAnswerUsed({
                    answSeq: data.answSeq,
                    usedYn: data.usedYn,
                    callback: ({ header }) => {
                        if (!header.success) {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        },
        [dispatch],
    );

    /**
     * 등록
     */
    const handleAddFeed = () => {
        setTemp({
            ...initialState.feed.feed,
            agndSeq,
        });
        setShow(true);
    };

    useEffect(() => {
        if (agndSeq) {
            const ns = { ...initialState.feed.search, agndSeq };
            handleSearch(ns);
        }
    }, [agndSeq, dispatch, handleSearch]);

    useEffect(() => {
        setRowData(
            list.map((data) => ({
                ...data,
                regDt: `${data.regDt.slice(0, 10)}\n${data.regDt.slice(11, 16)}`,
                onChangeAnswTop: handleChangeAnswTop,
                onChangeUsedYn: handleChangeUsedYn,
            })),
        );
    }, [handleChangeAnswTop, handleChangeUsedYn, list]);

    useEffect(() => {
        setTemp(feed);
    }, [feed]);

    useEffect(() => {
        return () => {
            dispatch(clearMicFeed());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaCard title={` ❛ ${agenda.agndKwd} ❜ 관리자 피드 목록`} className="w-100" bodyClassName="d-flex flex-column">
            <h1 className="color-primary mb-0">❛ {agenda.agndTitle} ❜</h1>
            <div className="mb-2 d-flex justify-content-end">
                <Button variant="positive" onClick={handleAddFeed}>
                    등록
                </Button>
            </div>
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                total={total}
                page={search.page}
                size={search.size}
                loading={loading}
                onRowNodeId={(data) => data.answSeq}
                onChangeSearchOption={handleChangeSearchOption}
                onRowClicked={handleRowClicked}
                preventRowClickCell={['usedYn', 'answTop']}
                selected={temp.answSeq}
            />

            {/* 피드 등록/수정 모달 */}
            <FeedEditModal
                show={show}
                onHide={() => {
                    setShow(false);
                    setTemp(initialState.feed.feed);
                }}
                feed={temp}
                agenda={agenda}
                onChange={handleChangeValue}
                onSave={handleSave}
            />
        </MokaCard>
    );
};

export default MicFeedList;
