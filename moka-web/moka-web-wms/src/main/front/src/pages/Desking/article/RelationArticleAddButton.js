import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { WmsButton } from '~/components';
import { agGrids } from '~/utils/agGridUtil';
import { changeHelperText } from '~/stores/article/relationArticleStore';
import style from '~/assets/jss/pages/Desking/DeskingStyle';

const useStyle = makeStyles(style);

/**
 * 관련기사 ag-grid의 등록 버튼
 * @param {object} props 인스턴스
 */
const RelationArticleAddButton = (props) => {
    const { node } = props;
    const dispatch = useDispatch();
    const classes = useStyle();

    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const { rel, main } = agGrids.prototype.rgrids;
        let possible = true;
        if (!rel.api) {
            possible = false;
            return;
        }

        // 대표기사, 관련기사에 없는 기사만 추가함
        if (rel.api.getRowNode(node.data.contentsId)) {
            possible = false;
            dispatch(changeHelperText('동일한 관련기사가 존재합니다.'));
            return;
        }
        if (main.api) {
            if (main.api.getRowNode(node.data.contentsId)) {
                dispatch(
                    changeHelperText('대표기사와 동일한 기사는 관련기사로 등록할 수 없습니다.')
                );
                possible = false;
                return;
            }
        }

        if (possible) {
            dispatch(changeHelperText(''));

            // Article 데이터 -> DeskingRelWork 데이터로 변경
            let newRelWork = {
                seq: '',
                deskingSeq: '', // 데스킹 아이디
                contentsId: '', // 데스킹워크의 컨텐츠아이디
                relContentsId: node.data.contentsId,
                relOrder: 0,
                relTitle: node.data.title
            };

            rel.api.applyTransaction({
                add: [newRelWork]
            });
        }
    };

    return (
        <WmsButton color="wolf" overrideClassName={classes.relArticleAddButton} onClick={onClick}>
            등록
        </WmsButton>
    );
};

export default RelationArticleAddButton;
