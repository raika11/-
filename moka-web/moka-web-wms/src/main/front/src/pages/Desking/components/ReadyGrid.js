import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { agGrids } from '~/utils/agGridUtil';
import { dragStopGrid } from '~/stores/desking/gridStore';

const ReadyGrid = (props) => {
    const { grid, component, isComponent = true, updateGridCount } = props;
    const dispatch = useDispatch();
    const components = useSelector((store) => store.deskingStore.list);

    useEffect(() => {
        components.forEach((comp, index) => {
            if (!isComponent || component.seq !== comp.seq) {
                const compGrid = document.querySelector(`#agGrid-${comp.seq}`);
                const targetIndex = index;

                const dropZone = {
                    getContainer: () => {
                        return compGrid;
                    },
                    onDragStop: (p) => {
                        if (agGrids.prototype.grids[targetIndex].api) {
                            const option = {
                                srcGrid: p,
                                tgtGrid: agGrids.prototype.grids[targetIndex],
                                srcComponent: component,
                                tgtComponent: comp
                            };
                            dispatch(dragStopGrid(option));
                        }
                    }
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
    }, [component, components, dispatch, grid.api, isComponent, updateGridCount]);

    return null;
};

export default ReadyGrid;
