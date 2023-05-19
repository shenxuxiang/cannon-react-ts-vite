import { useState } from 'react';

type InitialStateType<S> = () => S | S;

type Action<S> = Partial<S> | ((prevState: S) => Partial<S>);

type SetState<S> = (action: Action<S>) => void;

function reduce<S>(state: S, action: Partial<S>) {
  if (action === null) return state;
  return { ...state, ...action };
}
function useReducer<S>(initialState: InitialStateType<S>): [S, SetState<S>] {
  const [state, dispatchSetState] = useState<S>(initialState);

  function setState(action: Action<S>) {
    if (typeof action === 'function') {
      dispatchSetState((prevState) => reduce(prevState, action(prevState)));
    } else {
      dispatchSetState((prevState) => reduce(prevState, action));
    }
  }

  return [state, setState];
}

export default useReducer;
