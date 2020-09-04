import React, { useEffect, useCallback, useState } from 'react';
import clsx from 'clsx';
import produce from 'immer';
import { useSelector } from 'react-redux';
import { WmsTextField, WmsTextFieldWithDivider, WmsIconButton } from '~/components';
import AdDialog from '../dialog/AdDialog';

/**
 * 광고 리스트
 * @param {object} param.classes classes
 * @param {array} param.componentAds 광고리스트
 * @param {func} param.setComponentAds 광고리스트 수정하는 함수
 * @param {func} param.scrollHeight 스크롤 높이 조절하는 함수
 */
const ComponentAds = (props) => {
    const { classes, componentAds, setComponentAds, scrollHeight } = props;
    const { edit } = useSelector((state) => ({
        edit: state.componentStore.edit
    }));

    // 다이얼로그 설정
    const [adDialogOpen, setAdDialogOpen] = useState(false);
    const [adIndex, setAdIndex] = useState(0);

    const onComponentAdReset = useCallback(() => {
        setComponentAds([
            {
                seq: undefined,
                ad: {},
                componentSeq: edit.componentSeq || undefined,
                listParagraph: 0
            }
        ]);
    }, [edit, setComponentAds]);

    const addAds = () => {
        setComponentAds(
            produce(componentAds, (draft) => {
                draft.push({
                    seq: undefined,
                    ad: {},
                    componentSeq: edit.componentSeq || undefined,
                    listParagraph: 0
                });
            })
        );
        scrollHeight();
    };

    const removeAd = (idx) => {
        setComponentAds(
            produce(componentAds, (draft) => {
                draft.splice(idx, 1);
            })
        );
    };

    const handleAds = (e, idx) => {
        e.preventDefault();
        e.stopPropagation();
        setComponentAds(
            produce(componentAds, (draft) => {
                if (e.target.name === 'listParagraph') {
                    draft[idx].listParagraph = e.target.value;
                } else if (e.target.name === 'adSeq') {
                    draft[idx].ad.adSeq = e.target.value;
                } else if (e.target.name === 'adName') {
                    draft[idx].ad.adName = e.target.value;
                }
            })
        );
    };

    const onIconClick = (idx) => {
        setAdIndex(idx);
        setAdDialogOpen(true);
    };

    /**
     * 광고 다이얼로그 > 저장버튼
     * @param {string} param.adSeq 광고아이디
     * @param {string} param.adName 광고명
     */
    const onSave = ({ adSeq, adName }) => {
        setComponentAds(
            produce(componentAds, (draft) => {
                draft.splice(adIndex, 1, {
                    seq: draft[adIndex].seq,
                    ad: { adSeq, adName },
                    componentSeq: draft[adIndex].componentSeq,
                    listParagraph: draft[adIndex].listParagraph
                });
            })
        );
    };

    useEffect(() => {
        if (componentAds.length < 1) {
            onComponentAdReset();
        }
    }, [componentAds, onComponentAdReset]);

    const createDom = () => {
        if (componentAds.length > 0) {
            return componentAds.map((a, idx) => (
                <div key={idx} className={clsx(classes.mb8, classes.inLine)}>
                    <WmsTextField
                        overrideClassName={classes.mr8}
                        label="광고단락"
                        labelWidth="50"
                        width="100"
                        name="listParagraph"
                        value={a.listParagraph}
                        tabIndex={-1}
                        onChange={(e) => {
                            handleAds(e, idx);
                        }}
                        inputProps={{ type: 'number', min: 0 }}
                    />
                    <WmsTextFieldWithDivider
                        width="400"
                        disabled
                        dividerBefore={{
                            placeholder: 'ID',
                            value: a.ad && a.ad.adSeq ? `ID : ${a.ad.adSeq}` : '',
                            name: 'adSeq',
                            width: 60
                        }}
                        dividerAfter={{
                            placeholder: '광고를 선택해주세요',
                            icon: 'search',
                            value: a.ad && a.ad.adName ? a.ad.adName : '',
                            name: 'adName',
                            onIconClick: () => onIconClick(idx)
                        }}
                    />
                    {idx === 0 ? (
                        <WmsIconButton icon="add_box" onClick={addAds} />
                    ) : (
                        <WmsIconButton
                            icon="delete_forever"
                            onClick={() => {
                                removeAd(idx);
                            }}
                        />
                    )}
                </div>
            ));
        }
        return null;
    };

    return (
        <>
            <div className={classes.mb8}>{createDom()}</div>

            {/** API검색 팝업 */}
            {adDialogOpen && (
                <AdDialog
                    open={adDialogOpen}
                    componentAds={componentAds}
                    adIndex={adIndex}
                    onClose={() => setAdDialogOpen(false)}
                    onSave={onSave}
                />
            )}
        </>
    );
};

export default ComponentAds;
