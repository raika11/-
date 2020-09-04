import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { WmsIconButton } from '~/components/WmsButtons';
import CodeTypeUpdateDialog from '../dialog/CodeTypeUpdateDialog';
import DeleteDialog from '../dialog/DeleteDialog';
import { changeEditAll, putEtccodeType } from '~/stores/etccodeType/etccodeTypeStore';
import style from '~/assets/jss/pages/EtccodeType/EtccodeTypeStyle';

const useStyle = makeStyles(style);

/**
 * 수정할 코드그룹의 정보를 받아온다.
 * @param {*} props
 */
const EtccodeTypeUpdateButton = (props) => {
    const { row } = props;
    const classes = useStyle();
    const history = useHistory();
    const dispatch = useDispatch();

    // state
    const [codeTypeUpdateDialogOpen, setCodeTypeUpdateDialogOpen] = useState(false);
    const [codeTypeId, setCodeTypeId] = useState('');
    const [codeTypeName, setCodeTypeName] = useState('');
    const [codeTypeSeq, setCodeTypeSeq] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);

    /**
     * 코드그룹명 입력값 체크
     * @param {*} targetObj
     */
    const validate = (targetObj) => {
        let totErr = [];
        if (!/[^\s\t\n]+/g.test(targetObj.codeTypeName)) {
            let err = {
                field: 'codeTypeId',
                reason: '코드그룹명을 확인해주세요'
            };
            totErr.push(err);
        }
        if (totErr.length < 1) {
            return true;
        }
        return false;
    };

    /**
     * 저장
     */
    const onSave = () => {
        const updateCodeType = {
            ...row,
            codeTypeId,
            codeTypeName
        };
        if (validate(updateCodeType)) {
            dispatch(
                putEtccodeType({
                    callback: ({ etccodeTypeSeq }) => history.push('/etccodeType'),
                    actions: [changeEditAll(updateCodeType)]
                })
            );
            return true;
        }
        return false;
    };

    /**
     * 삭제
     * @param {} e
     */
    const onDelete = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setAlertOpen(true);
    };

    /**
     * dialog에 보낼 props를 위한 값 생성
     */
    useEffect(() => {
        setCodeTypeId(row.codeTypeId);
        setCodeTypeName(row.codeTypeName);
        setCodeTypeSeq(row.codeTypeSeq);
    }, [row]);

    return (
        <div className={classes.spaceBetween}>
            <Typography component="p" variant="body1">
                {row.codeTypeName}
            </Typography>
            <WmsIconButton
                icon="create"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCodeTypeUpdateDialogOpen(true);
                }}
            />
            {/** 코드그룹 수정 dialog창 */}
            {codeTypeUpdateDialogOpen && (
                <CodeTypeUpdateDialog
                    open={codeTypeUpdateDialogOpen}
                    onClose={() => setCodeTypeUpdateDialogOpen(false)}
                    setCodeTypeId={setCodeTypeId}
                    setCodeTypeName={setCodeTypeName}
                    codeTypeId={codeTypeId}
                    codeTypeName={codeTypeName}
                    onSave={onSave}
                    onDelete={onDelete}
                />
            )}
            {/* 삭제 alert창  */}
            <DeleteDialog
                open={alertOpen}
                onClose={() => setAlertOpen(false)}
                codeTypeSeq={codeTypeSeq}
            />
        </div>
    );
};

export default EtccodeTypeUpdateButton;
