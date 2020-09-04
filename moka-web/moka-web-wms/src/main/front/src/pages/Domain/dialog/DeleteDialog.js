import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { deleteDomain, hasRelations } from '~/stores/domain/domainStore';
import { WmsDialogAlert } from '~/components';

const DeleteDialog = (props) => {
    const { domainId, domainName, open, onClose } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const [delOpen, setDelOpen] = React.useState(false);
    const [relOpen, setRelOpen] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            dispatch(
                hasRelations({
                    domainId,
                    exist: () => setRelOpen(true),
                    notExist: () => setDelOpen(true)
                })
            );
        }
    }, [open, dispatch, domainId]);

    return (
        <>
            {/* 관련데이터 X */}
            <WmsDialogAlert
                title="도메인 삭제"
                open={delOpen}
                type="delete"
                onClose={() => {
                    setDelOpen(false);
                    onClose();
                }}
                okCallback={() => {
                    dispatch(
                        deleteDomain({
                            domainId,
                            success: () => history.push('/domain')
                        })
                    );
                }}
            >
                <Typography component="p" variant="body1">
                    {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                    선택하신 &apos;{domainName}&apos; 도메인을 삭제하시겠습니까?
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
                    선택하신 &apos;{domainName}&apos; 도메인에 아이템(템플릿, 컴포넌트 등)이
                    <br />
                    존재하여 삭제할 수 없습니다.
                </Typography>
            </WmsDialogAlert>
        </>
    );
};

export default DeleteDialog;
