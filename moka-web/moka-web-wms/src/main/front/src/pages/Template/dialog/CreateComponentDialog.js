import React, { useCallback, useState, useEffect } from 'react';
import clsx from 'clsx';
import produce from 'immer';
import { useSelector } from 'react-redux';
import { WmsDialogAlert, WmsSelect, WmsTextField, WmsIconButton } from '~/components';

/**
 * 컴포넌트 생성 다이얼로그
 */
const CreateComponentDialog = (props) => {
    const { open, onClose, onSave, classes } = props;
    const { domains, search, templateData } = useSelector((state) => ({
        domains: state.authStore.domains,
        search: state.templateStore.search,
        templateData: state.templateStore.detail
    }));

    const [domainRows, setDomainRows] = useState([]);
    const [domainCurrentId, setDomainCurrentId] = useState('all');
    const [components, setComponents] = useState([]);

    const onComponentReset = useCallback(() => {
        setComponents([
            {
                domainId: templateData.domainId || domainCurrentId,
                templateSeq: templateData.templateSeq,
                componentName: `${templateData.templateName}_컴포넌트`
            }
        ]);
    }, [templateData, domainCurrentId]);

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
                    domainId: templateData.domainId || domainCurrentId,
                    templateSeq: templateData.templateSeq,
                    componentName: `${templateData.templateName}_컴포넌트`
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

    // 도메인셀렉트의 rows 생성
    useEffect(() => {
        if (domains) {
            const rows1 = domains.map((m) => {
                return {
                    id: m.domainId,
                    name: m.domainName
                };
            });
            setDomainRows(rows1);
        }
    }, [domains]);

    useEffect(() => {
        if (search.domainId !== 'all') {
            setDomainCurrentId(search.domainId);
        } else if (domainRows.length > 0) {
            setDomainCurrentId(domainRows[0].id);
        }
    }, [search.domainId, domainRows]);

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
