import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet';
import { MokaCard } from '@components';
import { CARD_DEFAULT_HEIGHT } from '@/constants';
import { clearStore, deleteEditForm, GET_EDIT_FORM, SAVE_EDIT_FORM, showFormXmlImportModal } from '@store/editForm';
import toast, { messageBox } from '@utils/toastUtil';
import EditFormImportModal from './EditFormImportModal';
import EditFormList from './EditFormList';
import EditFormEdit from './EditFormEdit';

/**
 * 편집폼 관리
 */
const EditForm = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const loading = useSelector(({ loading }) => loading[GET_EDIT_FORM] || loading[SAVE_EDIT_FORM]);
    const formImportModalShow = useSelector(({ editForm }) => editForm.formImportModalShow);

    /**
     * 편집폼 추가
     */
    const handleAddClickEditForm = () => dispatch(showFormXmlImportModal(true));

    const hideImportModal = () => dispatch(showFormXmlImportModal(false));

    /**
     * 삭제 버튼 클릭
     */
    const handleClickDelete = (editForm) => {
        messageBox.confirm(`${editForm.formName}을 삭제하시겠습니까?`, () => {
            dispatch(
                deleteEditForm({
                    formSeq: editForm.formSeq,
                    callback: (response) => {
                        toast.result(response, () => {
                            history.push('/edit-form');
                        });
                    },
                }),
            );
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
                <meta name="description" content="편집폼 관리 페이지 입니다." />
                <meta name="robots" content="noindex" />
            </Helmet>

            {/* 리스트 */}
            <MokaCard className="mb-0 mr-gutter" height={CARD_DEFAULT_HEIGHT} title="편집폼 관리" bodyClassName="d-flex flex-column" width={480}>
                <div className="mb-2 d-flex justify-content-end">
                    <Button variant="positive" onClick={handleAddClickEditForm}>
                        편집폼 추가
                    </Button>
                </div>
                <EditFormList onDelete={handleClickDelete} />
            </MokaCard>

            {/* 편집폼 정보 */}
            <Switch>
                <MokaCard title="편집폼 추가" className="flex-fill" minWidth={820} height={CARD_DEFAULT_HEIGHT} loading={loading}>
                    <Route path={['/edit-form', '/edit-form/:formId']} exact render={() => <EditFormEdit onDelete={handleClickDelete} />} />
                </MokaCard>
            </Switch>

            <EditFormImportModal show={formImportModalShow} onHide={() => hideImportModal()} />
        </div>
    );
};

export default EditForm;
