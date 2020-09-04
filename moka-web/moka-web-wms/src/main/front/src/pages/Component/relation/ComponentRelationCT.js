import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { WmsButton, WmsTable } from '~/components';
import { changeSearchOption, getRelations } from '~/stores/component/componentRelationCTStore';
import style from '~/assets/jss/pages/RelationStyle';
import { containerColumns } from '../components/tableColumns';

const useStyles = makeStyles(style);

/**
 * 컴포넌트 관련 컨테이너
 */
const ComponentRelationCT = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { search, detail, relations, total, loading, error } = useSelector((state) => ({
        search: state.componentRelationCTStore.search,
        detail: state.componentStore.detail,
        relations: state.componentRelationCTStore.list,
        total: state.componentRelationCTStore.total,
        loading: state.loadingStore['componentRelationCTStore/GET_RELATIONS'],
        error: state.componentRelationCTStore.error
    }));
    const [relRows, setRelRows] = useState([]);

    /**
     * row 클릭 콜백
     * @param {object} e 클릭이벤트
     * @param {object} row row정보
     */
    const handleRowClick = (e, row) => {};

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} newValue 변경된 값
     */
    const handleChangeSearchOption = (newValue) => {
        dispatch(getRelations([changeSearchOption(newValue)]));
    };

    /**
     * 템플릿추가 클릭 콜백
     */
    const onAddClick = () => {};

    // 데이터 로딩
    useEffect(() => {
        if (detail.componentSeq) {
            dispatch(
                getRelations([
                    changeSearchOption({
                        key: 'domainId',
                        value: detail.domain.domainId
                    }),
                    changeSearchOption({
                        key: 'componentSeq',
                        value: detail.componentSeq
                    }),
                    changeSearchOption({
                        key: 'page',
                        value: 0
                    })
                ])
            );
        }
    }, [dispatch, detail]);

    // 템플릿 rows 생성
    useEffect(() => {
        if (relations) {
            setRelRows(
                relations.map((t) => ({
                    id: String(t.containerSeq),
                    containerSeq: t.containerSeq,
                    containerName: t.containerName,
                    link: `/container/${t.containerSeq}`
                }))
            );
        }
    }, [relations]);

    return (
        <>
            <div className={clsx(classes.button, classes.mb8)}>
                <WmsButton color="wolf" className={classes.m0} onClick={onAddClick}>
                    <span>컨테이너 추가</span>
                </WmsButton>
            </div>
            <div className={classes.table}>
                <WmsTable
                    columns={containerColumns}
                    rows={relRows}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onRowClick={handleRowClick}
                    onChangeSearchOption={handleChangeSearchOption}
                    loading={loading}
                    error={error}
                />
            </div>
        </>
    );
};

export default ComponentRelationCT;
