package jmnet.moka.core.tps.mvc.columnist.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModelProperty;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import jmnet.moka.core.tps.common.dto.DTODateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Alias("ColumnistVO")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ColumnistVO implements Serializable {

    private static final long serialVersionUID = 4915460246745266545L;

    /**
     * 일련번호
     */
    @Column(name = "SEQ_NO")
    private String seqNo;

    /**
     * 내외부구분(I내부,O외부)
     */
    @Column(name = "INOUT")
    private String inout;

    /**
     * 상태(유효/정지)
     */
    @Column(name = "STATUS")
    private String status;

    /**
     * 기자일련번호
     */
    @Column(name = "REP_SEQ")
    private String repSeq;

    /**
     * 필진타입
     */
    @Column(name = "JPLUS_REP_DIV")
    private String jplusRepDiv;

    /**
     * 필진타입명
     */
    @Column(name = "JPLUS_REP_DIV_NM")
    private String jplusRepDivNm;
    /**
     * 칼럼니스트이름
     */
    @Column(name = "COLUMNIST_NM")
    private String jplusRcolumnistNm;

    /**
     * 등록자
     */
    @Column(name = "REG_ID")
    private String regId;

    /**
     * 등록자
     */
    @Column(name = "REG_NM")
    private String regNm;

    /**
     * 등록일시
     */
    @DTODateTimeFormat
    @ApiModelProperty(value = "등록일시", hidden = true)
    private Date regDt;

    /**
     * 수정자
     */
    @Column(name = "MOD_ID")
    private String modId;

    /**
     * 수정일시
     */
    @DTODateTimeFormat
    @ApiModelProperty(value = "수정일시", hidden = true)
    private Date modDt;

    /**
     * 기자명
     */
    @Column(name = "POSITION")
    private String position;

    /**
     * 이메일
     */
    @Column(name = "EMAIL")
    private String email;

    /**
     * 프로필사진
     */
    @Column(name = "PROFILE_PHOTO")
    private String profilePhoto;

    /**
     * 프로필
     */
    @Column(name = "PROFILE")
    private String profile;
    
}
