import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Nav from 'react-bootstrap/Nav';

import { MokaIcon } from '@components';
import { MokaTemplateThumbCard } from '@/components/MokaCard';

import template from '../template.json';
import TemplateHtmlModal from '../modals/TemplateHtmlModal';

/**
 * 템플릿 검색 ag-grid 컴포넌트
 */

const PageChildTemplateAggrid = () => {
    const list = template.resultInfo.body.list;
    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState({});

    return (
        <>
            {/* 버튼 그룹 */}
            <div className="d-flex mb-10">
                <Nav as={ButtonGroup} size="sm" className="mr-auto" defaultActiveKey="1">
                    <Nav.Link eventKey="1" as={Button} variant="gray150" onClick={() => setShow(false)}>
                        <MokaIcon iconName="fal-th-list" />
                    </Nav.Link>
                    <Nav.Link eventKey="2" as={Button} variant="gray150" onClick={() => setShow(true)}>
                        <MokaIcon iconName="fal-th-list" />
                    </Nav.Link>
                </Nav>
                <div className="pt-0">
                    <Button variant="dark">템플릿 추가</Button>
                </div>
            </div>

            {/* ag-grid table */}
            <div className="tab-content p-0">
                <div className="mb-0 tab-pane fade border custom-scroll active show" style={{ height: '560px' }}>
                    {show && (
                        <div className="d-flex flex-wrap align-content-start p-05">
                            {list.map((thumb) => (
                                <MokaTemplateThumbCard
                                    key={thumb.templateSeq}
                                    width={176}
                                    height={130}
                                    data={thumb}
                                    img={thumb.templateThumbnail}
                                    alt={'썸네일이미지'}
                                    menus={[{ title: '복사본 생성' }, { title: '삭제' }]}
                                    onClick={(template) => {
                                        setShowModal(true);
                                        setSelected(template);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                    <TemplateHtmlModal title={selected.templateName} show={showModal} onHide={() => setShowModal(false)} />
                </div>
            </div>
        </>
    );
};

export default PageChildTemplateAggrid;
