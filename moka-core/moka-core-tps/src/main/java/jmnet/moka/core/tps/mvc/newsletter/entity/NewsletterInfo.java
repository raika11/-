package jmnet.moka.core.tps.mvc.newsletter.entity;

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
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import jmnet.moka.core.tps.mvc.codemgt.entity.CodeSimple;
import jmnet.moka.core.tps.mvc.member.entity.MemberSimpleInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.entity
 * ClassName : NewsLetterInfo
 * Created : 2021-04-16
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-16 오후 3:18
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Entity
@Table(name = "TB_NEWSLETTER_INFO")
public class NewsletterInfo extends BaseAudit {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LETTER_SEQ")
    private Long letterSeq;

    @Column(name = "SEND_TYPE")
    private String sendType;

    @Formula("case SEND_TYPE when 'A' then '자동' else '수동' end")
    private String sendTypeName;

    @Column(name = "LETTER_TYPE")
    private String letterType;

    @Formula("case LETTER_TYPE when 'O' then '오리지널' when 'B' then '브리핑' when 'N' then '알림' else '기타' end")
    private String letterTypeName;

    @Column(name = "STATUS")
    private String status;

    @Formula("case STATUS when 'Y' then '활성' when 'P' then '임시저장' when 'S' then '중지' else '종료' end")
    private String statusName;

    @Column(name = "CHANNEL_TYPE")
    private String channelType;

    @Column(name = "CHANNEL_ID")
    private Long channelId;

    @Column(name = "CHANNEL_DATA_ID")
    private Long channelDateId;

    @Column(name = "SEND_PERIOD")
    private String sendPeriod;

    @Column(name = "SEND_DAY")
    private String sendDay;

    @Column(name = "SEND_TIME")
    private String sendTime;

    @Column(name = "SEND_MIN_CNT")
    private Long sendMinCnt = 0L;

    @Column(name = "SEND_MAX_CNT")
    private Long sendMaxCnt = 0L;

    @Column(name = "SEND_ORDER")
    private String sendOrder;

    @Column(name = "SENDER_NAME")
    private String senderName;

    @Column(name = "SCB_YN")
    private String scbYn;

    @Column(name = "SENDER_EMAIL")
    private String senderEmail;

    @Column(name = "SEND_START_DT")
    private Date sendStartDt;

    @Column(name = "SCB_LINK_YN")
    private String scbLinkYn;

    @Column(name = "CONTAINER_SEQ")
    private Long containerSeq;

    @Column(name = "FORM_SEQ")
    private Long formSeq;

    @Column(name = "HEADER_IMG")
    private String headerImg;

    @Column(name = "EDIT_LETTER_TYPE")
    private String editLetterType;

    @Column(name = "ABTEST_YN")
    private String abtestYn;

    @Column(name = "MEMO")
    private String memo;

    @Column(name = "LAST_SEND_DT")
    private Date lastSendDt;

    @Column(name = "CATEGORY")
    private String category;

    @Column(name = "TITLE_TYPE")
    private String titleType;

    @Column(name = "LETTER_TITLE")
    private String letterTitle;

    @Column(name = "DATE_TAB")
    private Long dateTab;

    @Column(name = "DATE_TYPE")
    private Long dateType;

    @Column(name = "ART_TITLE_YN")
    private String artTitleYn;

    @Column(name = "EDIT_TITLE")
    private String editTitle;

    @Column(name = "LETTER_NAME")
    private String letterName;

    @Column(name = "LETTER_ENG_NAME")
    private String letterEngName;

    @Column(name = "LETTER_IMG")
    private String letterImg;

    @Column(name = "LETTER_DESC")
    private String letterDesc;

    //    @Builder.Default
    //    @OneToMany(fetch = FetchType.LAZY, mappedBy = "newsletterInfo", cascade = {CascadeType.REMOVE})
    //    private Set<NewsletterSubscribe> newsletterSubscribes = new LinkedHashSet<>();

    //    @Builder.Default
    //    @OneToMany(fetch = FetchType.LAZY, mappedBy = "newsletterInfo", cascade = {CascadeType.REMOVE})
    //    private Set<NewsletterLog> newsletterLogs = new LinkedHashSet<>();

    @Builder.Default
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "newsletterInfo", cascade = {CascadeType.REMOVE})
    private Set<NewsletterSend> newsletterSends = new LinkedHashSet<>();

    /**
     * 분야
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "CATEGORY", referencedColumnName = "DTL_CD", insertable = false, updatable = false)
    private CodeSimple categoryInfo;

    /**
     * 등록자
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "REG_ID", insertable = false, updatable = false)
    private MemberSimpleInfo regMember;

    /**
     * 수정자
     */
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "MOD_ID", insertable = false, updatable = false)
    private MemberSimpleInfo modMember;
}
