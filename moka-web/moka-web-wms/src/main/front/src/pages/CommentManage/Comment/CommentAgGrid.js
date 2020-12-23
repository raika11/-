import React, { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { MokaTable } from '@components';
import { GET_COMMENT_LIST, changeSearchOption, getCommentList } from '@store/commentManage/comment';
import { columnDefs } from './CommentAgGridColumns';

/**
 * 댓글 AgGrid 목록
 */
const CommentAgGrid = () => {
    const dispatch = useDispatch();
    const { list, total, search, loading } = useSelector(
        (store) => ({
            list: store.comment.list,
            total: store.comment.total,
            search: store.comment.search,
            loading: store.loading[GET_COMMENT_LIST],
        }),
        shallowEqual,
    );

    /**
     * 테이블에서 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getCommentList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={list}
            onRowNodeId={(rowData) => rowData.commentSeq}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
            rowSelection="multiple"
        />
    );
};

export default CommentAgGrid;
