import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import { MokaModal, MokaSearchInput, MokaTable } from '@components';
import { columnDefs } from './RepoterlistModalAgGridColumns';
import { MODAL_PAGESIZE_OPTIONS } from '@/constants';
import { GET_REPOTER_LIST, getRepoterList, changeRepoterSearchOption } from '@store/columnist';

const propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    /**
     * 등록 버튼 클릭
     * @param {object} template 선택한 데이터셋데이터
     */
    onClickSave: PropTypes.func,
    /**
     * 취소 버튼 클릭
     */
    onClickCancle: PropTypes.func,
    /**
     * 선택된 데이터셋아이디
     */
    selected: PropTypes.number,

    onClick: PropTypes.func,
};
const defaultProps = {};

/**
 * 데이터셋 리스트 공통 모달
 */
const RepoterlistModal = (props) => {
    const dispatch = useDispatch();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [rowData, setRowData] = useState([]);

    const { loading, list, repotersearch, total } = useSelector((store) => ({
        loading: store.loading[GET_REPOTER_LIST],
        list: store.columnist.repoter_list.list,
        repotersearch: store.columnist.repoter_list.search,
        total: store.columnist.repoter_list.total,
    }));

    // 검색어 스테이트 설정
    const handleChangeValue = (e) => {
        setSearchKeyword(e.target.value);
    };

    // 검색 버튼 클릭 과 테이블 페이징 번호 클릭시.
    const handleSearch = ({ key, value }) => {
        let temp = {};

        // FIXME: 페이징 처리 변수 외에 다른 변수가 넘어올 일이 있나?
        if (key !== undefined && key === 'page' && value > 0) {
            temp = { ...repotersearch, page: value };
        } else {
            temp = { ...repotersearch, keyword: searchKeyword };
        }

        // 기존 리스트 초기화
        setRowData([]);
        dispatch(getRepoterList(changeRepoterSearchOption(temp)));
        //FIXME: 에러 처리는 어떻게 할지?
    };

    // 기자 검색 리스트 클릭.
    // 부모창 값 전달.
    const handleSearchRowClick = (repoterData) => {
        props.onClick(repoterData);
    };

    // store 변경 되었을떄.
    useEffect(() => {
        setRowData(list);
    }, [list]);

    // 최초 로딩이 리스트 가지고 오기.
    useEffect(() => {
        dispatch(getRepoterList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <MokaModal show={props.show} onHide={props.onHide} title="기자 검색" size="xl" footerClassName="justify-content-center" width={970} draggable>
            <Form.Row>
                <Col xs={7} className="p-0 mb-2">
                    <MokaSearchInput value={searchKeyword} onChange={handleChangeValue} onSearch={handleSearch} placeholder="기자 이름을 검색하세요" />
                </Col>
            </Form.Row>
            <MokaTable
                agGridHeight={600}
                getRowHeight={40}
                error={null}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(reporter) => reporter.id}
                onRowClicked={handleSearchRowClick}
                loading={loading}
                total={total}
                page={repotersearch.page}
                size={0}
                selected={null}
                pageSizes={MODAL_PAGESIZE_OPTIONS}
                onChangeSearchOption={handleSearch}
            />
        </MokaModal>
    );
};

RepoterlistModal.propTypes = propTypes;
RepoterlistModal.defaultProps = defaultProps;

export default RepoterlistModal;
