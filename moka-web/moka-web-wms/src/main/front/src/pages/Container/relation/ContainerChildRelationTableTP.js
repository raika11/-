import React, { useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { WmsTable, WmsThumbnailTable } from '~/components';
import style from '~/assets/jss/pages/RelationStyle';
import { setWmsImgSrc } from '~/utils/imageUtil';
import { TemplateDialog, TemplateTableButton, TemplateActionMenu } from '~/pages/Page/components';
import { templateSearchColumns as searchColumns } from '../components';
import { getTemplates as getList } from '~/stores/template/templateStore';

const useStyles = makeStyles(style);

const ContainerChildRelationTableTP = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { search, listType, list, total, error, loading } = useSelector(
        ({ templateStore, loadingStore }) => ({
            search: templateStore.search,
            listType: templateStore.listType,
            list: templateStore.list,
            total: templateStore.total,
            error: templateStore.error,
            loading: loadingStore['templateStore/GET_TEMPLATES']
        })
    );
    const [listRows, setListRows] = useState([]);
    const [selected, setSelected] = useState({ open: false, templateSeq: null, title: null });
    const [actionMenuData, setActionMenuData] = useState(undefined);

    // 목록 로컬화
    useEffect(() => {
        if (list) {
            setListRows(
                list.map((t) => ({
                    id: String(t.templateSeq),
                    servicePlatform: t.servicePlatform,
                    domainName: t.domainName,
                    templateSeq: t.templateSeq,
                    templateName: t.templateName,
                    tpZone: t.tpZone,
                    templateWidth: t.templateWidth,
                    useYn: t.useYn,
                    link: `/template/${t.templateSeq}`,
                    imageSrc: setWmsImgSrc(t.templateThumbnail),
                    title: `${t.templateSeq}_${t.templateName}`,
                    body: t.tpZone,
                    overlayText: t.templateWidth ? `w${t.templateWidth}` : undefined
                }))
            );
        }
    }, [list]);

    // 테이블에서 검색옵션 변경하는 경우(즉시조회)
    const handleTableSearchOption = useCallback(
        (payload) => {
            const option = {
                ...search,
                [payload.key]: payload.value
            };
            dispatch(getList(option));
        },
        [dispatch, search]
    );

    // 테이블에서 Row클릭. 템플릿팝업
    const handleRowClick = useCallback((e, row) => {
        setSelected({ open: true, templateSeq: row.templateSeq, title: row.templateName });
    }, []);

    // 템플릿 팝업 종료
    const handleTemplateClose = useCallback(() => {
        setSelected({ open: false, templateSeq: null, title: null });
    }, []);

    // 썸네일에서 컨텍스트 메뉴 오픈
    const onActionBtnClick = (row, anchorRef) => {
        setActionMenuData({ row, anchorRef });
    };

    return (
        <>
            <div className={clsx(classes.buttonGroup, classes.mb8)}>
                <TemplateTableButton classes={classes} />
            </div>
            <div className={classes.templateTable}>
                {listType === 'list' && (
                    <WmsTable
                        columns={searchColumns}
                        rows={listRows}
                        total={total}
                        page={search.page}
                        size={search.size}
                        onRowClick={handleRowClick}
                        onChangeSearchOption={handleTableSearchOption}
                        // currentId={String(edit.templateSeq)}
                        loading={loading}
                        error={error}
                    />
                )}
                {listType === 'thumbnail' && (
                    <>
                        <WmsThumbnailTable
                            columns={searchColumns}
                            rows={listRows}
                            total={total}
                            page={search.page}
                            size={search.size}
                            onRowClick={handleRowClick}
                            onChangeSearchOption={handleTableSearchOption}
                            onActionBtnClick={onActionBtnClick}
                            // currentId={String(edit.templateSeq)}
                            boxWidth={180}
                            boxHeight={186}
                            loading={loading}
                            error={error}
                        />
                        <TemplateActionMenu data={actionMenuData} setData={setActionMenuData} />
                    </>
                )}
                {/** 템플릿 수정 팝업 */}
                {selected.open && (
                    <TemplateDialog onClose={handleTemplateClose} selected={selected} />
                )}
            </div>
        </>
    );
};

export default ContainerChildRelationTableTP;
