import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import columnDefs from './TemplateAgGridColumns';
import Button from 'react-bootstrap/Button';
import { MokaTable, MokaTableTypeButton } from '@components';
import { TemplateThumbTable } from '@pages/Template/components';
import { API_BASE_URL } from '@/constants';
import { GET_TEMPLATE_LIST, getTemplateList, changeSearchOption } from '@store/template';
import CopyModal from './modals/CopyModal';

/**
 * 템플릿 AgGrid 컴포넌트
 */
const TemplateAgGrid = ({ onDelete, match }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    //state
    const [listType, setListType] = useState('list');
    const [rowData, setRowData] = useState([]);
    const [copyModalShow, setCopyModalShow] = useState(false);
    const [copyModalData, setCopyModalData] = useState({});

    const { total, list, search, loading, template, UPLOAD_PATH_URL } = useSelector((store) => ({
        total: store.template.total,
        list: store.template.list,
        search: store.template.search,
        loading: store.loading[GET_TEMPLATE_LIST],
        template: store.template.template,
        UPLOAD_PATH_URL: store.app.UPLOAD_PATH_URL,
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

    /**
     * 등록버튼
     */
    const handleClickAdd = useCallback(() => {
        history.push(`${match.path}/add`);
    }, [history, match.path]);

    useEffect(() => {
        if (list.length > 0) {
            setRowData(
                list.map((data) => {
                    let thumb = data.templateThumb;
                    if (thumb && thumb !== '') {
                        thumb = `${API_BASE_URL}${UPLOAD_PATH_URL}/${thumb}`;
                    }
                    return {
                        ...data,
                        id: data.templateSeq,
                        name: data.templateName,
                        thumb,
                        onDelete,
                    };
                }),
            );
        } else {
            setRowData([]);
        }
    }, [UPLOAD_PATH_URL, list, onDelete]);

    return (
        <>
            {/* 버튼 그룹 */}
            <div className="d-flex mb-10">
                <MokaTableTypeButton
                    onSelect={(selectedKey) => {
                        setListType(selectedKey);
                    }}
                />
                <div className="pt-0">
                    <Button variant="positive" onClick={handleClickAdd}>
                        템플릿 등록
                    </Button>
                </div>
            </div>

            {/* ag-grid table */}
            {listType === 'list' && (
                <MokaTable
                    className="overflow-hidden flex-fill"
                    columnDefs={columnDefs}
                    rowData={rowData}
                    onRowNodeId={(template) => template.templateSeq}
                    onRowClicked={handleRowClicked}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    displayPageNum={3}
                    onChangeSearchOption={handleChangeSearchOption}
                    preventRowClickCell={['delete']}
                    selected={template.templateSeq}
                />
            )}
            {listType === 'thumbnail' && (
                <TemplateThumbTable
                    className="overflow-hidden flex-fill"
                    rowData={rowData}
                    loading={loading}
                    total={total}
                    page={search.page}
                    size={search.size}
                    displayPageNum={3}
                    onChangeSearchOption={handleChangeSearchOption}
                    onClick={handleRowClicked}
                    selected={template.templateSeq}
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
                            onClick: onDelete,
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
