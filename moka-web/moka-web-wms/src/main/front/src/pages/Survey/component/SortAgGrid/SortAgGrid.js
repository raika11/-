import React, { useState, useEffect } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import ArticleListModal from '@pages/Article/modals/ArticleListModal';
import { AgGridReact } from 'ag-grid-react';
import { columnDefs } from './SortAgGridColumns';
import ItemRenderer from './ItemRenderer';
import { selectArticleListChange, selectArticleItemChange } from '@store/survey/quiz';

const SortAgGrid = () => {
    const dispatch = useDispatch();
    const [articleListModalState, setArticleListModalState] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [modalArticle, setModalArticle] = useState(null);
    const [, setInstance] = useState(null);

    const { selectArticleList, selectArticleItem } = useSelector((store) => ({
        selectArticleList: store.quiz.selectArticle.list,
        selectArticleItem: store.quiz.selectArticle.item,
    }));

    const handleClickRelationArticleAdd = () => {
        let newItem = {
            contentId: '',
            title: '',
            linkUrl: ``,
        };

        dispatch(selectArticleListChange([...selectArticleList, newItem]));
        dispatch(selectArticleItemChange([...selectArticleItem, newItem]));
    };

    const handleClickArticleAdd = (e) => {
        setModalArticle(e);
    };

    /**
     * ag grid rows 조회
     */
    const getRows = (api) => {
        let displayedRows = [];
        for (let i = 0; i < api.getDisplayedRowCount(); i++) {
            const data = api.getDisplayedRowAtIndex(i).data;
            displayedRows.push(data);
        }
        return displayedRows;
    };

    /**
     * 그리드 onGridReady
     * @param {object} params grid instance
     */
    const handleGridReady = (params) => {
        setInstance(params);
    };

    const handleDragEnd = (params) => {
        const displayedRows = getRows(params.api);
        let list = [];
        let item = [];
        displayedRows.map((e) => {
            list.push(selectArticleList[Number(e.id)]);
            item.push(selectArticleItem[Number(e.id)]);
            return {};
        });

        setTimeout(function () {
            // params.api.refreshCells({ force: true });

            dispatch(selectArticleListChange(list));
            dispatch(selectArticleItemChange(item));
        });

        params.api.refreshCells({ force: true });

        // params.api.applyTransaction({ update: displayedRows });
    };

    const handleDelete = (itemIdex) => {
        // let newList2 = selectArticleList.filter((e, index) => index !== Number(itemIdex));
        // if (newList2.length === 0) {
        //     dispatch(clearSelectArticleList());
        // } else {
        //     dispatch(selectArticleListChange(newList2));
        // }
        // let newList = selectArticleItem.filter((e, index) => index !== Number(itemIdex));
        // dispatch(selectArticleItemChange(newList));
    };

    useEffect(() => {
        if (modalArticle) {
            let newItem = {
                contentId: modalArticle.totalId,
                title: modalArticle.artTitle,
                linkUrl: `https://news.joins.com/article/${modalArticle.totalId}`,
            };

            dispatch(selectArticleListChange([...selectArticleList, newItem]));
            dispatch(selectArticleItemChange([...selectArticleItem, newItem]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalArticle]);

    useEffect(() => {
        const setGridRowData = (data) => {
            setRowData(
                data.map((e, index) => {
                    return {
                        id: index,
                        info: {
                            id: index,
                            delete: handleDelete,
                        },
                    };
                }),
            );
        };

        if (selectArticleList) {
            setRowData([]);
            setGridRowData(selectArticleList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectArticleList]);

    return (
        <>
            <Form.Group>
                <Form.Row>
                    <Col xs={12}>
                        <Form.Group>
                            <Form.Label className="pr-2 mb-0">관련 정보</Form.Label>
                            <Button variant="positive" onClick={() => setArticleListModalState(true)} className="mr-2">
                                기사 검색
                            </Button>
                            <Button variant="positive" onClick={() => handleClickRelationArticleAdd()}>
                                추가
                            </Button>
                        </Form.Group>
                    </Col>
                </Form.Row>
            </Form.Group>
            <Form.Group>
                <Form.Row>
                    <Col xs={12}>
                        <div className="ag-theme-moka-dnd-grid position-relative overflow-hidden flex-fill">
                            <AgGridReact
                                immutableData
                                onGridReady={handleGridReady}
                                rowData={rowData}
                                getRowNodeId={(params) => params.id}
                                columnDefs={columnDefs}
                                localeText={{ noRowsToShow: '편집기사가 없습니다.', loadingOoo: '조회 중입니다..' }}
                                onRowDragEnd={handleDragEnd}
                                animateRows
                                rowDragManaged
                                suppressRowClickSelection
                                suppressMoveWhenRowDragging
                                headerHeight={0}
                                rowHeight={100}
                                frameworkComponents={{ itemRenderer: ItemRenderer }}
                            />
                        </div>
                    </Col>
                </Form.Row>
                <ArticleListModal show={articleListModalState} onHide={() => setArticleListModalState(false)} onRowClicked={handleClickArticleAdd} />
            </Form.Group>
        </>
    );

    // return (
    //     <>
    //         <div className="ag-theme-moka-dnd-grid w-100">
    //             <AgGridReact
    //                 immutableData
    //                 onGridReady={onGridReady}
    //                 rowData={rowData}
    //                 getRowNodeId={(params) => params.item.ordNo}
    //                 columnDefs={columnDefs}
    //                 localeText={{ noRowsToShow: '편집기사가 없습니다.', loadingOoo: '조회 중입니다..' }}
    //                 onRowDragEnd={handleDragEnd}
    //                 animateRows
    //                 rowDragManaged
    //                 suppressRowClickSelection
    //                 suppressMoveWhenRowDragging
    //                 headerHeight={0}
    //                 rowHeight={100}
    //             />
    //         </div>
    //     </>
    // );
};

export default SortAgGrid;
