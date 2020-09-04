import React, { useState, useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { WmsSelect, WmsAutocomplete } from '~/components';
import { getCodes, changeSearchOption } from '~/stores/code/codeStore';
import { getLang, getServiceType } from '~/stores/etccodeType/etccodeTypeStore';
import Core from './Core';

const LMCodesDialog = React.lazy(() => import('~/components/WmsHelper/CodeDialog/LMCodesDialog'));
const Loading = () => <></>;
const defaultLang = { id: 'all', name: '전체' };
const defaultServiceType = { id: 'all', name: '전체' };

/**
 * 컴포넌트 검색설정 (자동완성 컴포넌트)
 * @param {object} props.classes classes
 * @param {boolean} props.disabled disabled
 */
const ComponentSearchSet = (props) => {
    const { classes, disabled } = props;
    const dispatch = useDispatch();
    const { edit, langRows, serviceTypeRows, codes } = useSelector((state) => ({
        edit: state.componentStore.edit,
        langRows: state.etccodeTypeStore.langRows,
        serviceTypeRows: state.etccodeTypeStore.serviceTypeRows,
        codes: state.codeStore.codes
    }));

    // 카운터
    const [loadCnt, setLoadCnt] = useState(0);
    // rows
    const [lRows, setLRows] = useState([]);
    const [stRows, setStRows] = useState([]);
    // 패널 확장
    const [expanded, setExpanded] = useState(false);
    const [searchLang, setSearchLang] = useState('');
    const [searchServiceType, setSearchServiceType] = useState('');
    const [codeRows, setCodeRows] = useState([]);
    // 자동 완성
    const [autocompleteOpen, setAutocompleteOpen] = useState(false);
    const [autocompleteId, setAutocompleteId] = useState(null);
    // 다이얼로그
    const [popOpen, setPopOpen] = useState(false);

    /**
     * 패널 접기/펴기
     * @param {object} event Event
     * @param {boolean} isExpanded 확장 여부
     */
    const onChangeExpanded = (event, isExpanded) => {
        if (disabled) {
            setExpanded(isExpanded);
        }
    };

    /**
     * autocomplete 값 변경 시 실행
     * @param {object} e Event
     * @param {object} newValue { seq, codeId, tagTitle, optionTitle, title }
     * @param {string} targetName 속성 name값
     */
    const onChangeSearchId = (e, newValue, targetName) => {
        if (newValue !== null) {
            setAutocompleteId({
                ...newValue,
                title: ''
            });
        } else {
            setAutocompleteId(null);
        }
    };

    /**
     * 다이얼로그에서 searchCodeId 변경 시 실행
     * @param {string|number} codeId 코드ID값
     */
    const onChangeSearchIdByDialog = (codeId) => {
        let codeData = codeRows.find((c) => String(c.codeId) === String(codeId));
        setAutocompleteId({
            ...codeData,
            title: ''
        });
    };

    useEffect(() => {
        setExpanded(disabled);
    }, [disabled]);

    useEffect(() => {
        if (disabled && loadCnt < 1) {
            dispatch(getLang());
            dispatch(getServiceType());
            dispatch(getCodes(changeSearchOption({ key: 'codeLevel', value: 3 })));
            setLoadCnt(loadCnt + 1);
        } else {
            setLRows([].concat(defaultLang, langRows));
            setStRows([].concat(defaultServiceType, serviceTypeRows));
        }
    }, [disabled, loadCnt, dispatch, langRows, serviceTypeRows]);

    /**
     * edit 값 변경되면 초기값도 변경
     */
    useEffect(() => {
        // 언어
        setSearchLang(edit.searchLang || '');
        // 서비스타입
        setSearchServiceType(edit.searchServiceType || '');
        // 분류코드
        if (edit.searchCodeId && codeRows.length > 0) {
            let codeData = codeRows.find((c) => c.codeId === edit.searchCodeId);
            setAutocompleteId({
                ...codeData,
                title: ''
            });
        } else {
            setAutocompleteId(null);
        }
    }, [edit, codeRows]);

    // searchCodeRows 생성
    useEffect(() => {
        if (codes.length > 0) {
            const rows = codes.map((c) => ({
                seq: c.codeId, // DB의 seq 필드 아님
                codeId: c.codeId,
                tagTitle: c.codePath,
                optionTitle: c.codePath,
                title: c.codePath
            }));
            setCodeRows(rows);
        }
    }, [codes]);

    /**
     * 코어 모듈에 데이터 셋팅
     */
    useEffect(() => {
        Core.prototype.push('save', { key: 'searchLang', value: searchLang });
        Core.prototype.push('save', {
            key: 'searchServiceType',
            value: searchServiceType
        });
        if (autocompleteId !== null && autocompleteId.codeId) {
            Core.prototype.push('save', {
                key: 'searchCodeId',
                value: autocompleteId.codeId
            });
        }
    }, [searchLang, searchServiceType, autocompleteId]);

    return (
        <ExpansionPanel
            className={classes.expansionPanelRoot}
            square
            elevation={0}
            expanded={expanded}
            onChange={onChangeExpanded}
        >
            {/* Summary */}
            <ExpansionPanelSummary
                className={classes.expansionPanelSummary}
                expandIcon={<ExpandMoreIcon />}
                IconButtonProps={{ disableRipple: true }}
                aria-controls="component-search-content"
                id="component-search-header"
            >
                <Typography
                    variant="subtitle2"
                    className={clsx({ [classes.disabledText]: !disabled })}
                >
                    검색설정
                </Typography>
            </ExpansionPanelSummary>

            {/* Details */}
            <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                <div className={classes.panelContents}>
                    <div className={clsx(classes.inLine, classes.mb8)}>
                        <Typography component="div" variant="subtitle1" className={classes.label}>
                            검색조건
                        </Typography>
                        <div className={clsx(classes.inLine, classes.contentsWithLabel)}>
                            <div className={classes.mr34}>
                                <WmsSelect
                                    width="130"
                                    labelWidth="30"
                                    label="언어"
                                    rows={lRows}
                                    name="searchLang"
                                    currentId={searchLang}
                                    onChange={(e) => setSearchLang(e.target.value)}
                                />
                            </div>
                            <WmsSelect
                                width="252"
                                labelWidth="70"
                                label="서비스 타입"
                                rows={stRows}
                                name="searchServiceType"
                                currentId={searchServiceType}
                                onChange={(e) => setSearchServiceType(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={clsx(classes.inLine)}>
                        <div className={classes.ml74}>
                            <WmsAutocomplete
                                name="searchCodeId"
                                width="412"
                                labelWidth="30"
                                label="분류"
                                options={codeRows}
                                value={autocompleteId}
                                onChange={onChangeSearchId}
                                open={autocompleteOpen}
                                onSearchBtnClick={() => setPopOpen(true)}
                                onChangeOpen={(val) => setAutocompleteOpen(val)}
                            />
                        </div>
                    </div>
                </div>

                {/* 분류검색 다이얼로그 */}
                <Suspense fallback={<Loading />}>
                    {popOpen && (
                        <LMCodesDialog
                            open={popOpen}
                            onClose={() => setPopOpen(false)}
                            searchCodeId={autocompleteId}
                            setSearchCodeId={onChangeSearchIdByDialog}
                        />
                    )}
                </Suspense>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
};
export default ComponentSearchSet;
