package jmnet.moka.core.tps.mvc.schedule.server.service;

import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import jmnet.moka.core.common.MokaConstants;
import jmnet.moka.core.common.rest.RestTemplateHelper;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.dto.JobDeletedContentSearchDTO;
import jmnet.moka.core.tps.mvc.schedule.server.entity.JobContent;
import jmnet.moka.core.tps.mvc.schedule.server.repository.JobContentHistoryRepository;
import jmnet.moka.core.tps.mvc.schedule.server.repository.JobContentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Service
@Slf4j
public class JobContentServiceImpl implements JobContentService {

    @Value("http://172.29.58.94:8150")  //로컬 스케쥴서버 주소
    private String schdulerServer;

    @Autowired
    private JobContentRepository jobContentRepository;

    @Autowired
    private JobContentHistoryRepository jobContentHistoryRepository;

    private final RestTemplateHelper restTemplateHelper;

    private final EntityManager entityManager;

    @Autowired
    public JobContentServiceImpl(RestTemplateHelper restTemplateHelper, @Qualifier("tpsEntityManagerFactory") EntityManager entityManager) {
        this.restTemplateHelper = restTemplateHelper;
        this.entityManager = entityManager;
    }

    @Override
    public List<JobContent> findJobContentCodeList() {
        return jobContentRepository.findAllByUsedYnAndDelYnAndJobType(MokaConstants.YES, MokaConstants.NO, "R");
    }

    @Override
    public Page<JobContent> findJobContentList(JobContentSearchDTO search) {
        return jobContentRepository.findJobContentList(search, search.getPageable());
    }

    @Override
    public Optional<JobContent> findJobContentById(Long jobSeq) {
        return jobContentRepository.findById(jobSeq);
    }

    @Override
    public JobContent insertJobContent(JobContent jobContent) {
        JobContent result = jobContentRepository.save(jobContent);
        try {
            String url = "";
            MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();

            //등록 + 사용가능 + 반복성Job
            if (result
                    .getUsedYn()
                    .equals(MokaConstants.YES) & result
                    .getJobType()
                    .equals("S")) {
                url = schdulerServer + "/api/schedule/" + result.getJobSeq();
                ResponseEntity<String> responseEntity = restTemplateHelper.post(url, params);   //반복성job 등록
                log.debug("add schedule job result : " + responseEntity.toString());
            }
            /*
            //등록 + 사용가능 + 일회성Job (현재 기획부재로 등록방법이 미정 / 하드코딩된 데이터로 대체)
            else if(result.getUsedYn().equals(MokaConstants.YES) & result.getJobType().equals("R")){
                url = schdulerServer + "/api/reserve";
                params.add("seqNo", 1);
                params.add("jobSeq", 250);

                ResponseEntity<String> responseEntity = restTemplateHelper.post(url, params);   //일회성job 등록
                log.debug("add reserved job result : "+ responseEntity.toString());
            }
            */
        } catch (Exception e) {
            log.error("add job for scheduler is failed.");
        }
        return result;
    }

    @Override
    public JobContent updateJobContent(JobContent jobContent) {
        JobContent result = jobContentRepository.save(jobContent);
        try {
            String url = "";
            MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();

            //수정 + 사용가능 + 반복성Job
            if (result
                    .getUsedYn()
                    .equals(MokaConstants.YES) & result
                    .getJobType()
                    .equals("S")) {
                url = schdulerServer + "/api/schedule/" + result.getJobSeq();
                ResponseEntity<String> responseEntity = restTemplateHelper.post(url, params);   //반복성job 등록
                log.debug("add schedule job result : " + responseEntity.toString());
            }
            //수정 + 사용불가 + 반복성Job
            else if (result
                    .getUsedYn()
                    .equals(MokaConstants.NO) & result
                    .getJobType()
                    .equals("S")) {
                url = schdulerServer + "/api/schedule/" + result.getJobSeq();
                ResponseEntity<String> responseEntity = restTemplateHelper.delete(url); //반복성job 삭제
                log.debug("remove schedule job result : " + responseEntity.toString());
            }
            /*
            //수정 + 사용가능 + 일회성Job (현재 기획부재로 등록방법이 미정 / 직접 DB에 등록한 데이터를 조회하도록 처리)
            else if(result.getUsedYn().equals(MokaConstants.YES) & result.getJobType().equals("R")){
                JobContentHistory jobContentHistory = jobContentHistoryRepository.findFirstByJobSeqAndStatusAndDelYnOrderBySeqNoDesc(result.getJobSeq(), "0", MokaConstants.NO);
                //수정된 Job에 해당하는 예약정보가 있는 경우
                if(jobContentHistory != null){
                    url = schdulerServer + "/api/reserve";
                    params.add("seqNo", jobContentHistory.getSeqNo());
                    params.add("jobSeq", jobContentHistory.getJobSeq());

                    ResponseEntity<String> responseEntity = restTemplateHelper.post(url, params);   //일회성job 등록
                    log.debug("add reserved job result : "+ responseEntity.toString());
                }
            }
            */
        } catch (Exception e) {
            log.error("update job for scheduler is failed.");
        }

        return result;
    }

