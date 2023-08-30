import React, {useEffect, useState} from "react";
import {getProgramScheduleByProgramId, getWorkoutsByProgramId} from "../api"
import {Button, Card} from "semantic-ui-react";

const items = [
    {
        header: 'Project Report - April',
        description:
            'Leverage agile frameworks to provide a robust synopsis for high level overviews.',
        meta: 'ROI: 30%',
    },
    {
        header: 'Project Report - May',
        description:
            'Bring to the table win-win survival strategies to ensure proactive domination.',
        meta: 'ROI: 34%',
    },
    {
        header: 'Project Report - June',
        description:
            'Capitalise on low hanging fruit to identify a ballpark value added activity to beta test.',
        meta: 'ROI: 27%',
    },
]

const ProgramDetails = ({ handleBackClick, currentProgram }) => {
    // the key with this type of setup is that we need a line & f(x) for each input
    const [programDetails, setProgramDetails] = useState([]);
    const [workouts, setProgramWorkouts] = useState([]);

    useEffect(() => {
        getProgramScheduleByProgramId(currentProgram['id'])
            .then(response => setProgramDetails(response))
        getWorkoutsByProgramId(currentProgram['id'])
            .then(response => setProgramWorkouts(response))
    }, []);

    return (
        <div>
            <div>
                <pre>{JSON.stringify(currentProgram, null, 2)}</pre>
                <pre>{JSON.stringify(programDetails, null, 2)}</pre>
                <pre>{JSON.stringify(workouts, null, 2)}</pre>
            </div>
            <div>
                <Card.Group items={items} itemsPerRow={5} />
            </div>
            <Button primary onClick={handleBackClick}>Back</Button>
        </div>
    )
}



export default ProgramDetails;