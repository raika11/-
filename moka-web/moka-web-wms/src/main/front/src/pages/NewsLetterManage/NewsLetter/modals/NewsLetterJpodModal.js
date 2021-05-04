import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { MokaModal, MokaSearchInput } from '@/components';
import JpodAgGrid from '../components/RelJpodAgGrid';
import { getNewsLetterChannelType } from '@store/newsLetter';
import { initialState, getChnlList, clearStore } from '@store/jpod';
import { messageBox } from '@/utils/toastUtil';

/**
 * 뉴스레터 관리 > 뉴스레터 목록 > JPOD 채널 선택 모달
 */
const NewsLetterJpodModal = ({ show, onHide, channelType, onRowClicked }) => {
    const dispatch = useDispatch();
    const storeSearch = useSelector(({ jpod }) => jpod.channel.search);
    const [search, setSearch] = useState(initialState.channel.search);

    /**
     * 검색
     */
    const handleClickSearch = () => {
        let ns = { ...search, page: 0 };
        dispatch(getChnlList({ search: ns }));
    };

    /**
     * 모달 닫기
     */
    const handleClickHide = () => {
        dispatch(clearStore());
        onHide();
    };

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    useEffect(() => {
        if (show && channelType) {
            let ns = { ...search, usedYn: 'Y' };
            dispatch(
                getNewsLetterChannelType({
                    channelType,
                    callback: ({ header, body }) => {
                        if (header.success && body) {
                            dispatch(getChnlList({ search: ns }));
                        } else {
                            messageBox.alert(header.message);
                        }
                    },
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, channelType]);

    return (
        <MokaModal size="md" width={600} height={800} show={show} onHide={handleClickHide} bodyClassName="d-flex flex-column" title="J팟 채널 검색" draggable>
            <Form className="mb-14" onSubmit={(e) => e.preventDefault()}>
                <MokaSearchInput
                    className="flex-fill"
                    placeholder="채널명을 입력하세요"
                    value={search.keyword}
                    onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
                    onSearch={handleClickSearch}
                />
            </Form>
            <JpodAgGrid onHide={onHide} onRowClicked={onRowClicked} />
        </MokaModal>
    );
};

export default NewsLetterJpodModal;
