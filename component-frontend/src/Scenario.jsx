import React from 'react'
import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"
import styles from "./Scenario.module.css"
import { Link } from 'react-router-dom'
import { withStreamlitConnection, StreamlitComponentBase } from 'streamlit-component-lib'

function createDriverData(name, importance) {
    return {name, importance}
}

export const COMPONENT_REDY_WARNING_TIMS_MS = 3000

const DriverRows = [
    createDriverData("DRIVER_1", 35),
    createDriverData("DRIVER_2", 30),
    createDriverData("DRIVER_3", 20),
    createDriverData("DRIVER_4", 15)
]


class Scenario extends StreamlitComponentBase {
    constructor(props){
        super(props);
        this.state = {
            selectedRows: [],
            impt: 0,
            filterRow: DriverRows,
            driverName: [],
            conponentError: undefined,
            readyTimeout: false,
        };
        this.handleImportanceChange = this.handleImportanceChange.bind(this);
        this.onclickvalue = this.onclickvalue.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
    }

    componentDidMount = () => {
        this.componentReadyWarningTimer.setTimeout(
            () => this.setState({readyTimeout: true}),
            COMPONENT_REDY_WARNING_TIMS_MS
        )
    }

    handleImportanceChange(e) {
        if (e.target.checked) {
            this.setState({filterRow: (DriverRows.filter((row) => row.importance >= this.state.impt))})
        } else {
            this.setState({filterRow: DriverRows});
        }
    }

    handleRowClick(row) {
        if (this.state.selectedRows.includes(row)) {
            this.setState((prevState) => ({
                selectedRows: (prevState.selectedRows.filter((r) => r!== row)),
                driverName: (prevState.driverName.filter((name) => name !== row.name))
            }));
        } else {
            this.setState((prevState) => ({
                selectedRows: ([...prevState.selectedRows, row]),
                driverName: ([...prevState.driverName, row.name])
            }))
        }
    }

    // sum = () => {
    //     this.state.selectedRows.reduce((acc, row) => acc + row.importance, 0);
    // }

    
    

    onclickvalue = () => {
        localStorage.setItem("driverList", JSON.stringify(this.state.driverName));
        // <Navigate to="/AdjValue" replace={true} />
    }

    DriverTable = () => {
        return(
            <TableContainer>
                    <Table>
                        <TableHead
                            sx={{borderBottom: "2px solid red"}}
                        >
                            <TableRow>
                                <TableCell sx={{fontWeight: "bold"}}>Drivers</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Importance (%)</TableCell>
                                <TableCell sx={{fontWeight: "bold"}}>Adj?</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.filterRow.map((row) => (
                                <TableRow
                                    key={row.name}
                                >
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.importance}</TableCell>
                                    <TableCell><input className='drivercheckbox' type='checkbox' value={row.importance} onChange={() => this.handleRowClick(row)} checked={this.state.selectedRows.includes(row)}/></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
        )
    }

  render() {
    const sum = this.state.selectedRows.reduce((acc, row) => acc + row.importance, 0)
    return (
        <div className={styles.ScenarioContainer}>
            <h3>Select drivers</h3>
            <span>
                <input type='checkbox' onChange={this.handleImportanceChange}/>Show only drivers with importance {">"}
                <input type='number' id={styles.importance} value={this.state.impt} onChange={(e) => this.setState({impt: e.target.value})}/> %
            </span>
            <this.DriverTable />
            <span id={styles.buttonspan}>
                <h6>Total drivers selected:   {sum} %</h6>
                <Link to='/AdjValue'>
                    <Button variant='outlined' onClick={this.onclickvalue} sx={{color:"red", borderColor:"red", ":hover": {borderColor:"red"}}}>Adjust Values</Button>
                </Link>
            </span>
        </div>
    )
  }
}

export default withStreamlitConnection(Scenario)

