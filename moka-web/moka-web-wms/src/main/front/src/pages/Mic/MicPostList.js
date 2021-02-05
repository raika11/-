import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MokaCard, MokaTable } from '@components';
import { initialState, changePostSearchOption, getMicPostList, getMicPost, putMicAnswerDiv, saveMicPost, GET_MIC_POST_LIST } from '@store/mic';
import toast, { messageBox } from '@utils/toastUtil';
import PostEditMadal from './modals/PostEditModal';
import columnDefs from './MicPostListColumns';

/**
 * 아젠다 포스트 목록
 */
const MicPostList = () => {
    const dispatch = useDispatch();
    const { agndSeq } = useParams();
    const { total, search, list, post } = useSelector(({ mic }) => mic.post);
    const loading = useSelector(({ loading }) => loading[GET_MIC_POST_LIST]);
    const agenda = useSelector(({ mic }) => mic.agenda);
    const [show, setShow] = useState(false);
    const [temp, setTemp] = useState({});
    const [rowData, setRowData] = useState([]);

    /**
     * 검색
     */
    const handleSearch = useCallback(
        (search) => {
            dispatch(changePostSearchOption(search));
            dispatch(
                getMicPostList({
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
            getMicPost({
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
     * 포스트 상세 데이터 변경
     */
    const handleChangeValue = ({ key, value }) => setTemp({ ...temp, [key]: value });

    /**
     * 포스트 상세 수정/등록
     * @param {object} post 포스트 데이터
     */
    const handleSave = (post) => {
        dispatch(
            saveMicPost({
                post,
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
     * 상태 수정
     */
    const handleChangeAnswDiv = useCallback(
        (data) => {
            dispatch(
                putMicAnswerDiv({
                    answSeq: data.answSeq,
                    answDiv: data.answDiv,
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

    useEffect(() => {
        if (agndSeq) {
            const ns = { ...initialState.post.search, agndSeq };
            handleSearch(ns);
        }
    }, [agndSeq, dispatch, handleSearch]);

    useEffect(() => {
        setRowData(
            list.map((data) => ({
                ...data,
                onChangeAnswDiv: handleChangeAnswDiv,
            })),
        );
    }, [handleChangeAnswDiv, list]);

    useEffect(() => {
        setTemp(post);
    }, [post]);

    return (
        <MokaCard title={` ❛ ${agenda.agndKwd} ❜ 관리자 포스트 목록`} className="w-100" bodyClassName="d-flex flex-column">
            <h1 className="color-primary mb-3">❛ {agenda.agndTitle} ❜</h1>
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                rowHeight={46}
                total={total}
                page={search.page}
                size={search.size}
                loading={loading}
                onRowNodeId={(data) => data.answSeq}
                onChangeSearchOption={handleChangeSearchOption}
                onRowClicked={handleRowClicked}
                preventRowClickCell={['answDiv']}
                selected={temp.answSeq}
            />

            {/* 포스트 수정 모달 */}
            <PostEditMadal
                show={show}
                onHide={() => {
                    setShow(false);
                    setTemp(initialState.post.post);
                }}
                onChange={handleChangeValue}
                onSave={handleSave}
                agenda={agenda}
                post={temp}
            />
        </MokaCard>
    );
};

export default MicPostList;
