import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import style from '~/assets/jss/pages/ActionMenuStyle';
import DeleteDialog from '../dialog/DeleteDialog';
import CopyDialog from '../dialog/CopyDialog';

const useStyles = makeStyles(style);

/**
 * 액션메뉴
 * @param {object} props.data 클릭한 row에 대한 데이터 state
 * @param {func} props.setData 데이터 state 초기화
 */
const TemplateActionMenu = (props) => {
    const { data, setData } = props;
    const classes = useStyles();
    const [delOpen, setDelOpen] = React.useState(false);
    const [copyOpen, setCopyOpen] = React.useState(false);

    return (
        <>
            {data && (
                <>
                    <Menu
                        anchorEl={data.anchorRef.current}
                        open={Boolean(data)}
                        onClose={() => setData(undefined)}
                        variant="menu"
                        elevation={0}
                        classes={{
                            paper: classes.paper,
                            list: classes.list
                        }}
                    >
                        <MenuItem
                            key="anchor01"
                            onClick={() => setCopyOpen(true)}
                            className={classes.item}
                        >
                            복사본 생성
                        </MenuItem>
                        <MenuItem
                            key="anchor02"
                            onClick={() => setDelOpen(true)}
                            className={classes.item}
                        >
                            삭제
                        </MenuItem>
                    </Menu>

                    {/* 삭제 다이얼로그 */}
                    <DeleteDialog
                        open={delOpen}
                        onClose={() => setDelOpen(false)}
                        templateSeq={data.row.templateSeq}
                        templateName={data.row.templateName}
                    />

                    {/* 템플릿 복사 다이얼로그 */}
                    <CopyDialog
                        open={copyOpen}
                        onClose={() => setCopyOpen(false)}
                        templateSeq={data.row.templateSeq}
                        templateName={data.row.templateName}
                        domainId={data.row.domainId}
                        classes={classes}
                    />
                </>
            )}
        </>
    );
};

export default TemplateActionMenu;
