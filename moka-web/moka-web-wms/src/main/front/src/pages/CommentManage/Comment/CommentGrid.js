import React, { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { GET_COMMENT_LIST, changeSearchOption, getCommentList } from '@store/commentManage';
import { tempCommentList } from '@pages/CommentManage/CommentConst';
import CommentAgGrid from '@pages/CommentManage/CommentAgGrid';
import { useBreakpoint } from '@components';
import { columnDefs, localeText, smColumnDefs } from './CommentAgGridColumns';
import InfoItemRenderer from './InfoItemRenderer';

/**
 * 댓글 AgGrid 목록
 */
const CommentGrid = () => {
    const dispatch = useDispatch();
    const [gridReadyState, setGridReadyState] = useState(false);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [listRows, setListRows] = useState([]);
    const matchPoints = useBreakpoint();
    const { search, loading } = useSelector(
        (store) => ({
            list: store.comment.comments.list,
            total: store.comment.comments.total,
            search: store.comment.comments.search,
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

    useEffect(() => {
        setListRows(
            tempCommentList.list.map((element, index) => {
                return {
                    report: element.report,
                    commentSeq: element.commentSeq,
                    comment: element.comment,
                    userId: element.userId,
                    userName: element.userName,
                    ip: element.ip,
                    source: element.source,
                    regDt: element.regDt,
                    recommend: element.recommend,
                    status: element.status,
                    media: element.media,
                };
            }),
        );
    }, []);

    const createRowData = (element) => {
        return element.map((item, i) => {
            return {
                report: item.report,
                commentSeq: item.commentSeq,
                comment: item.comment,
                userId: item.userId,
                userName: item.userName,
                ip: item.ip,
                source: item.source,
                regDt: item.regDt,
                recommend: item.recommend,
                status: item.status,
                media: item.media,
            };
        });
    };

    const onGridReady = (params) => {
        // console.log(params);
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);

        setGridReadyState(true);

        setTimeout(function () {
            // params.api.setRowData(createRowData());
            // setGridRowData(params);
        }, 500);
    };
    const onColumnResized = (params) => {
        params.api.resetRowHeights();
    };

    const onColumnVisible = (params) => {
        params.api.resetRowHeights();
    };

    useEffect(() => {
        if (gridApi) {
            setTimeout(function () {
                gridApi.setRowData(createRowData(listRows));
            }, 500);
        }
    }, [listRows, gridReadyState, gridApi, gridColumnApi]);

    return (
        <>
            <CommentAgGrid
                loading={loading}
                columnDefs={matchPoints.xs || matchPoints.sm ? smColumnDefs : columnDefs}
                localeText={localeText}
                onColumnResized={(e) => onColumnResized(e)}
                onColumnVisible={(e) => onColumnVisible(e)}
                onGridReady={(e) => onGridReady(e)}
                changeSearchOption={(e) => handleChangeSearchOption(e)}
                frameworkComponents={{ infoRenderer: InfoItemRenderer }}
            />
        </>
    );
};

export default CommentGrid;
