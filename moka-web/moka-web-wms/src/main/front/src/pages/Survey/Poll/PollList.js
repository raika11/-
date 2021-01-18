import React, { useEffect, useState } from 'react';
import PollSearch from '@pages/Survey/Poll/PollSearch';
import PollAgGrid from '@pages/Survey/Poll/PollAgGrid';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPollList } from '@store/survey/poll/pollAction';

const PollList = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { search, list, codes, total } = useSelector((store) => ({
        search: store.poll.search,
        total: store.poll.total,
        list: store.poll.list,
        codes: store.poll.codes,
    }));

    const handleClickAdd = () => {
        history.push('/poll/add');
    };

    useEffect(() => {
        dispatch(getPollList({ search }));
    }, [dispatch, search]);

    useEffect(() => {
        console.log(list);
    }, [list]);

    return (
        <>
            <PollSearch searchOptions={search} codes={codes} onAdd={handleClickAdd} />
            <PollAgGrid searchOptions={search} rows={list} total={total} />
        </>
    );
};

export default PollList;
