package jmnet.moka.core.common.encrypt;

import java.security.Key;
import java.security.SecureRandom;
import java.util.Arrays;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.util.Base64Utils;

/**
 * <pre>
 * KISA의 블록 암호 SEED 중 CBC 방식으로 암복화 처리
 * Project : moka
 * Package : jmnet.moka.core.common.encrypt
 * ClassName : MokaCrypt
 * Created : 2020-11-19 ince
 * </pre>
 *
 * @author ince
 * @since 2020-11-19 09:02
 */
public class MokaCrypt {

    /*
    암호화 key
     */
    private final Key secretKey;
    /**
     * 암호화 알고리즘
     */
    private final String transformation = "AES/CBC/PKCS5Padding";

    public MokaCrypt(String key) {
        secretKey = generateKeySpec(key);
    }

    /**
     * 암호화
     *
     * @param source 원본
     * @return 암호문
     * @throws Exception 에러 처리
     */
    public String encrypt(String source)
            throws Exception {
        Cipher cipher = Cipher.getInstance(transformation);
        IvParameterSpec iv = getRandomIvParameterSpec();
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, iv);
        byte[] encrypted = cipher.doFinal(source.getBytes());
        byte[] ivcipherByte = new byte[iv.getIV().length + encrypted.length];
        System.arraycopy(iv.getIV(), 0, ivcipherByte, 0, 16);
        System.arraycopy(encrypted, 0, ivcipherByte, 16, encrypted.length);
        return Base64Utils.encodeToString(ivcipherByte);
    }

    /**
     * 복호화
     *
     * @param source 암호문
     * @return 원문
     * @throws Exception 에러 처리
     */
    public String decrypt(String source)
            throws Exception {
        Cipher cipher = Cipher.getInstance(transformation);
        byte[] byteStr = Base64Utils.decodeFromString(source);
        byte[] originalIvByte = Arrays.copyOfRange(byteStr, 0, 16);
        byte[] originalCipherByte = Arrays.copyOfRange(byteStr, 16, byteStr.length);
        cipher.init(Cipher.DECRYPT_MODE, secretKey, new IvParameterSpec(originalIvByte));
        return new String(cipher.doFinal(originalCipherByte));
    }



    /**
     * 랜덤 initial vector를 반환
     *
     * @return IvParameterSpec
     */
    private IvParameterSpec getRandomIvParameterSpec() {
        byte[] iv = new byte[16];
        new SecureRandom().nextBytes(iv);
        return new IvParameterSpec(iv);
    }

    /**
     * key spec 생성
     *
     * @return Key
     * @throws Exception 에러 처리
     */
    private Key generateKeySpec(String key) {
        Key keySpec;

        byte[] keyBytes = new byte[16];
        byte[] b = key.getBytes();

        int len = b.length;
        if (len > keyBytes.length) {
            len = keyBytes.length;
        }

        System.arraycopy(b, 0, keyBytes, 0, len);
        keySpec = new SecretKeySpec(keyBytes, "AES");

        return keySpec;
    }

}
