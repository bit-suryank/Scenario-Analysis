import os
import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import datetime
import streamlit.components.v1 as components
import numpy as np


st.set_page_config(layout='wide')

page_name = "Select Drivers"

_RELEASE = True


if 'clicked' not in st.session_state:
    st.session_state.clicked = False

if 'scenario' not in st.session_state:
    st.session_state.scenario = False

if 'Adjust' not in st.session_state:
    st.session_state.Adjust = False
    
if 'form' not in st.session_state:
    st.session_state.form = False
    

if _RELEASE:
    root_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(root_dir, "component-frontend/build")

    _adj_value = components.declare_component(
        "adj_value",
        path=build_dir
    )

else:
    _adj_value = components.declare_component(
        "adj_value",
        url="http://localhost:3000"
    )

def com():
    return _adj_value()

def button_click():
    st.session_state.clicked = True


def scenario_button():
    st.session_state.scenario = not st.session_state.scenario



data = {
    "Actual": {"2023-04": 3, "2023-05": 6, "2023-06": 4, "2023-07": 7, "2023-08": 12, "2023-09": 15},
    "Hyperinflation": {"2024-01": 1, "2024-02": 2, "2024-03": 3,"2024-04": 3, "2024-05": 6, "2024-06": 4, "2024-07": 7, "2024-08": 12, "2024-09": 15},
    "Covid": {"2024-01": 1, "2024-02": 2, "2024-03": 3,"2024-04": 8, "2024-05": 10, "2024-06": 11, "2024-07": 5, "2024-08": 1, "2024-09": 2},
    "Forecast":{"2024-01": 1, "2024-02": 2, "2024-03": 3,"2024-04": 4, "2024-05":12, "2024-06": 8, "2024-07": 3, "2024-08":6, "2024-09": 8}
}



tData = {
    "Hyperinflation": {"2024-01": 1, "2024-02": 2, "2024-03": 3,"2024-04": 3, "2024-05": 6, "2024-06": 4, "2024-07": 7, "2024-08": 12, "2024-09": 15},
    "Covid": {"2024-01": 1, "2024-02": 2, "2024-03": 3, "2024-04": 8, "2024-05": 10, "2024-06": 11, "2024-07": 5, "2024-08": 1, "2024-09": 2},
    "Forecast":{"2024-01": 1, "2024-02": 2, "2024-03": 3, "2024-04": 4, "2024-05":12, "2024-06": 8, "2024-07": 3, "2024-08":6, "2024-09": 8}
}

date = ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06", "2024-07", "2024-08", "2024-09",]

st.session_state.data = data
st.session_state.tData = tData

def chart_show():

    start = datetime.date(2023, 4, 1)
    end = datetime.date(2024, 9, 30)
    column = st.columns([1,1])
    column[0].write("####")
    column[0].button("Refresh Data")
    column[1].write("#####")
    d = column[1].date_input("Select Date", (start, end), format="YYYY/MM/DD")

    df = pd.DataFrame(tData)
    tdf = df.transpose()
    tdf.index.name = "Scenarios"
    res = tdf.reset_index()
    columns = list(tdf.columns.values)

    data_p = pd.DataFrame(data)
    lis = []
    chart_data = pd.DataFrame(data_p)
    cat_list = data_p.columns
    val = [None] *len(cat_list)
    col = st.columns([1]*len(cat_list))
    for i, cat in enumerate(cat_list):
        val[i] = col[i].checkbox(cat, value=True)
        if val[i] == True:
            lis.append(cat)
    

    chart_data_filter = chart_data.filter(items=lis)

    st.line_chart(chart_data_filter)
    on = st.toggle('Enable Delete')
    if on:
        res.insert(0, "Delete", False)

    forecast_table = st.data_editor(res, column_config={
        "Delete": st.column_config.CheckboxColumn(required=True, default=False)
    }, disabled=columns, hide_index=True)

    if on:
        dis = True
        to_be_deleted = forecast_table[forecast_table.Delete]
        if not to_be_deleted.empty:
            dis = False

        if st.button("Delete", disabled=dis):
            deleted_scenarios = to_be_deleted.Scenarios.tolist()
            for scenario in deleted_scenarios:
                tdf.drop(scenario, axis=0,inplace=True)
                chart_data.drop(scenario, axis=1, inplace=True)


def save_edited_df(edited_df, scenario_name, description, creator, comment):
    # Combine edited DataFrame and scenario details into a dictionary
    scenario_data = {
        'edited_df': edited_df,
        'scenario_name': scenario_name,
        'description': description,
        'creator': creator,
        'comment': comment
    }
    # Store the data in session state
    return scenario_data

