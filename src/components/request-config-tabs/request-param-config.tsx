import { IState } from "@/types/state";
import { KeyValueEditableTable } from "@/components/common/key-value-editable-table";
import { IParams } from "@/types/request";

export function RequestParamConfig({ params }: { params: IState<IParams> }) {
  return (
    <KeyValueEditableTable values={params}></KeyValueEditableTable>
  );
}
