import React, { useEffect, useState } from 'react';
import PollSearch from '@pages/Survey/Poll/PollSearch';
import PollAgGrid from '@pages/Survey/Poll/PollAgGrid';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changePollSearchOptions, getPollList, GET_POLL_LIST, SAVE_POLL, UPDATE_POLL } from '@store/survey/poll/pollAction';
import { initialState } from '@store/survey/poll/pollReducer';

const PollList = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { search, pollSeq, list, codes, total, loading } = useSelector((store) => ({
        search: store.poll.search,
        total: store.poll.total,
        pollSeq: store.poll.poll.pollSeq,
        list: store.poll.list,
        codes: store.poll.codes,
        loading: store.loading[GET_POLL_LIST] || store.loading[SAVE_POLL] || store.loading[UPDATE_POLL],
    }));

    const handleClickAdd = () => {
        history.push('/poll/add');
    };

    const handleChangeSearchOption = (options) => {
        dispatch(changePollSearchOptions(options));
    };

    const handleClickReset = (callback) => {
        if (callback instanceof Function) {
            callback(initialState.search);
        }
        handleChangeSearchOption(initialState.search);
    };

    useEffect(() => {
        dispatch(getPollList(search));
    }, [dispatch, search]);

    return (
        <>
            <PollSearch searchOptions={search} codes={codes} onAdd={handleClickAdd} onSearch={handleChangeSearchOption} onReset={handleClickReset} />
            <PollAgGrid searchOptions={search} rows={list} total={total} loading={loading} pollSeq={pollSeq} onChangeSearchOption={handleChangeSearchOption} />
        </>
    );
};

export default PollList;
