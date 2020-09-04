import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { copyTemplate } from '~/stores/template/templateStore';
import { WmsDialogAlert, WmsSelect, WmsTextField } from '~/components';
import { defaultDomain } from '../TemplateSearchContainer';

const CopyDialog = (props) => {
    const { open, onClose, classes, templateSeq, templateName, domainId } = props;
    const dispatch = useDispatch();
    const history = useHistory();
    const { domains } = useSelector((state) => ({
        domains: state.authStore.domains
    }));

    const [domainRows, setDomainRows] = useState([]);
    const [domainCurrentId, setDomainCurrentId] = useState('all');
    const [copyName, setCopyName] = useState('');

    const onCloseTrigger = () => {
        onClose();
    };

    const onCopy = () => {
        dispatch(
            copyTemplate({
                templateSeq,
                templateName: copyName,
                domainId: domainCurrentId,
                success: () => {
                    history.push('/template');
                    onCloseTrigger();
                }
            })
        );
    };

    useEffect(() => {
        // 도메인셀렉트의 rows 생성
        if (domains) {
            const rows1 = domains.map((m) => {
                return {
                    id: m.domainId,
                    name: m.domainName
                };
            });
            rows1.unshift(defaultDomain);
            setDomainRows(rows1);
        }
    }, [domains]);

    useEffect(() => {
        setDomainCurrentId(domainId || 'all');
        return () => {
            setDomainCurrentId('all');
        };
    }, [domainId]);

    useEffect(() => {
        setCopyName(`${templateName}_복사`);
        return () => {
            setCopyName('');
        };
    }, [templateName]);

    return (
        <WmsDialogAlert
            type="alert"
            open={open}
            onClose={onCloseTrigger}
            title="템플릿 설정복사"
            buttons={[
                { name: '저장', color: 'primary', onClick: onCopy },
                { name: '취소', onClick: onCloseTrigger }
            ]}
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
                />
            </div>
            <div>
                <WmsTextField
                    label="템플릿"
                    labelWidth={70}
                    value={copyName}
                    fullWidth
                    onChange={(e) => {
                        setCopyName(e.target.value);
                    }}
                />
            </div>
        </WmsDialogAlert>
    );
};

export default CopyDialog;
