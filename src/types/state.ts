export interface IState<T> {
  value: T,
  set: (newValue: T) => void,
}
