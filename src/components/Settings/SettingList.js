import React, {useContext} from "react";
import {Button, Pagination} from 'semantic-ui-react';
import {Table} from "semantic-ui-react";
import {SettingsContext} from "./settingsContext";


const SettingList = () => {
    const { settingsData,  activePage, dataColumns, count, handleShowDetails, pageHandler, handleCreateNew} = useContext(SettingsContext)

    const buildTableHeaders = () => {
        return dataColumns.map((col) => {
            return (
                <Table.HeaderCell>{col['header']}</Table.HeaderCell>
            )
        });
    }

    const buildTableData = (props) => {
        const data = props['data']
        if(!!data && data.length > 0) {
            return data.map((d, i) => {
                let cellData = dataColumns.map((col) => {
                    if (col['link'] === 1) {
                        return (
                            <Table.Cell><a href="#" onClick={() => handleShowDetails(d)}>{d[col['accessor']]}</a></Table.Cell>
                        )
                    }
                    return (
                        <Table.Cell>{d[col['accessor']]}</Table.Cell>
                    )
                });
                return (
                    <Table.Row key={i}>{cellData}</Table.Row>
                )
            })
        }

    }

    const TableItUp = (table, data) => (
        <Table celled>
            <Table.Header>
                <Table.Row>
                    {buildTableHeaders()}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {buildTableData(table, data)}
            </Table.Body>
        </Table>
    )

    return (
        <div className={"div-card-parent"}>
            <div className="ui container">
                <div>
                    <TableItUp table={"settings"} data={settingsData}/>
                </div>
                <div className="ui right floated pagination menu">
                    <Pagination
                        activePage={activePage}
                        onPageChange={pageHandler}
                        totalPages={Math.ceil(count / 10)}
                        ellipsisItem={null}
                    />
                </div>
                <div className="ui left floated">
                    <Button primary onClick={handleCreateNew}>Create New Discord Config</Button>
                </div>
            </div>
        </div>
    )
}



export default SettingList;