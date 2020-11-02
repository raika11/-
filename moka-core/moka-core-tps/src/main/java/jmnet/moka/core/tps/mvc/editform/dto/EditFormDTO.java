package jmnet.moka.core.tps.mvc.editform.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonRootName;
import com.fasterxml.jackson.core.type.TypeReference;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <pre>
 * 편집 폼
 * Project : moka
 * Package : jmnet.moka.core.tps.common.dto
 * ClassName : EditFormDTO
 * Created : 2020-10-25 ince
 * </pre>
 *
 * @author ince
 * @since 2020-10-25 07:36
 */
@JsonRootName("channelFormat")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
public class EditFormDTO {

    public static final Type TYPE = new TypeReference<List<EditFormDTO>>() {
    }.getType();

    private Long formSeq;

    /**
     * 채널 ID
     */
    @Size(min = 1, max = 30, message = "{tps.edit-form.error.size.formId}")
    private String formId;

    /**
     * 채널명 화면명 또는 업무명이라고 보면 됨
     */
    private String formName;

    /**
     * 서비스 페이지 url
     */
    private String serviceUrl;

    /**
     * 사용여부
     */
    private String usedYn;

    /**
     * 서비스 페이지 url url 값과 동일함. 다른 채널을 찾지 못함.
     */
    private String baseUrl;


    //@JsonManagedReference
    //private List<EditFormItemDTO> editFormItems;


    /**
     * 파일 마지막 수정 일시
     */
    private Long lastModified = 0L;
}
