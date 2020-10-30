import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { MokaCard, MokaTable } from '@components';
import { initialState, GET_RELATION_LIST, getRelationList, changeSearchOption, clearStore } from '@store/relation';
import columnDefs from './RelationInPageListColums';
import { ITEM_TP, ITEM_CP, ITEM_CT, ITEM_DS } from '@/constants';

const propTypes = {
    /**
     * relSeq의 타입
     */
    relSeqType: PropTypes.oneOf([ITEM_TP, ITEM_CP, ITEM_CT, ITEM_DS]),
    /**
     * relSeq
     */
    relSeq: PropTypes.number,
    /**
     * show === true이면 리스트를 조회한다
     */
    show: PropTypes.bool,
};
const defaultProps = {
    show: true,
};

/**
 * 오른쪽 탭에 들어가는
 * 관련된 상위(부모의) 스킨 리스트
 */
const RelationInSkinList = (props) => {
    const { show, relSeqType, relSeq } = props;
    const history = useHistory();
    const dispatch = useDispatch();

    const { search: storeSearch, list, total, error, loading, latestDomainId } = useSelector((store) => ({
        search: store.relation.search,
        list: store.relation.list,
        total: store.relation.total,
        error: store.relation.error,
        loading: store.loading[GET_RELATION_LIST],
        latestDomainId: store.auth.latestDomainId,
    }));

    // state
    const [search, setSearch] = useState(initialState.search);
    const [rowData, setRowData] = useState([]);

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        dispatch(
            getRelationList(
                changeSearchOption({
                    ...search,
                    [key]: value,
                    page: 0,
                }),
            ),
        );
    };

    /**
     * row의 링크 버튼 클릭
     * @param {object} data row 데이터
     */
    const handleClickLink = (data) => {
        window.open(`/skin/${data.skinSeq}`);
    };

    useEffect(() => {
        setRowData(
            list.map((l) => ({
                ...l,
                handleClickLink,
            })),
        );
    }, [list]);

    useEffect(() => {
        return () => {
            dispatch(clearStore());
        };
    }, [dispatch]);

    useEffect(() => {
        if (show && relSeq) {
            dispatch(
                getRelationList(
                    changeSearchOption({
                        ...initialState.search,
                        relSeq,
                        relSeqType,
                        relType: 'SK',
                        domainId: latestDomainId,
                    }),
                ),
            );
        }
    }, [show, relSeq, relSeqType, dispatch, latestDomainId]);

    return (
        <MokaCard titleClassName="mb-0" title="뷰스킨 검색">
            {/* 버튼 */}
            <div className="d-flex justify-content-end mb-3">
                <Button variant="dark" onClick={() => history.push('/skin')}>
                    뷰스킨 추가
                </Button>
            </div>

            {/* 테이블 */}
            <MokaTable
                agGridHeight={625}
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(data) => data.skinSeq}
                onRowClicked={() => {}}
                loading={loading}
                error={error}
                total={total}
                page={search.page}
                size={search.size}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['preview', 'link']}
            />
        </MokaCard>
    );
};

RelationInSkinList.propTypes = propTypes;
RelationInSkinList.defaultProps = defaultProps;

export default RelationInSkinList;
