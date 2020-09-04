import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { WmsAutocomplete } from '~/components';
import { LMSCodesDialog } from '~/components/WmsHelper';
import { getCodes, clearCode, changeSearchOption } from '~/stores/code/codeStore';

const CodeAutoCompleteContainer = (props) => {
    const { name, label, required, multiple, value, error } = props;
    const { onChange } = props;
    const dispatch = useDispatch();
    const { list, loading } = useSelector(({ codeStore, loadingStore }) => ({
        list: codeStore.codes,
        loading: loadingStore['codeStore/GET_CODES']
    }));
    const [openListBox, setOpenListBox] = useState(false); // 자동완성 리스트 박스 목록 open/close
    const [listRows, setListRows] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        return () => {
            dispatch(clearCode());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 분류 조회
    useEffect(() => {
        if (openListBox) {
            dispatch(
                getCodes(
                    changeSearchOption({
                        key: 'codeLevel',
                        value: 3
                    })
                )
            );
        }
    }, [dispatch, openListBox]);

    // 분류 로컬화
    useEffect(() => {
        if (openListBox && list) {
            setListRows(
                list.map((c) => {
                    return {
                        seq: c.codeId, // 텍스트필드에 보이는 값(필수)
                        codeId: c.codeId,
                        tagTitle: c.codePath,
                        optionTitle: c.codePath,
                        title: c.codePath // 리스트박스에 보이는 값(필수)
                    };
                })
            );
        } else {
            setListRows([]);
        }
    }, [list, openListBox]);

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
    const handlePopSelect = (seq) => {
        value.push({ seq });
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
                <LMSCodesDialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    setSearchCodeId={handlePopSelect}
                />
            )}
        </>
    );
};

export default CodeAutoCompleteContainer;
