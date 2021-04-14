import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';
import { initialState, changeBannedsSearchOption, getCommentsBlocks } from '@store/commentManage';
import CommentBlockModal from '@pages/CommentManage/CommentModal/CommentBlockModal';
import { messageBox } from '@utils/toastUtil';

// 2021-01-25 09:41 추후에 구분값 정리 필요.
export const blockIpReason = [
    {
        name: `차단 IP`,
        value: `tagValue`,
    },
    {
        name: `차단 내용`,
        value: `tagDesc`,
    },
    {
        name: `등록자 ID`,
        value: `memberId`,
    },
    {
        name: `등록자`,
        value: `memberNm`,
    },
];

export const blockUserReason = [
    {
        name: `차단 ID`,
        value: `tagValue`,
    },
    {
        name: `차단 내용`,
        value: `tagDesc`,
    },
    {
        name: `등록자 ID`,
        value: `memberId`,
    },
    {
        name: `등록자`,
        value: `memberNm`,
    },
];

export const blockWordReason = [
    {
        name: `금지어`,
        value: `tagValue`,
    },
    {
        name: `차단 내용`,
        value: `tagDesc`,
    },
    {
        name: `등록자 ID`,
        value: `memberId`,
    },
    {
        name: `등록자`,
        value: `memberNm`,
    },
];

/**
 * 댓글 관리 > 차단 목록 검색
 */
