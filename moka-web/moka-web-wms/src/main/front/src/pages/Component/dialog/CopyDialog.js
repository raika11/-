import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { copyComponent } from '~/stores/component/componentStore';
import { WmsDialogAlert, WmsTextField } from '~/components';

const ComponentDeleteButton = (props) => {
    const { open, onClose, componentSeq, componentName } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const [copyName, setCopyName] = React.useState('');

    const onCloseTrigger = () => {
        onClose();
    };

    const onSaveTrigger = () => {
        dispatch(
            copyComponent({
                componentSeq,
                componentName: copyName,
                success: () => {
                    history.push('/component');
                    onCloseTrigger();
                }
            })
        );
    };

    React.useEffect(() => {
        setCopyName(`${componentName}_복사`);
        return () => {
            setCopyName('');
        };
    }, [componentName]);

    return (
        <WmsDialogAlert
            title="컴포넌트 설정복사"
            open={open}
            type="alert"
            onClose={onCloseTrigger}
            buttons={[
                { name: '저장', color: 'primary', onClick: onSaveTrigger },
                { name: '취소', onClick: onCloseTrigger }
            ]}
        >
            <WmsTextField
                label="컴포넌트명"
                labelWidth={70}
                value={copyName}
                fullWidth
                onChange={(e) => {
                    setCopyName(e.target.value);
                }}
            />
        </WmsDialogAlert>
    );
};

export default ComponentDeleteButton;
