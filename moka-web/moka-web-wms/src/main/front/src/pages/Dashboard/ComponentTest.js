import React from 'react';
import SaveIcon from '@material-ui/icons/Save';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import WmsButton from '~/components/WmsButtons';
import WmsTextField from '~/components/WmsTextFields';
import WmsBreadcrumb from '~/components/WmsBreadcrumbs';

const Test = (props) => {
    return (
        <div style={{ width: 300 }}>
            컴포넌트 테스트입니다.
            <WmsTextField placeholder="테스트입니다." value="" label="테스트라벨" />
            <WmsTextField placeholder="에러텍스트필드" value="" label="에러테스트라벨" error />
            <WmsBreadcrumb separator={<NavigateNextIcon fontSize="small" />}>
                <Link href="/">크로스미디어</Link>
                <Link href="/">템플릿관리</Link>
                <Typography color="textPrimary">페이지서비스</Typography>
            </WmsBreadcrumb>
            <WmsButton color="info">
                <span>저장</span>
                <SaveIcon />
            </WmsButton>
            <WmsButton color="warning">
                <InsertDriveFileIcon />
            </WmsButton>
            <WmsButton color="info">
                <ViewCompactIcon />
            </WmsButton>
        </div>
    );
};

export default Test;
