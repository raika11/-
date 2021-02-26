package jmnet.moka.web.schedule.mvc.gen.service;

import jmnet.moka.web.schedule.mvc.gen.entity.GenStatus;

import java.util.Optional;

public interface GenStatusService {

    /**
     * 일련번호에 해당하는 genStatus가 없는 경우 > 등록
     *
     * @return GenStatus
     */
    GenStatus insertGenStatus(Long jobSeq);

    /**
     * 일련번호에 해당하는 genStatus를 갱신
     *
     * @return GenStatus
     */
    GenStatus updateGenStatus(GenStatus genStatus);

}
