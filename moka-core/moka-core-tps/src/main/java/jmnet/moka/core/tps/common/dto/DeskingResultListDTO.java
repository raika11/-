package jmnet.moka.core.tps.common.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonRootName;
import jmnet.moka.common.utils.dto.ResultListDTO;
import jmnet.moka.core.tps.mvc.page.dto.PageSimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@JsonRootName("resultDeskingInfo")
@AllArgsConstructor
@Data
@SuperBuilder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class DeskingResultListDTO<T> extends ResultListDTO<T> {


	public DeskingResultListDTO() {
	}

	private static final long serialVersionUID = -8653104967829522784L;
	
	private PageSimpleDTO page;

}
