package jmnet.moka.core.tps.mvc.articlePackage.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
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
 * Package : jmnet.moka.core.tps.mvc.articlePackage.dto
 * ClassName : ArticlePackageSimpleDTO
 * Created : 2021-05-03 New
 * </pre>
 *
 * @author stsoon
 * @since 2021-05-03 오후 4:22
 */
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder(toBuilder = true)
@Alias("ArticlePackageSimpleDTO")
public class ArticlePackageSimpleDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    public static final Type TYPE = new TypeReference<List<ArticlePackageSimpleDTO>>() {
    }.getType();

    private String pkgDiv;

    private String pkgTitle;

    private String scbYn;

    @DTODateTimeFormat
    private Date regDt;

    @ApiModelProperty("종료일시")
    @DTODateTimeFormat
    private Date endDt;

    /**
     * 등록자
     */
    private MemberSimpleDTO regMember;

    // TODO: 구독 설계 여부
    private String subscribeYn;

    // TODO: PUSH 설정 여부
    private String pushYn;

    /**
     * 뉴스레터 설정 여부
     */
    private String newsletterYn;
}
