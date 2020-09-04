import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useDispatch } from 'react-redux';
import style from '~/assets/jss/pages/ActionMenuStyle';
import { appendTag } from '~/stores/page/pageStore';

const useStyles = makeStyles(style);

/**
 * 액션메뉴
 * @param {object} props.data 클릭한 row에 대한 데이터 state
 * @param {func} props.setData 데이터 state 초기화
 */
const TemplateActionMenu = (props) => {
    const { data, setData } = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleClose = () => {
        setData(undefined);
    };

    const onAppendTag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const tag = `${new Date().getTime()}<mte:tp id="${data.row.templateSeq}" name="${
            data.row.templateName
        }"/>\n`;
        dispatch(appendTag(tag));
    };

    const onGoDetail = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(`/template/${data.row.templateSeq}`);
    };

    return (
        <>
            {data && (
                <Menu
                    anchorEl={data.anchorRef.current}
                    open={Boolean(data)}
                    onClose={handleClose}
                    variant="menu"
                    elevation={0}
                    classes={{
                        paper: classes.paper,
                        list: classes.list
                    }}
                >
                    <MenuItem key="anchor01" onClick={onAppendTag} className={classes.item}>
                        태그추가
                    </MenuItem>
                    <MenuItem key="anchor02" onClick={onGoDetail} className={classes.item}>
                        상세보기
                    </MenuItem>
                </Menu>
            )}
        </>
    );
};

export default TemplateActionMenu;
