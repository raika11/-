import React, { useState } from 'react';
import { MokaInput, MokaSearchInput } from '@components';
import produce from 'immer';

const RelationPollModalSearchComponent = ({ searchOptions, onSearch }) => {
    const [search, setSearch] = useState(searchOptions);

    const handleChangeValue = (name, value) => {
        setSearch(
            produce(search, (draft) => {
                draft[name] = value;
            }),
        );
    };

    const handleClickSearch = () => {
        onSearch(search);
    };

    return (
        <div className="mb-14 d-flex">
            <div className="flex-shrink-0 mr-2">
                <MokaInput
                    as="select"
                    name="searchType"
                    value={search.searchType}
                    onChange={(e) => {
                        const { name, value } = e.target;
                        handleChangeValue(name, value);
                    }}
                >
                    <option value="">분류</option>
                    <option value="title">투표 제목</option>
                    <option value="itemTitle">투표 보기</option>
                    <option value="pollSeq">투표 ID</option>
                </MokaInput>
            </div>
            <MokaSearchInput
                className="flex-fill"
                name="keyword"
                value={search.keyword}
                onChange={(e) => {
                    const { name, value } = e.target;
                    handleChangeValue(name, value);
                }}
                onSearch={handleClickSearch}
            />
        </div>
    );
};

export default RelationPollModalSearchComponent;
