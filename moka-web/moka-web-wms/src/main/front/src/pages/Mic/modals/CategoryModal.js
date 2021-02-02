import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { MokaModal, MokaSearchInput } from '@/components';
import { AgGridReact } from 'ag-grid-react';
import { SAVE_MIC_CATEGORY, saveMicCategory } from '@store/mic';
import toast, { messageBox } from '@utils/toastUtil';
import { REQUIRED_REGEX } from '@utils/regexUtil';
import columnDefs from './CategoryModalAgGridColumns';
import CategoryEditorRenderer from '../components/CategoryEditorRenderer';
import CategorySelectRenderer from '../components/CategorySelectRenderer';

/**
 * 시민 마이크 카테고리 관리 모달
 */
const CategoryModal = (props) => {
    const { show, onHide } = props;
    const dispatch = useDispatch();
    const list = useSelector(({ mic }) => mic.category.list);
    const loading = useSelector(({ loading }) => loading[SAVE_MIC_CATEGORY]);
    const [keyword, setKeyword] = useState('');
    const [rowData, setRowData] = useState([]);
    const [error, setError] = useState(false);
    const [instance, setInstance] = useState(null);

    /**
     * ag grid rows 조회
     */
    const getRows = (api) => {
        let displayedRows = [];
        for (let i = 0; i < api.getDisplayedRowCount(); i++) {
            const data = api.getDisplayedRowAtIndex(i).data;
            displayedRows.push({ ...data, ordNo: i + 1 });
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

    /**
     * 등록
     */
    const handleAdd = () => {
        if (!REQUIRED_REGEX.test(keyword)) {
            setError(true);
            return;
        }

        const displayedRows = getRows(instance.api);

        // 기존 리스트에서 중복 체크
        const duplicated = displayedRows.filter((row) => row.catNm === keyword);
        if (duplicated.length > 0) {
            messageBox.alert('중복된 이름이 있습니다');
            setError(true);
            return;
        }

        dispatch(
            saveMicCategory({
                category: {
                    catNm: keyword,
                    ordNo: displayedRows.length + 1,
                    usedYn: 'Y',
                },
                callback: ({ header, body }) => {
                    if (header.success && body) {
                        toast.success(header.message);
                    } else {
                        messageBox.alert(header.message);
                    }
                },
            }),
        );
    };

    /**
     * 수정
     */
    const handleEdit = () => {
        const displayedRows = getRows(instance.api);

        // 갯수 체크
        if (displayedRows.length < 1) {
            messageBox.alert('변경할 카테고리가 없습니다');
            return;
        }

        // 카테고리명 중복 체크
        const duplicated = new Set(displayedRows.map((row) => row.catNm));
        if (duplicated.length !== displayedRows.length) {
            messageBox.alert('중복된 이름이 있습니다');
            return;
        }

        messageBox.confirm(
            '일괄 수정하시겠습니까?',
            () => {
                dispatch(
                    saveMicCategory({
                        categoryList: displayedRows,
                        callback: ({ header, body }) => {
                            if (header.success && body) {
                                toast.success(header.message);
                            } else {
                                messageBox.alert(header.message);
                            }
                        },
                    }),
                );
            },
            () => {},
        );
    };

    /**
     * 드래그 후 ordNo 정렬
     * @param {object} params grid instance
     */
    const handleDragEnd = (params) => {
        const displayedRows = getRows(params.api);
        params.api.applyTransaction({ update: displayedRows });
    };

    useEffect(() => {
        setRowData(list);
        setKeyword('');
    }, [list]);

    useEffect(() => {
        if (!show) {
            setRowData(list);
            setKeyword('');
        }
    }, [list, show]);

    return (
        <MokaModal
            width={600}
            height={685}
            title="카테고리 관리"
            show={show}
            onHide={onHide}
            loading={loading}
            size="md"
            bodyClassName="d-flex flex-column"
            buttons={[
                { text: '수정', variant: 'positive', onClick: handleEdit },
                { text: '취소', variant: 'negative', onClick: onHide },
            ]}
            centered
        >
            <div className="d-flex mb-2">
                <MokaSearchInput
                    placeholder="카테고리명을 입력하세요"
                    className="mr-2 flex-fill"
                    value={keyword}
                    onChange={(e) => {
                        setKeyword(e.target.value);
                        setError(false);
                    }}
                    isInvalid={error}
                />
                <Button variant="positive" onClick={handleAdd}>
                    등록
                </Button>
            </div>
            <div className="ag-theme-moka-dnd-grid position-relative overflow-hidden flex-fill">
                <AgGridReact
                    rowHeight={45}
                    onGridReady={handleGridReady}
                    immutableData
                    rowData={rowData}
                    getRowNodeId={(data) => data.catSeq}
                    columnDefs={columnDefs}
                    frameworkComponents={{ editor: CategoryEditorRenderer, selector: CategorySelectRenderer }}
                    animateRows
                    rowDragManaged
                    onRowDragEnd={handleDragEnd}
                    suppressRowClickSelection
                    suppressMoveWhenRowDragging
                />
            </div>
            <p className="mt-2 mb-0 color-primary ft-12">※ 현재 페이지를 일괄 수정합니다.</p>
        </MokaModal>
    );
};

export default CategoryModal;
