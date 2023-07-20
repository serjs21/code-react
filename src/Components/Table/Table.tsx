import React from "react";
import TableItem from "./TableItem/TableItem";
import { Field } from "types";
import styles from './Table.module.css';
import tableItemStyles from './TableItem/TableItem.module.css';
import Icon from "@ant-design/icons/lib/components/Icon";

export interface Props {
    fields: Field[];
    titles: string[];
    displayedIds: string[];
    action?: (id: string) => React.ReactElement;
}

const Table = ({ fields, titles, displayedIds, action }: Props) => {
    const titlesSpaces = new Array(action ? fields.length + 2 : fields.length + 1).fill(null); // icon takes another space
    return <div className={styles.container}>

        <div className={`${tableItemStyles.container} ${styles.titles}`}>
            {titlesSpaces.map((_, index) => <div className={tableItemStyles.field}>{titles[index] || ''}</div>)}
        </div>

        { displayedIds.map(id => <TableItem id={id} fields={fields} key={id} className={styles.item} actionButton={action ? action(id) : undefined}/>) }
    </div>

}

export default Table;