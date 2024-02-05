import os
import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import datetime
import streamlit.components.v1 as components


st.set_page_config(layout='wide')

page_name = "Select Drivers"

_RELEASE = True



if 'clicked' not in st.session_state:
    st.session_state.clicked = False

if 'scenario' not in st.session_state:
    st.session_state.scenario = False

if 'Adjust' not in st.session_state:
    st.session_state.Adjust = False

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
            # for key in list(les):
            #     # st.write(list(data.keys()))
            #     # if key in les:
            #     data.pop(key)
                
            # for key in list(les):
            #     # if key in les:
            #     tData.pop(key)


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

    with open('style.css') as f:
        st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)
        
    st.title("Scenario Analysis - Proof-of-Concept")
    cont = st.container()
    with cont:
        cols = st.columns([1, 1])
        subCont = cols[0].container()
        with subCont:
            selection_box()
            if st.session_state.clicked == True:
                driver_list()
            # modal = Modal(key="3", title="", padding= 5, max_width=900)
            # open_modal = st.button('Create Scenario Analysis')
            # res = None
            # if open_modal:
            #     with modal.container():
            #         res = com()
            # if res is not None:
            #     name = res["scenarioName"]
            #     data[name] = res[name]
            #     tData[name] = res[name]
            
            res = None
            with st.expander('Create Scenario'):
                res = com()
                if res is not None:
                    name = res["scenarioName"]
                    data[name] = res[name]
                    tData[name] = res[name]


        if st.session_state.clicked == True:
            subTwoCont = cols[1].container()
            with subTwoCont:
                chart_show()
    

