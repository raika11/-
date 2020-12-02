package jmnet.moka.core.tps.mvc.editform.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonRootName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * 편집 폼 간단한 조회용
 * Project : moka
 * Package : jmnet.moka.core.tps.common.dto
 * ClassName : EditFormSimpleDTO
 * Created : 2020-10-25 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-25 07:36
 */
@JsonRootName("editForm")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
public class EditFormSimpleDTO {

    private Long formSeq;

    /**
     * 채널 ID
     */
    private String formId;

    /**
     * 채널명 화면명 또는 업무명이라고 보면 됨
     */
    private String formName;


    /**
     * 사용여부
     */
    private String usedYn;

}
