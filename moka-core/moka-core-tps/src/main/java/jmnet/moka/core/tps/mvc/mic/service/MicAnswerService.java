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
     * 답변수정(사용여부)
     *
     * @param answSeq 답변순번
     * @param usedYn  사용여부
     */
    void updateMicAnswerUsed(Long answSeq, String usedYn);

    /**
     * 답변수정(최상위)
     *
     * @param answSeq 답변순번
     * @param answTop 최상위여부
     */
    void updateMicAnswerTop(Long answSeq, String answTop);

    /**
     * 답변수정(상태)
     *
     * @param answSeq 답변순번
     * @param answDiv 상태
     * @param request 요청
     */
    void updateMicAnswerDiv(Long answSeq, String answDiv, HttpServletRequest request);

    /**
     * 답변 수정
     *
     * @param micAnswerVO 답변정보
     * @return 업로드 성공여부(업로드할게 없을경우는 true)
     */
    boolean updateMicAnswer(MicAnswerVO micAnswerVO)
            throws IOException;

    /**
     * 답변 등록
     *
     * @param micAnswerVO 답변정보
     * @return 등록성공여부
     * @throws IOException 예외
     */
    boolean insertMicAnswer(MicAnswerVO micAnswerVO)
            throws IOException;

    /**
     * 답변 부가정보 삭제
     *
     * @param answSeq 답변순번
     */
    void deleteAllMicAnswerRel(Long answSeq);
}
