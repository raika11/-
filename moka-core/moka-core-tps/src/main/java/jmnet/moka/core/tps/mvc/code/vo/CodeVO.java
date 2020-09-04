package jmnet.moka.core.tps.mvc.code.vo;

import java.io.Serializable;
import javax.persistence.Column;
import org.apache.ibatis.type.Alias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("codeVO")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class CodeVO implements Serializable {
    private static final long serialVersionUID = -8218786467121204779L;

    @Column(name="SEQ")
    private String seq;
    
    @Column(name="CODE_NAME")
    private String codeName;
    
    @Column(name="CODE_PATH")
    private String codePath;
    
    @Column(name="CODE_ID")
    private String codeId;
    
    @Column(name="CODE_TYPE_ID")
    private String codeTypeId;
    
    @Column(name="CODE_LEVEL")
    private String codeLevel;
    
    @Column(name="CODE_ORDER")
    private String codeOrder;
    
    @Column(name="LARGE_CODE_ID")
    private String largeCodeId;
    
    @Column(name="MIDDLE_CODE_ID")
    private String middleCodeId;
    
    @Column(name="SMALL_CODE_ID")
    private String smallCodeId;
}
