/**
 * msp-tps DeskingRepositorySupport.java 2020. 8. 11. 오전 10:42:56 ssc
 */
package jmnet.moka.core.tps.mvc.desking.repository;

/**
 * <pre>
 * 
 * 2020. 8. 11. ssc 최초생성
 * </pre>
 * 
 * @since 2020. 8. 11. 오전 10:42:56
 * @author ssc
 */
public interface DeskingWorkRepositorySupport {
    public void deleteByDatasetSeq(Long datasetSeq, String creator);
}
