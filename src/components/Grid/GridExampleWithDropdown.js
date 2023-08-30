import React, {useContext} from "react";
import {Dropdown, Grid} from "semantic-ui-react";
import { AppContext } from '../../stupidContext';

const GridInput = ({ armorPiece, armorBuildData }) => {
    const { valueOptions } = useContext(AppContext);
    const { setBuildData2 } = useContext(AppContext);

    const DropdownExampleSearchSelection = ({idx}) => (
        <Dropdown
            placeholder='Select Mod'
            fluid
            search
            selection
            clearable
            value={armorBuildData[idx]}
            options={valueOptions}
            onChange={setBuildData2}
            piece={armorPiece}
            idx={idx}
        />
    )

    return (
        <div>
            <Grid verticalAlign={"middle"}>
                <Grid.Row columns={6}>
                    <Grid.Column width={1}>
                        <h5>{`${armorPiece}`}</h5>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <DropdownExampleSearchSelection idx={0}/>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <DropdownExampleSearchSelection idx={1}/>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <DropdownExampleSearchSelection idx={2}/>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <DropdownExampleSearchSelection idx={3}/>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <DropdownExampleSearchSelection idx={4}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    )
}

export default GridInput;