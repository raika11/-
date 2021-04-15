package jmnet.moka.web.schedule.mvc.gen.service;

import java.util.Date;
import jmnet.moka.web.schedule.mvc.gen.entity.GenStatus;
import jmnet.moka.web.schedule.mvc.gen.repository.GenStatusRepository;
import jmnet.moka.web.schedule.support.StatusResultType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class GenStatusServiceImpl implements GenStatusService {

    @Autowired
    private GenStatusRepository genStatusRepository;

    @Override
    public GenStatus insertGenStatusInit(Long jobSeq) {

        //GenStatus 데이터가 없는 최초실행 JOB인 경우 > 실행실패로 입력 / 성공 후 성공처리
        GenStatus genStatus = new GenStatus();
        genStatus.setJobSeq(jobSeq);
        genStatus.setGenResult(StatusResultType.BEFORE_EXECUTE.getCode());
        genStatus.setErrMgs(StatusResultType.BEFORE_EXECUTE.getName());
        genStatus.setGenExecTime(0L);           // 기존에 왜 -1L로 되어있는지?
        genStatus.setSendResult(0L);            //-1L
        genStatus.setSendExecTime(0L);          //-1L
        genStatus.setLastExecDt(new Date());

        return genStatusRepository.save(genStatus);
    }

    @Override
    public GenStatus updateGenStatus(GenStatus genStatus) {

        return genStatusRepository.save(genStatus);
    }
}
