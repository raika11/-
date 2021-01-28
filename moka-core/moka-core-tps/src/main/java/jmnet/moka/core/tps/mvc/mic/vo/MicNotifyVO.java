/*
 * Copyright (c) 2017 Joongang Ilbo, Inc. All rights reserved.
 */

package jmnet.moka.core.tps.mvc.mic.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * 시민마이크 공지
 */
@Alias("MicNotifyVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MicNotifyVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 공지일련번호
     */
    @Column(name = "NOTI_SEQ", nullable = false)
    private Long notiSeq;

    /**
     * 답변일련번호
     */
    @Column(name = "ANSW_SEQ", nullable = false)
    private Long answSeq;

    /**
     * 타입 일반(GNR), 공감(AGR), 공유(SHR), 댓글(RPL), Hot People 등록(HOT)
     */
    @Column(name = "MSG_DIV", nullable = false)
    private String msgDiv;

    /**
     * 받는사람
     */
    @Column(name = "RCV_ID", nullable = false)
    private String rcvId;

    /**
     * 보낸사람
     */
    @Column(name = "SEND_ID")
    private String sendId;

    /**
     * 보낸사람 이름
     */
    @Column(name = "SEND_NM")
    private String sendNm;

    /**
     * 로그인SNS
     */
    @Column(name = "LOGIN_SNS")
    private String loginSns;

    /**
     * 확인여부 (Y/N)
     */
    @Column(name = "IS_READ", nullable = false)
    private String read = "N";

    /**
     * 등록일시
     */
    @DTODateTimeFormat
    @Column(name = "REG_DT", nullable = false)
    private Date regDt;

    /**
     * 메시지(타입이 일반경우)
     */
    @Column(name = "NOTI_MEMO")
    private String notiMemo;

}
