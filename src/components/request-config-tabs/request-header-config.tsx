import { IState } from "@/types/state";
import { KeyValueEditableTable } from "@/components/common/key-value-editable-table";
import { IHeaders } from "@/types/request";

export function RequestHeadersConfig({ headers }: { headers: IState<IHeaders> }) {
  return (
    <KeyValueEditableTable values={headers}></KeyValueEditableTable>
  );
}
