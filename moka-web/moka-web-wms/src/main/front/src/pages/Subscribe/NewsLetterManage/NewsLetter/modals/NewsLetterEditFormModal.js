import React, { useEffect, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaSearchInput, MokaTable } from '@/components';
import { getEditFormList, GET_EDIT_FORM_LIST, changeSearchOption, clearStore } from '@store/editForm';

/**
 * 뉴스레터 관리 > 뉴스레터 목록 > 편집폼 선택 모달
 */
const NewsLetterEditFormModal = ({ show, onHide }) => {
    const dispatch = useDispatch();
    const { list, total, search, loading } = useSelector(
        (store) => ({
            editForm: store.editForm.editForm,
            list: store.editForm.list,
            total: store.editForm.total,
            search: store.editForm.search,
            loading: store.loading[GET_EDIT_FORM_LIST],
        }),
        shallowEqual,
    );

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = useCallback(
        ({ key, value }) => {
            let temp = { ...search, [key]: value };
            if (key !== 'page') {
                temp['page'] = 0;
            }
            dispatch(getEditFormList(changeSearchOption(temp)));
        },
        [dispatch, search],
    );

    /**
     * 목록 Row클릭
     */
    const handleRowClicked = useCallback((row) => {
        console.log(row);
    }, []);

    useEffect(() => {
        if (show) {
            dispatch(getEditFormList());
        } else {
            dispatch(clearStore());
        }
    }, [show, dispatch]);

    return (
        <MokaModal
            size="md"
            width={600}
            height={800}
            show={show}
            onHide={onHide}
            bodyClassName="d-flex flex-column"
            title="편집폼 검색"
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
                        field: 'formSeq',
                        width: 65,
                    },
                    {
                        headerName: 'ID',
                        field: 'formId',
                        width: 100,
                    },
                    {
                        headerName: 'Form 명',
                        field: 'formName',
                        flex: 1,
                    },
                ]}
                rowData={list}
                onRowNodeId={(params) => params.formSeq}
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

export default NewsLetterEditFormModal;
