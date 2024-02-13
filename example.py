import streamlit as st
import pandas as pd
import time

# def adj_value(driver):
    


if 'res' not in st.session_state:
    st.session_state.res = None
    
if 'form' not in st.session_state:
    st.session_state.form = False
    
data = {
    "Actual": {"2023-04": 3, "2023-05": 6, "2023-06": 4, "2023-07": 7, "2023-08": 12, "2023-09": 15},
    "Hyperinflation": {"2024-01": 1, "2024-02": 2, "2024-03": 3,"2024-04": 3, "2024-05": 6, "2024-06": 4, "2024-07": 7, "2024-08": 12, "2024-09": 15},
    "Covid": {"2024-01": 1, "2024-02": 2, "2024-03": 3,"2024-04": 8, "2024-05": 10, "2024-06": 11, "2024-07": 5, "2024-08": 1, "2024-09": 2},
    "Forecast":{"2024-01": 1, "2024-02": 2, "2024-03": 3,"2024-04": 4, "2024-05":12, "2024-06": 8, "2024-07": 3, "2024-08":6, "2024-09": 8}
}
    
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
    
    if selected_rows:
        dis = False
    
    cols = st.columns([1,1])
    cols[0].write("Total drivers selected: 65%")
   
    edit = None
    if cols[1].button("Adjust Value", disabled=dis):
        st.session_state.form = True
    
    if st.session_state.form:
        edit = adjust_form(selected_rows)
        st.write(edit)



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
    
   
    # Display the DataFrame for editing
    with st.form("scenario_form"):
        edit = st.data_editor(df2)

        # Inputs for scenario details
        Scenario_Name = st.text_input("Scenario Name", key=23)
        Description = st.text_input("Description", key=22)
        Creator = st.text_input("Scenario Creator", key=33)
        Comment = st.text_input("Comment about forecasted result", key=44)

        # Buttons for actions
        
        column = st.columns([1, 1, 1, 1], gap="medium")
        save = column[0].form_submit_button("Save Scenario", type='secondary')
        column[1].form_submit_button("Run Scenario", type='primary')
        column[2].form_submit_button("Reset Form", type='secondary')
        column[3].form_submit_button("Share", type='secondary')
        
        # if save:
        #     result = save_edited_df(edit, Scenario_Name, Description, Creator, Comment)
        if save:
            edit = edit.iloc[range(0,len(selected_rows))].mean()
            res = {Scenario_Name: edit}
            # series = pd.read_csv(pd.compat.StringIO(res[Scenario_Name]), delim_whitespace=True, header=None, index_col=0, squeeze=True)
            series = pd.Series(res[Scenario_Name].split(), dtype=float)
            series.index = pd.to_datetime(series.index)
            converted_dict = series.to_dict()
            data[Scenario_Name] = converted_dict

        
    return data
                   


def save_adjustment(df, df2):
    for index, row in df2.iterrows():
        for col in df2.columns:
            df.loc[index, col] = st.session_state[index][col]

with st.expander('Create Scenario'):
    create_scenario()

# adjust_form(["DRIVER_1"])

# df2 = pd.DataFrame({
#         "MUSD": ["DRIVER_1"],
#         "2024-01": 0,
#         "2024-02": 0,
#         "2024-03": 0,
#         "2024-04": 0,
#         "2024-05": 0,
#         "2024-06": 0,
#         "2024-07": 0,
#         "2024-08": 0,
#         "2024-09": 0,
#     })
# with st.form("edit Data"):
#     edited_df = st.data_editor(df2)
#     st.form_submit_button("Submit")

# edited_df