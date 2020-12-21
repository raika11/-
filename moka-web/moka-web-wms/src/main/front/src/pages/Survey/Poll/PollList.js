import React, { useState } from 'react';
import PollSearch from '@pages/Survey/Poll/PollSearch';
import PollAgGrid from '@pages/Survey/Poll/PollAgGrid';
import { useHistory } from 'react-router-dom';

const PollList = () => {
    const history = useHistory();
    const [search, setSearch] = useState({ group: '1', status: '0', section: '0', searchType: '1', page: 0, size: 0, total: 0, keyword: '' });

    const handleClickAdd = () => {
        history.push('/poll/add');
    };

    return (
        <>
            <PollSearch searchOptions={search} onChange={setSearch} onAdd={handleClickAdd} />
            <PollAgGrid searchOptions={search} />
        </>
    );
};

export default PollList;
