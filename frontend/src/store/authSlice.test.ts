import { describe, it, expect, beforeEach } from 'vitest';
import reducer, { login, logout, verifySession } from './authSlice';

const baseState = {
  token: null as string | null,
  username: null as string | null,
  status: 'idle' as const,
  error: null as string | null,
  retryAfterSeconds: null as number | null,
  sessionChecked: true,
};

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('sets status to "loading" on login.pending', () => {
    const action = login.pending('requestId', { username: 'admin', password: 'x' });
    const state = reducer(baseState, action);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('stores the token/username and persists them to localStorage on login.fulfilled', () => {
    const action = login.fulfilled(
      { token: 'abc.def.ghi', username: 'admin' },
      'requestId',
      { username: 'admin', password: 'x' }
    );
    const state = reducer(baseState, action);

    expect(state.token).toBe('abc.def.ghi');
    expect(state.username).toBe('admin');
    expect(localStorage.getItem('auth_token')).toBe('abc.def.ghi');
    expect(localStorage.getItem('auth_username')).toBe('admin');
  });

  it('sets an error message and "failed" status on login.rejected', () => {
    const action = login.rejected(
      new Error('Request failed'),
      'requestId',
      { username: 'admin', password: 'wrong' },
      { message: 'Invalid username or password' }
    );
    const state = reducer(baseState, action);

    expect(state.status).toBe('failed');
    expect(state.error).toBe('Invalid username or password');
    expect(state.retryAfterSeconds).toBeNull();
  });

  it('carries retryAfterSeconds through on a rate-limited login.rejected', () => {
    const action = login.rejected(
      new Error('Request failed'),
      'requestId',
      { username: 'admin', password: 'wrong' },
      { message: 'Too many login attempts, please try again later', retryAfterSeconds: 300 }
    );
    const state = reducer(baseState, action);

    expect(state.error).toBe('Too many login attempts, please try again later');
    expect(state.retryAfterSeconds).toBe(300);
  });

  it('clears the token/username from state and localStorage on logout', () => {
    localStorage.setItem('auth_token', 'abc.def.ghi');
    localStorage.setItem('auth_username', 'admin');
    const loggedInState = { ...baseState, token: 'abc.def.ghi', username: 'admin' };

    const state = reducer(loggedInState, logout());

    expect(state.token).toBeNull();
    expect(state.username).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_username')).toBeNull();
  });

  it('marks the session as checked on verifySession.fulfilled', () => {
    const state = reducer(
      { ...baseState, sessionChecked: false },
      verifySession.fulfilled(undefined, 'requestId', undefined)
    );
    expect(state.sessionChecked).toBe(true);
  });

  it('marks the session as checked even on verifySession.rejected', () => {
    const state = reducer(
      { ...baseState, sessionChecked: false },
      verifySession.rejected(new Error('network error'), 'requestId', undefined)
    );
    expect(state.sessionChecked).toBe(true);
  });
});
