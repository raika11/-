import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import { WmsTextFieldIcon, WmsSelect, WmsIconButton } from '~/components';
import {
    changeSearchOption,
    changeSearchOptions,
    clearTemplate,
    getTemplates
} from '~/stores/template/templateStore';
import { getTPZone, getTPSize } from '~/stores/etccodeType/etccodeTypeStore';
import ComponentDialogButton from '../components/ComponentDialogButton';

const defaultTPZone = { id: 'all', name: '위치그룹 전체' };
const defaultTPSize = { id: 'all', name: '사이즈 전체' };
const defaultSearchType = [
    { id: 'all', name: '템플릿 전체' },
    { id: 'templateSeq', name: '템플릿ID' },
    { id: 'templateName', name: '템플릿명' },
    { id: 'templateBody', name: '템플릿본문' }
];

/**
 * 템플릿 검색
 */
const TemplateEditSearch = ({ component, classes }) => {
    const dispatch = useDispatch();

    // 스토어 데이터
    const { tpSizeRows, tpZoneRows, search, latestDomainId } = useSelector((store) => ({
        tpSizeRows: store.etccodeTypeStore.tpSizeRows,
        tpZoneRows: store.etccodeTypeStore.tpZoneRows,
        search: store.templateStore.search,
        latestDomainId: store.authStore.latestDomainId
    }));

    // state
    const [sizeRows, setSizeRows] = useState([]);
    const [zoneRows, setZoneRows] = useState([]);
    const [domainCurrentId] = useState(latestDomainId);
    const [initialCnt, setInitialCnt] = useState(0);
    const [keyword, setKeyword] = useState('');

    // 초기 데이터 로드
    useEffect(() => {
        if (initialCnt < 1) {
            dispatch(
                getTemplates(
                    clearTemplate(),
                    changeSearchOption({
                        key: 'domainId',
                        value: domainCurrentId
                    })
                )
            );
            if (tpZoneRows.length <= 1) {
                dispatch(getTPZone());
            }
            if (tpSizeRows.length <= 1) {
                dispatch(getTPSize());
            }
            setInitialCnt(initialCnt + 1);
        } else {
            setSizeRows([].concat(defaultTPSize, tpSizeRows));
            setZoneRows([].concat(defaultTPZone, tpZoneRows));
        }
    }, [domainCurrentId, dispatch, initialCnt, tpZoneRows, tpSizeRows]);

    // 언마운트시 search option clear
    useEffect(() => {
        return () => {
            dispatch(clearTemplate());
        };
    }, [dispatch]);

    const goToComponent = () => {
        window.open(`/component/${component.componentSeq}`);
    };

    const goToTemplate = () => {
        window.open(`/template/${component.templateSeq}`);
    };

    /**
     * 검색 조건 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeSearchType = (e) => {
        dispatch(
            changeSearchOption({
                key: 'searchType',
                value: e.target.value
            })
        );
    };

    /**
     * 키워드 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeKeyword = (e) => {
        setKeyword(e.target.value);
    };

    /**
     * 검색
     * @param {object} e click이벤트
     */
    const onSearch = (e) => {
        dispatch(
            getTemplates(
                changeSearchOption({
                    key: 'keyword',
                    value: keyword
                })
            )
        );
    };

    /**
     * 도메인 위치그룹 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeTpZone = (e) => {
        dispatch(
            changeSearchOption({
                key: 'tpZone',
                value: e.target.value
            })
        );
    };

    /**
     * 템플릿 사이즈 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeTpSize = (e) => {
        if (e.target.value === 'all') {
            dispatch(
                changeSearchOptions([
                    { key: 'widthMin', value: undefined },
                    { key: 'widthMax', value: undefined },
                    { key: 'tpSize', value: 'all' }
                ])
            );
            return;
        }
        try {
            const { codeNameEtc1, codeNameEtc2 } = e.target.selectedOptions[0].dataset;
            dispatch(
                changeSearchOptions([
                    { key: 'widthMin', value: Number(codeNameEtc1) },
                    { key: 'widthMax', value: Number(codeNameEtc2) },
                    { key: 'tpSize', value: e.target.value }
                ])
            );
        } catch (err) {
            dispatch(
                changeSearchOptions([
                    { key: 'widthMin', value: undefined },
                    { key: 'widthMax', value: undefined },
                    { key: 'tpSize', value: 'all' }
                ])
            );
        }
    };

    return (
        <>
            <div className={clsx(classes.textLine, classes.mb8)}>
                <div className={clsx(classes.inLine, classes.w50)}>
                    <Typography variant="subtitle1" component="p" className={classes.nameField1}>
                        컴포넌트 명
                    </Typography>
                    <div className={classes.dataField1}>
                        <WmsIconButton
                            overrideClassName={clsx(classes.linkIcon, classes.mr8)}
                            icon="dvr_outlined"
                            onClick={goToComponent}
                        />
                        <Typography component="p" variant="body1" className="underline">
                            {`${component.componentSeq}_${component.componentName}`}
                        </Typography>
                    </div>
                </div>
                <div className={clsx(classes.inLine, classes.w50)}>
                    <Typography variant="subtitle1" component="p" className={classes.nameField2}>
                        사용 템플릿명
                    </Typography>
                    <div className={classes.dataField2}>
                        <WmsIconButton
                            overrideClassName={clsx(classes.linkIcon, classes.mr8)}
                            icon="dvr_outlined"
                            onClick={goToTemplate}
                        />
                        <Typography component="p" variant="body1" className="underline">
                            {`${component.templateSeq}_${component.componentName}`}
                        </Typography>
                    </div>
                </div>
            </div>

            <div className={clsx(classes.inLine, classes.mb8)}>
                <WmsSelect
                    rows={zoneRows}
                    width={150}
                    overrideClassName={classes.mr8}
                    onChange={onChangeTpZone}
                    currentId={search.tpZone}
                />
                <WmsSelect
                    rows={sizeRows}
                    width={105}
                    overrideClassName={classes.mr8}
                    onChange={onChangeTpSize}
                    currentId={search.tpSize}
                />
                <WmsSelect
                    rows={defaultSearchType}
                    width={105}
                    overrideClassName={classes.mr8}
                    onChange={onChangeSearchType}
                    currentId={search.searchType}
                />
                <WmsTextFieldIcon
                    placeholder="검색어를 입력하세요."
                    width="calc(100% - 384px)"
                    icon="search"
                    value={keyword}
                    onChange={onChangeKeyword}
                    onIconClick={onSearch}
                    onEnter={onSearch}
                />
            </div>
            <div className={classes.mb8}>
                <ComponentDialogButton />
            </div>
        </>
    );
};

export default TemplateEditSearch;
