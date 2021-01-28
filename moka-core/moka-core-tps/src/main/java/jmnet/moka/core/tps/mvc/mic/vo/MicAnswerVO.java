/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 시민마이크 답변
 */
@Alias("MicAnswerVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MicAnswerVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 답변일련번호
     */
    @Column(name = "ANSW_SEQ", nullable = false)
    private Long answSeq;

    /**
     * 아젠다일련번호
     */
    @Column(name = "AGND_SEQ", nullable = false)
    private Long agndSeq;

    /**
     * 사용여부
     */
    @Column(name = "USED_YN", nullable = false)
    private String usedYn = MokaConstants.YES;

    /**
     * 답변 구분(0:등록, 1:귀쫑긋, 2:PICK)
     */
    @Column(name = "ANSW_DIV")
    private String answDiv;

    /**
     * 답변 내용
     */
    @Column(name = "ANSW_MEMO")
    private String answMemo;

    /**
     * 답변 장문
     */
    @Column(name = "ANSW_MEMO_LONG")
    private String answMemoLong;

    /**
     * 추천개수
     */
    @Column(name = "GOOD_CNT", nullable = false)
    private Integer goodCnt = 0;

    /**
     * 로그인 SNS (F:페북,T:트위터)
     */
    @Column(name = "LOGIN_SNS", nullable = false)
    private String loginSns;

    /**
     * SNS 로그인 아이디
     */
    @Column(name = "LOGIN_ID", nullable = false)
    private String loginId;

    /**
     * SNS 로그인명
     */
    @Column(name = "LOGIN_NAME")
    private String loginName;

    /**
     * SNS 로그인 이미지
     */
    @Column(name = "LOGIN_IMG")
    private String loginImg;

    /**
     * 노출 순서
     */
    @Column(name = "ORD_NO", nullable = false)
    private Integer ordNo = 1;

    /**
     * 조인스 아이디
     */
    @Column(name = "MEM_ID")
    private String memId;

    /**
     * 등록일시
     */
    @DTODateTimeFormat
    @Column(name = "REG_DT", nullable = false)
    private Date regDt;

    /**
     * 등록아이피
     */
    @Column(name = "REG_IP", nullable = false)
    private String regIp;

    /**
     * 답변제목
     */
    @Column(name = "ANSW_TITLE")
    private String answTitle;

    /**
     * 해당 피드(ANSWER)를 최상단 노출 하기 위한 플래그값
     */
    @Column(name = "ANSW_TOP")
    private String answTop = MokaConstants.NO;

    /**
     * 댓글개수
     */
    @Column(name = "REPLY_CNT", nullable = false)
    private Integer replyCnt = 0;

    private MicAnswerRelVO answerRel;

}
