import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import columnDefs from './TemplateAgGridColumns';

import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { MokaTable, MokaIcon, MokaThumbnailTable } from '@components';
import { GET_TEMPLATE_LIST, getTemplateList, changeSearchOption } from '@store/template/templateAction';

/**
 * 템플릿 AgGrid 컴포넌트
 */
const TemplateAgGrid = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [listType, setListType] = useState('list');
    const { total, list, search, loading } = useSelector((store) => ({
        total: store.template.total,
        list: store.template.list,
        search: store.template.search,
        loading: store.loading[GET_TEMPLATE_LIST],
    }));

    /**
     * 테이블 검색옵션 변경
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = useCallback(
        (payload) => {
            dispatch(getTemplateList(changeSearchOption(payload)));
        },
        [dispatch],
    );

    /**
     * 목록에서 Row클릭
     */
    const handleRowClicked = useCallback(
        (template) => {
            history.push(`/template/${template.templateSeq}`);
        },
        [history],
    );

    return (
        <>
            {/* 버튼 그룹 */}
            <div className="d-flex mb-10">
                <Nav
                    as={ButtonGroup}
                    size="sm"
                    className="mr-auto"
                    defaultActiveKey="list"
                    onSelect={(selectedKey) => {
                        setListType(selectedKey);
                    }}
                >
                    <Nav.Link eventKey="list" as={Button} variant="gray150">
                        <MokaIcon iconName="fal-th-list" />
                    </Nav.Link>
                    <Nav.Link eventKey="thumbnail" as={Button} variant="gray150">
                        <MokaIcon iconName="fal-th-list" />
                    </Nav.Link>
                </Nav>
                <div className="pt-0">
                    <Button variant="dark" onClick={() => history.push('/template')}>
                        템플릿 추가
                    </Button>
                </div>
            </div>

            {/* ag-grid table */}
            {listType === 'list' && (
                <MokaTable
                    agGridHeight={501}
                    columnDefs={columnDefs}
                    rowData={list}
                    onRowNodeId={(template) => template.templateSeq}
                    onRowClicked={handleRowClicked}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onChangeSearchOption={handleChangeSearchOption}
                    preventRowClickCell={['append', 'link']}
                />
            )}
            {listType === 'thumbnail' && (
                <MokaThumbnailTable
                    tableHeight={501}
                    rowData={list}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onChangeSearchOption={handleChangeSearchOption}
                    onClick={handleRowClicked}
                    menus={[
                        {
                            title: '복사본 생성',
                        },
                        {
                            title: '삭제',
                        },
                    ]}
                />
            )}
        </>
    );
};

export default TemplateAgGrid;
