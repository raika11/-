package jmnet.moka.core.tps.common.dto.edit;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonRootName;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * <pre>
 *
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
@ToString
@EqualsAndHashCode
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
public class ChannelFormatDTO {

    /**
     * 채널명 화면명 또는 업무명이라고 보면 됨
     */
    private String name;

    /**
     * 서비스 페이지 url
     */
    private String url;

    /**
     * 서비스 페이지 url url 값과 동일함. 다른 채널을 찾지 못함.
     */
    @JacksonXmlProperty(localName = "baseurl")
    private String baseUrl;

    /**
     * 채널의 부분 요소 목록
     */
    @JacksonXmlElementWrapper(localName = "parts")
    private List<PartDTO> parts;


    private Long lastModified;
}
