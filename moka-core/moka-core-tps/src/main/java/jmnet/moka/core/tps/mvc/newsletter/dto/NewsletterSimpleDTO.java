package jmnet.moka.core.tps.mvc.newsletter.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.mvc.member.dto.MemberSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

/**
 * <pre>
 *
 * Project : moka-springboot-parent
 * Package : jmnet.moka.core.tps.mvc.newsletter.dto
 * ClassName : NewsletterProductDTO
 * Created : 2021-04-19 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-04-19 오후 2:03
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder(toBuilder = true)
@Alias("NewsletterProductDTO")
public class NewsletterSimpleDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<NewsletterSimpleDTO>>() {
    }.getType();

    private Long letterSeq;

    private String sendType;

    private String sendTypeName;

    private String letterType;

    private String letterTypeName;

    private String letterName;

    private Date sendStartDt;

    private Date lastSendDt;

    private String sendDay;

    private String sendMinCnt;

    private String sendMaxCnt;

    private String sendTime;

    private Long subscribeCount;

    private String status;

    private String statusName;

    private Date regDt;

    /**
     * 등록자
     */
    private MemberSimpleDTO regMember;

    private String abtestYn;
}
