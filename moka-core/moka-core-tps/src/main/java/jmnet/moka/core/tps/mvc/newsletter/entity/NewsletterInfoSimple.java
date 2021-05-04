package jmnet.moka.core.tps.mvc.newsletter.entity;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import jmnet.moka.core.tps.common.entity.BaseAudit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
@Builder(toBuilder = true)
@Entity
@Table(name = "TB_NEWSLETTER_INFO")
public class NewsletterInfoSimple extends BaseAudit {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LETTER_SEQ")
    private Long letterSeq;

    @Column(name = "SEND_TYPE")
    private String sendType;

    @Column(name = "LETTER_TYPE")
    private String letterType;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "CHANNEL_TYPE")
    private String channelType = "";

    @Column(name = "CHANNEL_ID")
    private Long channelId = 0L;

    @Column(name = "CHANNEL_DATA_ID")
    private Long channelDateId = 0L;

    @Column(name = "SEND_PERIOD")
    private String sendPeriod;

    @Column(name = "SEND_DAY")
    private String sendDay;

    @Column(name = "SEND_TIME")
    private String sendTime;

    @Column(name = "SEND_MIN_CNT")
    private Long sendMinCnt = 1L;

    @Column(name = "SEND_MAX_CNT")
    private Long sendMaxCnt = 1L;

    @Column(name = "SEND_ORDER")
    private String sendOrder;

    @Column(name = "SENDER_NAME")
    private String senderName = "";

    @Column(name = "SCB_YN")
    private String scbYn;

    @Column(name = "SENDER_EMAIL")
    private String senderEmail = "";

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
    private Long dateTab = 0L;

    @Column(name = "DATE_TYPE")
    private Long dateType = 0L;

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

}
