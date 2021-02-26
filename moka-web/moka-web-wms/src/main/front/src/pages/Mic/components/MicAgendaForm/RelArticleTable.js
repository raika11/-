import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { MokaTable, MokaInputLabel } from '@components';
import columnDefs from './RelArticleTableColumns';
import toast, { messageBox } from '@utils/toastUtil';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import { getDisplayedRows } from '@utils/agGridUtil';
import ArticleListModal from '@pages/Article/modals/ArticleListModal';

/**
 * 관련기사 테이블 (ag-grid)
 */
const RelArticleTable = ({ agenda, gridInstance, setGridInstance }) => {
    const { relArticleList = [] } = agenda;
    const PDS_URL = useSelector(({ app }) => app.PDS_URL);
    const [rowData, setRowData] = useState([]);
    const [show, setShow] = useState(false);

    /**
     * 관련기사 추가
     * @param {object} articleData 기사데이터
     */
    const handleAddArticle = (articleData) => {
        const currentRows = getDisplayedRows(gridInstance.api);

        // 1. 관련기사는 최대 4개까지만 추가
        if (currentRows.length > 3) {
            messageBox.alert('관련기사는 4개까지 등록 가능합니다.\n현재 기사를 추가하고 싶을 경우, 등록된 다른 관련기사를 삭제해주세요.');
            return;
        }

        // 2. 동일한 기사 체크
        // if (relArticleList.filter((a) => a.totalId === articleData.totalId).length > 0) {
        //     messageBox.alert('이미 등록된 기사입니다.');
        //     return;
        // }

        // 3. 기사 추가
        gridInstance.api.applyTransaction({
            add: [
                {
                    totalId: articleData.totalId,
                    agndSeq: agenda.agndSeq,
                    artTitle: unescapeHtmlArticle(articleData.artTitle),
                    artThumb: articleData.artThumb ? `${PDS_URL}${articleData.artThumb}` : null,
                    ordNo: currentRows.length,
                },
            ],
        });
        toast.success('등록하였습니다.');
    };

    /**
     * 드래그 후 ordNo 정렬
     * @param {object} params grid instance
     */
    const handleDragEnd = (params) => {
        const displayedRows = getDisplayedRows(params.api);
        const ordered = displayedRows.map((data, idx) => ({
            ...data,
            ordNo: idx + 1,
        }));
        params.api.applyTransaction({ update: ordered });
    };

    useEffect(() => {
        setRowData(
            relArticleList.map((article, idx) => ({
                ...article,
                artTitle: unescapeHtmlArticle(article.artTitle),
                ordNo: idx,
            })),
        );
    }, [relArticleList]);

    return (
        <React.Fragment>
            <div className="mb-2 d-flex">
                <MokaInputLabel label="관련 정보" as="none" />
                <Button variant="searching" size="sm" onClick={() => setShow(true)}>
                    기사 검색
                </Button>
            </div>

            <MokaTable
                dragStyle
                header={false}
                animateRows
                rowDragManaged
                rowHeight={84}
                rowData={rowData}
                onRowNodeId={(data) => data.ordNo}
                columnDefs={columnDefs}
                paging={false}
                suppressMoveWhenRowDragging
                onDragEnd={handleDragEnd}
                setGridInstance={setGridInstance}
            />

            {/* 관련기사 모달 */}
            <ArticleListModal show={show} onHide={() => setShow(false)} onRowClicked={handleAddArticle} setGridInstance={setGridInstance} />
        </React.Fragment>
    );
};

export default RelArticleTable;
