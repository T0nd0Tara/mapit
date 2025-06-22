import { IState } from "@/types/state";
import { useState } from "react";

export function useComState<T>(initialState: T): IState<T> {
  const [value, set] = useState<T>(initialState);
  return { value, set };
}
