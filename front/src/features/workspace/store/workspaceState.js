export const initialWorkspaceState = Object.freeze({
  data: null,
  status: 'idle',
  error: null,
});

export function workspaceReducer(state, action) {
  switch (action.type) {
    case 'loadStarted':
      return { data: null, status: 'loading', error: null };
    case 'loadSucceeded':
    case 'saveSucceeded':
      return { data: action.workspace, status: 'ready', error: null };
    case 'saveStarted':
      return { ...state, status: 'saving', error: null };
    case 'failed':
      return { ...state, status: 'error', error: action.error?.message || String(action.error) };
    case 'reset':
      return initialWorkspaceState;
    default:
      return state;
  }
}
