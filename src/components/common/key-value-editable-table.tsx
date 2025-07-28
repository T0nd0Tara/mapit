import { IState } from "@/types/state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IKeyValueObj } from "@/types/key-value";


export function KeyValueEditableTable({ values, ...props }: { values: IState<IKeyValueObj[]> }) {
  const handleChange = (index: number, field: "key" | "value", value: string) => {
    const newRows = [...values.value];

    const isLastRow = index === values.value.length;
    const opField: "key" | "value" = field === "key" ? "value" : "key";
    if (isLastRow) {
      const emptyObject = { key: "", value: "", enabled: true };
      emptyObject[field] = value
      newRows.push(emptyObject);
    } else if (value === "" && newRows[index][opField] === "") {
      // We removed both the value and the key so naturally we need to delete the row
      deleteRow(index)
      return;
    }
    else newRows[index][field] = value;


    values.set(newRows);
  };

  const deleteRow = (index: number) => {
    values.value.splice(index, 1);
    values.set([...values.value]);
  }

  const valuesWithNewRow: IKeyValueObj[] = [...values.value, { key: "", value: "", enabled: true }];

  return (
    <Table {...props}>
      <TableHeader>
        <TableRow>
          <TableHead>Key</TableHead>
          <TableHead>Value</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {valuesWithNewRow.map((keyVal: IKeyValueObj, index) => (
          <TableRow key={index}>
            <TableCell>
              <Input
                type="text"
                value={keyVal.key}
                onChange={(e) => handleChange(index, 'key', e.target.value)}
                className="flex-grow"
              />
            </TableCell>
            <TableCell>
              <Input
                type="text"
                value={keyVal.value}
                onChange={(e) => handleChange(index, 'value', e.target.value)}
                className="flex-grow"
              />
            </TableCell>
            <TableCell>
              {(index !== values.value.length) &&
                <FontAwesomeIcon icon={["far", "trash-can"]} className="cursor-pointer" onClick={() => deleteRow(index)} />
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

}
