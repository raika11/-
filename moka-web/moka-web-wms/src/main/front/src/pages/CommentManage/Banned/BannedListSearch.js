import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { MokaInput, MokaSearchInput } from '@components';
import { initialState, changeBannedsSearchOption, getCommentsBlocks } from '@store/commentManage';
import CommentBlockModal from '@pages/CommentManage/CommentModal/CommentBlockModal';

// 2021-01-25 09:41 추후에 구분값 정리 필요.
export const blockIpReason = [
    {
        name: `차단 IP`,
        value: `A`,
    },
    {
        name: `차단 내용`,
        value: `B`,
    },
    {
        name: `등록자 ID`,
        value: `C`,
    },
    {
        name: `등록자`,
        value: `D`,
    },
];

export const blockUserReason = [
    {
        name: `차단 ID`,
        value: `A`,
    },
    {
        name: `차단 내용`,
        value: `B`,
    },
    {
        name: `등록자 ID`,
        value: `C`,
    },
    {
        name: `등록자`,
        value: `D`,
    },
];

export const blockWordReason = [
    {
        name: `금지어`,
        value: `A`,
    },
    {
        name: `차단 내용`,
        value: `B`,
    },
    {
        name: `등록자 ID`,
        value: `C`,
    },
    {
        name: `등록자`,
        value: `D`,
    },
];

/**
 * 컨테이너 검색 컴포넌트
 */
