package jmnet.moka.core.tps.mvc.volume.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import jmnet.moka.common.data.support.SearchDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 볼륨 검색 DTO
 * 
 * @author jeon
 *
 */
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class VolumeSearchDTO extends SearchDTO {

    private static final long serialVersionUID = 7654699437575812334L;

    private String searchType;

    private String keyword;

    // 검색 조건의 기본값을 설정
    public VolumeSearchDTO() {
        super("volumeId,asc");
    }
}
