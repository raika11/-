package jmnet.moka.web.push.mvc.sender.entity;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * 푸시기사 정보
 */
@Entity
@Table(name = "TB_PUSH_CONTENTS")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class PushContents implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 콘텐트 일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CONTENT_SEQ", nullable = false)
    private Long contentSeq;

    /**
     *  노출유무
     */
    @Column(name = "USED_YN")
    private String usedYn;

    /**
     * 푸시상태
     */
    @Column(name = "PUSH_YN")
    private String pushYn;

    /**
     * 푸시종류(속보:T, 추천기사:S, 미리보는오늘:R, 뉴스룸레터:N)
     */
    @Column(name = "PUSH_TYPE")
    private String pushType;

    /**
     * Push제목의 아이콘 부분(속보:B, 단독:S)
     */
    @Column(name = "ICON_TYPE")
    private String iconType;

    /**
     * 레터에서 편집자 사진 노출여부(Y/N)
     */
    @Column(name = "PIC_YN")
    private String picYn;

    /**
     * 메일 발송 여부 ( Y:발송, N:발송안함 )
     */
    @Column(name = "SEND_EMAIL")
    private String sendEmail;

    /**
     * 출고예약
     */
    @Column(name = "RSV_DT")
    private Date rsvDt;

    /**
     * 작성 기자 아이디 - 뉴스룸 레터용
     */
    @Column(name = "REP_ID")
    private String repId;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT")
    private Date regDt;

    /**
     * 등록자 아이디
     */
    @Column(name = "REG_ID")
    private String regId;

    /**
     * 수정일시
     */
    @Column(name = "MOD_DT")
    private Date modDt;

    /**
     * 수정자 아이디
     */
    @Column(name = "MOD_ID")
    private String modId;

    /**
     * 관련 콘텐트ID
     */
    @Column(name = "REL_CONTENT_ID")
    private Long relContentId;

    /**
     * 관련 콘텐트URL
     */
    @Column(name = "REL_URL", nullable = false)
    private String relUrl;

    /**
     * 이미지 URL
     */
    @Column(name = "IMG_URL", nullable = false)
    private String imgUrl;

    /**
     * 푸시 이미지 URL
     */
    @Column(name = "PUSH_IMG_URL", nullable = false)
    private String pushImgUrl;

    /**
     * 제목
     */
    @Column(name = "TITLE", nullable = false)
    private String title;

    /**
     * 서브 타이틀(편집용)
     */
    @Column(name = "SUB_TITLE", nullable = false)
    private String subTitle;

    /**
     * 내용
     */
    @Column(name = "CONTENT", nullable = false)
    private String content;
}
