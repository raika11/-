import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTable, WmsButton } from '~/components';
import { tableColumns } from './components';
import { getComponents, changeSearchOption, getComponent } from '~/stores/component/componentStore';
import style from '~/assets/jss/pages/Component/ComponentStyle';

const useStyles = makeStyles(style);

/**
 * 컴포넌트 리스트 테이블
 */
const ComponentTableContainer = () => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { edit, search, components, total, loading, error } = useSelector(
        ({ componentStore, loadingStore }) => ({
            edit: componentStore.edit,
            search: componentStore.search,
            components: componentStore.list,
            total: componentStore.total,
            loading: loadingStore['componentStore/GET_COMPONENTS'],
            error: componentStore.error
        })
    );
    const [componentRows, setComponentRows] = useState([]);

    /**
     * row 클릭 콜백
     * @param {object} e 클릭이벤트
     * @param {object} row row정보
     */
    const handleRowClick = (e, row) => {
        history.push(row.link);
        dispatch(getComponent({ componentSeq: row.componentSeq }));
    };

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = (payload) => {
        dispatch(getComponents(changeSearchOption(payload)));
    };

    /**
     * 컴포넌트 추가 버튼
     * @param {object} e 이벤트
     */
    const onAddComponent = () => history.push('/component');

    useEffect(() => {
        if (components) {
            setComponentRows(
                components.map((c) => ({
                    id: String(c.componentSeq),
                    componentSeq: c.componentSeq,
                    componentName: c.componentName,
                    tpZone: c.tpZone,
                    useYn: c.useYn,
                    link: `/component/${c.componentSeq}`
                }))
            );
        }
    }, [components]);

    return (
        <>
            <div className={clsx(classes.listTableButtonGroup, classes.mb8)}>
                <WmsButton color="wolf" onClick={onAddComponent}>
                    <span>컴포넌트 추가</span>
                </WmsButton>
            </div>
            <div className={classes.listTable}>
                <WmsTable
                    columns={tableColumns}
                    rows={componentRows}
                    total={total}
                    page={search.page}
                    size={search.size}
                    onRowClick={handleRowClick}
                    onChangeSearchOption={handleChangeSearchOption}
                    currentId={String(edit.componentSeq)}
                    loading={loading}
                    error={error}
                />
            </div>
        </>
    );
};

export default ComponentTableContainer;
