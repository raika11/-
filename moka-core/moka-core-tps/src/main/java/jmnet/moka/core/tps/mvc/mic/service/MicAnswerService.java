/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.service;

import java.io.IOException;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import jmnet.moka.core.tps.mvc.mic.dto.MicAnswerSearchDTO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAnswerRelVO;
import jmnet.moka.core.tps.mvc.mic.vo.MicAnswerVO;

/**
 * Description: 답변(포스트,피드) 서비스
 *
 * @author ssc
 * @since 2021-01-28
 */
public interface MicAnswerService {
    /**
     * 답변(포스트,피드) 목록 검색
     *
     * @param search 검색조건
     * @return 답변목록
     */
    List<MicAnswerVO> findAllMicAnswer(MicAnswerSearchDTO search);

    /**
     * 답변(포스트,피드) 상세조회
     *
     * @param answSeq 답변순번
     * @return 답변정보
     */
    MicAnswerVO findMicAnswerById(Long answSeq);

    /**
     * 답변 부가정보 저장(삭제 후 저장함)
     *
     * @param micAnswerRelVO 답변 부가정보
     * @return 성공여부
     */
    boolean saveMicAnswerRel(MicAnswerRelVO micAnswerRelVO)
            throws IOException;

    /**
     * 답변삭제(답변사용여부 수정처리함)
     *
     * @param answSeq 답변순번
     */
    void deleteMicAnswer(Long answSeq);

    /**
     * 답변상태수정
     *
     * @param answSeq 답변순번
     * @param answDiv 상태
     * @param request 요청
     */
    void updateAnswerDiv(Long answSeq, String answDiv, HttpServletRequest request);
}
