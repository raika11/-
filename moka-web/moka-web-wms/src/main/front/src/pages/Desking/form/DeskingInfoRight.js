import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import { putDeskingWork, postDeskingWork, changeContents } from '~/stores/desking/deskingStore';
import { WmsTextField, WmsButton, WmsText } from '~/components';
import ImageEditDialog from '../dialog/ImageEditDialog';
import RelationArticleDialog from '../dialog/RelationArticleDialog';
import DeskingImageInput from './DeskingImageInput';
import RelationArticleTag from './RelationArticleTag';
import Core from './Core';

/**
 * 데스킹 수정폼 오른쪽
 */
const DeskingInfoRight = (props) => {
    const { classes, workData = {}, component = {}, relWorkData = [], isDummyForm = false } = props;
    const dispatch = useDispatch();

    // 데스킹 정보
    const [bodyHead, setBodyHead] = useState('');
    const [thumbnailFile, setThumnbnailFile] = useState(null); // 이미지 파일
    const [thumbnailFileName, setThumbnailFileName] = useState(''); // 썸네일파일명(DB)

    // 다이얼로그
    const [imageEditOpen, setImageEditOpen] = useState(false);
    const [relArticleOpen, setRelArticleOpen] = useState(false);

    // 저장 클릭
    const onSaveAction = useCallback(
        (e) => {
            console.log(Core.prototype.infoObj);
            const { contentsId } = Core.prototype.infoObj;
            if (contentsId && contentsId !== '') {
                dispatch(
                    putDeskingWork({
                        componentWorkSeq: component.seq,
                        deskingWork: Core.prototype.infoObj,
                        success: () => {
                            setThumnbnailFile(null);
                        }
                    })
                );
            } else {
                // 컨텐츠아이디가 없는 더미기사 저장(데스킹워크에 편집기사 추가)
                // contentsOrder 설정(맨 마지막)
                Core.prototype.push('info', {
                    key: 'contentsOrder',
                    value: component.deskingWorks.length + 1
                });
                dispatch(
                    postDeskingWork({
                        componentWorkSeq: component.seq,
                        datasetSeq: component.datasetSeq,
                        deskingWork: Core.prototype.infoObj,
                        success: ({ deskingWorks }) => {
                            // 성공 콜백
                            if (deskingWorks.length > 0) {
                                const lastWorks = deskingWorks[deskingWorks.length - 1];
                                dispatch(
                                    changeContents({
                                        contentsId: lastWorks.contentsId
                                    })
                                );
                            }
                            setThumnbnailFile(null);
                        }
                    })
                );
            }
        },
        [dispatch, component]
    );

    // state 초기화
    useEffect(() => {
        setBodyHead(workData.bodyHead || '');
        setThumbnailFileName(workData.thumbnailFileName || '');
        Core.prototype.push('info', {
            key: 'contentsAttr',
            value: isDummyForm ? 'D' : workData.contentsAttr
        });
        Core.prototype.push('info', { key: 'contentsId', value: workData.contentsId });
    }, [workData, relWorkData, isDummyForm]);

    // 코어에 함수 연결
    useEffect(() => {
        Core.prototype.onSaveAction = onSaveAction;
    }, [onSaveAction]);

    useEffect(() => {
        Core.prototype.push('info', { key: 'bodyHead', value: bodyHead });
        Core.prototype.push('info', { key: 'thumbnailFileName', value: thumbnailFileName });
        Core.prototype.push('info', { key: 'thumbnailFile', value: thumbnailFile });
    }, [bodyHead, thumbnailFileName, thumbnailFile]);

    return (
        <div className={classes.infoRightRoot}>
            {/* 탑버튼 */}
            <div className={classes.infoTopButton}>
                <WmsButton
                    color="info"
                    size="long"
                    overrideClassName={classes.mr8}
                    onClick={onSaveAction}
                >
                    저장
                </WmsButton>
                <WmsButton color="default" size="long">
                    리로드
                </WmsButton>
            </div>
            <div className={classes.infoRightContent}>
                <div className={classes.infoDetail}>
                    <div className={clsx(classes.mb8)}>
                        <Typography variant="subtitle1" component="p" className={classes.mb8}>
                            리드문
                        </Typography>
                        <WmsTextField
                            fullWidth
                            multiline
                            rows={6}
                            name="bodyHead"
                            value={bodyHead}
                            onChange={(e) => setBodyHead(e.target.value)}
                        />
                    </div>
                    <div className={clsx(classes.inLine, classes.mb8)}>
                        <WmsText value="관련기사" width={50} />
                        <WmsButton
                            color="wolf"
                            size="long"
                            onClick={() => setRelArticleOpen(true)}
                            disabled={isDummyForm}
                        >
                            검색
                        </WmsButton>
                    </div>
                    <div
                        className={clsx(classes.infoRightRelation, {
                            [classes.disabled]: isDummyForm
                        })}
                    >
                        {relWorkData.map((relData, idx) => (
                            <RelationArticleTag
                                key={idx}
                                index={idx}
                                currentData={relData}
                                component={component}
                                workData={workData}
                                classes={classes}
                            />
                        ))}
                    </div>
                </div>

                {/* 이미지 편집 */}
                <div className={classes.infoRightImageEdit}>
                    <div className={clsx(classes.infoRightImageInsert, classes.mb8)}>
                        <DeskingImageInput
                            classes={classes}
                            thumbnailFile={thumbnailFile}
                            thumbnailFileName={thumbnailFileName}
                            setThumnbnailFile={setThumnbnailFile}
                            setThumbnailFileName={setThumbnailFileName}
                            workData={workData}
                        />
                    </div>

                    <div className={classes.spaceBetween}>
                        <WmsButton color="wolf" size="lg" onClick={() => setImageEditOpen(true)}>
                            편집
                        </WmsButton>
                        <WmsButton color="wolf" size="lg">
                            대표사진변경
                        </WmsButton>
                    </div>
                </div>
            </div>

            {/* 대표이미지 변경 다이얼로그 */}
            <ImageEditDialog open={imageEditOpen} onClose={() => setImageEditOpen(false)} />

            {/* 관련기사 */}
            <RelationArticleDialog
                open={relArticleOpen}
                onClose={() => setRelArticleOpen(false)}
                component={component}
                contentsId={workData.contentsId}
            />
        </div>
    );
};

export default DeskingInfoRight;
