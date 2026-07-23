import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Card } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { API, showError, showSuccess } from '../../helpers';

const AddUser = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const originInputs = {
    username: '',
    display_name: '',
    password: '',
    daily_points: 100000,
    email: '',
    student_id: '',
  };
  const [inputs, setInputs] = useState(originInputs);
  const { username, display_name, password, email, student_id } = inputs;

  const handleInputChange = (e, { name, value }) => {
    if (name === 'daily_points') {
      if (value !== '' && !/^\d+$/.test(value)) {
        showError('每日积分必须是非负整数');
        return;
      }
      value = parseInt(value);
      if (isNaN(value) || value < 0) {
        showError('每日积分必须是非负整数');
        return;
      }
    }
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const submit = async () => {
    if (inputs.username === '' || inputs.password === '') return;
    if (inputs.password.length < 8) {
      showError('密码长度不能少于8位');
      return;
    }
    const res = await API.post(`/api/user/`, inputs);
    const { success, message } = res.data;
    if (success) {
      showSuccess(t('user.messages.create_success'));
      navigate('/user');
    } else {
      showError(message);
    }
  };

  return (
    <div className='dashboard-container'>
      <Card fluid className='chart-card'>
        <Card.Content>
          <Card.Header className='header'>{t('user.add.title')}</Card.Header>
          <Form autoComplete='off'>
			<Form.Field>
			  <Form.Input
                label={t('user.edit.username')}
                name='username'
                placeholder={t('user.edit.username_placeholder')}
                onChange={handleInputChange}
                value={username}
                autoComplete='off'
                required
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                label={t('user.edit.display_name')}
                name='display_name'
                placeholder={t('user.edit.display_name_placeholder')}
                onChange={handleInputChange}
                value={display_name}
                autoComplete='off'
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                label={t('user.edit.password')}
                name='password'
                type='password'
                placeholder={t('user.edit.password_placeholder')}
                onChange={handleInputChange}
                value={password}
                autoComplete='off'
                required
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                label='每日积分'
                name='daily_points'
                type='number'
                value={inputs.daily_points}
                onChange={handleInputChange}
                placeholder='每日刷新时重置为此数值'
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                label='邮箱'
                name='email'
                value={email}
                onChange={handleInputChange}
                placeholder='请输入邮箱地址'
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                label='一卡通号'
                name='student_id'
                value={student_id}
                onChange={handleInputChange}
                placeholder='请输入一卡通号'
              />
            </Form.Field>
            <Button positive type='submit' onClick={submit}>
              {t('user.edit.buttons.submit')}
            </Button>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );
};

export default AddUser;
