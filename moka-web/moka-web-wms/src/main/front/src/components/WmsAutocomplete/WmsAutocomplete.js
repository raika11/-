import React from 'react';
import clsx from 'clsx';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import WmsAutocompleteStyle from '~/assets/jss/components/WmsAutocompleteStyle';
import { WmsLoader } from '~/components';

const useStyles = makeStyles(WmsAutocompleteStyle);

/**
 * 자동완성
 * @param {string} props.name element명칭(ex: ids)
 * @param {string|number} props.width 넓이(없을 경우 100%)
 * @param {string} props.label 라벨명
 * @param {string|number} props.labelWidth 라벨 width
 * @param {boolean} props.required 필수여부
 * @param {array[string]} props.value 현재 선택된 값 배열
 * @param {boolean} props.multiple 다중선택여부
 * @param {boolean} props.error 에러여부
 * @param {string} props.overrideClassName 오버라이드 스타일
 *
 * @param {string} props.onChange 선택 값 변경
 * @param {string} props.onSearchBtnClick 돋보기 버튼 클릭
 * @param {string} props.icon 아이콘명
 *
 * @param {array[object]} props.options 리스트목록(ex: [{seq: 1, title: 'test1'},{seq: 2, title: 'test2'}])
 * @param {boolean} props.loading 리스트목록 로딩중 여부
 * @param {string} props.open 리스트목록 오픈여부
 * @param {string} props.onChangeOpen 리스트목록 열기
 */
export default function CustomizedHook(props) {
    // 컴포넌트 속성
    const {
        name,
        width,
        label,
        labelWidth,
        required = false,
        value,
        multiple = false,
        error,
        overrideClassName
    } = props;

    // 컴포넌트 값 변경
    const { onChange, onSearchBtnClick, icon } = props;

    // 리스트박스 정보
    const { options, loading = false, open, onChangeOpen } = props;

    // 스타일
    const classes = useStyles({ error, width, labelWidth });

    // 리스트목록에서 선택하여 값 변경 콜백
    const handleValueChange = (e, newValue) => {
        onChange(e, newValue, name);
    };

    // 자동완성 컴포넌트 생성
    const {
        getRootProps,
        getInputLabelProps,
        getInputProps,
        getTagProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
        value: selectedValue,
        setAnchorEl
    } = useAutocomplete({
        multiple,
        value,
        options: options || [],
        open,
        onOpen: () => onChangeOpen(true),
        onClose: () => onChangeOpen(false),
        onChange: handleValueChange,
        getOptionSelected: (option, svalue) => String(option.seq) === String(svalue.seq),
        getOptionLabel: (option) => option.title || ''
    });

    // 태그 생성 함수
    const Tag = ({ text, onDelete }) => {
        const onClickTagDelete = multiple
            ? onDelete
            : () => {
                  handleValueChange({}, null);
              };
        return (
            <div className={classes.tag}>
                <Typography component="div" variant="body1" className={classes.tagLabel}>
                    <span>{text}</span>
                    <CancelIcon onClick={onClickTagDelete} />
                </Typography>
            </div>
        );
    };

    if (setAnchorEl.current && document.activeElement.id === setAnchorEl.current.id) {
        setAnchorEl.current.classList.add('Mui-focused');
    }

    return (
        <div {...getRootProps()} className={clsx(classes.autoTextfield, overrideClassName)}>
            {/** 라벨 */}
            {label && (
                <Typography
                    component="div"
                    variant="subtitle1"
                    className={classes.label}
                    {...getInputLabelProps()}
                >
                    {label}
                    {required && <div className={classes.requiredData}>*</div>}
                </Typography>
            )}

            {/** 자동완성 텍스트필드 영역 */}
            <div className={classes.autogroup}>
                <div
                    className={classes.inputWrapper}
                    id="autoWrapper"
                    ref={setAnchorEl}
                    tabIndex={-1}
                >
                    {selectedValue && Array.isArray(selectedValue)
                        ? // multiple이 true 경우(selectedValue가 array)
                          selectedValue.map((option, index) => (
                              <Tag
                                  text={option.tagTitle || option.seq}
                                  {...getTagProps({ index })}
                              />
                          ))
                        : // multiple이 false인 경우(selectedValue가 object)
                          selectedValue &&
                          selectedValue.seq && (
                              <Tag text={selectedValue.tagTitle || selectedValue.seq} />
                          )}
                    <InputBase className={classes.input} {...getInputProps()} />
                    <IconButton className={classes.inputIcon} onClick={onSearchBtnClick}>
                        <Icon>{icon || 'search'}</Icon>
                    </IconButton>
                    <fieldset className={classes.fieldset} />
                </div>
                {loading ? (
                    <div className={classes.listbox}>
                        <WmsLoader size={10} />
                    </div>
                ) : groupedOptions.length > 0 ? (
                    <div className={classes.listbox} {...getListboxProps()}>
                        {groupedOptions.map((option, index) => (
                            <li {...getOptionProps({ option, index })}>
                                <Typography component="span" variant="body1">
                                    {option.optionTitle || option.title}
                                </Typography>
                                <CheckIcon fontSize="small" />
                            </li>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
