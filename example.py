import os
import streamlit as st
import streamlit.components.v1 as components


_RELEASE = True

root_dir = os.path.dirname(os.path.abspath(__file__))
build_dir = os.path.join(root_dir, "component-frontend/build")

_adj_value = components.declare_component(
    "adj_value",
    path=build_dir
)

def com():
   return _adj_value()

if _RELEASE:
    res = com()
