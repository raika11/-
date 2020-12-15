/*
 * Copyright (c) 2020. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package jmnet.moka.core.tps.mvc.desking.service;

import java.util.Optional;
import jmnet.moka.core.tps.exception.NoDataException;
import jmnet.moka.core.tps.mvc.component.entity.ComponentHist;
import jmnet.moka.core.tps.mvc.desking.entity.ComponentWork;
import jmnet.moka.core.tps.mvc.desking.vo.ComponentWorkVO;

/**
 * ComponentWork Service
 *
 * @author jeon0525
 */
public interface ComponentWorkService {

    /**
     * 컴포넌트work 조회
     *
     * @param seq 순번
     * @return work컴포넌트
     */
    Optional<ComponentWork> findComponentWorkBySeq(Long seq);

    /**
     * 컴포넌트work 업데이트
     *
     * @param workVO 업데이트할 컴포넌트work VO
     * @return 업데이트된 컴포넌트work
     * @throws NoDataException 데이터없음
     * @throws Exception       예외
     */
    ComponentWork updateComponentWork(ComponentWorkVO workVO)
            throws NoDataException, Exception;

    /**
     * 컴포넌트work 스냅샷 업데이트
     *
     * @param componentWorkSeq 컴포넌트work순번
     * @param snapshotYn       스냅샷여부
     * @param snapshotBody     스냅샷HTML
     * @param regId            작업자
     * @return 등록된 컴포넌트work
     * @throws NoDataException 데이타없음
     * @throws Exception       예외
     */
    ComponentWork updateComponentWorkSnapshot(Long componentWorkSeq, String snapshotYn, String snapshotBody, String regId)
            throws NoDataException, Exception;

    /**
     * 컴포넌트work 템플릿 업데이트
     *
     * @param componentWorkSeq 컴포넌트work순번
     * @param templateSeq      템플릿순번
     * @param regId            작업자
     * @return
     * @throws NoDataException
     * @throws Exception
     */
    public ComponentWork updateComponentWorkTemplate(Long componentWorkSeq, Long templateSeq, String regId)
            throws NoDataException, Exception;

    /**
     * 컴포넌트 히스토리에서 컴포넌트 정보 불러와서 업데이트
     *
     * @param componentWorkSeq 컴포넌트work순번
     * @param componentHist    컴포넌트 히스토리
     * @return 수정된 컴포넌트work
     */
    ComponentWork updateComponentWork(Long componentWorkSeq, ComponentHist componentHist)
            throws NoDataException;
}
