import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaModal, MokaTable } from '@components';
import { getArticleHistoryList, clearHistory, GET_ARTICLE_HISTORY_LIST } from '@store/article';
import columnDefs from './ArticleHistoryModalColumns';

/**
 * 기사 작업정보 모달
 */
const ArticleHistoryModal = (props) => {
    const { show, onHide, totalId } = props;
    const dispatch = useDispatch();
    const historyList = useSelector(({ article }) => article.history.list);
    const loading = useSelector(({ loading }) => loading[GET_ARTICLE_HISTORY_LIST]);
    const [rowData, setRowData] = useState([]);

    const handleHide = () => {
        dispatch(clearHistory());
        onHide();
    };

    useEffect(() => {
        if (show && totalId) {
            dispatch(
                getArticleHistoryList({
                    search: {
                        totalId,
                    },
                }),
            );
        }
    }, [dispatch, show, totalId]);

    useEffect(() => {
        setRowData(
            historyList.map((hist) => ({
                ...hist,
                title: `${hist.artTitle}\n${hist.artSubTitle}`,
            })),
        );
    }, [historyList]);

    return (
        <MokaModal size="lg" width={800} height={650} show={show} onHide={handleHide} title="작업정보" bodyClassName="overflow-y-hidden h-100" centered draggable>
            <MokaTable headerHeight={50} loading={loading} rowData={rowData} columnDefs={columnDefs} onRowNodeId={(data) => data.seq} paging={false} className="h-100" />
        </MokaModal>
    );
};

export default ArticleHistoryModal;
