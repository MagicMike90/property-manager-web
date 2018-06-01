import * as types from './actionTypes';
import AuthService from '../../../core/services/auth.service';
import LocalStoreService from '../../../core/services/local-store.service';

import { notification } from 'antd';

export const authRequest = () => ({
  type: types.AUTH_REQUEST,
});
export const authRequestError = error => ({
  type: types.AUTH_REQUEST_ERROR,
  error: error,
  receivedAt: Date.now(),
});

export const loginSuccess = (data, history) => {
  // save the token
  LocalStoreService.authenticateUser(data.token);
  history.replace({
    pathname: `/`,
  });
  return {
    type: types.SIGN_IN_SUCCESS,
    data,
  };
};
export const registerSuccess = (data, history) => {
  history.replace({
    pathname: `/`,
  });
  return {
    type: types.SIGN_UP_SUCCESS,
    data,
  };
};
export const signoutSuccess = () => ({
  type: types.SIGN_OUT_SUCCESS,
});

export const login = (user, history) => {
  return async dispatch => {
    dispatch(authRequest());
    try {
      const response = await AuthService.login(user);
      dispatch(loginSuccess(response, history));
      notification.success({
        message: 'Sign In successfully',
      });
    } catch (error) {
      // console.log(error.message);
      console.error('Failure!');
      console.error(error.message);
      dispatch(authRequestError(error.message));
      // const errorMsg = `Error in sending data to server: ${error.message}`;
      // notification.error({
      //   message: errorMsg,
      // });
    }
    // dispatch(authRequest());
    // AuthService.login(user)
    //   .then(response => {
    //     if (!response.ok) {
    //       return response.json().then(error => {
    //         notification.error({
    //           message: error.message,
    //         });
    //       });
    //     }
    //     response.json().then(res => {
    //       dispatch(signinSuccess(res, history));
    //       notification.success({
    //         message: 'Sign In successfully',
    //       });
    //     });
    //   })
    //   .catch(error => {
    //     const errorMsg = `Error in sending data to server: ${error.message}`;
    //     notification.error({
    //       message: errorMsg,
    //     });
    //   });
  };
};

export const register = async (user, history) => {
  return dispatch => {
    dispatch(authRequest());

    AuthService.register(user)
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            notification.error({
              message: error.message,
            });
          });
        }
        response.json().then(user => {
          dispatch(registerSuccess(user, history));
          notification.success({
            message: 'Sign Up successfully',
          });
        });
      })
      .catch(error => {
        const errorMsg = `Error in sending data to server: ${error.errors}`;
        // dispatch(authRequestError(errorMsg))
        notification.error({
          message: errorMsg,
        });
      });
  };
};
