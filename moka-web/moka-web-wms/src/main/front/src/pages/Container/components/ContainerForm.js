import React, { useCallback } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import WmsTextField, { WmsText } from '~/components/WmsTextFields';
import style from '~/assets/jss/pages/Template/TemplateInfoStyle';
import { isError } from '~/utils/errorUtil';

const useStyle = makeStyles(style);

/**
 * 컨테이너폼
 */
const ContainerForm = (props) => {
    const { edit, loading, error, onChangeField } = props;
    const classes = useStyle();

    // 유효성 에러 목록
    let validList = null;
    if (error && error.header && !error.header.success) {
        if (Array.isArray(error.body.list)) {
            validList = error.body.list;
        }
    }

    // 정보변경
    const handleChange = useCallback(
        (e) => {
            let value;
            value = e.target.value;
            onChangeField({ key: e.target.name, value });
        },
        [onChangeField]
    );

    return (
        <>
            <div className={clsx(classes.id, classes.mb8)}>
                <WmsText
                    width="172"
                    labelWidth="70"
                    label="컨테이너ID"
                    name="pageSeq"
                    disabled
                    value={!loading && edit && edit.containerSeq ? edit.containerSeq : ''}
                />
            </div>
            <div className={classes.mb8}>
                <WmsTextField
                    fullWidth
                    placeholder="컨테이너명을 입력하세요"
                    labelWidth="70"
                    label="컨테이너명"
                    name="containerName"
                    onChange={handleChange}
                    error={isError(validList, 'containerName')}
                    value={!loading && edit && edit.containerName ? edit.containerName : ''}
                    required
                />
            </div>
        </>
    );
};

export default ContainerForm;
