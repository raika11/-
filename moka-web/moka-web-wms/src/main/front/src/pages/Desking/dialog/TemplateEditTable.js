import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setWmsImgSrc } from '~/utils/imageUtil';
import { WmsTable, WmsThumbnailTable } from '~/components';
import { getTemplates, changeSearchOption } from '~/stores/template/templateStore';
import { templateColumns } from './dialogColumns';

/**
 * 템플릿 테이블
 */
const TemplateEditTable = (props) => {
    const { classes, component, selected, setSelected } = props;
    const dispatch = useDispatch();

    // 스토어 데이터
    const { search, listType, templates, total, loading, error } = useSelector((store) => ({
        search: store.templateStore.search,
        listType: store.templateStore.listType,
        templates: store.templateStore.list,
        total: store.templateStore.total,
        loading: store.loadingStore['templateStore/GET_TEMPLATES'],
        error: store.templateStore.error
    }));

    // state
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
                    templateWidth: t.templateWidth ? `w${t.templateWidth}` : undefined,
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
        setSelected(component.templateSeq);
    }, [component, setSelected]);

    /**
     * 라디오 버튼 클릭
     * @param {object} event 클릭이벤트
     * @param {object} row 클릭한 row에 대한 데이터
     */
    const onRowRadioClick = (event, row) => {
        setSelected(row.templateSeq);
        // setTemplateName(row.templateName);
        // setTemplateGroupName(row.tpZone);
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
        <div className={classes.templateEditTable}>
            {listType === 'list' && (
                <WmsTable
                    columns={templateColumns}
                    rows={templateRows}
                    total={total}
                    page={search.page}
                    size={search.size}
                    currentId={String(selected)}
                    selected={[String(selected)]}
                    loading={loading}
                    error={error}
                    onChangeSearchOption={handleChangeSearchOption}
                    onRowClick={handleRowClick}
                    onRowRadioClick={onRowRadioClick}
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
                        currentId={String(selected)}
                        boxWidth={197}
                        boxHeight={178}
                        loading={loading}
                        error={error}
                        onRowClick={handleRowClick}
                        onChangeSearchOption={handleChangeSearchOption}
                    />
                </>
            )}
        </div>
    );
};

export default TemplateEditTable;
