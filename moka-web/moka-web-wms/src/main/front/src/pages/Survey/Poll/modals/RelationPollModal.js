import React, { useCallback, useEffect, useState } from 'react';
import { MokaModal } from '@components';
import RelationPollModalSearchComponent from '@pages/Survey/Poll/components/RelationPollModalSearchComponent';
import RelationPollModalAgGridComponent from '@pages/Survey/Poll/components/RelationPollModalAgGridComponent';
import { useDispatch } from 'react-redux';
import { getRelationPollList } from '@store/survey/poll/pollAction';
import toast from '@utils/toastUtil';
import commonUtil from '@utils/commonUtil';
import { unescapeHtml } from '@utils/convertUtil';
import produce from 'immer';

const RelationPollModal = ({ show, onHide, onAdd, onRowClicked, codes }) => {
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState({ searchType: 'title', keyword: '', page: 0, size: 20, sort: 'pollSeq,desc', status: ['S', 'D'] });
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const handleClickAdd = (row) => {
        if (onAdd instanceof Function) {
            onAdd(row);
        }
    };

    const handleClickRow = (row) => {
        if (onRowClicked instanceof Function) {
            onRowClicked(row);
        }
    };

    const handleChangeSearchOptions = (option) => {
        const { key, value } = option;
        setSearch(
            produce(search, (draft) => {
                draft[key] = value;
                if (key === 'size') {
                    draft['page'] = 0;
                }
            }),
        );
    };

    const loadList = useCallback(
        (searchObj) => {
            setLoading(true);
            dispatch(
                getRelationPollList({
                    search: searchObj,
                    callback: (response) => {
                        if (response.header.success) {
                            setRows(
                                response.body.list.map((row) => ({
                                    id: row.pollSeq,
                                    title: unescapeHtml(row.title),
                                    category: commonUtil.toKorFromCode(row.pollCategory, codes.pollCategory),
                                    status: row.status === 'S' ? '진행' : '종료',
                                    onClick: handleClickAdd,
                                })),
                            );
                            setTotal(response.body.totalCnt);
                            setLoading(false);
                        } else {
                            toast.warning('관련투표 리스트를 조회하는데 실패하였습니다.');
                        }
                    },
                }),
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dispatch],
    );

    useEffect(() => {
        if (show) {
            loadList(search);
        }
    }, [loadList, search, show]);

    return (
        <MokaModal title="관련 투표 팝업" show={show} onHide={onHide} size="md" width={600} draggable>
            <RelationPollModalSearchComponent onSearch={setSearch} searchOptions={search} />
            <RelationPollModalAgGridComponent
                rowData={rows}
                searchOptions={search}
                total={total}
                onRowClicked={handleClickRow}
                onChangeSearch={handleChangeSearchOptions}
                loading={loading}
            />
        </MokaModal>
    );
};

export default RelationPollModal;