def create_scenario():
    dis = True
    st.subheader("Select Driver")
    col = st.columns([2, 1, 1])

    col[0].write("#")
    check = col[0].checkbox("show only drivers with importance > ")
    query = col[1].number_input("")
    col[2].write("#")
    col[2].write("%")


    df = pd.DataFrame({
      'Driver_Name': ['DRIVER_1', 'DRIVER_2', 'DRIVER_3', 'DRIVER_4'],
      'Importance (%)':[ 35, 30, 20, 15],
      'Adj':[False, False, False, False]
    }).set_index('Driver_Name')


    if check:
        df = df[df['Importance (%)'] > query]

    edit_df = st.data_editor(df, width=700, disabled=["Driver_Name", "Importance (%)"])

    selected_rows = list(edit_df[edit_df.Adj].index)
    select_impt = list(edit_df[edit_df.Adj]['Importance (%)'])
    s = sum(select_impt)
    
    if selected_rows:
        dis = False
    
    cols = st.columns([1,1])
    cols[0].write("#")
    cols[0].write(f"Total drivers selected: {s}%")
   

    if cols[1].button("Adjust Value", disabled=dis):
        st.session_state.form = True
    
    if st.session_state.form:
        adjust_form(selected_rows)

    
def adjust_form(selected_rows):
    st.subheader("Scenario Analysis")
    df2 = pd.DataFrame({
        "MUSD": selected_rows,
        "2024-01": 0,
        "2024-02": 0,
        "2024-03": 0,
        "2024-04": 0,
        "2024-05": 0,
        "2024-06": 0,
        "2024-07": 0,
        "2024-08": 0,
        "2024-09": 0,
    }).set_index("MUSD")
    
    with st.form("scenario_form", clear_on_submit=True):
        edit = st.data_editor(df2, width=None)
        run_dis = True
        Scenario_Name = st.text_input("Scenario Name", key=23)
        Description = st.text_input("Description", key=22)
        Creator = st.text_input("Scenario Creator", key=33)
        Comment = st.text_input("Comment about forecasted result", key=44)
        
        column = st.columns([1, 1, 1, 1], gap="medium")
        save = column[0].form_submit_button("Save Scenario", type='secondary')
        run = column[1].form_submit_button("Run Scenario", type='primary')
        column[2].form_submit_button("Reset Form", type='secondary')
        column[3].form_submit_button("Share", type='secondary')

        res = {}
        if save:
            edit = edit.iloc[range(0,len(selected_rows))].mean()
            for i in range(0, len(edit)):
                res[date[i]] = edit[i]
            data[Scenario_Name] = res
            tData[Scenario_Name] = res
        if run:
            st.session_state.form = False
            
        

def selection_box():

    col = st.columns([1, 1, 1])
    df = pd.DataFrame({
        'first column': ["ZCCO", "ZIFC", "ZOOO", "ZRED"],
        'second column': ["Germany", "India", "France", "New Zeland"],
        'third column': ['SG1', 'SG2', 'SG3', 'SG4'],
        'forth column': ['4001', '4003', '4003', '4004']
        })

    col[0].selectbox('Division', df['first column'])
    col[1].selectbox('Country', df['second column'])
    col[0].selectbox('Segement', df['third column'])
    col[1].selectbox('Product Group', df['forth column'])

    col[2].write("#")
    col[2].write("#")
    col[2].write("###")
    col[2].button("Show Forecast",key='1', on_click=button_click)


def driver_list():

    df = pd.DataFrame({
      'Driver_ID': [1, 2, 3, 4],
      'Driver_Name': ['DRIVER_1', 'DRIVER_2', 'DRIVER_3', 'DRIVER_4'],
      'Importance (%)':[ 35, 30, 20, 15]
    }).set_index('Driver_ID')
    
    col = st.columns([1,1])
    with col[0].container():
        st.write("List of Drivers (sorted by importance in model)", df)

    with col[1].container():
        fig, ax = plt.subplots(figsize=(6, 3), subplot_kw=dict(aspect="equal"))

        plt.pie(df['Importance (%)'], labels=df['Importance (%)'], colors=["red", "black", "grey", "#B0B0B0"])

        center_circle = plt.Circle((0,0), 0.5, fc='white')

        fig = plt.gcf()

        fig.legend(df['Driver_Name'], bbox_to_anchor=(1.5,1),fontsize='5', loc='upper right')

        fig.gca().add_artist(center_circle)
        
        fig.set_figheight(2)
        fig.set_figwidth(2)

        st.pyplot(fig)


if __name__ == "__main__":

    st.markdown(
        '''
            <style>
                .cursor{
                    background-color: red;
                    width: 30px;
                    height: 5px;
                    margin: 0;
                }
                div > div.dvn-underlay > div.dvn-scroller.glideDataEditor > div.dvn-scroll-inner.hidden{
                    overflow: auto;
                }
                div.block-container.st-emotion-cache-z5fcl4.ea3mdgi5{
                    padding: 45px 10px 10px 10px
                }
            </style>
            <div class="cursor"></div>
        ''', unsafe_allow_html=True
    )    
    st.title("Scenario Analysis - Proof-of-Concept")
    cont = st.container()
    with cont:
        cols = st.columns([1, 1])
        subCont = cols[0].container()
        with subCont:
            selection_box()
            if st.session_state.clicked == True:
                driver_list()
            
                with st.expander('Create Scenario'):
                    create_scenario()

        if st.session_state.clicked == True:
            subTwoCont = cols[1].container()
            with subTwoCont:
                chart_show()
    

