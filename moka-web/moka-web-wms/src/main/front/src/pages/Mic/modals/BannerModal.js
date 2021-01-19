import React, { useState, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaImageInput, MokaInputLabel, MokaModal, MokaTable } from '@/components';
import columnDefs, { rowData } from './BannerModalAgGridColumns';

/**
 * 시민 마이크 다른 주제 공통 배너 모달
 */
const BannerModal = (props) => {
    const { show, onHide } = props;

    const [gridApi, setGridApi] = useState(null);
    const [total] = useState(0);
    const [loading] = useState(false);
    const [search] = useState({ page: 1, size: 10 });
    const [showEdit, setShowEdit] = useState(false);
    const [seqNo, setSeqNo] = useState(null);
    const [link, setLink] = useState('');

    const handleChangeSearchOption = useCallback((search) => console.log(search), []);

    const handleRowClicked = useCallback((row) => {
        setShowEdit(true);
        setSeqNo(row.seqNo);
    }, []);

    const handleClickCancel = () => {
        setShowEdit(false);
    };

    const handleHide = () => {
        setSeqNo(null);
        setShowEdit(false);
        onHide();
    };

    return (
        <MokaModal title="다른 주제 공통 배너 관리" height={800} show={show} onHide={handleHide} size="xl" draggable>
            <Container className="p-0" fluid>
                <Row>
                    <Col className="p-0 custom-scroll d-flex flex-column" style={{ width: 500, height: 695 }}>
                        <div className="mb-2 d-flex justify-content-end">
                            <Button
                                variant="positive"
                                className="ft-12"
                                onClick={() => {
                                    setShowEdit(true);
                                    setSeqNo(null);
                                }}
                            >
                                등록
                            </Button>
                        </div>
                        <MokaTable
                            className="overflow-hidden flex-fill"
                            columnDefs={columnDefs}
                            rowData={rowData}
                            rowHeight={100}
                            onRowNodeId={(params) => params.seqNo}
                            onRowClicked={handleRowClicked}
                            // loading={loading}
                            total={total}
                            page={search.page}
                            size={search.size}
                            // selected={rowData.seqNo}
                            onChangeSearchOption={handleChangeSearchOption}
                            preventRowClickCell={['usedYn']}
                        />
                    </Col>
                    {showEdit === true && (
                        <Col className="p-0 ml-2">
                            <MokaCard
                                title={seqNo ? '공통 배너 수정' : '공통 배너 등록'}
                                titleClassName="mb-0"
                                className="w-100 h-100"
                                footerClassName="justify-content-center"
                                footer
                                footerButtons={[
                                    { text: seqNo ? '수정' : '저장', variant: 'positive', className: 'mr-2' },
                                    { text: '취소', variant: 'negative', onClick: handleClickCancel },
                                ]}
                            >
                                <div className="mb-2 d-flex align-items-end">
                                    <MokaImageInput className="mr-2" width={280} />
                                    <div>
                                        <Button variant="outline-neutral">내 PC</Button>
                                    </div>
                                </div>
                                <MokaInputLabel label="링크 주소" value={link} onChange={(e) => setLink(e.target.value)} />
                            </MokaCard>
                        </Col>
                    )}
                </Row>
            </Container>
        </MokaModal>
    );
};

export default BannerModal;
