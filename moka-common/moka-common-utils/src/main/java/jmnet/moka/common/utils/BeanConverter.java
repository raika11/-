package jmnet.moka.common.utils;

import java.beans.PropertyDescriptor;
import java.io.StringReader;
import java.lang.reflect.Array;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import org.apache.commons.lang.ArrayUtils;
import org.springframework.beans.BeanUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jmnet.moka.common.utils.exception.ServiceProcessException;

/**
 * 
 * <pre>
 * Bean Converter
 * 2017. 4. 21. ince 최초생성
 * </pre>
 * 
 * @since 2017. 4. 21. 오후 3:12:09
 * @author ince
 */
public final class BeanConverter {

    /**
     * 
     * <pre>
     * 변환 무시 프로퍼티  체크
     * </pre>
     * 
     * @param name
     * @param ignoreProperties
     * @return boolean
     */
    static private boolean ignoreProperty(String name, String... ignoreProperties) {
        for (String propName : ignoreProperties) {
            if (name.equals(propName)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 
     * <pre>
     * Bean 객체를 Map으로 변환
     * </pre>
     * 
     * @param bean
     * @return Map<String, Object>
     * @throws Exception
     */
    public static Map<String, Object> toMap(Object bean) throws Exception {
        return toMap(bean, new String[] {"class", "blob_body"});
    }

    /**
     * 
     * <pre>
     * Bean 객체를 Map으로 변환
     * </pre>
     * 
     * @param bean
     * @param ignoreProperties
     * @return Map<String, Object>
     * @throws Exception
     */
    public static Map<String, Object> toMap(Object bean, String[] ignoreProperties)
            throws Exception {
        return toMap(bean, ignoreProperties, false, null);
    }

    /**
     * Bean 객체를 Map으로 변환
     * 
     * @param bean
     * @param isUnderScore map key 값의 대문자를 _소문자로 치환할지 여부
     * @param ignoreUnderScore _소문자 치환 제와 단어
     * @return Map<String, Object>
     * @throws Exception
     */
    public static Map<String, Object> toMap(Object bean, boolean isUnderScore,
            String[] ignoreUnderScore) throws Exception {
        return toMap(bean, new String[] {"class", "blob_body"}, isUnderScore, ignoreUnderScore);
    }

    /**
     * Bean 객체를 Map으로 변환
     * 
     * @param bean
     * @param ignoreProperties
     * @param isUnderScore map key 값의 대문자를 _소문자로 치환할지 여부
     * @param ignoreUnderScore _소문자 치환 제와 단어
     * @return Map<String, Object>
     * @throws Exception
     */
    public static Map<String, Object> toMap(Object bean, String[] ignoreProperties,
            boolean isUnderScore, String[] ignoreUnderScore) {
        if (bean == null) {
            return null;
        }
        if (ignoreProperties == null) {
            ignoreProperties = new String[] {"class", "blob_body"};
        }
        Map<String, Object> row = new HashMap<String, Object>();
        try {
            PropertyDescriptor[] descriptors = BeanUtils.getPropertyDescriptors(bean.getClass());
            for (PropertyDescriptor descriptor : descriptors) {
                String name = descriptor.getName();
                if (ignoreProperty(name, ignoreProperties)) {
                    continue;
                }
                Method getter = descriptor.getReadMethod();
                if (getter == null) {
                    continue;
                }
                String getterName = getter.getName();
                Object value = getter.invoke(bean, new Object[] {});
                if (getterName.startsWith("get") || getterName.startsWith("is")) {
                    String key = name;
                    if (isUnderScore && ArrayUtils.indexOf(ignoreUnderScore, name) == -1) {
                        key = McpString.convertCamelToSnake(key);
                    }
                    row.put(key, value);
                }
            }
            return row;
        } catch (InvocationTargetException e) {
            throw new ServiceProcessException(e);
        } catch (IllegalAccessException e) {
            throw new ServiceProcessException(e);
        }
    }

    /**
     * 
     * <pre>
     * Dubble 값 변환
     * </pre>
     * 
     * @param setter
     * @param bean
     * @param paramType
     * @param value
     * @throws IllegalAccessException
     * @throws IllegalArgumentException
     * @throws InvocationTargetException
     */
    static private void setterDouble(Method setter, Object bean, Class<?> paramType, Object value)
            throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        if (paramType == Integer.class) {
            setter.invoke(bean, new Double((Integer) value));
        } else if (paramType == Float.class) {
            setter.invoke(bean, ((Float) value).doubleValue());
        } else if (paramType == Long.class) {
            setter.invoke(bean, ((Long) value).doubleValue());
        } else if (paramType == BigDecimal.class) {
            setter.invoke(bean, ((BigDecimal) value).doubleValue());
        } else if (paramType == BigInteger.class) {
            setter.invoke(bean, ((BigInteger) value).doubleValue());
        } else if (paramType == String.class) {
            setter.invoke(bean, Double.parseDouble((String) value));
        } else {
            setter.invoke(bean, value);
        }
    }

    /**
     * 
     * <pre>
     * Integer값 변환
     * </pre>
     * 
     * @param setter
     * @param bean
     * @param paramType
     * @param value
     * @throws IllegalAccessException
     * @throws IllegalArgumentException
     * @throws InvocationTargetException
     */
    static private void setterInteger(Method setter, Object bean, Class<?> paramType, Object value)
            throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        if (paramType == Double.class) {
            setter.invoke(bean, ((Double) value).intValue());
        } else if (paramType == Float.class) {
            setter.invoke(bean, ((Float) value).intValue());
        } else if (paramType == Long.class) {
            setter.invoke(bean, ((Long) value).intValue());
        } else if (paramType == BigDecimal.class) {
            setter.invoke(bean, ((BigDecimal) value).intValue());
        } else if (paramType == BigInteger.class) {
            setter.invoke(bean, ((BigInteger) value).intValue());
        } else if (paramType == String.class) {
            setter.invoke(bean, Integer.parseInt((String) value));
        } else if (paramType == Boolean.class) {
            if (((Boolean) value)) {
                setter.invoke(bean, 1);
            } else {
                setter.invoke(bean, 0);
            }
        } else {
            setter.invoke(bean, value);
        }
    }

    /**
     * 
     * <pre>
     * Float 변환
     * </pre>
     * 
     * @param setter
     * @param bean
     * @param paramType
     * @param value
     * @throws IllegalAccessException
     * @throws IllegalArgumentException
     * @throws InvocationTargetException
     */
    static private void setterFloat(Method setter, Object bean, Class<?> paramType, Object value)
            throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        if (paramType == Double.class) {
            setter.invoke(bean, ((Double) value).floatValue());
        } else if (paramType == Integer.class) {
            setter.invoke(bean, ((Integer) value).floatValue());
        } else if (paramType == Long.class) {
            setter.invoke(bean, ((Long) value).floatValue());
        } else if (paramType == BigDecimal.class) {
            setter.invoke(bean, ((BigDecimal) value).floatValue());
        } else if (paramType == BigInteger.class) {
            setter.invoke(bean, ((BigInteger) value).floatValue());
        } else if (paramType == String.class) {
            setter.invoke(bean, Float.parseFloat((String) value));
        } else {
            setter.invoke(bean, value);
        }
    }

