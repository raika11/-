import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import ImageIcon from '@material-ui/icons/Image';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { WmsIconButton } from '~/components';
import style from '~/assets/jss/components/WmsCard/WmsThumbnailCardStyle';

const useStyle = makeStyles(style);

/**
 * WmsThumbnailCard
 * @param {string} props.img 이미지 src
 * @param {string} props.alt 이미지 alt
 * @param {func} props.onActionBtnClick 카드헤더 액션
 * @param {array} props.actionButtons 액션버튼 리스트
 * @param {string|number} props.width 카드의 width
 * @param {string|number} props.height 카드의 height
 * @param {string|number} props.useYn 카드의 사용여부
 * @param {string} props.overrideClassName 추가적인 css
 * @param {string} props.title 타이틀영역 텍스트
 * @param {string} props.body 바디영역 텍스트
 * @param {string} props.overlayText 오버레이영역 텍스트
 * @param {string} props.selected 선택 여부
 * @param {Element} props.onlyThumbnail 사진만 카드로 사용
 */
const WmsThumbnailCard = (props) => {
    const {
        img,
        alt,
        onActionBtnClick,
        actionButtons = [],
        width,
        height,
        useYn,
        overrideClassName,
        title,
        body,
        overlayText,
        selected,
        onlyThumbnail = false,
        ...rest
    } = props;

    const classes = useStyle({ width, height, useYn });
    const anchorRef = useRef(null);
    const imgRef = useRef(null);
    const wrapRef = useRef(null);

    const clickEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onActionBtnClick.call(this, { anchorRef });
    };

    // 이미지 로드 시 landscape, portrait 셋팅
    useEffect(() => {
        if (imgRef.current !== null) {
            let image = new Image();
            image.src = imgRef.current.src;
            image.onload = (imgProps) => {
                let w = imgProps.path[0].width;
                let h = imgProps.path[0].height;
                let rate = 1;
                if (wrapRef.current) {
                    rate = wrapRef.current.clientWidth / wrapRef.current.clientHeight;
                }
                try {
                    if (w / h > rate) {
                        imgRef.current.className = classes.landscape;
                    } else {
                        imgRef.current.className = classes.portrait;
                    }
                    imgRef.current.style.visibility = 'visible';
                } catch (e) {
                    // console.log(e);
                }
            };
        }
    }, [classes]);

    return (
        <Card
            elevation={0}
            className={clsx(classes.root, { [classes.selected]: selected }, overrideClassName)}
            {...rest}
        >
            <CardContent
                className={clsx(classes.content, { [classes.onlyThumbnail]: onlyThumbnail })}
                ref={wrapRef}
            >
                {img && (
                    <img
                        src={img}
                        alt={alt || '썸네일이미지'}
                        ref={imgRef}
                        className={classes.hidden}
                    />
                )}
                {!img && (
                    <div className={classes.svg}>
                        <ImageIcon fontSize="large" />
                    </div>
                )}
                {overlayText && (
                    <div className={classes.overlayBox}>
                        <Typography component="p" className={classes.overlayText}>
                            {overlayText}
                        </Typography>
                    </div>
                )}
            </CardContent>
            {!onlyThumbnail && (
                <CardActions className={classes.actions}>
                    <div className={classes.actionsTop}>
                        {title && (
                            <Tooltip title={title}>
                                <Typography component="p" className={classes.titleText}>
                                    {title.length > 18 ? `${title.substring(0, 16)}...` : title}
                                </Typography>
                            </Tooltip>
                        )}
                        <div className={classes.actionButtons}>
                            {actionButtons &&
                                actionButtons.map((b) => (
                                    <WmsIconButton
                                        key={b.key}
                                        className={b.className}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            b.onClick.call(this, { anchorRef });
                                        }}
                                        buttonRef={anchorRef}
                                        icon={b.icon}
                                    />
                                ))}
                            {/* 3단 메뉴 버튼 안에 들어가는 액션들 */}
                            {onActionBtnClick && (
                                <WmsIconButton
                                    className={classes.rotateIcon}
                                    onClick={clickEvent}
                                    buttonRef={anchorRef}
                                >
                                    <MoreHorizIcon />
                                </WmsIconButton>
                            )}
                        </div>
                    </div>
                    {body && (
                        <Tooltip title={body}>
                            <Typography component="p" className={classes.bodyText}>
                                {body.length > 20 ? `${body.substring(0, 18)}...` : body}
                            </Typography>
                        </Tooltip>
                    )}
                </CardActions>
            )}
        </Card>
    );
};

export default WmsThumbnailCard;
