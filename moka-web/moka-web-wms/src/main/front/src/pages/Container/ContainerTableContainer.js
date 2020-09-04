import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { WmsTable, WmsButton } from '~/components';
import { tableColumns } from './components';
import TemplateStyle from '~/assets/jss/pages/Container/ContainerStyle';
import {
    clearContainer,
    getContainerList,
    getContainer,
    insertContainer
} from '~/stores/container/containerStore';

const useStyles = makeStyles(TemplateStyle);

const ContainerTableContainer = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const latestDomainId = useSelector((store) => store.authStore.latestDomainId);
    const { search, list, total, error, loading, latestContainerSeq } = useSelector(
        ({ containerStore, loadingStore }) => ({
            search: containerStore.search,
            list: containerStore.list,
            total: containerStore.total,
            error: containerStore.error,
            loading: loadingStore['containerStore/GET_CONTAINER_LIST'],
            latestContainerSeq: containerStore.latestContainerSeq
        })
    );
    const [listRows, setListRows] = useState([]);

    useEffect(() => {
        return () => {
            dispatch(clearContainer());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 컨테이너목록정보 로컬화
    useEffect(() => {
        if (list) {
            setListRows(
                list.map((d) => {
                    return {
                        id: String(d.containerSeq),
                        containerSeq: d.containerSeq,
                        containerName: d.containerName,
                        useYn: d.useYn,
                        link: `/container/${d.containerSeq}`
                    };
                })
            );
        }
    }, [list]);

    // row 클릭 콜백
    const handleRowClick = useCallback(
        (e, row) => {
            dispatch(
                getContainer({
                    containerSeq: row.containerSeq,
                    callback: (result) => {
                        if (result) history.push(row.link);
                    }
                })
            );
        },
        [dispatch, history]
    );

    // 테이블에서 검색옵션 변경하는 경우
    const handleChangeSearchOption = useCallback(
        (payload) => {
            const option = {
                ...search,
                [payload.key]: payload.value
            };
            dispatch(getContainerList(option));
        },
        [dispatch, search]
    );

    // 추가 클릭
    const onAddClick = useCallback(() => {
        dispatch(insertContainer({ latestDomainId }));
        history.push('/container');
    }, [dispatch, history, latestDomainId]);

    return (
        <>
            <div className={clsx(classes.listTableButtonGroup, classes.mb8)}>
                <WmsButton color="wolf" onClick={onAddClick}>
                    <span>컨테이너 추가</span>
                </WmsButton>
            </div>
            <WmsTable
                columns={tableColumns}
                rows={listRows}
                total={total}
                page={search.page}
                size={search.size}
                onRowClick={handleRowClick}
                onChangeSearchOption={handleChangeSearchOption}
                currentId={String(latestContainerSeq)}
                loading={loading}
                error={error}
                otherHeight="128"
            />
        </>
    );
};

export default withRouter(ContainerTableContainer);