    /**
     * 
     * <pre>
     * Long 변환
     * </pre>
     * 
     * @param setter
     * @param bean
     * @param paramType
     * @param value
     * @throws IllegalAccessException
     * @throws IllegalArgumentException
     * @throws InvocationTargetException
     */
    static private void setterLong(Method setter, Object bean, Class<?> paramType, Object value)
            throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        if (paramType == Integer.class) {
            setter.invoke(bean, ((Integer) value).longValue());
        } else if (paramType == Double.class) {
            setter.invoke(bean, ((Double) value).longValue());
        } else if (paramType == Float.class) {
            setter.invoke(bean, ((Float) value).longValue());
        } else if (paramType == BigDecimal.class) {
            setter.invoke(bean, ((BigDecimal) value).longValue());
        } else if (paramType == BigInteger.class) {
            setter.invoke(bean, ((BigInteger) value).longValue());
        } else if (paramType == String.class) {
            setter.invoke(bean, Long.parseLong((String) value));
        } else {
            setter.invoke(bean, value);
        }
    }

    /**
     * 
     * <pre>
     * Boolean 변환
     * </pre>
     * 
     * @param setter
     * @param bean
     * @param paramType
     * @param value
     * @throws IllegalAccessException
     * @throws IllegalArgumentException
     * @throws InvocationTargetException
     */
    static private void setterBoolean(Method setter, Object bean, Class<?> paramType, Object value)
            throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        int v = 0;
        if (paramType == Integer.class) {
            v = ((Integer) value).intValue();
        } else if (paramType == Double.class) {
            v = ((Double) value).intValue();
        } else if (paramType == Float.class) {
            v = ((Float) value).intValue();
        } else if (paramType == BigDecimal.class) {
            v = ((BigDecimal) value).intValue();
        } else if (paramType == BigInteger.class) {
            v = ((BigInteger) value).intValue();
        } else if (paramType == String.class) {
            setter.invoke(bean, Boolean.getBoolean((String) value));
        } else {
            setter.invoke(bean, Boolean.getBoolean((String) value));
        }
        if (v == 1) {
            setter.invoke(bean, Boolean.TRUE);
        } else {
            setter.invoke(bean, Boolean.FALSE);
        }
    }

    /**
     * 
     * <pre>
     * Date 변환
     * </pre>
     * 
     * @param setter
     * @param bean
     * @param paramType
     * @param value
     * @throws IllegalAccessException
     * @throws IllegalArgumentException
     * @throws InvocationTargetException
     */
    static private void setterDate(Method setter, Object bean, Class<?> paramType, Object value)
            throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        if (paramType == Timestamp.class) {
            setter.invoke(bean, new Date(((Timestamp) value).getTime()));
        } else if (paramType == Long.class) {
            setter.invoke(bean, new Date((Long) value));
        }
        // else if ( paramType == Double.class )
        // {
        // ( (Double) value ).longValue();
        // }
        // else if ( paramType == Float.class )
        // {
        // ( (Float) value ).longValue();
        // }
        // else if ( paramType == BigDecimal.class )
        // {
        // ( (BigDecimal) value ).longValue();
        // }
        // else if ( paramType == BigInteger.class )
        // {
        // ( (BigInteger) value ).longValue();
        // }
        // else if ( paramType == String.class )
        // {
        // Long.parseLong( (String) value );
        // }
        else {
            setter.invoke(bean, new Date(Long.parseLong((String) value)));
        }
    }

    /**
     * 
     * <pre>
     * Map 맵 컬렉션 객체를 파라미터로 선언된 클래스 타입 T 로 변환 한다.
     * </pre>
     * 
     * @param row
     * @param clazz
     * @return 타겟 객체
     * @throws Exception
     */
    public static <T> T toBean(Map<String, Object> row, Class<T> clazz) throws Exception {
        if (row == null) {
            throw new RuntimeException("Can not convert to target class. Source object is null");
        }
        T bean = clazz.newInstance();
        PropertyDescriptor[] props = BeanUtils.getPropertyDescriptors(clazz);
        for (PropertyDescriptor desc : props) {
            final String name = desc.getName();
            Object value = row.get(name);
            Method setter = desc.getWriteMethod();
            if (value != null && setter != null) {
                Class<?> valueType = value.getClass();
                Class<?> parameterType = setter.getParameterTypes()[0];
                if (valueType == parameterType) {
                    setter.invoke(bean, value);
                } else {
                    if (parameterType == String.class) {
                        setter.invoke(bean, (String) value);
                    } else if (parameterType == Double.class) {
                        setterDouble(setter, bean, valueType, value);
                    } else if (parameterType == Integer.class) {
                        setterInteger(setter, bean, valueType, value);
                    } else if (parameterType == Float.class) {
                        setterFloat(setter, bean, valueType, value);
                    } else if (parameterType == Long.class) {
                        setterLong(setter, bean, valueType, value);
                    } else if (parameterType == Boolean.class) {
                        setterBoolean(setter, bean, valueType, value);
                    } else if (parameterType == Date.class) {
                        setterDate(setter, bean, valueType, value);
                    } else {
                        setter.invoke(bean, value);
                    }
                }
            }
        }
        return bean;
    }

    /**
     * 
     * <pre>
     * List 리스트 컬렉션 객체를 파라미터로 선언된 클래스 타입 T를 통해 리스트 컬렉션 List로 변환 한다.
     * </pre>
     * 
     * @param rows
     * @param clazz
     * @return 리스트 컬렉션 List
     * @throws Exception
     */
    public static <M extends Map<String, Object>, T> List<T> toBeans(List<M> rows, Class<T> clazz)
            throws Exception {
        if (rows == null) {
            return null;
        }
        List<T> list = new ArrayList<T>();
        for (M row : rows) {
            T bean = toBean(row, clazz);
            list.add(bean);
        }
        return list;
    }

    /**
     * 
     * <pre>
     * source 객체를 타겟 clazz 객체로 복제 하고, 복제된 타겟 객체를 리턴 한다.
     * </pre>
     * 
     * @param source
     * @param clazz
     * @return 타겟 객체
     * @throws Exception
     */
    public static <T> T copyProperties(Object source, Class<T> clazz) throws Exception {
        if (source == null) {
            return null;
        }
        T target = BeanUtils.instantiate(clazz);
        BeanUtils.copyProperties(source, target);
        return target;
    }

    /**
     * 
     * <pre>
     * 타겟 객체의 속성값을 source 객체의 속성들로 copy 합니다.
     * </pre>
     * 
     * @param source
     * @param target
     * @throws Exception
     */
    public static void copyProperties(Object source, Object target) throws Exception {
        if (source == null || target == null) {
            throw new RuntimeException("Source or Target object is null.");
        }
        BeanUtils.copyProperties(source, target);
    }

    /**
     * 
     * <pre>
     * source 객체를 타겟 clazz 객체로 복제 하고, 복제된 타겟 객체를 리턴 한다.
     * </pre>
     * 
     * @param source
     * @param clazz
     * @param ignoreProperties
     * @return 타겟 객체
     * @throws Exception
     */
    public static <T> T copyProperties(Object source, Class<T> clazz, String... ignoreProperties)
            throws Exception {
        if (source == null) {
            return null;
        }
        T target = BeanUtils.instantiate(clazz);
        BeanUtils.copyProperties(source, target, ignoreProperties);
        return target;
    }

    public static <T> T toBean(String source, Class<T> clazz) {
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(clazz);
            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            StringReader reader = new StringReader(source);
            @SuppressWarnings("unchecked")
            T target = (T) jaxbUnmarshaller.unmarshal(reader);
            return target;
        } catch (JAXBException ex) {
            throw new ServiceProcessException(ex);
        }
    }

    public static Map<String, Object> jsonToMap(String strJson) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> map =
                mapper.readValue(strJson, new TypeReference<Map<String, Object>>() {});
        return map;
    }

    /**
     * 
     * <pre>
     * 객체배열을 copy
     * </pre>
     * 
     * @param rows
     * @param clazz
     * @return copy한 객체배열
     * @throws Exception
     */
    @SuppressWarnings("unchecked")
    public static <T> T[] copyArray(T[] rows, Class<T> clazz) {
        if (rows == null) {
            return null;
        }
        T[] list = (T[]) Array.newInstance(clazz, rows.length);

        if (rows != null && rows.length > 0) {
            int i = 0;
            for (T row : rows) {
                T target = BeanUtils.instantiate(clazz);
                BeanUtils.copyProperties(row, target);
                list[i] = target;
                i++;
            }
        }

        return list;
    }
}
