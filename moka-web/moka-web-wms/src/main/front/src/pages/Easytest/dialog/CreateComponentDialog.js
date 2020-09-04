import React, { useCallback, useState, useEffect } from 'react';
import clsx from 'clsx';
import produce from 'immer';
import { useSelector } from 'react-redux';
import { WmsDialogAlert, WmsSelect, WmsTextField, WmsIconButton } from '~/components';

const CreateComponentDialog = (props) => {
    const { open, onClose, onSave, classes } = props;
    const { domains, search, edit } = useSelector((state) => ({
        domains: state.authStore.domains,
        search: state.templateStore.search,
        edit: state.templateStore.edit
    }));

    const [domainRows, setDomainRows] = useState([]);
    const [domainCurrentId, setDomainCurrentId] = useState('all');
    const [components, setComponents] = useState([]);

    const onComponentReset = useCallback(() => {
        setComponents([
            {
                domainId: edit.domainId || domainCurrentId,
                templateSeq: edit.templateSeq,
                componentName: `${edit.templateName}_컴포넌트`
            }
        ]);
    }, [edit, domainCurrentId]);

    const onCloseTrigger = () => {
        onClose();
        setTimeout(() => {
            onComponentReset();
        }, 500);
    };

    const onSaveTrigger = () => {
        onSave({ components });
        onCloseTrigger();
    };

    const addComponents = () => {
        setComponents(
            produce(components, (draft) => {
                draft.push({
                    domainId: edit.domainId || domainCurrentId,
                    templateSeq: edit.templateSeq,
                    componentName: `${edit.templateName}_컴포넌트`
                });
            })
        );
    };

    const removeComponent = (idx) => {
        setComponents(
            produce(components, (draft) => {
                draft.splice(idx, 1);
            })
        );
    };

    const handleComponents = (e, idx) => {
        e.preventDefault();
        e.stopPropagation();
        setComponents(
            produce(components, (draft) => {
                draft[idx].componentName = e.target.value;
            })
        );
    };

    useEffect(() => {
        onComponentReset();
    }, [onComponentReset]);

    const createDom = () => {
        if (components.length > 0) {
            return components.map((c, idx) => (
                <div key={idx} className={clsx(classes.mb8, classes.inLine)}>
                    <div className={classes.mr8}>
                        <WmsTextField
                            label="컴포넌트명"
                            labelWidth={70}
                            width={368}
                            value={c.componentName}
                            onChange={(e) => {
                                handleComponents(e, idx);
                            }}
                            tabIndex={-1}
                        />
                    </div>
                    {idx === 0 ? (
                        <WmsIconButton icon="add_box" onClick={addComponents} />
                    ) : (
                        <WmsIconButton
                            icon="delete_forever"
                            onClick={() => {
                                removeComponent(idx);
                            }}
                        />
                    )}
                </div>
            ));
        }
        return null;
    };

    return (
        <WmsDialogAlert
            type="alert"
            open={open}
            onClose={onCloseTrigger}
            title="컴포넌트만들기"
            buttons={[
                { name: '저장', color: 'primary', onClick: onSaveTrigger },
                { name: '취소', onClick: onCloseTrigger }
            ]}
            overrideClassName={classes.dialog}
        >
            <div className={classes.mb8}>
                <WmsSelect
                    label="도메인"
                    labelWidth={70}
                    rows={domainRows}
                    fullWidth
                    currentId={domainCurrentId}
                    onChange={(e) => {
                        setDomainCurrentId(e.target.value);
                    }}
                    disabled={search.domainId !== 'all'}
                />
            </div>
            {createDom()}
        </WmsDialogAlert>
    );
};

export default CreateComponentDialog;
