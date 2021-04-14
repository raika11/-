import React, { useState, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MokaInput, MokaModal, MokaSearchInput, MokaTable } from '@/components';

/**
 * 뉴스레터 관리 > 뉴스레터 목록 > 패키지 검색 모달
 */
const NewsLetterPackageModal = ({ show, onHide }) => {
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
            title="패키지 검색"
            buttons={[
                { text: '선택', variant: 'positive' },
                { text: '취소', variant: 'negative', onClick: () => onHide() },
            ]}
            draggable
        >
            <hr className="divider" />
            <Form className="mb-14" onSubmit={(e) => e.preventDefault()}>
                <Form.Row>
                    <Col xs={3} clsssName="p-0 pr-2">
                        <MokaInput as="select" disabled>
                            <option>이슈</option>
                        </MokaInput>
                    </Col>
                    <MokaSearchInput className="flex-fill" placeholder="패키지 명을 입력하세요" disabled />
                </Form.Row>
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
                        width: 40,
                    },
                    {
                        headerName: 'ID',
                        field: 'id',
                        width: 50,
                    },
                    {
                        headerName: '연계 패키지',
                        field: 'pkg',
                        flex: 1,
                    },
                    {
                        headerName: '뉴스레터 여부',
                        field: 'letterYn',
                        width: 90,
                    },
                ]}
                rowData={total}
                onRowNodeId={(params) => params.noSeq}
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

export default NewsLetterPackageModal;
