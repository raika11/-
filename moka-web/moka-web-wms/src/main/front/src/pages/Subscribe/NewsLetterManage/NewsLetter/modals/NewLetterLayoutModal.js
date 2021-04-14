import React, { useState, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaSearchInput, MokaTable } from '@/components';

/**
 * 뉴스레터 관리 > 뉴스레터 목록 > 레이아웃 선택 모달
 */
const NewsLetterLayoutModal = ({ show, onHide }) => {
    const [total] = useState(0);
    const [loading] = useState(false);
    const [search] = useState({ page: 1, size: 10 });

    /**
     * 테이블 검색 옵션 변경
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    /**
     * 목록 Row클릭
     */
    const handleRowClicked = useCallback((row) => {
        console.log(row);
    }, []);

    return (
        <MokaModal
            size="md"
            width={600}
            height={800}
            show={show}
            onHide={onHide}
            bodyClassName="d-flex flex-column"
            title="레이아웃 선택"
            buttons={[
                { text: '선택', variant: 'positive' },
                { text: '취소', variant: 'negative', onClick: () => onHide() },
            ]}
            draggable
        >
            <hr className="divider" />
            <Form className="mb-14" onSubmit={(e) => e.preventDefault()}>
                <MokaSearchInput className="flex-fill" placeholder="검색어를 입력하세요" disabled />
            </Form>
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={[
                    {
                        headerName: '',
                        field: '',
                        width: 35,
                    },
                    {
                        headerName: 'NO',
                        field: 'no',
                        width: 65,
                    },
                    {
                        headerName: 'ID',
                        field: 'id',
                        width: 70,
                    },
                    {
                        headerName: '레이아웃 명',
                        field: 'layoutNm',
                        flex: 1,
                    },
                    {
                        headerName: '위치 그룹',
                        field: 'grp',
                        width: 90,
                    },
                ]}
                rowData={total}
                onRowNodeId={(params) => params.seq}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </MokaModal>
    );
};

export default NewsLetterLayoutModal;
