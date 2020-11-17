import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { agGrids } from '@utils/agGridUtil';
import { dragStopGrid } from '@store/desking/gridAction';

const ReadyGrid = (props) => {
    const { grid, component, isComponent = false, updateGridCount } = props;
    const dispatch = useDispatch();
    const components = useSelector((store) => store.desking.list);

    useEffect(() => {
        components.forEach((comp, index) => {
            if (!isComponent || component.seq !== comp.seq) {
                // const compGrid = document.querySelector(`#agGrid-${comp.seq}`);
                const targetIndex = index;

                const dropZone = {
                    getContainer: () => {
                        // return compGrid;
                        //  .ag-body-viewport dom을 return한다
                        return grid.gridOptionsWrapper.layoutElements[2];
                    },
                    onDragStop: (p) => {
                        if (agGrids.prototype.grids[targetIndex].api) {
                            const option = {
                                srcGrid: p,
                                tgtGrid: agGrids.prototype.grids[targetIndex],
                                srcComponent: component,
                                tgtComponent: comp,
                            };
                            dispatch(dragStopGrid(option));
                        }
                    },
                };

                if (!grid.api) {
                    console.warn('AgGrid GridOptions Not Existing');
                    return;
                }

                // 동일한 드롭존이 존재할 수 있으므로 삭제 후 다시 추가한다
                grid.api.removeRowDropZone(dropZone);
                grid.api.addRowDropZone(dropZone);
            }
        });
        // updateGridCount는 기사목록테이블에서 컴포넌트가 바뀔때마다, dropzone을 추가하기위해 추가함.
    }, [component, components, dispatch, grid, isComponent, updateGridCount]);

    return null;
};

export default ReadyGrid;
