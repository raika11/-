import React, {Suspense} from 'react';
import {Route, Switch, useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import {Helmet} from 'react-helmet';
import {MokaCard} from '@components';
import {CARD_DEFAULT_HEIGHT} from '@/constants';
import {
  clearStore,
  deleteEditForm,
  GET_EDIT_FORM,
  SAVE_EDIT_FORM
} from '@store/editForm';
import toast from '@utils/toastUtil';

const EditFormEdit = React.lazy(() => import('./EditFormEdit'));
const EditFormList = React.lazy(() => import('./EditFormList'));

/**
 * 편집폼 관리
 */
const EditForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const {loading} = useSelector((store) => ({
    loading: store.loading[GET_EDIT_FORM] || store.loading[SAVE_EDIT_FORM],
  }));

  /**
   * 편집폼 추가
   */
  const handleAddClickEditForm = () => {
    history.push('/edit-form');
  };

  /**
   * 삭제 버튼 클릭
   */
  const handleClickDelete = (editForm) => {
    toast.confirm(`${editForm.formId}_${editForm.formName}을 정말 삭제하시겠습니까?`,
        (ok) => {
          if (ok) {
            deleteEditForm({
              formId: editForm.formSeq,
              callback: (response) => {
                toast.result(response, () => {
                  history.push('/edit-form');
                });
              },
            });
          }
        });
  };

  React.useEffect(() => {
    return () => {
      dispatch(clearStore());
    };
  }, [dispatch]);

  return (
      <div className="d-flex">
        <Helmet>
          <title>편집폼 관리</title>
          <meta name="description" content="편집폼 관리 페이지 입니다."/>
          <meta name="robots" content="noindex"/>
        </Helmet>

        {/* 리스트 */}
        <MokaCard className="mb-0 mr-gutter" height={CARD_DEFAULT_HEIGHT}
                  title="편집폼 관리" titleClassName="mb-0" width={480}>
          <div className="mb-3 d-flex justify-content-end">
            <Button variant="dark" className={clsx('p-0', 'mr-05')}
                    onClick={handleAddClickEditForm}
                    style={{width: '100px', height: '32px'}}>
              편집폼 추가
            </Button>
          </div>
          <Suspense>
            <EditFormList onDelete={handleClickDelete}/>
          </Suspense>
        </MokaCard>

        {/* 편집폼 정보 */}
        <MokaCard title="편집폼 추가" className="flex-fill" minWidth={820}
                  titleClassName="mb-0" height={CARD_DEFAULT_HEIGHT}
                  loading={loading}>
          <Suspense>
            <Switch>
              <Route path={['/edit-form', '/edit-form/:formId']} exact
                     render={() => <EditFormEdit
                         onDelete={handleClickDelete}/>}/>
            </Switch>
          </Suspense>
        </MokaCard>
      </div>
  );
};

export default EditForm;
