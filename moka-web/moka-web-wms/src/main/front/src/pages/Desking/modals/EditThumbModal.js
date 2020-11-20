import React, { useState } from 'react';
import clsx from 'clsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MokaModal, MokaCardTabs } from '@components';
import { EditThumbSearch, EditThumbTable, EditThumbDropzone } from '../components';

/**
 * 대표이미지 편집 모달 ====> 데스킹워크 저장 후 나중에 작업
 */
const EditThumbModal = (props) => {
    const { show, onHide } = props;
    const [collapse, setCollapse] = useState(true);

    return (
        <MokaModal
            title="대표 이미지 편집"
            show={show}
            onHide={onHide}
            width={1200}
            height={860}
            size="xl"
            buttons={[
                { text: '등록', variant: 'positive' },
                { text: '취소', variant: 'negative' },
            ]}
            bodyClassName="p-0 overflow-x-hidden custom-scroll"
            footerClassName="d-flex justify-content-center"
            draggable
            centered
        >
            <DndProvider backend={HTML5Backend}>
                <MokaCardTabs
                    height={502}
                    className="shadow-none w-100"
                    tabs={[
                        <React.Fragment>
                            <div className="px-3 py-2">
                                <EditThumbSearch />
                                <EditThumbTable />
                            </div>
                        </React.Fragment>,
                    ]}
                    tabNavs={['아카이브', '본문 소재 리스트']}
                    fill
                />
                <div className={clsx('deskthumb-gif-list', 'd-flex', 'justify-content-between', 'overflow-hidden', { collapse: collapse })} style={{ backgroundColor: 'F4F5F6' }}>
                    <div className="deskthumb-main" style={{ width: 202 }}>
                        대표이미지창
                    </div>
                    <EditThumbDropzone collapse={collapse} setCollapse={setCollapse} />
                </div>
            </DndProvider>
        </MokaModal>
    );
};

export default EditThumbModal;
