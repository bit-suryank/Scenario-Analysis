import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"
import styles from "./Scenario.module.css"
import { PlayArrowOutlined, SaveOutlined, RestartAltOutlined, ShareOutlined } from "@mui/icons-material"
import React, { Component } from "react"
import {Streamlit, withStreamlitConnection, StreamlitComponentBase} from 'streamlit-component-lib'
import { Link } from "react-router-dom"


class AdjValue extends StreamlitComponentBase {
    
    constructor(props) {
        super(props);
        const driverList = JSON.parse(localStorage.getItem("driverList"));
        const dateList = ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06", "2024-07", "2024-08", "2024-09"]
        this.state = {
            scenario: {
                Name: "",
                Description: "",
                Creator: "",
                Comment: ""
            },
            driverName: driverList,
            numberDriver: driverList.length,
            tableData : this.generateInitialData(driverList.length, driverList, dateList),
            date: dateList,
            res: {}
        }
        this.handleTableCellChange = this.handleTableCellChange.bind(this);
        this.resetForm = this.resetForm.bind(this)
        
    }

    generateInitialData = (numDrivers, driverName, dateLs) => {
        const initialData = [];
        for (let i = 0; i < numDrivers; i++) {
          const driverRow = { driver: driverName[i] };
          dateLs.forEach(d => (driverRow[d] = ''));
          initialData.push(driverRow);
        }
        return initialData;
      };


    handleTableCellChange = (driverIndex, dateIndex, value) => {
        this.setState((prevState) => {
          const newData = [...prevState.tableData];
          newData[driverIndex][this.state.date[dateIndex]] = value;
          return { tableData: newData };
        });
      };

    updateName = (name) => {
        this.setState((prevState) => ({scenario: {...prevState.scenario, Name: name}}));
    }

    updateDescription = (desc) => {
        this.setState((prevState) => ({scenario: {...prevState.scenario, Description: desc}}));
    }

    updateCreator = (create) => {
        this.setState((prevState) => ({scenario: {...prevState.scenario, Creator: create}}));
    }

    updateComment = (com) => {
        this.setState((prevState) => ({scenario: {...prevState.scenario, Comment: com}}));
    }


    resetForm = () => {
        this.setState({
            scenario: {Name: "", Description: "", Creator: "", Comment: ""},
        })
    }

    saveScenario = () => {
        const result = {
            scenarioName: this.state.scenario.Name,
            data: this.state.tableData

        }
        this.setState({
            res: result
        })
    }

    runSenario = () => {
        const val = this.state.res
        const name = val.scenarioName
        const combinedData = {};
        val.data.forEach(obj => {
        for (const key in obj) {
            if (key !== "driver") {
            if (!combinedData[key]) {
                combinedData[key] = [];
            }
            combinedData[key].push(obj[key]);
            }
        }
        });
        
        const averageByDate = {};
        for (const key in combinedData) {
            const values = combinedData[key];
            const sum = values.reduce((total, current) => total + current, 0);
            const average = sum / values.length;
            averageByDate[key] = average;
        }
        
        const compValue = {[name]: averageByDate, scenarioName:name}
        Streamlit.setComponentValue(compValue)
    }

  render() {
    return (
        <div className={styles.AdjustValueCont} aria-disabled={this.props.disabled}>
        <h3>Scenario Analysis</h3>
        <TableContainer sx={{height:"fit-content"}}>
            <Table>
                <TableHead>
                    <TableCell sx={{fontSize:"12px", fontWeight:"800"}}>(MUSD)</TableCell>
                    {this.state.date.map((row, index) => (
                        <TableCell key={index} sx={{fontSize:"12px"}} >{row}</TableCell>
                    ))}
                </TableHead>
                <TableBody>
                    {this.state.driverName && this.state.driverName.map((row,driverIndex) => (
                        <TableRow
                        key = {driverIndex}
                        >
                            <TableCell>{row}</TableCell>
                            {this.state.date.map((rows, dateIndex) => (
                                
                                // <TableCell key={rows}><input className={styles.plo} type="number" value={this.state.tableData[driverIndex][dateIndex]} onChange ={(e) => {this.handleTableCellChange(driverIndex, dateIndex, e.target.value); console.log("driverIndex", driverIndex, "dateIndex",dateIndex, "value",e.target.value, rows)  console.log("driverIndex", driverIndex, "dateIndex",dateIndex, "value",e.target.value, rows)}}/></TableCell>
                                <TableCell key={rows}><input className={styles.plo} type="number" value={this.state.tableData[driverIndex][dateIndex]} onChange={(e) => this.handleTableCellChange(driverIndex, dateIndex, parseInt(e.target.value))}/></TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <span className={styles.ScenarioInfo}><p>Scenario name</p> <input type='text' value={this.state.scenario.Name} onChange={(e) => this.updateName(e.target.value)}/></span>
        <span className={styles.ScenarioInfo} id={styles.des}><p>Description</p> <textarea value={this.state.scenario.Description} onChange={(e) => this.updateDescription(e.target.value)}/></span>
        <span className={styles.ScenarioInfo}><p>Scenario creator</p> <input type='text' value={this.state.scenario.Creator} onChange={(e) => this.updateCreator(e.target.value)}/></span>
        <span className={styles.ScenarioInfo}><p>Comments about Forecasted Results (if any)</p> <textarea value={this.state.scenario.Comment} onChange={(e) => this.updateComment(e.target.value)}/></span>
        <span className={styles.buttonOptions}>
            <Link to='/'  style={{textDecoration:'none'}}>
                <i onClick={this.runSenario}><PlayArrowOutlined className={styles.buttonIcon} /> Run Scenario</i>
            </Link>
            <i onClick={this.saveScenario}><SaveOutlined className={styles.buttonIcon}/> Save Scenario</i>
            <i onClick={this.resetForm}><RestartAltOutlined className={styles.buttonIcon}/> Reset Form</i>
            <i><ShareOutlined className={styles.buttonIcon} /> Share</i>
        </span>
    </div>
    )
  }
}

export default withStreamlitConnection(AdjValue)