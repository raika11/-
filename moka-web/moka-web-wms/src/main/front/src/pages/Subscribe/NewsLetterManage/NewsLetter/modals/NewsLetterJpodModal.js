import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaSearchInput } from '@/components';
import RelJpodAgGrid from '../components/RelJpodAgGrid';
import { initialState, getChnlList, clearStore } from '@store/jpod';

/**
 * 뉴스레터 관리 > 뉴스레터 목록 > JPOD 채널 선택 모달
 */
const NewsLetterJpodModal = ({ show, onHide, onRowSelected }) => {
    const dispatch = useDispatch();
    const storeSearch = useSelector(({ jpod }) => jpod.channel.search);
    const [search, setSearch] = useState(initialState.channel.search);
    const [rowSelected, setRowSelected] = useState(null);

    /**
     * 선택
     */
    const handleClickSelect = () => {
        if (rowSelected) {
            onRowSelected(rowSelected);
        }
        onHide();
    };

    useEffect(() => {
        let ns = {
            ...search,
            usedYn: 'Y',
        };
        if (show) {
            dispatch(getChnlList({ search: ns }));
        } else {
            dispatch(clearStore());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, dispatch]);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    return (
        <MokaModal
            size="lg"
            width={800}
            height={800}
            show={show}
            onHide={onHide}
            bodyClassName="d-flex flex-column"
            title="J팟 채널 검색"
            buttons={[
                { text: '선택', variant: 'positive', onClick: handleClickSelect },
                { text: '취소', variant: 'negative', onClick: () => onHide() },
            ]}
            draggable
        >
            <hr className="divider" />
            <Form className="mb-14" onSubmit={(e) => e.preventDefault()}>
                <MokaSearchInput
                    className="flex-fill"
                    placeholder="채널명을 입력하세요"
                    value={search.keyword}
                    onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
                />
            </Form>
            <RelJpodAgGrid show={show} onHide={onHide} setRowSelected={setRowSelected} />
        </MokaModal>
    );
};

export default NewsLetterJpodModal;
