package jmnet.moka.web.schedule.mvc.gen.service;

import jmnet.moka.web.schedule.mvc.gen.entity.GenStatus;
import jmnet.moka.web.schedule.mvc.gen.repository.GenStatusRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
@Slf4j
public class GenStatusServiceImpl implements GenStatusService{

    @Autowired
    private GenStatusRepository genStatusRepository;

    @Override
    public GenStatus insertGenStatus(Long jobSeq) {

        //GenStatus 데이터가 없는 최초실행 JOB인 경우
        GenStatus genStatus = new GenStatus();
        genStatus.setJobSeq(jobSeq);
        genStatus.setGenResult(500L);   //실패
        genStatus.setGenExecTime(-1L);  //미실행
        genStatus.setSendResult(-1L);   //미전송
        genStatus.setSendExecTime(-1L); //미실행
        genStatus.setLastExecDt(new Date());

        return genStatusRepository.save(genStatus);
    }

    @Override
    public GenStatus updateGenStatus(GenStatus genStatus) {
        return genStatusRepository.save(genStatus);
    }
}
