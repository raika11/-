import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { setWmsImgSrc } from '~/utils/imageUtil';
import { WmsTable, WmsThumbnailTable } from '~/components';
import { getTemplates, changeSearchOption } from '~/stores/template/templateStore';
import { tableColumns, TemplateActionMenu, TemplateTableButton } from './components';
import style from '~/assets/jss/pages/Template/TemplateStyle';

const useStyles = makeStyles(style);

/**
 * 템플릿 리스트 테이블
 */
const TemplateTableContainer = () => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { templateData, search, listType, templates, total, loading, error } = useSelector(
        (store) => ({
            templateData: store.templateStore.detail,
            search: store.templateStore.search,
            listType: store.templateStore.listType,
            templates: store.templateStore.list,
            total: store.templateStore.total,
            loading: store.loadingStore['templateStore/GET_TEMPLATES'],
            error: store.templateStore.error
        })
    );
    const [templateRows, setTemplateRows] = useState([]);
    const [actionMenuData, setActionMenuData] = useState(undefined);

    /**
     * row 클릭 콜백
     * @param {object} e 클릭이벤트
     * @param {object} row row정보
     */
    const handleRowClick = (e, row) => history.push(row.link);

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = (payload) => {
        dispatch(getTemplates(changeSearchOption(payload)));
    };

    const onActionBtnClick = (row, anchorRef) => {
        setActionMenuData({ row, anchorRef });
    };

    // 템플릿 rows 생성
    useEffect(() => {
        if (templates) {
            setTemplateRows(
                templates.map((t) => ({
                    id: String(t.templateSeq),
                    servicePlatform: t.servicePlatform,
                    domainId: t.domainId,
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
    }, [templates]);

    return (
        <>
            <div className={clsx(classes.listTableButtonGroup, classes.mb8)}>
                <TemplateTableButton classes={classes} />
            </div>
            <div className={classes.listTable}>
                {listType === 'list' && (
                    <WmsTable
                        columns={tableColumns}
                        rows={templateRows}
                        total={total}
                        page={search.page}
                        size={search.size}
                        onRowClick={handleRowClick}
                        onChangeSearchOption={handleChangeSearchOption}
                        currentId={String(templateData.templateSeq)}
                        loading={loading}
                        error={error}
                    />
                )}
                {listType === 'thumbnail' && (
                    <>
                        <WmsThumbnailTable
                            columns={tableColumns}
                            rows={templateRows}
                            total={total}
                            page={search.page}
                            size={search.size}
                            onRowClick={handleRowClick}
                            onChangeSearchOption={handleChangeSearchOption}
                            onActionBtnClick={onActionBtnClick}
                            currentId={String(templateData.templateSeq)}
                            boxWidth={180}
                            boxHeight={186}
                            loading={loading}
                            error={error}
                        />
                        <TemplateActionMenu data={actionMenuData} setData={setActionMenuData} />
                    </>
                )}
            </div>
        </>
    );
};

export default TemplateTableContainer;
