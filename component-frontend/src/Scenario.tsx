import React from 'react'
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { Link } from 'react-router-dom'
import { withStreamlitConnection, StreamlitComponentBase } from 'streamlit-component-lib'


interface State {
    selectedRows: any[];
    impt: number;
    filterRow: { name: string; importance: number; }[];
    driverName: string[];
}


function createDriverData(name: string, importance: number) {
    return { name, importance }
}

const DriverRows = [
    createDriverData("DRIVER_1", 35),
    createDriverData("DRIVER_2", 30),
    createDriverData("DRIVER_3", 20),
    createDriverData("DRIVER_4", 15)
]

class Scenario extends StreamlitComponentBase<State> {
    constructor(props: any) {
        super(props);
        this.state = {
            selectedRows: [],
            impt: 0,
            filterRow: DriverRows,
            driverName: []
        };
        this.handleImportanceChange = this.handleImportanceChange.bind(this);
        this.onclickvalue = this.onclickvalue.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
    }

    handleImportanceChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.checked) {
            this.setState({ filterRow: (DriverRows.filter((row) => row.importance >= this.state.impt)) })
        } else {
            this.setState({ filterRow: DriverRows });
        }
    }

    handleRowClick(row: { name: string; importance: number; }) {
        if (this.state.selectedRows.includes(row)) {
            this.setState((prevState: { selectedRows: any[]; driverName: string[]; }) => ({
                selectedRows: (prevState.selectedRows.filter((r: any) => r !== row)),
                driverName: (prevState.driverName.filter((name: string) => name !== row.name))
            }));
        } else {
            this.setState((prevState: { selectedRows: any[]; driverName: string[]; }) => ({
                selectedRows: ([...prevState.selectedRows, row]),
                driverName: ([...prevState.driverName, row.name])
            }))
        }
    }

    onclickvalue = () => {
        localStorage.setItem("driverList", JSON.stringify(this.state.driverName));
        // <Navigate to="/AdjValue" replace={true} />
    }

    DriverTable = () => {
        return (
            <TableContainer>
                <Table>
                    <TableHead
                        sx={{ borderBottom: "2px solid red" }}
                    >
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>Drivers</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Importance (%)</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Adj?</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.filterRow.map((row: { name: string; importance: number; }) => (
                            <TableRow
                                key={row.name}
                            >
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.importance}</TableCell>
                                <TableCell><input className='drivercheckbox' type='checkbox' value={row.importance} onChange={() => this.handleRowClick(row)} checked={this.state.selectedRows.includes(row)} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    render() {
        const sum = this.state.selectedRows.reduce((acc: number, row: { importance: number; }) => acc + row.importance, 0)
        return (
            <div className='ScenarioContainer'>
                <h3>Select drivers</h3>
                <span>
                    <input type='checkbox' onChange={this.handleImportanceChange} />Show only drivers with importance {">"}
                    <input type='number' id='importance' value={this.state.impt} onChange={(e) => this.setState({ impt: parseInt(e.target.value) })} /> %
                </span>
                <this.DriverTable />
                <span id='buttonspan'>
                    <h6>Total drivers selected:   {sum} %</h6>
                    <Link to='/AdjValue'>
                        <Button variant='outlined' onClick={this.onclickvalue} sx={{ color: "red", borderColor: "red", ":hover": { borderColor: "red" } }}>Adjust Values</Button>
                    </Link>
                </span>
            </div>
        )
    }
}

export default withStreamlitConnection(Scenario)
