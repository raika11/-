package jmnet.moka.web.wms.mvc.issue;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelvemonkeys.util.LinkedSet;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;
import jmnet.moka.core.tps.mvc.issue.dto.PackageKeywordDTO;
import jmnet.moka.core.tps.mvc.issue.dto.PackageMasterDTO;
import jmnet.moka.core.tps.mvc.issue.dto.PackageSearchDTO;
import jmnet.moka.core.tps.mvc.issue.entity.PackageKeyword;
import jmnet.moka.core.tps.mvc.issue.entity.PackageMaster;
import jmnet.moka.core.tps.mvc.issue.mapper.IssueMapper;
import jmnet.moka.core.tps.mvc.issue.service.PackageService;
import jmnet.moka.core.tps.mvc.issue.vo.PackageVO;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class PackageTest {

    @Autowired
    private PackageService packageService;

    @Autowired
    private IssueMapper issueMapper;

    @Autowired
    private ObjectMapper objectMapper;

    @Ignore
    @SneakyThrows
    @Test
    public void selectPackageList() {
        //        List<PackageMaster> a = packageService
        //                .findAllPackage(PackageSearchDTO
        //                        .builder()
        //                        .build())
        //                .getContent();
        assertTrue(false);

        List<PackageVO> a = issueMapper.findAll(PackageSearchDTO
                .builder()
                .endDt(new Date())
                .build());

        log.debug(objectMapper
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(a));

        assertNotNull(a);
    }


    @Test
    @Ignore
    //        @Rollback(false)
    public void insertPackageTest() {
        PackageMaster packageMaster = PackageMaster
                .builder()
                .usedYn("Y")
                .pkgDiv("T")
                .scbYn("Y")
                .scbNo(0000L)
                .artCnt(0L)
                .totalId1(00000L)
                .catList("test1,test2")
                .pkgTitle("테스트")
                .pkgDesc("테스트설명")
                .recommPkg("0000")
                .reservDt(new Date())
                .build();

        PackageKeyword packageKeyword = PackageKeyword
                .builder()
                .catDiv("C")
                .schCondi("T")
                .keyword("테스트123")
                .sDate("2020-03-24")
                .build();

        packageMaster
                .getPackageKeywords()
                .add(packageKeyword);
        //        packageKeyword.setPackageMaster(packageMaster);

        PackageMaster resultValue = packageService.insertPackage(packageMaster);
        assertNotNull(resultValue.getPkgSeq());
    }

    @Test
    public void packageMappingTest()
            throws JsonProcessingException {
        PackageMasterDTO packageMasterDTO = PackageMasterDTO
                .builder()
                .usedYn("Y")
                .pkgDiv("T")
                .scbYn("Y")
                .scbNo(0000L)
                .artCnt(0L)
                .totalId1(00000L)
                .catList("test1,test2")
                .pkgTitle("테스트")
                .pkgDesc("테스트설명")
                .recommPkg("0000")
                .reservDt(new Date())
                .build();

        PackageKeywordDTO packageKeywordDTO = PackageKeywordDTO
                .builder()
                .catDiv("R")
                .schCondi("T,K")
                .keyword("테스트123,테스트2")
                .sDate("2020-03-24")
                .ordno(1L)
                .pkgSeq(packageMasterDTO.getPkgSeq())
                .build();
        PackageKeywordDTO packageKeywordDTO2 = PackageKeywordDTO
                .builder()
                .catDiv("K")
                //                .schCondi("T,K")
                .keyword("테스트5,테스트4")
                .sDate("2020-03-24")
                .ordno(2L)
                .pkgSeq(packageMasterDTO.getPkgSeq())
                .build();

        packageMasterDTO
                .getPackageKeywords()
                .add(packageKeywordDTO);
        packageMasterDTO
                .getPackageKeywords()
                .add(packageKeywordDTO2);

        List<PackageKeywordDTO> keywords = new LinkedList<>();
        packageMasterDTO
                .getPackageKeywords()
                .stream()
                .forEach(keyword -> {
                    AtomicLong kwdOrd = new AtomicLong();
                    Arrays
                            .stream(keyword
                                    .getKeyword()
                                    .split(","))
                            .forEach(kwd -> {
                                keywords.add(keyword
                                        .toBuilder()
                                        .schCondi(null)
                                        .keyword(kwd)
                                        .kwdOrd(kwdOrd.incrementAndGet())
                                        .build());
                            });
                });

        packageMasterDTO
                .getPackageKeywords()
                .stream()
                .filter(keyword -> Optional
                        .ofNullable(keyword.getSchCondi())
                        .isPresent())
                .forEach(keyword -> {
                    Arrays
                            .stream(keyword
                                    .getSchCondi()
                                    .split(","))
                            .forEach(schCondi -> {
                                AtomicLong kwdOrd = new AtomicLong();
                                Arrays
                                        .stream(keyword
                                                .getKeyword()
                                                .split(","))
                                        .forEach(kwd -> {
                                            keywords.add(keyword
                                                    .toBuilder()
                                                    .schCondi(schCondi)
                                                    .keyword(kwd)
                                                    .kwdOrd(kwdOrd.incrementAndGet())
                                                    .build());
                                        });
                            });
                });

        log.debug("getSchCondi().isPresent() {}", Optional
                .ofNullable(packageKeywordDTO.getSchCondi())
                .isPresent());

        log.debug("packageKeywordDTO {}", packageKeywordDTO);
        log.debug("packageKeywordDTO2 {}", packageKeywordDTO2);
        log.debug("test {}", keywords);

        Map<Long, List<PackageKeywordDTO>> groupByOrdNo = keywords
                .stream()
                .collect(Collectors.groupingBy(PackageKeywordDTO::getOrdno));

        Object a = keywords
                .stream()
                .collect(Collectors.groupingBy(PackageKeywordDTO::getOrdno))
                .values()
                .stream()
                .map(group -> group
                        .stream()
                        .sorted(Comparator.comparingLong(PackageKeywordDTO::getKwdOrd))
                        .reduce(PackageKeywordDTO
                                .builder()
                                .keyword("")
                                .schCondi("")
                                .build(), (c, b) -> {
                            return b
                                    .toBuilder()
                                    .keyword(c.getKeyword() + "," + b.getKeyword())
                                    .schCondi(c.getSchCondi() + "," + b.getSchCondi())
                                    .build();
                        }))
                .map(keyword -> {
                    Set<String> keywordSet = new LinkedSet<>();
                    Set<String> schCondiSet = new LinkedSet<>();
                    Arrays
                            .stream(keyword
                                    .getKeyword()
                                    .split(","))
                            .filter(kwd -> kwd.length() > 0 && kwd != "null")
                            .forEach(kwd -> keywordSet.add(kwd));
                    Arrays
                            .stream(keyword
                                    .getSchCondi()
                                    .replace("null", "")
                                    .split(","))
                            .filter(condi -> condi.length() > 0 && condi != "null")
                            .forEach(condi -> schCondiSet.add(condi));
                    keyword.setKeyword(String.join(",", keywordSet));
                    keyword.setSchCondi(String.join(",", schCondiSet));
                    return keyword;
                })
                .collect(Collectors.toList());


        log.debug("groupByOrdNo {}", a);



        //        log.debug(
        objectMapper
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(packageKeywordDTO);
        //        );
    }

    //    @Test
    //    public void updateMenuTest() {
    //        Optional<Menu> menuOptional = menuService.findMenuById("03000000");
    //        menuOptional.ifPresent(menu -> {
    //            menu.setMenuDisplayNm("테스트");
    //            menuService.updateMenu(menu);
    //        });
    //
    //
    //    }
    //
    //    @Test
    //    @Rollback(false)
    //    public void deleteMenuTest() {
    //        menuService.deleteMenuById("03000000");
    //    }

}
