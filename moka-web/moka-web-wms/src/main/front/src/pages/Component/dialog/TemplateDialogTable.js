import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { setWmsImgSrc } from '~/utils/imageUtil';
import { WmsTable, WmsThumbnailTable } from '~/components';
import { getTemplates, changeSearchOption } from '~/stores/template/templateStore';
import { templateColumns } from './dialogColumns';
import style from '~/assets/jss/pages/DialogStyle';
import { POP_PAGESIZE_OPTIONS, POP_DISPLAY_PAGE_NUM } from '~/constants';

const useStyle = makeStyles(style);

const TemplateDialogTable = (props) => {
    const { templateSeq, setTemplateSeq, setTemplateName, setTemplateGroupName } = props;
    const classes = useStyle();
    const dispatch = useDispatch();
    const { edit, search, listType, templates, total, loading, error } = useSelector((store) => ({
        edit: store.componentStore.edit,
        search: store.templateStore.search,
        listType: store.templateStore.listType,
        templates: store.templateStore.list,
        total: store.templateStore.total,
        loading: store.loadingStore['templateStore/GET_TEMPLATES'],
        error: store.templateStore.error
    }));
    const [templateRows, setTemplateRows] = useState([]);

    // 템플릿 rows 생성
    useEffect(() => {
        if (templates) {
            setTemplateRows(
                templates.map((t) => ({
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
    }, [templates]);

    useEffect(() => {
        setTemplateSeq(String(edit.templateSeq));
    }, [edit, setTemplateSeq]);

    /**
     * 라디오 버튼 클릭
     * @param {object} event 클릭이벤트
     * @param {object} row 클릭한 row에 대한 데이터
     */
    const onRowRadioClick = (event, row) => {
        setTemplateSeq(row.templateSeq);
        setTemplateName(row.templateName);
        setTemplateGroupName(row.tpZone);
    };

    /**
     * row 클릭 콜백
     * @param {object} e 클릭이벤트
     * @param {object} row row정보
     */
    const handleRowClick = (e, row) => {
        // 클릭했을때 컴포넌트의 템플릿id 변경
        onRowRadioClick(e, row);
    };

    /**
     * 테이블에서 검색옵션 변경하는 경우
     * @param {object} payload 변경된 값
     */
    const handleChangeSearchOption = (payload) => {
        dispatch(getTemplates(changeSearchOption(payload)));
    };

    return (
        <div className={classes.table}>
            {listType === 'list' && (
                <WmsTable
                    columns={templateColumns}
                    rows={templateRows}
                    total={total}
                    page={search.page}
                    size={search.size}
                    pageSizes={POP_PAGESIZE_OPTIONS}
                    displayPageNum={POP_DISPLAY_PAGE_NUM}
                    onRowClick={handleRowClick}
                    onChangeSearchOption={handleChangeSearchOption}
                    currentId={String(templateSeq)}
                    loading={loading}
                    error={error}
                    selected={[String(templateSeq)]}
                    onRowRadioClick={onRowRadioClick}
                    borderTop
                    borderBottom
                    popupPaging
                />
            )}
            {listType === 'thumbnail' && (
                <>
                    <WmsThumbnailTable
                        columns={templateColumns}
                        rows={templateRows}
                        total={total}
                        page={search.page}
                        size={search.size}
                        pageSizes={POP_PAGESIZE_OPTIONS}
                        displayPageNum={POP_DISPLAY_PAGE_NUM}
                        onRowClick={handleRowClick}
                        onChangeSearchOption={handleChangeSearchOption}
                        currentId={String(templateSeq)}
                        boxWidth={176}
                        boxHeight={186}
                        loading={loading}
                        error={error}
                        popupPaging
                    />
                </>
            )}
        </div>
    );
};

export default TemplateDialogTable;
