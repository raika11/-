package jmnet.moka.core.tps.mvc.code.dto;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class CodeDTO implements Serializable {
    private static final long serialVersionUID = -8077140985874866054L;
    
    private String codeId;
    
    private String codeLevel;
    
    private String codeName;
    
    private Integer codeOrder;
    
    private String createYmdt;
    
    private String creator;
    
    private String fileName;
    
    private String filPath;
    
    private String largeCodeId;
    
    private String middleCodeId;
    
    private String modefiedYmdt;
    
    private String modifier;
    
    private String samllCodeId;
    
    private String thumbnailFileName;
    
    private String thumbnailFilePath;
    
    private String useYn;
}
