import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '@material-ui/core';
import { WmsButton } from '~/components';
import {
    changeSearchOption,
    changeEditAll,
    getTemplates,
    saveTemplate
} from '~/stores/template/templateStore';
import { getTPZone } from '~/stores/etccodeType/etccodeTypeStore';
import { changeLatestMediaId, changeLatestDomainId } from '~/stores/auth/authStore';
import { postAllComponents } from '~/stores/component/componentStore';
import style from '~/assets/jss/pages/Template/TemplateInfoStyle';
import TemplateForm from './components/TemplateForm';
import DeleteDialog from './dialog/DeleteDialog';

const CopyDialog = React.lazy(() => import('./dialog/CopyDialog'));
const CreateComponentDialog = React.lazy(() => import('./dialog/CreateComponentDialog'));
const useStyle = makeStyles(style);
const Loading = () => <></>;

/**
 * 템플릿 정보입력 컨테이너
 */
const TemplateInfoContainer = () => {
    const classes = useStyle();
    const dispatch = useDispatch();
    let { templateSeq: paramSeq } = useParams();
    let history = useHistory();
    const { latestMediaId, latestDomainId, search, templateData, tpZoneRows } = useSelector(
        (store) => ({
            latestMediaId: store.authStore.latestMediaId,
            latestDomainId: store.authStore.latestDomainId,
            search: store.templateStore.search,
            templateData: store.templateStore.detail,
            tpZoneRows: store.etccodeTypeStore.tpZoneRows
        })
    );

    // 템플릿 state
    const [templateName, setTemplateName] = useState('');
    const [description, setDescription] = useState('');
    const [templateWidth, setTemplateWidth] = useState('');
    const [cropWidth, setCropWidth] = useState('');
    const [cropHeight, setCropHeight] = useState('');
    const [templateSeq, setTemplateSeq] = useState('');
    const [templateGroup, setTemplateGroup] = useState(undefined);
    const [templateThumbnail, setTemplateThumbnail] = useState(undefined);
    const [inputTag, setInputTag] = useState('');
    const [thumbnail, setThumbnail] = useState(undefined);
    const [mediaChangeCnt, setMediaChangeCnt] = useState(0);
    const [btnDisabled, setBtnDisabled] = useState(true);

    // validate state
    const [invalidList, setInvalidList] = useState([]);

    // 다이얼로그 state
    const [copyOpen, setCopyOpen] = useState(false);
    const [ccOpen, setCcOpen] = useState(false);
    const [delOpen, setDelOpen] = useState(false);

    /**
     * 템플릿데이터 change 콜백
     * @param {object} e 이벤트
     */
    const handleChange = useCallback((e) => {
        if (e.target.name === 'templateName') {
            setTemplateName(e.target.value);
        } else if (e.target.name === 'description') {
            setDescription(e.target.value);
        } else if (e.target.name === 'templateWidth') {
            setTemplateWidth(e.target.value);
        } else if (e.target.name === 'cropWidth') {
            setCropWidth(e.target.value);
        } else if (e.target.name === 'cropHeight') {
            setCropHeight(e.target.value);
        } else if (e.target.name === 'templateGroup') {
            setTemplateGroup(e.target.value);
        }
    }, []);

    /**
     * validate 함수
     */
    const validate = () => {
        // let totErr = [];
        // if (!/[^\s\t\n]+/.test(templateName)) {
        //     let err = {
        //         field: 'templateName',
        //         reason: '템플릿명을 입력해주세요'
        //     };
        //     totErr.push(err);
        // }
        // setInvalidList(totErr);
        // if (totErr.length < 1) {
        //     return true;
        // }
        // return false;
        return true;
    };

    /**
     * 템플릿 저장
     * @param {object} e 클릭 이벤트
     */
    const onSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let newTemp = {
            ...templateData,
            templateSeq,
            templateGroup,
            templateName,
            templateThumbnail,
            templateWidth,
            cropWidth,
            cropHeight,
            description
        };
        // 검증
        if (validate(newTemp)) {
            if (thumbnail) {
                // 썸네일 파일 있으면 썸네일 파일 셋팅
                newTemp.templateThumbnailFile = thumbnail;
            }
            if (!templateData.templateSeq || templateData.templateSeq === '') {
                // 새 템플릿 저장 시에 도메인ID 셋팅
                newTemp.domain = { domainId: search.domainId };
                newTemp.domainId = search.domainId;
            }
            dispatch(
                saveTemplate({
                    actions: [changeEditAll(newTemp)],
                    success: ({ templateSeq: resultSeq, domain }) => {
                        history.push(`/template/${resultSeq}`);
                        dispatch(
                            changeSearchOption({
                                key: 'domainId',
                                value: domain ? domain.domainId : 'all'
                            })
                        );
                    }
                })
            );
        }
        setThumbnail(undefined);
    };

    /**
     * 컴포넌트 생성 > 저장버튼
     * @param {Array} param0.components 컴포넌트리스트
     */
    const onSaveComponents = ({ components }) => {
        dispatch(postAllComponents({ components, success: () => dispatch(getTemplates()) }));
    };

    useEffect(() => {
        // 버튼 disabled처리
        if (paramSeq) {
            setBtnDisabled(false);
        } else {
            setBtnDisabled(true);
        }
    }, [paramSeq]);

    useEffect(() => {
        // 스토어에서 가져온 템플릿 데이터 셋팅
        setThumbnail(undefined);
        setTemplateSeq(templateData.templateSeq || '');
        setTemplateName(templateData.templateName || '');
        setTemplateWidth(templateData.templateWidth || '');
        setCropWidth(templateData.cropWidth || '');
        setCropHeight(templateData.cropHeight || '');
        setDescription(templateData.description || '');
        setTemplateGroup(templateData.templateGroup || '');
        setTemplateThumbnail(templateData.templateThumbnail);
        setInputTag(templateData.inputTag || '');
        setInvalidList([]);
    }, [templateData]);

    useEffect(() => {
        // 위치그룹 코드 조회
        if (tpZoneRows.length < 1) {
            dispatch(getTPZone());
        }
    }, [tpZoneRows, dispatch]);

    useEffect(() => {
        /**
         * 템플릿ID 링크로 다이렉트 접속 시,
         * 템플릿의 mediaId, domainId 정보로 latestMediaId, latestDomainId를 셋팅한다
         * 이 작업은 최초 한번만 한다!!
         */
        if (mediaChangeCnt < 1) {
            let d = Object.prototype.hasOwnProperty.call(templateData, 'domain');
            if (d && templateData.domain !== null) {
                // 공통 도메인이 아닌 템플릿
                if (templateData.domain.mediaId !== latestMediaId) {
                    dispatch(
                        changeLatestMediaId({
                            mediaId: templateData.domain.mediaId,
                            domainId: templateData.domain.domainId
                        })
                    );
                } else if (templateData.domain.domainId !== latestDomainId) {
                    dispatch(changeLatestDomainId(templateData.domain.domainId));
                }
                setMediaChangeCnt(mediaChangeCnt + 1);
            } else if (Object.prototype.hasOwnProperty.call(templateData, 'templateSeq')) {
                // 공통 도메인 템플릿
                dispatch(changeSearchOption({ key: 'domainId', value: 'all' }));
            }
        }
    }, [templateData, dispatch, latestMediaId, latestDomainId, mediaChangeCnt]);

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                {/* 버튼 */}
                <div className={classes.buttonGroup}>
                    <div className="left">
                        <WmsButton
                            color="wolf"
                            disabled={btnDisabled}
                            onClick={() => setCcOpen(true)}
                        >
                            <span>컴포넌트 생성</span>
                        </WmsButton>
                        <WmsButton
                            color="wolf"
                            disabled={btnDisabled}
                            onClick={() => setCopyOpen(true)}
                        >
                            <span>복사</span>
                        </WmsButton>
                    </div>
                    <div className="right">
                        <WmsButton color="info" onClick={onSave}>
                            <span>저장</span>
                            <Icon>save</Icon>
                        </WmsButton>
                        <WmsButton
                            color="del"
                            onClick={() => setDelOpen(true)}
                            disabled={btnDisabled}
                        >
                            <span>삭제</span>
                            <Icon>delete</Icon>
                        </WmsButton>
                    </div>
                </div>

                {/* 폼 */}
                <TemplateForm
                    invalidList={invalidList}
                    tpZoneRows={tpZoneRows}
                    handleChange={handleChange}
                    templateName={templateName}
                    description={description}
                    templateWidth={templateWidth}
                    cropWidth={cropWidth}
                    cropHeight={cropHeight}
                    thumbnail={thumbnail}
                    setThumbnail={setThumbnail}
                    templateSeq={templateSeq}
                    templateGroup={templateGroup}
                    templateThumbnail={templateThumbnail}
                    setTemplateThumbnail={setTemplateThumbnail}
                    inputTag={inputTag}
                />

                {/* 삭제 다이얼로그 */}
                <DeleteDialog
                    open={delOpen}
                    onClose={() => setDelOpen(false)}
                    templateSeq={templateData.templateSeq}
                    templateName={templateData.templateName}
                />

                {/* 템플릿 복사 다이얼로그 */}
                <Suspense fallback={<Loading />}>
                    <CopyDialog
                        open={copyOpen}
                        onClose={() => setCopyOpen(false)}
                        templateName={templateData.templateName}
                        templateSeq={templateData.templateSeq}
                        domainId={templateData.domain ? templateData.domain.domainId : 'all'}
                        classes={classes}
                    />
                </Suspense>

                {/* 컴포넌트 생성 다이얼로그 */}
                <Suspense fallback={<Loading />}>
                    <CreateComponentDialog
                        open={ccOpen}
                        onSave={onSaveComponents}
                        onClose={() => setCcOpen(false)}
                        classes={classes}
                    />
                </Suspense>
            </div>
        </div>
    );
};

export default TemplateInfoContainer;
