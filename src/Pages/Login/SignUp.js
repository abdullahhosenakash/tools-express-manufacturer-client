import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
  useUpdateProfile
} from 'react-firebase-hooks/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import auth from '../../firebase.init';
import { useForm } from 'react-hook-form';
import SocialLogin from './SocialLogin';
import useUsers from '../../hooks/useUsers';
import Loading from '../Shared/Loading';
import PageTitle from '../Shared/PageTitle';
import useToken from '../../hooks/useToken';

const SignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [createUserWithEmailAndPassword, , loading, error] =
    useCreateUserWithEmailAndPassword(auth); //ignoring user and loading as they are unused
  const [updateProfile] = useUpdateProfile(auth);
  const [sendEmailVerification] = useSendEmailVerification(auth);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const [users, usersLoading] = useUsers();
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [user, userLoading] = useAuthState(auth);
  const [token] = useToken(user);
  const imageStorageKey = process.env.IMG_API_KEY;
  const from = location?.state?.from?.pathname || '/';

  useEffect(() => {
    token && navigate(from, { replace: true });
  }, [from, navigate, token]);

  if (loading || signUpLoading || usersLoading || userLoading) {
    return <Loading />;
  }

  const onSubmit = ({
    userEmail,
    userName: displayName,
    userPassword,
    userPhoto
  }) => {
    setSignUpLoading(true);
    let img;
    const image = userPhoto[0];
    const formData = new FormData();
    formData.append('image', image);
    const url = `https://api.imgbb.com/1/upload?key=${imageStorageKey}`;
    fetch(url, {
      method: 'POST',
      body: formData
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          img = result.data.url;
        }
      });

    createUserWithEmailAndPassword(userEmail, userPassword).then(async () => {
      await updateProfile({ displayName, photoURL: img });
      toast('Email Verification Sent');
      await sendEmailVerification();

      const registeredUser = users?.find((u) => u.email === userEmail);
      if (!registeredUser) {
        const newUser = { userName: displayName, userEmail, userPhoto: img };
        fetch('https://tools-express-manufacturer-server.vercel.app/users', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(newUser)
        })
          .then((res) => res.json())
          .then(() => {
            setSignUpLoading(false);
          });
      }
    });
  };

  return (
    <div className='login-form mx-auto my-5'>
      <PageTitle title='Sign Up' />
      <h2 className='mb-3 pt-3 display-6'>Please Sign Up</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <p className='m-0'>Name</p>
        <Form.Control
          type='text'
          placeholder='Enter Your Name'
          {...register('userName', { required: true, maxLength: 30 })}
          className='mb-2'
        />

        <small className='text-danger'>
          {errors.userName?.type === 'required' && 'Username is required'}
        </small>

        <p className='m-0'>Email</p>
        <Form.Control
          type='email'
          placeholder='Enter Email'
          {...register('userEmail', { required: true, maxLength: 30 })}
          className='mb-2'
        />
        <small className='text-danger'>
          {errors.userEmail?.type === 'required' && 'Email is required'}
        </small>

        <p className='m-0'>Password</p>
        <Form.Control
          type='password'
          placeholder='Enter Password'
          {...register('userPassword', { required: true, maxLength: 30 })}
          className='mb-2'
        />
        <small className='text-danger'>
          {errors.userPassword?.type === 'required' && 'Password is required'}
        </small>

        <p className='m-0'>Photo</p>
        <Form.Control
          type='file'
          {...register('userPhoto', { required: true })}
          className='mb-2'
        />
        <small className='text-danger'>
          {errors.userPhoto?.type === 'required' && 'Photo is required'}
        </small>
        {error && <p className='text-danger'>{error.message}</p>}

        <Button
          className='login-button d-block mx-auto'
          variant='secondary'
          type='submit'
        >
          Sign Up
        </Button>

        <p className='my-3'>
          Already have an account?{' '}
          <Link className='ms-2 text-decoration-none' to='/login'>
            Please Login here
          </Link>
        </p>
      </Form>
      <SocialLogin from={from}></SocialLogin>
    </div>
  );
};

export default SignUp;
