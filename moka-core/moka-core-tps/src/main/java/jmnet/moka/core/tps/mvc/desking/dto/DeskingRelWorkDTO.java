package jmnet.moka.core.tps.mvc.desking.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;
import javax.validation.constraints.NotNull;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 데스킹릴레이션워크DTO
 * 
 * @author jeon0525
 *
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class DeskingRelWorkDTO implements Serializable {

    private static final long serialVersionUID = -3202037818529255165L;

    public static final Type TYPE = new TypeReference<List<DeskingRelWorkDTO>>() {
    }.getType();

    private Long seq;

    private String creator;

    private Long deskingSeq;

    @NotNull
    private String contentsId;

    @NotNull
    private String relContentsId;

    private Integer relOrder;

    private String relTitle;

    private String createYmdt;

}
