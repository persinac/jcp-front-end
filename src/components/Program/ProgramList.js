import React, {useEffect, useState} from "react";
import {createProgram, createProgramSchedule, getProgramCount, getPrograms} from "../../api"
import {Button, Pagination} from 'semantic-ui-react';
import {Table} from "semantic-ui-react";
import ProgramCreateNew from "./ProgramCreateNew";


const ProgramList = ({handleShowProgramDetails, programPageHandler, programData, activeProgramPage, isCreateProgram, setIsCreateProgram}) => {
    const [programDataCount, setProgramDataCount] = useState(0);

    useEffect(() => {
        getProgramCount('programs')
            .then(response => setProgramDataCount(response[0]['total_count']))
    }, []);

    const handleNewProgramSubmit = async (data, submit) => {
        if(submit) {
            const {program, programSchedule} = {...data}
            const newProgramResponse = await createProgram(program)
            console.log(newProgramResponse)
            programSchedule.program_id = newProgramResponse.id
            const newProgramScheduleResponse = await createProgramSchedule(programSchedule)
            console.log(newProgramScheduleResponse)

        }
        setIsCreateProgram(false)
    }

    const programDataColumns = () => {
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
                header: "Type",
                accessor: "type",
                link: 0
            },
            {
                header: "Description",
                accessor: "description",
                link: 0
            },
            {
                header: "Created",
                accessor: "created_on",
                link: 0
            },
            {
                header: "Last Updated",
                accessor: "updated_on",
                link: 0
            }
        ]
    }

    const buildTableHeaders = (table) => {
        const mapper = {
            "programs": programDataColumns
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
            "programs": programDataColumns
        }
        let columns = mapper[props['table']]()
        const data = props['data']
        if(!!data && data.length > 0) {
            return data.map((d, i) => {
                let cellData = columns.map((col) => {
                    if (col['link'] === 1) {
                        return (
                            <Table.Cell><a href="#" onClick={() => handleShowProgramDetails(d)}>{d[col['accessor']]}</a></Table.Cell>
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

            {/*<Table.Footer>*/}
            {/*    <Table.Row>*/}
            {/*        <Table.HeaderCell colSpan='3'>*/}
            {/*            <Menu floated='right' pagination>*/}
            {/*                <Menu.Item as='a' icon>*/}
            {/*                    <Icon name='chevron left' />*/}
            {/*                </Menu.Item>*/}
            {/*                <Menu.Item as='a'>1</Menu.Item>*/}
            {/*                <Menu.Item as='a'>2</Menu.Item>*/}
            {/*                <Menu.Item as='a'>3</Menu.Item>*/}
            {/*                <Menu.Item as='a'>4</Menu.Item>*/}
            {/*                <Menu.Item as='a' icon>*/}
            {/*                    <Icon name='chevron right' />*/}
            {/*                </Menu.Item>*/}
            {/*            </Menu>*/}
            {/*        </Table.HeaderCell>*/}
            {/*    </Table.Row>*/}
            {/*</Table.Footer>*/}
        </Table>
    )

    return (
        <div>
            {isCreateProgram ? <ProgramCreateNew handleNewProgramSubmit={handleNewProgramSubmit}/> :
                <div className="ui container container-width-100">
                    <div>
                        <TableItUp table={"programs"} data={programData}/>
                    </div>
                    <div className="ui right floated pagination menu">
                        <Pagination
                            activePage={activeProgramPage}
                            onPageChange={programPageHandler}
                            totalPages={Math.ceil(programDataCount / 10)}
                            ellipsisItem={null}
                        />
                    </div>
                    <div className="ui left floated">
                        <Button primary onClick={() => setIsCreateProgram(true)}>Create New Program</Button>
                    </div>
                </div>
            }
        </div>
    )
}



export default ProgramList;