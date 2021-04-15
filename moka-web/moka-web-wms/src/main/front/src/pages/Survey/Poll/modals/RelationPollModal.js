import React, { useCallback, useEffect, useState } from 'react';
import { MokaModal } from '@components';
import RelationPollModalSearchComponent from '@pages/Survey/Poll/components/RelationPollModalSearchComponent';
import RelationPollModalAgGridComponent from '@pages/Survey/Poll/components/RelationPollModalAgGridComponent';
import { useDispatch } from 'react-redux';
import { getRelationPollList } from '@store/survey/poll/pollAction';
import toast from '@utils/toastUtil';
import commonUtil from '@utils/commonUtil';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import produce from 'immer';
const initialState = { searchType: 'title', keyword: '', page: 0, size: 20, sort: 'pollSeq,desc', status: ['S', 'D'], pollGroup: '' };
const RelationPollModal = ({ title, show, onHide, onAdd, onRowClicked, codes }) => {
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState(initialState);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const handleClickAdd = useCallback(
        (row) => {
            if (onAdd instanceof Function) {
                onAdd(row);
            }
        },
        [onAdd],
    );

    const handleClickRow = (row) => {
        if (onRowClicked instanceof Function) {
            onRowClicked(row);
        }
    };

    const handleChangeSearchOptions = (option) => {
        const { key, value } = option;
        const ns = produce(search, (draft) => {
            draft[key] = value;
            if (key === 'size') {
                draft['page'] = 0;
            }
        });

        setSearch(ns);
        loadList(search);
    };

    const loadList = useCallback(
        (searchObj) => {
            setLoading(true);
            dispatch(
                getRelationPollList({
                    search: { ...searchObj },
                    callback: (response) => {
                        if (response.header.success) {
                            setRows(
                                response.body.list.map((row) => ({
                                    id: row.pollSeq,
                                    title: unescapeHtmlArticle(row.title),
                                    group: commonUtil.toKorFromCode(row.pollGroup, codes.pollGroup),
                                    status: row.status === 'S' ? '진행' : '종료',
                                    onAdd: handleClickAdd,
                                })),
                            );
                            setTotal(response.body.totalCnt);
                        } else {
                            toast.warning('관련투표 리스트를 조회하는데 실패하였습니다.');
                        }
                        setLoading(false);
                    },
                }),
            );
        },
        [codes.pollGroup, dispatch, handleClickAdd],
    );

    useEffect(() => {
        if (show) {
            loadList(search);
        } else {
            setSearch(initialState);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, search]);

    return (
        <MokaModal title={title} show={show} onHide={onHide} size="md" width={600} loading={loading} draggable>
            <RelationPollModalSearchComponent onSearch={setSearch} searchOptions={search} codes={codes} />
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
