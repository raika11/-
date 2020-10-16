import React, { useState } from 'react';

import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import { MokaIcon } from '@components';
import { MokaTemplateThumbCard } from '@/components/MokaCard';
import template from '../Page/template.json';

/**
 * 템플릿 AgGrid 컴포넌트
 */
const TemplateAgGrid = () => {
    const [listType, setListType] = useState('thumb');
    // 템플릿 데이터 api로 변경
    const list = template.resultInfo.body.list;

    return (
        <>
            {/* 버튼 그룹 */}
            <div className="d-flex mb-10">
                <Nav as={ButtonGroup} size="sm" className="mr-auto" defaultActiveKey={listType}>
                    <Nav.Link eventKey="list" as={Button} variant="gray150" onClick={() => setListType('list')}>
                        <MokaIcon iconName="fal-th-list" />
                    </Nav.Link>
                    <Nav.Link eventKey="thumb" as={Button} variant="gray150" onClick={() => setListType('thumb')}>
                        <MokaIcon iconName="fal-th-list" />
                    </Nav.Link>
                </Nav>
                <div className="pt-0">
                    <Button variant="dark">템플릿 추가</Button>
                </div>
            </div>

            {/* ag-grid table */}
            <div className="border custom-scroll" style={{ height: 564 }}>
                {listType === 'thumb' && (
                    <div className="d-flex flex-wrap align-content-start p-05 h-100 custom-scroll overflow-y-scroll">
                        {list.map((thumb) => (
                            <MokaTemplateThumbCard
                                key={thumb.templateSeq}
                                width={176}
                                height={130}
                                data={thumb}
                                img={thumb.templateThumbnail}
                                alt={'썸네일이미지'}
                                menus={[{ title: '복사본 생성' }, { title: '삭제' }]}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default TemplateAgGrid;
