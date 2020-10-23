import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import columnDefs from './TemplateAgGridColumns';

import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { MokaTable, MokaIcon, MokaThumbTable } from '@components';
import { GET_TEMPLATE_LIST, getTemplateList, changeSearchOption } from '@store/template/templateAction';
import CopyModal from './modals/CopyModal';

/**
 * 템플릿 AgGrid 컴포넌트
 */
const TemplateAgGrid = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    //state
    const [listType, setListType] = useState('list');
    const [rowData, setRowData] = useState([]);
    const [copyModalShow, setCopyModalShow] = useState(false);
    const [copyModalData, setCopyModalData] = useState({});

    const { total, list, search, loading, template } = useSelector((store) => ({
        total: store.template.total,
        list: store.template.list,
        search: store.template.search,
        loading: store.loading[GET_TEMPLATE_LIST],
        template: store.template.template,
    }));

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getTemplateList(changeSearchOption(temp)));
        },
        [dispatch, search],
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

    useEffect(() => {
        if (list.length > 0) {
            setRowData(
                list.map((data) => ({
                    ...data,
                    id: data.templateSeq,
                    name: data.templateName,
                    thumb: data.templateThumb,
                })),
            );
        } else {
            setRowData([]);
        }
    }, [list]);

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
                    rowData={rowData}
                    onRowNodeId={(template) => template.templateSeq}
                    onRowClicked={handleRowClicked}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onChangeSearchOption={handleChangeSearchOption}
                    preventRowClickCell={['delete']}
                    selected={template.templateSeq}
                />
            )}
            {listType === 'thumbnail' && (
                <MokaThumbTable
                    tableHeight={501}
                    rowData={rowData}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onChangeSearchOption={handleChangeSearchOption}
                    onClick={handleRowClicked}
                    menus={[
                        {
                            title: '복사본 생성',
                            onClick: (data) => {
                                setCopyModalData(data);
                                setCopyModalShow(true);
                            },
                        },
                        {
                            title: '삭제',
                        },
                    ]}
                />
            )}

            {/* 복사본 생성 Modal */}
            <CopyModal show={copyModalShow} onHide={() => setCopyModalShow(false)} template={copyModalData} />
        </>
    );
};

export default TemplateAgGrid;
