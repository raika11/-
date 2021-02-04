import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaTable } from '@components';
import { initialState, getMicFeedList, changeFeedSearchOption, GET_MIC_FEED_LIST } from '@store/mic';
import { messageBox } from '@utils/toastUtil';
import columnDefs from './MicFeedListColumns';
import FeedEditModal from './modals/FeedEditModal';

/**
 * 아젠다 피드 목록
 */
const MicFeedList = () => {
    const dispatch = useDispatch();
    const { agndSeq } = useParams();
    const { total, search, list } = useSelector(({ mic }) => mic.feed);
    const loading = useSelector(({ loading }) => loading[GET_MIC_FEED_LIST]);
    const agenda = useSelector(({ mic }) => mic.agenda);
    const [show, setShow] = useState(false);
    const [temp, setTemp] = useState({});

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
        setShow(true);
    };

    /**
     * 피드 상세 데이터 변경
     */
    const handleChangeValue = ({ key, value }) => {
        setTemp({ ...temp, [key]: value });
    };

    useEffect(() => {
        if (agndSeq) {
            const ns = { ...initialState.feed.search, agndSeq };
            handleSearch(ns);
        } else {
            // dispatch(clearMicAgenda());
        }
    }, [agndSeq, dispatch, handleSearch]);

    return (
        <MokaCard title={` ❛${agenda.agndKwd}❜ 관리자 피드 목록`} className="w-100" bodyClassName="d-flex flex-column">
            <h1 className="color-primary mb-0">❛{agenda.agndTitle}❜</h1>
            <div className="mb-2 d-flex justify-content-end">
                <Button variant="positive" onClick={() => {}}>
                    등록
                </Button>
            </div>
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={list}
                total={total}
                page={search.page}
                size={search.size}
                loading={loading}
                onRowNodeId={(data) => data.answSeq}
                onChangeSearchOption={handleChangeSearchOption}
                onRowClicked={handleRowClicked}
                preventRowClickCell={['usedYn', 'answTop']}
            />

            {/* 피드 등록/수정 모달 */}
            <FeedEditModal show={show} onHide={() => setShow(false)} feed={temp} agenda={agenda} onChange={handleChangeValue} />
        </MokaCard>
    );
};

export default MicFeedList;