    @Override
    public void deleteJobContent(JobContent jobContent) {
        jobContent.setDelYn(MokaConstants.YES);
        jobContentRepository.save(jobContent);

        try {
            String url = "";
            MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();

            //삭제 + 사용가능 + 반복성Job
            if (jobContent
                    .getUsedYn()
                    .equals(MokaConstants.YES) & jobContent
                    .getJobType()
                    .equals("S")) {
                url = schdulerServer + "/api/schedule/" + jobContent.getJobSeq();
                ResponseEntity<String> responseEntity = restTemplateHelper.delete(url); //반복성job 삭제
                log.debug("remove schedule job result : " + responseEntity.toString());
            }

        } catch (Exception e) {
            log.error("delete job for schedule is failed.");
        }
    }

    @Override
    public boolean isValidData(JobContentSearchDTO search) {
        return jobContentRepository
                .findJobContent(search)
                .isPresent();
    }

    @Override
    public Page<JobContent> findDeletedJobContentList(JobDeletedContentSearchDTO search) {
        JobContentSearchDTO searchDeleted = new JobContentSearchDTO();
        searchDeleted.setSort(search.getSort());
        searchDeleted.setSize(search.getSize());
        searchDeleted.setSearchType(search.getSearchType());
        searchDeleted.setKeyword(search.getKeyword());
        searchDeleted.setUseTotal(search.getUseTotal());

        searchDeleted.setDelYn(MokaConstants.YES);
        searchDeleted.setCategory(search.getCategory());
        searchDeleted.setPeriod(search.getPeriod());
        searchDeleted.setSendType(search.getSendType());
        searchDeleted.setServerSeq(search.getServerSeq());



        return jobContentRepository.findJobContentList(searchDeleted, search.getPageable());
    }

    @Override
    public Optional<JobContent> findDeletedJobContentById(Long jobSeq) {
        return jobContentRepository.findByJobSeqAndDelYn(jobSeq, MokaConstants.YES);
    }

    @Override
    public void updateDeleteJobContent(JobContent jobContent) {
        jobContent.setDelYn(MokaConstants.NO);
        JobContent result = jobContentRepository.save(jobContent);
        try {
            String url = "";
            MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();

            //수정 + 사용가능 + 반복성Job
            if (result
                    .getUsedYn()
                    .equals(MokaConstants.YES) & result
                    .getJobType()
                    .equals("S")) {
                url = schdulerServer + "/api/schedule/" + result.getJobSeq();
                ResponseEntity<String> responseEntity = restTemplateHelper.post(url, params);   //반복성job 등록
                log.debug("add schedule job result : " + responseEntity.toString());
            }
            /*
            //수정 + 사용가능 + 일회성Job (현재 기획부재로 등록방법이 미정 / 직접 DB에 등록한 데이터를 조회하도록 처리)
            else if(result.getUsedYn().equals(MokaConstants.YES) & result.getJobType().equals("R")){
                JobContentHistory jobContentHistory = jobContentHistoryRepository.findFirstByJobSeqAndStatusAndDelYnOrderBySeqNoDesc(result.getJobSeq(), "0", MokaConstants.NO);
                //수정된 Job에 해당하는 예약정보가 있는 경우
                if(jobContentHistory != null){
                    url = schdulerServer + "/api/reserve";
                    params.add("seqNo", jobContentHistory.getSeqNo());
                    params.add("jobSeq", jobContentHistory.getJobSeq());

                    ResponseEntity<String> responseEntity = restTemplateHelper.post(url, params);   //일회성job 등록
                    log.debug("add reserved job result : "+ responseEntity.toString());
                }
            }
            */
        } catch (Exception e) {
            log.error("update job for scheduler is failed.");
        }
    }

    @Override
    public int findJobCd(String jobCd) {
        return jobContentRepository
                .findByJobCd(jobCd)
                .size();
    }
}
