import { IState } from "@/types/state";
import { KeyValueEditableTable } from "@/components/common/key-value-editable-table";
import { Headers } from "@/types/request";

export function RequestHeadersConfig({ headers }: { headers: IState<Headers> }) {
  return (
    <KeyValueEditableTable values={headers}></KeyValueEditableTable>
  );
}
