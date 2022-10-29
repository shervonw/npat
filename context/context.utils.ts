export const updateState = (prop: string, value: any, state: any) => ({
  ...state,
  [prop]: value,
});