const BannedListSearch = ({ match }) => {
    const dispatch = useDispatch();

    // 차단 등록 모달 에 전달 할 값
    const [modalUsage, setModalUsage] = useState('');
    // 스토어 연결
    const { pageGubun, storeSearch, COMMENT_SITE_CODE, COMMENT_TAG_DIV_CODE } = useSelector(
        (store) => ({
            COMMENT_SITE_CODE: store.comment.common.COMMENT_SITE_CODE,
            COMMENT_TAG_DIV_CODE: store.comment.common.COMMENT_TAG_DIV_CODE,
            pageGubun: store.comment.banneds.pageGubun,
            storeSearch: store.comment.banneds.commentsBlocks.search,
        }),
        shallowEqual,
    );

    const [searchData, setSearchData] = useState(initialState.banneds.commentsBlocks.search);
    const [defaultInputModalState, setDefaultInputModalState] = useState(false);

    /**
     * 데이터 변경
     */
    const handleChangeSearchInput = (e) => {
        const { name, value } = e.target;
        setSearchData({
            ...searchData,
            [name]: value,
        });
    };

    /**
     * 검색
     */
    const handleClickSearchButton = () => {
        dispatch(getCommentsBlocks(changeBannedsSearchOption({ ...searchData, page: 0 })));
    };

    const handleOnClickMemoryButton = () => {
        messageBox.alert('서비스 준비 중입니다.');
    };

    const handleOnClickApplyButton = () => {
        messageBox.alert('서비스 준비 중입니다.');
    };

    useEffect(() => {
        // 페이지 구분값이 변경 되었을때 모달에 전달할 구분값 업데이트.
        setModalUsage(pageGubun);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageGubun]);

    useEffect(() => {
        // 최초 로딩시 URL 구분 값으로 검색 옵션(차단 리스트 에 필요한 구분값) 설정 및 목록 가지고 오기.
        const initStoreSearch = (pathname) => {
            let tagtype = '';

            if (pathname === '/banned-id') {
                tagtype = 'U';
            } else if (pathname === '/banned-ip') {
                tagtype = 'I';
            } else if (pathname === '/banned-word') {
                tagtype = 'W';
            }

            setModalUsage(tagtype);

            dispatch(getCommentsBlocks(changeBannedsSearchOption({ ...searchData, tagType: tagtype })));
        };

        initStoreSearch(match.path);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setSearchData(storeSearch);
    }, [storeSearch]);

    return (
        <Form className="mb-14">
            {/* 차단 IP 관리 일 경우 */}
            {pageGubun === 'I' && (
                <>
                    <div className="mr-2 d-inline-block" style={{ width: 140 }}>
                        <MokaInput as="select" value={searchData.tagDiv} onChange={handleChangeSearchInput} name="tagDiv" id="tagDiv">
                            <option value="">전체</option>
                            {COMMENT_TAG_DIV_CODE &&
                                COMMENT_TAG_DIV_CODE.map((item, index) => (
                                    <option key={index} value={item.dtlCd}>
                                        {item.cdNm}
                                    </option>
                                ))}
                        </MokaInput>
                    </div>
                    <div className="mr-2 d-inline-block" style={{ width: 140 }}>
                        <MokaInput as="select" value={searchData.searchType} onChange={handleChangeSearchInput} name="searchType" id="searchType">
                            <option value="">전체</option>
                            {blockIpReason.map((media, index) => (
                                <option key={index} value={media.value}>
                                    {media.name}
                                </option>
                            ))}
                        </MokaInput>
                    </div>
                </>
            )}
            {/* 차단 ID 관리 일 경우 */}
            {pageGubun === 'U' && (
                <>
                    <div className="mr-2 d-inline-block" style={{ width: 140 }}>
                        <MokaInput as="select" value={searchData.media} onChange={handleChangeSearchInput} name="media" id="media">
                            <option value="">전체계정</option>
                            {COMMENT_SITE_CODE &&
                                COMMENT_SITE_CODE.map((item, index) => (
                                    <option key={index} value={item.dtlCd}>
                                        {item.cdNm}
                                    </option>
                                ))}
                        </MokaInput>
                    </div>
                    <div className="mr-2 d-inline-block" style={{ width: 140 }}>
                        <MokaInput as="select" value={searchData.tagDiv} onChange={handleChangeSearchInput} name="tagDiv" id="tagDiv">
                            <option value="">전체</option>
                            {COMMENT_TAG_DIV_CODE &&
                                COMMENT_TAG_DIV_CODE.map((item, index) => (
                                    <option key={index} value={item.dtlCd}>
                                        {item.cdNm}
                                    </option>
                                ))}
                        </MokaInput>
                    </div>
                    <div className="mr-2 d-inline-block" style={{ width: 140 }}>
                        <MokaInput as="select" value={searchData.searchType} onChange={handleChangeSearchInput} name="searchType" id="searchType">
                            <option value="">전체</option>
                            {blockUserReason.map((media, index) => (
                                <option key={index} value={media.value}>
                                    {media.name}
                                </option>
                            ))}
                        </MokaInput>
                    </div>
                </>
            )}
            {/* 차단 금지어 관리 일 경우 */}
            {pageGubun === 'W' && (
                <>
                    <div className="mr-2 d-inline-block" style={{ width: 140 }}>
                        <MokaInput as="select" value={searchData.tagDiv} onChange={handleChangeSearchInput} name="tagDiv" id="tagDiv">
                            <option value="">전체</option>
                            {COMMENT_TAG_DIV_CODE &&
                                COMMENT_TAG_DIV_CODE.map((item, index) => (
                                    <option key={index} value={item.dtlCd}>
                                        {item.cdNm}
                                    </option>
                                ))}
                        </MokaInput>
                    </div>
                    <div className="mr-2 d-inline-block" style={{ width: 140 }}>
                        <MokaInput as="select" value={searchData.searchType} onChange={handleChangeSearchInput} name="searchType" id="searchType">
                            <option value="">전체</option>
                            {blockWordReason.map((media, index) => (
                                <option key={index} value={media.value}>
                                    {media.name}
                                </option>
                            ))}
                        </MokaInput>
                    </div>
                </>
            )}
            {/* 키워드 및 검색 버튼 */}
            <div className="mr-2 d-inline-block">
                <MokaSearchInput value={searchData.keyword} onChange={handleChangeSearchInput} onSearch={handleClickSearchButton} name="keyword" />
            </div>
            <div className="d-inline-block float-right">
                <Button variant="positive" onClick={() => setDefaultInputModalState(true)}>
                    등록
                </Button>
                {/* <Button variant="positive" className="mr-1" onClick={handleOnClickApplyButton}>
                    적용하기
                </Button>
                <Button variant="negative" onClick={handleOnClickMemoryButton}>
                    메모리
                </Button> */}
            </div>
            <CommentBlockModal
                modalUsage={modalUsage}
                show={defaultInputModalState}
                onHide={() => {
                    setDefaultInputModalState(false);
                }}
            />
        </Form>
    );
};

export default BannedListSearch;
