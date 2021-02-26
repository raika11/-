package jmnet.moka.core.mail.mvc.dto;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class SmtpSendDTO implements Serializable {

    private String from;
    private String[] to;

    private String title;
    private String body;

    @Builder.Default
    private boolean isHtml = true;

    private String templateName;

    private Object context;
}
