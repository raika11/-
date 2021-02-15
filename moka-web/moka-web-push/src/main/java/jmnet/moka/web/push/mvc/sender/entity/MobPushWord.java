package jmnet.moka.web.push.mvc.sender.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 푸시기사
 */
@Entity
@Table(name = "TB_MOB_PUSH_WORD")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class MobPushWord implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 단어일련번호
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "WORD_SEQ", nullable = false)
    private Long wordSeq;

    /**
     * 노출유무
     */
    @Column(name = "USED_YN")
    private String usedYn = "Y";

    /**
     * 푸시상태
     */
    @Column(name = "PUSH_YN")
    private String pushYn = "N";

    /**
     * 푸시종류(속보:T, 추천기사:S, 미리보는오늘:R, 뉴스룸레터:N)
     */
    @Column(name = "WORD_TYPE")
    private String wordType;

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
    private String sendEmail = "N";

    /**
     * 작성 기자 아이디 - 뉴스룸 레터용
     */
    @Column(name = "REP_ID")
    private String repId;

    /**
     * 푸시일자
     */
    @Column(name = "PUSH_DATE")
    private String pushDate;

    /**
     * 푸시시간
     */
    @Column(name = "PUSH_TIME")
    private String pushTime;

    /**
     * 예보위치
     */
    @Column(name = "YEBO_LOC")
    private String yeboLoc;

    /**
     * 예보상태
     */
    @Column(name = "YEBO_STS")
    private String yeboSts;

    /**
     * 출고예약
     */
    @Column(name = "RSV_DAYTIME")
    private Date rsvDaytime;

    /**
     * 등록일시
     */
    @Column(name = "REG_DT")
    private Date regDt;

    /**
     * 등록자
     */
    @Column(name = "REG_ID")
    private String regId;

    /**
     * 수정일시
     */
    @Column(name = "MOD_DT")
    private Date modDt;

    /**
     * 수정자
     */
    @Column(name = "MOD_ID")
    private String modId;

    /**
     * 제목
     */
    @Column(name = "TITLE", nullable = false)
    private String title;

    /**
     * 관련기사ID
     */
    @Column(name = "REL_TOTAL_ID", nullable = false)
    private Integer relTotalId = 0;

    /**
     * 관련기사 URL
     */
    @Column(name = "REL_URL")
    private String relUrl;

    /**
     * 이미지URL
     */
    @Column(name = "IMG_URL")
    private String imgUrl;

    /**
     * 푸시이미지URL
     */
    @Column(name = "PUSH_IMG_URL")
    private String pushImgUrl;

    /**
     * 서브 타이틀(편집용)
     */
    @Column(name = "SUB_TITLE")
    private String subTitle;

    /**
     * 내용
     */
    @Column(name = "CONTENT")
    private String content;

    /**
     * 앱별 전송 상태 정보
     */
    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "pushWord", cascade = {CascadeType.MERGE, CascadeType.REMOVE, CascadeType.PERSIST})
    private Set<MobPushWordProc> appProcs = new LinkedHashSet<MobPushWordProc>();

}
