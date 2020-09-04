import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { WmsButton, WmsTable } from '~/components';
import { changeSearchOption, getRelations } from '~/stores/component/componentRelationPGStore';
import style from '~/assets/jss/pages/RelationStyle';
import { pageColumns } from '../components/tableColumns';

const useStyles = makeStyles(style);

/**
 * 컴포넌트 관련 페이지
 */
const TemplateRelationPG = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { search, detail, relations, total, loading, error } = useSelector((state) => ({
        search: state.componentRelationPGStore.search,
        detail: state.componentStore.detail,
        relations: state.componentRelationPGStore.list,
        total: state.componentRelationPGStore.total,
        loading: state.loadingStore['componentRelationPGStore/GET_RELATIONS'],
        error: state.componentRelationPGStore.error
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
     * 페이지추가 클릭
     */
    const onAddClick = () => {
        history.push('/page');
    };

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

    // rows 생성
    useEffect(() => {
        if (relations) {
            setRelRows(
                relations.map((t) => ({
                    id: String(t.pageSeq),
                    pageSeq: t.pageSeq,
                    pageName: t.pageName,
                    link: `/page/${t.pageSeq}`,
                    previewUrl: t.pageUrl
                }))
            );
        }
    }, [relations]);

    return (
        <>
            <div className={clsx(classes.button, classes.mb8)}>
                <WmsButton color="wolf" onClick={onAddClick}>
                    <span>페이지 추가</span>
                </WmsButton>
            </div>
            <div className={classes.table}>
                <WmsTable
                    columns={pageColumns}
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

export default TemplateRelationPG;
