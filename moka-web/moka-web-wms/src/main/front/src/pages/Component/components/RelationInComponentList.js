import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import { ITEM_TP, ITEM_DS, ITEM_CP } from '@/constants';
import { MokaCard, MokaTable, MokaInput } from '@components';
import { initialState, GET_RELATION_LIST, getRelationList, changeSearchOption, clearStore } from '@store/relation';
import columnDefs from './RelationInComponentListColumns';

const propTypes = {
    /**
     * relSeq의 타입
     */
    relSeqType: PropTypes.oneOf([ITEM_TP, ITEM_DS]),
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
 * 관련된 상위(부모의) 컴포넌트 리스트
 *
 * 데이터셋 관리 => 도메인 select 추가
 */
const RelationInComponentList = (props) => {
    const { show, relSeqType, relSeq } = props;
    const dispatch = useDispatch();
    const { search: storeSearch, list, total, error } = useSelector(({ relation }) => relation);
    const loading = useSelector(({ loading }) => loading[GET_RELATION_LIST]);
    const { latestDomainId, domainList } = useSelector(({ auth }) => auth);
    const [search, setSearch] = useState(initialState.search);
    const [rowData, setRowData] = useState([]);

    /**
     * 테이블 검색옵션 변경
     */
    const handleChangeSearchOption = ({ key, value }) => {
        let temp = { ...search, [key]: value };
        if (key !== 'page') {
            temp['page'] = 0;
        }
        dispatch(getRelationList(changeSearchOption(temp)));
    };

    /**
     * row의 링크 버튼 클릭
     * @param {object} data 로우 데이터
     */
    const handleClickLink = (data) => {
        window.open(`/component/${data.componentSeq}`);
    };

    useEffect(() => {
        setSearch(storeSearch);
    }, [storeSearch]);

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
                        relType: ITEM_CP,
                        domainId: latestDomainId,
                    }),
                ),
            );
        } else if (!relSeq) {
            dispatch(clearStore());
        }
    }, [show, relSeq, relSeqType, dispatch, latestDomainId]);

    return (
        <MokaCard
            title="관련 컴포넌트"
            titleButtons={[
                {
                    text: '컴포넌트 등록',
                    variant: 'positive',
                    onClick: () => window.open('/component/add'),
                },
            ]}
            bodyClassName="d-flex flex-column"
        >
            {/* 도메인 선택 */}
            {relSeqType === ITEM_DS && (
                <Form.Row className="mb-14">
                    <MokaInput as="select" value={search.domainId || undefined} onChange={(e) => handleChangeSearchOption({ key: 'domainId', value: e.target.value })}>
                        {domainList.map((domain) => (
                            <option key={domain.domainId} value={domain.domainId}>
                                {domain.domainName}
                            </option>
                        ))}
                    </MokaInput>
                </Form.Row>
            )}

            {/* 테이블 */}
            <MokaTable
                className="overflow-hidden flex-fill"
                columnDefs={columnDefs}
                rowData={rowData}
                onRowNodeId={(data) => data.componentSeq}
                onRowClicked={() => {}}
                loading={loading}
                error={error}
                total={total}
                page={search.page}
                size={search.size}
                displayPageNum={3}
                onChangeSearchOption={handleChangeSearchOption}
                preventRowClickCell={['link']}
            />
        </MokaCard>
    );
};

RelationInComponentList.propTypes = propTypes;
RelationInComponentList.defaultProps = defaultProps;

export default RelationInComponentList;
