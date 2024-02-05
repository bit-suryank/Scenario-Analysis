// import React, { useState } from 'react'
// import styles from "./Scenario.module.css"
// import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"
// import { useNavigate } from 'react-router-dom'


// function createDriverData(name, importance) {
//     return {name, importance}
// }



// const DriverRows = [
//     createDriverData("DRIVER_1", 35),
//     createDriverData("DRIVER_2", 30),
//     createDriverData("DRIVER_3", 20),
//     createDriverData("DRIVER_4", 15)
// ]



// export const Scenario = () => {
//     const [selectedRows, setSelectedRows] = useState([]);
//     const [impt, setImpt] = useState(0);
//     const [filterRow, setFilterRow] = useState(DriverRows);
//     const [driverName, setDriverName] = useState([]);
    
//     const handleImportanceChange = (e) => {
//         if (e.target.checked) {
//             setFilterRow(DriverRows.filter((row) => row.importance >= impt));
//         } else {
//             setFilterRow(DriverRows);
//         }
//     };


//     const handleRowClick = (row) => {
//         if (selectedRows.includes(row)) {
//             setSelectedRows(selectedRows.filter((r) => r !== row));
//             setDriverName(driverName.filter((name) => name !== row.name));
//         } else {
//             setDriverName([...driverName, row.name])
//             setSelectedRows([...selectedRows, row]);
//         }
//     }


//     const sum = selectedRows.reduce((acc, row) => acc + row.importance, 0);

//     const onclickvalue = () => {
//         localStorage.setItem("driverList", JSON.stringify(driverName));
//         navigate('/AdjValue')
//     }

//     const DriverTable = () => {
//         return(
//             <TableContainer>
//                     <Table>
//                         <TableHead
//                             sx={{borderBottom: "2px solid red"}}
//                         >
//                             <TableRow>
//                                 <TableCell sx={{fontWeight: "bold"}}>Drivers</TableCell>
//                                 <TableCell sx={{fontWeight: "bold"}}>Importance (%)</TableCell>
//                                 <TableCell sx={{fontWeight: "bold"}}>Adj?</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {filterRow.map((row) => (
//                                 <TableRow
//                                     key={row.name}
//                                 >
//                                     <TableCell>{row.name}</TableCell>
//                                     <TableCell>{row.importance}</TableCell>
//                                     <TableCell><input className='drivercheckbox' type='checkbox' value={row.importance} onChange={() => handleRowClick(row)} checked={selectedRows.includes(row)}/></TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//         )
//     }
//     const navigate = useNavigate();

//   return (
//       <div className={styles.ScenarioContainer}>
//                 <h3>Select drivers</h3>
//                 <span>
//                     <input type='checkbox' onChange={handleImportanceChange}/>Show only drivers with importance {">"}
//                     <input type='number' id={styles.importance} value={impt} onChange={(e) => setImpt(e.target.value)}/> %
//                 </span>
//                 <DriverTable />
//                 <span id={styles.buttonspan}>
//                     <h6>Total drivers selected:   {sum} %</h6>
//                     <Button variant='outlined' onClick={onclickvalue} sx={{color:"red", borderColor:"red", ":hover": {borderColor:"red"}}}>Adjust Values</Button>
//                 </span>
//         </div>
//   )
// }



import React, { Component } from 'react'
import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"
import styles from "./Scenario.module.css"
import { Link } from 'react-router-dom'
import { withStreamlitConnection, StreamlitComponentBase } from 'streamlit-component-lib'

function createDriverData(name, importance) {
    return {name, importance}
}



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
            driverName: []
        };
        this.handleImportanceChange = this.handleImportanceChange.bind(this);
        this.onclickvalue = this.onclickvalue.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
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