const BannedListSearch = ({ pathName }) => {
    const dispatch = useDispatch();

    // 차단 등록 모달 에 전달 할 값
    const [modalUsage, setModalUsage] = useState({
        usage: '',
    });

    // 스토어 연결.
    const { pageGubun, search, tagDiv, searchIdTypeList } = useSelector((store) => ({
        tagDiv: store.comment.common.tagDiv,
        pageGubun: store.comment.banneds.pageGubun,
        searchIdTypeList: store.comment.common.searchIdTypeList,
        search: store.comment.banneds.commentsBlocks.search,
    }));

    const [searchData, setSearchData] = useState(initialState.banneds.commentsBlocks.search);
    // 차단 모달 열기 닫기.
    const [defaultInputModalState, setDefaultInputModalState] = useState(false);

    // 검색 데이터 변경.
    const handleChangeSearchInput = (e) => {
        const { name, value } = e.target;
        setSearchData({
            ...searchData,
            [name]: value,
        });
    };

    // 검색 버튼 처리.
    const handleClickSearchButton = () => {
        dispatch(changeBannedsSearchOption(searchData));
        dispatch(getCommentsBlocks());
    };

    // 페이지 구분값이 변경 되었을때 모달에 전달할 구분값 업데이트.
    useEffect(() => {
        setModalUsage({
            ...modalUsage,
            usage: pageGubun,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageGubun]);

    // 최초 로딩시 URL 구분 값으로 검색 옵션( 차단 리스트 에 필요한 구분값.) 설정 및 목록 가지고 오기.
    useEffect(() => {
        const initStoreSearch = (pathname) => {
            let tagtype = '';

            if (pathname === '/banned-id') {
                tagtype = 'U';
            } else if (pathname === '/banned-ip') {
                tagtype = 'I';
            } else if (pathname === '/banned-word') {
                tagtype = 'W';
            }

            setModalUsage({
                ...modalUsage,
                usage: tagtype,
            });

            dispatch(
                changeBannedsSearchOption({
                    ...initialState.banneds.commentsBlocks.search,
                    tagType: tagtype,
                }),
            );

            setSearchData(search);
            dispatch(getCommentsBlocks());
        };

        initStoreSearch(pathName);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form className="mb-10">
            {(function () {
                // 차단 IP 관리 일 경우.
                if (pageGubun === 'I') {
                    return (
                        <>
                            <div className="mr-10 d-inline-block" style={{ width: 140 }}>
                                <MokaInput as="select" value={null} onChange={(e) => handleChangeSearchInput(e)} name="tagDiv">
                                    <option value="">전체</option>
                                    {tagDiv.map((item, index) => (
                                        <option key={index} value={item.value}>
                                            {item.name}
                                        </option>
                                    ))}
                                </MokaInput>
                            </div>
                            <div className="mr-10 d-inline-block" style={{ width: 140 }}>
                                <MokaInput as="select" value={null} onChange={(e) => handleChangeSearchInput(e)} name="searchMedia">
                                    {blockIpReason.map((media, index) => (
                                        <option key={index} value={media.id}>
                                            {media.name}
                                        </option>
                                    ))}
                                </MokaInput>
                            </div>
                        </>
                    );
                } else if (pageGubun === 'U') {
                    return (
                        <>
                            <div className="mr-10 d-inline-block" style={{ width: 140 }}>
                                <MokaInput as="select" value={null} onChange={(e) => handleChangeSearchInput(e)} name="searchMedia">
                                    <option value="">전체계정</option>
                                    {searchIdTypeList.map((item, index) => (
                                        <option key={index} value={item.value}>
                                            {item.name}
                                        </option>
                                    ))}
                                </MokaInput>
                            </div>
                            <div className="mr-10 d-inline-block" style={{ width: 140 }}>
                                <MokaInput as="select" value={null} onChange={(e) => handleChangeSearchInput(e)} name="searchMedia">
                                    <option value="">전체</option>
                                    {tagDiv.map((item, index) => (
                                        <option key={index} value={item.value}>
                                            {item.name}
                                        </option>
                                    ))}
                                </MokaInput>
                            </div>
                            <div className="mr-10 d-inline-block" style={{ width: 140 }}>
                                <MokaInput as="select" value={null} onChange={(e) => handleChangeSearchInput(e)} name="searchMedia">
                                    <option value="">전체</option>
                                    {blockUserReason.map((media, index) => (
                                        <option key={index} value={media.id}>
                                            {media.name}
                                        </option>
                                    ))}
                                </MokaInput>
                            </div>
                        </>
                    );
                } else if (pageGubun === 'W') {
                    return (
                        <>
                            <div className="mr-10 d-inline-block" style={{ width: 140 }}>
                                <MokaInput as="select" value={null} onChange={(e) => handleChangeSearchInput(e)} name="searchMedia">
                                    <option value="">전체</option>
                                    {tagDiv.map((item, index) => (
                                        <option key={index} value={item.value}>
                                            {item.name}
                                        </option>
                                    ))}
                                </MokaInput>
                            </div>
                            <div className="mr-10 d-inline-block" style={{ width: 140 }}>
                                <MokaInput as="select" value={null} onChange={(e) => handleChangeSearchInput(e)} name="searchMedia">
                                    <option value="">전체</option>
                                    {blockWordReason.map((media, index) => (
                                        <option key={index} value={media.id}>
                                            {media.name}
                                        </option>
                                    ))}
                                </MokaInput>
                            </div>
                        </>
                    );
                }
            })()}

            {/* 키워드 및 검색 버튼 */}
            <div className="mr-10 d-inline-block">
                <MokaSearchInput value={searchData.keyword} onChange={(e) => handleChangeSearchInput(e)} onSearch={() => handleClickSearchButton()} name="keyword" />
            </div>
            <div className="d-inline-block float-right">
                <Button variant="positive" className="mr-2" onClick={() => setDefaultInputModalState(true)}>
                    차단등록
                </Button>
                <Button variant="negative" className="mr-2" onClick={() => setDefaultInputModalState(true)}>
                    적용하기
                </Button>
                <Button variant="negative" className="mr-2" onClick={() => setDefaultInputModalState(true)}>
                    메모리
                </Button>
            </div>
            {defaultInputModalState && (
                <CommentBlockModal
                    ModalUsage={modalUsage}
                    show={defaultInputModalState}
                    onHide={() => {
                        setDefaultInputModalState(false);
                    }}
                />
            )}
        </Form>
    );
};

export default BannedListSearch;
