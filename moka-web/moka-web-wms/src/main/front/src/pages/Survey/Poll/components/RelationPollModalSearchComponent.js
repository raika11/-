import React, { useState } from 'react';
import { MokaInput, MokaSearchInput } from '@components';
import produce from 'immer';

const RelationPollModalSearchComponent = ({ searchOptions, onSearch, codes }) => {
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
                    name="pollGroup"
                    value={search.pollGroup}
                    onChange={(e) => {
                        const { name, value } = e.target;
                        handleChangeValue(name, value);
                    }}
                >
                    <option value="">그룹 전체</option>
                    {codes.pollGroup.map((code) => {
                        return (
                            <option key={code.key} value={code.key}>
                                {code.value}
                            </option>
                        );
                    })}
                </MokaInput>
            </div>
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
                    <option value="title">투표 제목</option>
                    <option value="pollSeq">투표 ID</option>
                </MokaInput>
            </div>
            <MokaSearchInput
                className="flex-fill"
                name="keyword"
                placeholder="검색어를 입력하세요"
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
