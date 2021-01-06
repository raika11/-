import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MokaModal, MokaTable } from '@components';
import { getArticleHistoryList, clearHistory, GET_ARTICLE_HISTORY_LIST } from '@store/article';
import { getMasterCodeList } from '@store/code';
import columnDefs from './ArticleHistoryModalColumns';

/**
 * 기사 작업정보 모달
 */
const ArticleHistoryModal = (props) => {
    const { show, onHide, totalId } = props;
    const dispatch = useDispatch();
    const historyList = useSelector(({ article }) => article.history.list);
    const loading = useSelector(({ loading }) => loading[GET_ARTICLE_HISTORY_LIST]);
    const masterCodeList = useSelector((store) => store.code.master.list);
    const [rowData, setRowData] = useState([]);

    const handleHide = () => {
        dispatch(clearHistory());
        onHide();
    };

    useEffect(() => {
        // 마스터코드 조회
        if (show && !masterCodeList) {
            dispatch(getMasterCodeList());
        }
    }, [dispatch, masterCodeList, show]);

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
            historyList.map((hist) => {
                const masterCodeText = hist.masterCodeList
                    .split(',')
                    .filter((code) => code !== '')
                    .reduce((fullText, code) => {
                        if (masterCodeList) {
                            const result = masterCodeList.find((m) => m.masterCode === code);
                            return fullText === '' ? `[${result.masterCode}]${result.contentKorname}` : `${fullText},[${result.masterCode}]${result.contentKorname}`;
                        }
                    }, '');

                return {
                    ...hist,
                    title: `${hist.artTitle}\n${hist.artSubTitle}`,
                    masterCodeText,
                };
            }),
        );
    }, [historyList, masterCodeList]);

    return (
        <MokaModal size="lg" width={900} height={650} show={show} onHide={handleHide} title="작업정보" bodyClassName="overflow-y-hidden h-100" centered>
            <MokaTable headerHeight={50} loading={loading} rowData={rowData} columnDefs={columnDefs} onRowNodeId={(data) => data.seqNo} paging={false} className="h-100" />
        </MokaModal>
    );
};

export default ArticleHistoryModal;
