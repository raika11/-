import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { MokaModal, MokaSearchInput, MokaTable } from '@components';
import columnDefs from './ReporterListModalColumns';
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
    onClick: PropTypes.func,
};
const defaultProps = {};

/**
 * 기자 목록 모달
 */
const ReporterListModal = (props) => {
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_REPOTER_LIST]);
    const { list, repotersearch, total } = useSelector(({ columnist }) => ({
        list: columnist.repoter_list.list,
        repotersearch: columnist.repoter_list.search,
        total: columnist.repoter_list.total,
    }));
    const [keyword, setKeyword] = useState('');
    const [rowData, setRowData] = useState([]);

    /**
     * 입력값 변경
     * @param {object} e 이벤트
     */
    const handleChangeValue = (e) => {
        setKeyword(e.target.value);
    };

    /**
     * 검색
     */
    const handleSearch = () => {
        const temp = { ...repotersearch, keyword };
        setRowData([]);
        dispatch(getRepoterList(changeRepoterSearchOption(temp)));
    };

    /**
     * 테이블 페이징 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...repotersearch, keyword, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }

        // 기존 리스트 초기화
        setRowData([]);
        dispatch(getRepoterList(changeRepoterSearchOption(temp)));
        //FIXME: 에러 처리는 어떻게 할지?
    };

    useEffect(() => {
        setRowData(
            list.map((row) => ({
                ...row,
                belong:
                    (row.r1CdNm ? `${row.r1CdNm} / ` : '') + (row.r2CdNm ? `${row.r2CdNm} / ` : '') + (row.r3CdNm ? `${row.r3CdNm} / ` : '') + (row.r4CdNm ? `${row.r4CdNm}` : ''),
                onClick: props.onClick,
            })),
        );
    }, [list, props.onClick]);

    useEffect(() => {
        dispatch(getRepoterList());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MokaModal
            show={props.show}
            onHide={props.onHide}
            title="기자 검색"
            size="xl"
            bodyClassName="overflow-x-hidden custom-scroll"
            footerClassName="d-flex justify-content-center"
            width={970}
            centered
            draggable
        >
            <div className="mb-2">
                <MokaSearchInput value={keyword} onChange={handleChangeValue} onSearch={handleSearch} placeholder="기자 이름을 검색하세요" />
            </div>
            <MokaTable
                agGridHeight={600}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(reporter) => reporter.repSeq}
                onRowClicked={() => {}}
                loading={loading}
                total={total}
                page={repotersearch.page}
                size={repotersearch.size}
                selected={null}
                onChangeSearchOption={handleChangeSearchOption}
            />
        </MokaModal>
    );
};

ReporterListModal.propTypes = propTypes;
ReporterListModal.defaultProps = defaultProps;

export default ReporterListModal;
