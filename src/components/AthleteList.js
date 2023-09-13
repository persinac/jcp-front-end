import React, {useEffect, useState} from "react";
import {
    createNewAthlete,
    getAthleteCount,
} from "../api"
import {Button, Pagination} from 'semantic-ui-react';
import {Table} from "semantic-ui-react";
import {EditAthleteHeader} from "./AthleteDetails";


const AthleteList = ({handleShowAthleteDetails, gridPageHandler, athleteData, activePage, isCreateAthlete, setIsCreateAthlete}) => {
    const [athleteCount, setAthleteCount] = useState(0);

    useEffect(() => {
        getAthleteCount()
            .then(response => setAthleteCount(response[0]['total_count']))
    }, []);

    const handleNewAthleteSubmit = (data, submit) => {
        if(submit) {
            data.is_active = data.is_active ? 1 : 0
            createNewAthlete([data]).then(res => console.log(res))
        }
        setIsCreateAthlete(false)
    }

    const athleteDataColumns = () => {
        return [
            {
                header: "ID",
                accessor: "id",
                link: 0
            },
            {
                header: "Name",
                accessor: "name",
                link: 1
            },
            {
                header: "Discord",
                accessor: "discord_name",
                link: 0
            },
            {
                header: "Active?",
                accessor: "is_active",
                link: 0
            },
            {
                header: "Created",
                accessor: "created_at",
                link: 0
            },
            {
                header: "Last Updated",
                accessor: "updated_at",
                link: 0
            }
        ]
    }

    const buildTableHeaders = (table) => {
        const mapper = {
            "athletes": athleteDataColumns
        }
        let columns = mapper[table['table']]()
        return columns.map((col) => {
            return (
                <Table.HeaderCell>{col['header']}</Table.HeaderCell>
            )
        });
    }

    const buildTableData = (props) => {
        const mapper = {
            "athletes": athleteDataColumns
        }
        let columns = mapper[props['table']]()
        const data = props['data']
        if(!!data && data.length > 0) {
            return data.map((d, i) => {
                let cellData = columns.map((col) => {
                    if (col['link'] === 1) {
                        return (
                            <Table.Cell><a href="#" onClick={() => handleShowAthleteDetails(d)}>{d[col['accessor']]}</a></Table.Cell>
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
                    {buildTableHeaders(table)}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {buildTableData(table, data)}
            </Table.Body>
        </Table>
    )

    return (
        <div className={"div-card-parent"}>
            {isCreateAthlete ? <EditAthleteHeader selectedAthlete={{name:"", discord_name:"", is_active: true}} handleAthleteEdit={handleNewAthleteSubmit}/> :
                <div className="ui container">
                    <div>
                        <TableItUp table={"athletes"} data={athleteData}/>
                    </div>
                    <div className="ui right floated pagination menu">
                        <Pagination
                            activePage={activePage}
                            onPageChange={gridPageHandler}
                            totalPages={Math.ceil(athleteCount / 10)}
                            ellipsisItem={null}
                        />
                    </div>
                    <div className="ui left floated">
                        <Button primary onClick={() => setIsCreateAthlete(true)}>Create New Athlete</Button>
                    </div>
                </div>
            }
        </div>
    )
}



export default AthleteList;