import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import columnDefs from './RcvArticleAgGridColumns';
import { MokaTable } from '@components';
import { unescapeHtml } from '@utils/convertUtil';
import { GET_RCV_ARTICLE_LIST, changeSearchOption, getRcvArticleList, postRcvArticleWithRid, POST_RCV_ARTICLE_WITH_RID } from '@store/rcvArticle';
import { DB_DATEFORMAT } from '@/constants';
import toast from '@utils/toastUtil';

moment.locale('ko');

/**
 * 수신기사 AgGrid 컴포넌트
 */
const RcvArticleAgGrid = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector((store) => store.loading[GET_RCV_ARTICLE_LIST] || store.loading[POST_RCV_ARTICLE_WITH_RID]);
    const { total, list, search } = useSelector((store) => ({
        total: store.rcvArticle.total,
        list: store.rcvArticle.list,
        search: store.rcvArticle.search,
    }));

    //state
    const [rowData, setRowData] = useState([]);
    const rcvArticle = useSelector((store) => store.rcvArticle.rcvArticle);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(changeSearchOption(temp));
            dispatch(getRcvArticleList({ search: temp }));
        },
        [dispatch, search],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback(
        (data) => {
            history.push(`/rcv-article/${data.rid}`);
        },
        [history],
    );

    /**
     * 등록
     */
    const handleRegister = useCallback(
        (data) => {
            dispatch(
                postRcvArticleWithRid({
                    rid: data.rid,
                    callback: ({ header }) => {
                        if (header.success) {
                            toast.success(header.message);
                        } else {
                            toast.fail(header.message);
                        }
                    },
                }),
            );
        },
        [dispatch],
    );

    /**
     * ag-grid queue empty 시점에서 실행
     * https://www.ag-grid.com/documentation/javascript/grid-events/
     */
    const handleRowRendered = useCallback((params) => {
        params.api.forEachNode((rowNode) => {
            const titleCell = params.api.getCellRendererInstances({ columns: ['title'], rowNodes: [rowNode] });
            if (titleCell[0]) {
                let height = titleCell[0].getGui().offsetHeight;
                // line-height 보다 크면
                if (height > 21) {
                    rowNode.setRowHeight(height + 8);
                }
            }
        });
        params.api.onRowHeightChanged();
    }, []);

    useEffect(() => {
        if (list.length > 0) {
            setRowData(
                list.map((data) => ({
                    ...data,
                    title: unescapeHtml(data.title),
                    rcvDt: moment(data.regDt, DB_DATEFORMAT).format('MM-DD'),
                    rcvTime: moment(data.regDt, DB_DATEFORMAT).format('HH:mm'),
                    sourceName: `[${data.sourceName}]`,
                    serviceTime: data.serviceDaytime ? moment(data.serviceDaytime, DB_DATEFORMAT).format('HH:mm') : null,
                    handleRowClicked,
                    handleRegister,
                })),
            );
        } else {
            setRowData([]);
        }
    }, [handleRegister, handleRowClicked, list]);

    return (
        <MokaTable
            className="overflow-hidden flex-fill"
            columnDefs={columnDefs}
            rowData={rowData}
            onRowNodeId={(data) => data.rid}
            onRowClicked={handleRowClicked}
            loading={loading}
            total={total}
            page={search.page}
            size={search.size}
            onChangeSearchOption={handleChangeSearchOption}
            preventRowClickCell={['sourceName', 'preview', 'register']}
            selected={rcvArticle.rid}
            suppressRefreshCellAfterUpdate
            onAnimationQueueEmpty={handleRowRendered}
        />
    );
};

export default RcvArticleAgGrid;
