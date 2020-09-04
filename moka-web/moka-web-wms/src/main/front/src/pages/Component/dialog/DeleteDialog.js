import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { deleteComponent, hasRelations } from '~/stores/component/componentStore';
import { WmsDialogAlert } from '~/components';

const DeleteDialog = (props) => {
    const { componentSeq, componentName, open, onClose } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const [delOpen, setDelOpen] = React.useState(false);
    const [relOpen, setRelOpen] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            dispatch(
                hasRelations({
                    componentSeq,
                    exist: () => setRelOpen(true),
                    notExist: () => setDelOpen(true)
                })
            );
        }
    }, [open, dispatch, componentSeq]);

    return (
        <>
            {/* 관련데이터 X */}
            <WmsDialogAlert
                title="컴포넌트 삭제"
                open={delOpen}
                type="delete"
                onClose={() => {
                    setDelOpen(false);
                    onClose();
                }}
                okCallback={() => {
                    dispatch(
                        deleteComponent({
                            componentSeq,
                            success: () => history.push('/component')
                        })
                    );
                }}
            >
                <Typography component="p" variant="body1">
                    {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                    선택하신 {componentName} 컴포넌트를 삭제하시겠습니까?
                </Typography>
            </WmsDialogAlert>

            {/* 관련 데이터 O */}
            <WmsDialogAlert
                title="확인"
                open={relOpen}
                type="show"
                onClose={() => {
                    setRelOpen(false);
                    onClose();
                }}
            >
                <Typography component="p" variant="body1">
                    {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                    선택하신 {componentName} 컴포넌트가 사용 중이어서 삭제할 수 없습니다.
                </Typography>
            </WmsDialogAlert>
        </>
    );
};

export default DeleteDialog;
