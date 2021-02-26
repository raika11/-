package jmnet.moka.core.mail.mvc.dto;

import java.io.Serializable;
import java.util.Date;
import javax.validation.constraints.NotNull;
import jmnet.moka.common.utils.McpDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class EmsSendDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    private Long autocode;

    private String legacyid;

    private String mailtype;

    private String email;

    private String name;

    @Builder.Default
    private Date insertdate = McpDate.now();

    private Date sendtime;

    @Builder.Default
    private String sendyn = "N";

    private Date opentime;

    private Date senttime;

    private Integer cmpncode;

    private String fromaddress;

    private String fromname;

    private String title;

    private String tag1;

    private String tag2;

    private String tag3;

    private String tag4;

    private String tag5;

    private String tag6;

    private String tag7;

    private String tag8;

    private String tag9;

    private String tag10;

}
