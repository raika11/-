import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { MokaInput, MokaModal, MokaSearchInput, MokaTable } from '@/components';

/**
 * 뉴스레터 관리 > 뉴스레터 목록 > 패키지 검색 모달
 */
const NewsLetterPackageModal = () => {
    const [total] = useState(0);
    const [loading] = useState(false);
    const [search] = useState({ page: 1, size: 10 });

    return (
        <MokaModal size="md" width={600} title="패키지 검색">
            <hr className="divider" />
            <Form className="mb-14" onSubmit={(e) => e.preventDefault()}>
                <Form.Row>
                    <MokaInput as="select" disabled>
                        <option>이슈</option>
                    </MokaInput>
                    <MokaSearchInput placeholder="패키지 명을 입력하세요" disabled />
                </Form.Row>
            </Form>
            {/* <MokaTable
                columnDefs={[
                    {
                        headerName: '',
                        field: '',
                        width: 40,
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
                        width: 70,
                    },
                ]}
                rowData={total}
                onRowNodeId={(params) => params.containerSeq}
                agGridHeight={550}
                onRowClicked={handleRowClicked}
                loading={loading}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
            />*/}
        </MokaModal>
    );
};

export default NewsLetterPackageModal;
