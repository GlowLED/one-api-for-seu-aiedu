import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Card } from 'semantic-ui-react';
import { useParams, useNavigate } from 'react-router-dom';
import { API, showError, showSuccess } from '../../helpers';
import { UserContext } from '../../context/User';

const EditUser = () => {
  const { t } = useTranslation();
  const params = useParams();
  const userId = params.id;
  const [userState, userDispatch] = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState({
    username: '',
    display_name: '',
    password: '',
    points: 0,
    daily_points: 0,
    email: '',
    student_id: '',
  });
  const {
    username,
    display_name,
    password,
    points,
    daily_points,
    email,
    student_id,
  } = inputs;
  const handleInputChange = (e, { name, value }) => {
    if (name === 'points' || name === 'daily_points') {
      if (value !== '' && !/^\d+$/.test(value)) {
        showError(name === 'points' ? '积分必须是非负整数' : '每日积分必须是非负整数');
        return;
      }
      value = parseInt(value);
      if (isNaN(value) || value < 0) {
        showError(name === 'points' ? '积分必须是非负整数' : '每日积分必须是非负整数');
        return;
      }
    }
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };
  const navigate = useNavigate();
  const handleCancel = () => {
    if (userId) {
      navigate('/user');
    } else {
      navigate('/setting');
    }
  };
  const loadUser = async () => {
    let res = undefined;
    if (userId) {
      res = await API.get(`/api/user/${userId}`);
    } else {
      res = await API.get(`/api/user/self`);
    }
    const { success, message, data } = res.data;
    if (success) {
      data.password = '';
      setInputs(data);
    } else {
      showError(message);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadUser().then();
  }, []);

  const submit = async () => {
    let res = undefined;
    if (userId) {
      let data = { ...inputs, id: parseInt(userId) };
      if (typeof data.points === 'string') {
        data.points = parseInt(data.points);
      }
      if (typeof data.daily_points === 'string') {
        data.daily_points = parseInt(data.daily_points);
      }
      res = await API.put(`/api/user/`, data);
    } else {
      res = await API.put(`/api/user/self`, {
        password: inputs.password,
        display_name: inputs.display_name,
      });
    }
    const { success, message } = res.data;
    if (success) {
      showSuccess(t('user.messages.update_success'));
      if (userId) {
        navigate('/user');
      } else {
        let user = JSON.parse(localStorage.getItem('user'));
        user.display_name = inputs.display_name;
        localStorage.setItem('user', JSON.stringify(user));
        userDispatch({ type: 'login', payload: user });
        navigate('/setting');
      }
    } else {
      showError(message);
    }
  };

  return (
    <div className='dashboard-container'>
      <Card fluid className='chart-card'>
        <Card.Content>
          <Card.Header className='header'>{t('user.edit.title')}</Card.Header>
          <Form loading={loading} autoComplete='new-password'>
            {userId && (
              <Form.Field>
                <Form.Input
                  label={t('user.edit.username')}
                  name='username'
                  placeholder={t('user.edit.username_placeholder')}
                  onChange={handleInputChange}
                  value={username}
                  autoComplete='new-password'
                />
              </Form.Field>
            )}
            <Form.Field>
              <Form.Input
                label={t('user.edit.display_name')}
                name='display_name'
                placeholder={t('user.edit.display_name_placeholder')}
                onChange={handleInputChange}
                value={display_name}
                autoComplete='new-password'
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                label={t('user.edit.password')}
                name='password'
                type={'password'}
                placeholder={t('user.edit.password_placeholder')}
                onChange={handleInputChange}
                value={password}
                autoComplete='new-password'
              />
            </Form.Field>
            {userId && (
              <>
                <Form.Field>
                  <Form.Input
                    label='剩余积分'
                    name='points'
                    placeholder='请输入新的剩余积分'
                    onChange={handleInputChange}
                    value={points}
                    type={'number'}
                    autoComplete='new-password'
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Input
                    label='每日积分'
                    name='daily_points'
                    placeholder='每日刷新时重置为此数值'
                    onChange={handleInputChange}
                    value={daily_points}
                    type={'number'}
                    autoComplete='new-password'
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Input
                    label='邮箱'
                    name='email'
                    placeholder='请输入邮箱地址'
                    onChange={handleInputChange}
                    value={email}
                    autoComplete='new-password'
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Input
                    label='一卡通号'
                    name='student_id'
                    placeholder='请输入一卡通号'
                    onChange={handleInputChange}
                    value={student_id}
                    autoComplete='new-password'
                  />
                </Form.Field>
              </>
            )}
            <Button onClick={handleCancel}>
              {t('user.edit.buttons.cancel')}
            </Button>
            <Button positive onClick={submit}>
              {t('user.edit.buttons.submit')}
            </Button>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );
};

export default EditUser;
