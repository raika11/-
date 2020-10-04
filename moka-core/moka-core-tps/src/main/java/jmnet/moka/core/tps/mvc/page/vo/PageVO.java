/**
 * msp-tps PageVo.java 2020. 7. 8. 오전 11:07:26 ssc
 */
package jmnet.moka.core.tps.mvc.page.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import javax.persistence.Column;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.core.type.TypeReference;
import jmnet.moka.core.tps.mvc.domain.dto.DomainSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("PageVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class PageVO implements Serializable {

    private static final long serialVersionUID = 947646099080077257L;

    public static final Type TYPE = new TypeReference<List<PageVO>>() {}.getType();

    @Column(name = "PAGE_SEQ")
    private Long pageSeq;

    @Column(name = "PAGE_NAME")
    private String pageName;

    private DomainSimpleDTO domain;

    @Column(name = "PAGE_URL")
    private String pageUrl;
}
