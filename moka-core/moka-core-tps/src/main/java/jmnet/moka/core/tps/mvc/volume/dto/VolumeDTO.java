package jmnet.moka.core.tps.mvc.volume.dto;

import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 볼륨 DTO
 * 
 * @author jeon
 *
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class VolumeDTO implements Serializable {

    private static final long serialVersionUID = 1254731673802532231L;

    public static final Type TYPE = new TypeReference<List<VolumeDTO>>() {}.getType();

    @Pattern(regexp = ".{0}|(^[A-Z]{2}$)", message = "{tps.volume.error.invalid.volumeId}")
    private String volumeId;

    @NotNull(message = "{tps.volume.error.invalid.volumeLanguage}")
    @Pattern(regexp = "[^\\s]+", message = "{tps.volume.error.invalid.volumeLanguage}")
    private String lang;

    @NotNull(message = "{tps.volume.error.invalid.volumeName}")
    @Pattern(regexp = "[^\\s]+", message = "{tps.volume.error.invalid.volumeName}")
    private String volumeName;

    @NotNull(message = "{tps.volume.error.invalid.volumePath}")
    @Pattern(regexp = "[^\\s]+", message = "{tps.volume.error.invalid.volumePath}")
    private String volumePath;

    @NotNull(message = "{tps.volume.error.invalid.volumeSource}")
    @Pattern(regexp = "[^\\s]+", message = "{tps.volume.error.invalid.volumeSource}")
    private String volumeSource;
}
