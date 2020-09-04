import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearAutoDataset, getDatasetList, defaultSearch } from '~/stores/dataset/datasetAutoStore';
import WmsAutocomplete from '~/components/WmsAutocomplete';
import { DatasetDialog } from '~/components/WmsHelper';

const DatasetAutoCompleteContainer = (props) => {
    const { name, label, required, multiple, value, error } = props;
    const { onChange } = props;

    const dispatch = useDispatch();
    const latestApiCodeId = useSelector((store) => store.datasetStore.search.apiCodeId);
    const { list, total, loading, search } = useSelector(({ datasetAutoStore, loadingStore }) => ({
        list: datasetAutoStore.list,
        total: datasetAutoStore.total,
        // error: datasetAutoStore.error,
        loading: loadingStore['datasetAutoStore/GET_DATASET_LIST'],
        search: datasetAutoStore.search
    }));
    const [openListBox, setOpenListBox] = useState(false); // 자동완성 리스트 박스 목록 open/close
    const [listRows, setListRows] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        return () => {
            dispatch(clearAutoDataset());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 데이타셋 조회
    useEffect(() => {
        if (openListBox) {
            const option = {
                ...defaultSearch,
                apiCodeId: latestApiCodeId
                // keyword
            };
            if (JSON.stringify(search) !== JSON.stringify(option)) {
                dispatch(getDatasetList(option));
            }
        }
    }, [dispatch, openListBox, latestApiCodeId, search]);

    // 데이타셋 조회
    useEffect(() => {
        if (openListBox && list && total > 0) {
            setListRows(
                list.map((d) => {
                    return {
                        seq: d.datasetSeq, // 텍스트필드에 보이는 값(필수)
                        title: `${d.datasetSeq} : ${d.datasetName}` // 리스트박스에 보이는 값(필수)
                    };
                })
            );
        } else {
            setListRows([]);
        }
    }, [list, total, openListBox]);

    // 자동목록 팝업이 종료시 내용 삭제
    useEffect(() => {
        if (!openListBox && listRows && listRows.length > 0) {
            setListRows([]);
        }
    }, [openListBox, listRows]);

    // 자동목록이 팝업되거나, 종료될때의 상태관리
    const handleChangeOpen = (val) => {
        setOpenListBox(val);
    };

    // 검색버튼 클릭
    const handleSearchBtnClick = (e) => {
        setOpenListBox(false);
        setOpenDialog(true);
    };

    // 팝업에서 선택(value변경)
    const handlePopSelect = (datasetSeq) => {
        value.push({ seq: datasetSeq });
        onChange(null, value, name);
    };

    // 텍스트 입력(inputValue변경)
    // const handleInputChange = (val) => {
    //     setKeyword(val);
    // };

    return (
        <>
            <WmsAutocomplete
                name={name}
                width={700}
                label={label}
                labelWidth={100}
                required={required}
                multiple={multiple}
                options={listRows}
                value={value}
                onChange={onChange}
                onSearchBtnClick={handleSearchBtnClick}
                loading={openDialog ? false : loading}
                open={openListBox}
                onChangeOpen={handleChangeOpen}
                error={error}
            />
            {/** 검색팝업 다이얼로그 */}
            {openDialog && (
                <DatasetDialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    onSave={(row) => handlePopSelect(row)}
                />
            )}
        </>
    );
};

export default DatasetAutoCompleteContainer;
