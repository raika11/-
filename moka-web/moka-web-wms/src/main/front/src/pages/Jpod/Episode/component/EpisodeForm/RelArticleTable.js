import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { MokaTable, MokaInputLabel } from '@components';
import { ARTICLE_URL } from '@/constants';
import columnDefs from './RelArticleTableColumns';
import toast, { messageBox } from '@utils/toastUtil';
import { unescapeHtmlArticle } from '@utils/convertUtil';
import { getDisplayedRows } from '@utils/agGridUtil';
import ArticleListModal from '@pages/Article/modals/ArticleListModal';

/**
 * 관련기사 테이블 (ag-grid)
 */
const RelArticleTable = ({ chnlSeq, epsdSeq, articles, gridInstance, setGridInstance }) => {
    const [show, setShow] = useState(false);

    /**
     * 관련기사 추가
     * @param {object} articleData 기사데이터
     */
    const handleAddArticle = (articleData) => {
        const currentRows = getDisplayedRows(gridInstance.api);
        let addData = { id: { chnlSeq, epsdSeq }, relLinkTarget: 'S', ordNo: currentRows.length + 1 };

        // 1. 관련기사는 최대 4개까지만 추가 => 조건이 없음
        // if (currentRows.length > 3) {
        //     messageBox.alert('관련기사는 4개까지 등록 가능합니다.\n현재 기사를 추가하고 싶을 경우, 등록된 다른 관련기사를 삭제해주세요.');
        //     return;
        // }

        if (articleData) {
            // 2. 동일한 기사 체크
            if (currentRows.filter((a) => a.id?.totalId === articleData.totalId).length > 0) {
                messageBox.alert('이미 등록된 기사입니다.');
                return;
            }
            addData.id = { chnlSeq, epsdSeq, totalId: articleData.totalId };
            addData.relLink = `${ARTICLE_URL}${articleData.totalId}`;
            addData.relTitle = unescapeHtmlArticle(articleData.artTitle);
        }

        // 3. 기사 추가
        gridInstance.api.applyTransaction({
            add: [addData],
        });

        if (articleData) toast.success('등록하였습니다.');
    };

    return (
        <React.Fragment>
            <div className="mb-10 d-flex">
                <MokaInputLabel label="관련 정보" as="none" />

                {/* 기사 추가 */}
                <Button variant="searching" className="mr-1" onClick={() => setShow(true)}>
                    기사 검색
                </Button>
                <ArticleListModal show={show} onHide={() => setShow(false)} onRowClicked={handleAddArticle} setGridInstance={setGridInstance} />

                {/* row 추가 */}
                <Button variant="positive" onClick={() => handleAddArticle(null)}>
                    추가
                </Button>
            </div>

            <MokaTable
                dragStyle
                header={false}
                animateRows
                rowDragManaged
                rowHeight={92}
                rowData={articles}
                onRowNodeId={(data) => data.ordNo}
                columnDefs={columnDefs}
                paging={false}
                suppressMoveWhenRowDragging
                onRowDragEnd={(params) => params.api.refreshCells({ columns: ['ordNo'], force: true })}
                setGridInstance={setGridInstance}
            />
        </React.Fragment>
    );
};

export default RelArticleTable;
