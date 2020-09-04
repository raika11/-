import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import WmsButton from '~/components/WmsButtons';
import { WmsCard } from '~/components';
import style from '~/assets/jss/pages/EtccodeType/EtccodeTableStyle';
import { rightTableColumns } from './components/tableColumns';
import WmsTable from '~/components/WmsTable';
import WmsSelect from '~/components/WmsSelects';
import { WmsTextFieldIcon } from '~/components/WmsTextFields';
import CodeAddDialog from './dialog/CodeAddDialog';
import CodeUpdateDialog from './dialog/CodeUpdateDialog';
import {
    getEtccodeList,
    changeEditAll,
    putEtccode,
    deleteEtccode
} from '~/stores/etccode/etccodeStore';
import CodeTypeAlertDialog from './dialog/CodeTypeAlertDialog';

const useStyles = makeStyles(style);

const EtccodeDetailContainer = (props) => {
    let history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { selectedCodeType } = props;

    const [codeAddDialogOpen, setCodeAddDialogOpen] = useState(false);
    const [codeUpdateDialogOpen, setEtccodeUpdateDialogOpen] = useState(false);
    const [etccodeListRows, setEtccodeListRows] = useState([]);

    const [selectedCodeSeq, setSelectedCodeSeq] = useState('');
    const [codeTypeAlertOpen, setCodeTypeAlertOpen] = useState(false);

    const [keyword, setKeyword] = useState('');
    const [searchType, setSearchType] = useState('codeId');
    const keywordRef = useRef();

    /**
     * 목록에서 아이템 클릭 (상세 조회 및 수정 )
     * @param {object} row row정보
     */
    const handleRowClick = (seq) => {
        setSelectedCodeSeq(seq);
        setEtccodeUpdateDialogOpen(true);
    };

    /**
     * store
     */
    const { etccodes, total, search, etccodeType } = useSelector((store) => ({
        etccodeType: store.etccodeTypeStore.list,
        etccodes: store.etccodeStore.etccodes,
        total: store.etccodeStore.total,
        search: store.etccodeStore.search
    }));

    /**
     * 검색 select 조건
     */
    const etccodeSearchRows = [
        { id: 'codeId', name: '코드' },
        { id: 'codeName', name: '코드명' }
    ];

    /**
     * table 정보조회
     */
    useEffect(() => {
        if (etccodes) {
            setEtccodeListRows(
                etccodes.map((c) => ({
                    seq: c.seq,
                    codeTypeName: c.etccodeType.codeTypeName,
                    codeTypeSeq: c.etccodeType.codeTypeSeq,
                    codeTypeId: c.etccodeType.codeTypeId,
                    codeId: c.codeId,
                    codeName: String(c.codeName),
                    etcOne: c.codeNameEtc1 != null ? c.codeNameEtc1 : '',
                    etcTwo: c.codeNameEtc2 != null ? c.codeNameEtc2 : '',
                    etcThree: c.codeNameEtc3 != null ? c.codeNameEtc3 : '',
                    codeOrder: c.codeOrder,
                    useYn: c.useYn
                }))
            );
        }
    }, [etccodes]);

    useEffect(() => {
        setEtccodeListRows([]);
    }, [etccodeType]);

    /**
     * 저장 수정 버튼
     * @param {*} updateCode
     */
    const onSave = (updateCode) => {
        dispatch(
            putEtccode({
                callback: ({ etccodeTypeSeq }) => history.push('/etccodeType'),
                actions: [changeEditAll(updateCode)]
            })
        );
    };

    /**
     * 코드추가 액션
     */
    const codeAdd = () => {
        if (selectedCodeType) {
            setCodeAddDialogOpen(true);
        } else {
            setCodeTypeAlertOpen(true);
        }
    };

    /**
     * 키워드 변경 함수
     * @param {object} e change이벤트
     */
    const onChangeKeyword = (e) => {
        setKeyword(e.target.value);
    };

    const onChangeSearchType = (e) => {
        setSearchType(e.target.value);
    };
    /**
     * 검색
     * @param {object} e click이벤트
     */
    const onSearch = (e) => {
        const { codeTypeId } = selectedCodeType;
        if (codeTypeId) {
            dispatch(
                getEtccodeList({
                    ...search,
                    codeTypeId,
                    keyword,
                    searchType
                })
            );
        } else {
            setCodeTypeAlertOpen(true);
        }
    };

    /**
     * 삭제
     * @param {*} seq
     */
    const onDelete = (seq) => {
        const codeSet = {
            seq,
            codeTypeId: selectedCodeType.codeTypeId
        };
        dispatch(deleteEtccode({ callback: () => history.push('/etccodeType'), codeSet }));
    };

    return (
        <div className={classes.nonTitle}>
            <WmsCard>
                <div className={clsx(classes.topBotton)}>
                    <WmsSelect
                        rows={etccodeSearchRows}
                        currentId={searchType}
                        width={166}
                        overrideClassName={classes.mr8}
                        onChange={onChangeSearchType}
                    />
                    <WmsTextFieldIcon
                        placeholder="검색어를 입력하세요."
                        value={keyword}
                        width={388}
                        icon="search"
                        overrideClassName={classes.mr8}
                        onChange={onChangeKeyword}
                        onIconClick={onSearch}
                        onEnter={onSearch}
                        inputRef={keywordRef}
                    />
                    <WmsButton color="wolf" onClick={codeAdd}>
                        <span>코드 추가</span>
                    </WmsButton>
                </div>

                <div className={classes.table}>
                    <WmsTable
                        columns={rightTableColumns}
                        rows={etccodeListRows}
                        total={total}
                        page={search.page}
                        size={search.size}
                        onRowClick={(evt, selectedRow) => handleRowClick(selectedRow)}
                        currentId={String(etccodeListRows.codeSeq)}
                    />
                </div>
                {/** 코드추가 팝업 */}
                {codeAddDialogOpen && (
                    <CodeAddDialog
                        open={codeAddDialogOpen}
                        onClose={() => setCodeAddDialogOpen(false)}
                        selectedCodeType={selectedCodeType}
                        onSave={onSave}
                    />
                )}
                {/** 코드 수정  팝업 */}
                {codeUpdateDialogOpen && (
                    <CodeUpdateDialog
                        open={codeUpdateDialogOpen}
                        onClose={() => setEtccodeUpdateDialogOpen(false)}
                        code={selectedCodeSeq}
                        onSave={onSave}
                        onDelete={onDelete}
                    />
                )}
                {/* 코드타입 미선택  alert창  */}
                {codeTypeAlertOpen && (
                    <CodeTypeAlertDialog
                        open={codeTypeAlertOpen}
                        onClose={() => setCodeTypeAlertOpen(false)}
                    />
                )}
            </WmsCard>
        </div>
    );
};

export default EtccodeDetailContainer;
