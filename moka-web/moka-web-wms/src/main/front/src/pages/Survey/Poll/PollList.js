import React, { useEffect, useState } from 'react';
import PollSearch from '@pages/Survey/Poll/PollSearch';
import PollAgGrid from '@pages/Survey/Poll/PollAgGrid';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changePollSearchOptions, getPollList, GET_POLL_LIST } from '@store/survey/poll/pollAction';
import { initialState } from '@store/survey/poll/pollReducer';

const PollList = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { search, list, codes, total, loading } = useSelector((store) => ({
        search: store.poll.search,
        total: store.poll.total,
        list: store.poll.list,
        codes: store.poll.codes,
        loading: store.loading[GET_POLL_LIST],
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
            <PollAgGrid searchOptions={search} rows={list} total={total} loading={loading} onChangeSearchOption={handleChangeSearchOption} />
        </>
    );
};

export default PollList;
