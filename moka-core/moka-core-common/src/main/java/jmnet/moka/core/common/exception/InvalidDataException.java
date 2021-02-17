/**
 * msp-tps InValidContentException.java 2020. 1. 10. 오후 2:23:40 ssc
 */
package jmnet.moka.core.common.exception;

import java.util.ArrayList;
import java.util.List;
import jmnet.moka.core.common.dto.InvalidDataDTO;

/**
 * <pre>
 * 데이타가 유효하지 않을경우 예외처리
 * 2020. 1. 10. ssc 최초생성
 * </pre>
 *
 * @author ssc
 * @since 2020. 1. 10. 오후 2:23:40
 */
public class InvalidDataException extends Exception {

    private static final long serialVersionUID = 6869325291938412284L;

    List<InvalidDataDTO> invalidList;

    public InvalidDataException(String message) {
        super(message);
    }

    public InvalidDataException(String message, Throwable t) {
        super(message, t);
    }

    public InvalidDataException(List<InvalidDataDTO> invalidList, String message) {
        super(message);
        this.invalidList = invalidList;
    }

    public InvalidDataException(InvalidDataDTO invalidDto, String message) {
        super(message);
        this.invalidList = new ArrayList<InvalidDataDTO>();
        this.invalidList.add(invalidDto);
    }

    public List<InvalidDataDTO> getInvalidList() {
        return invalidList;
    }

    public void setInvalidList(List<InvalidDataDTO> invalidList) {
        this.invalidList = invalidList;
    }


}
