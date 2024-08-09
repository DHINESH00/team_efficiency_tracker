# Copyright (c) 2024, dhinesh@aerele.in and contributors
# For license information, please see license.txt

import frappe
from frappe import _

def execute(filters=None):
	col_find_workflow_state=frappe.db.get_list("Activity Timer Log",{"dt":filters.get("doctype_value"),"creation":["between",[filters.get("from_date"),filters.get("to_date")]],"workflow_state":["!=",""]},["distinct workflow_state"],pluck ="workflow_state",order_by="creation")
	col_find_action=frappe.db.get_list("Activity Timer Log",{"dt":filters.get("doctype_value"),"creation":["between",[filters.get("from_date"),filters.get("to_date")]],"action":["!=",""]},["distinct action"],pluck="action",order_by="creation")
	def get_columns(filters,col_find_action,col_find_workflow_state):
		
		
		columns=[{
			"label": _("Document"),
			"fieldtype": "Data",
			"fieldname": "ref_docname",
			"width": 100,}]
		for  action in col_find_action:
			columns= columns+[
				{
				"label": _("Document open time"),
				"fieldtype": "Data",
				"fieldname": "open_time"+action,
				"width": 100,
			},
			{
				"label": _("Document close time"),
				"fieldtype": "Data",
				"fieldname": "close_time"+action,
				"width": 100,
			},
			{
				"label": _(action),
				"fieldtype": "Data",
				"fieldname": "time_taken"+action,
				"width": 100,
			},
			{
				"label": _(action +" On"),
				"fieldtype": "Data",
				"fieldname": "on"+action,
				"width": 100,
			},
			{
				"label": _(action +" by"),
				"fieldtype": "Data",
				"fieldname": "by"+action,
				"width": 100,
			},

			]
		for  action in col_find_workflow_state:
			columns= columns+[
			{
			"label": _("Document open time"),
			"fieldtype": "Data",
			"fieldname": "open_time"+action,
			"width": 100,
		},
		{
			"label": _("Document close time"),
			"fieldtype": "Data",
			"fieldname": "close_time"+action,
			"width": 100,
		},
		{
			"label": _(action),
			"fieldtype": "Data",
			"fieldname": "time_taken"+action,
			"width": 100,
		},
		{
			"label": _(action +" On"),
			"fieldtype": "Data",
			"fieldname": "on"+action,
			"width": 100,
		},
		{
			"label": _(action +" by"),
			"fieldtype": "Data",
			"fieldname": "by"+action,
			"width": 100,
		},

		]
		return columns
	def get_data(filters,col_find_action,col_find_workflow_state):
		data=[]
		
		data=frappe.db.sql("""Select
					dn as ref_docname,
					DATE_SUB(creation, INTERVAL time_taken SECOND) as open_time,
					creation as close_time,
					ROUND(time_taken/60,3) as time_taken,
					Date(creation)as on_v,
					owner as by_v,
					workflow_state,
					action
					from `tabActivity Timer Log`
					 where dt = %s
					 and
					 Date(creation) <=%s
					 and
					 Date(creation) >=%s
					 order by creation,modified,ref_docname
					   """,(filters.get("doctype_value"),filters.get("to_date"),filters.get("from_date")),as_dict=1)
		data_new=[]
		for dict_data in data:
			new_data_dict={"ref_docname":dict_data["ref_docname"]}
			for  action in col_find_action:
				if dict_data["action"]==action:
					new_data_dict["on"+action]=dict_data["on_v"]
					new_data_dict["by"+action]=dict_data["by_v"]
					new_data_dict["open_time"+action]=dict_data["open_time"]
					new_data_dict["close_time"+action]=dict_data["close_time"]
					new_data_dict["time_taken"+action]=dict_data["time_taken"]
			for  action in col_find_workflow_state:
				if dict_data["workflow_state"]==action:
					new_data_dict["on"+action]=dict_data["on_v"]
					new_data_dict["by"+action]=dict_data["by_v"]
					new_data_dict["open_time"+action]=dict_data["open_time"]
					new_data_dict["close_time"+action]=dict_data["close_time"]
					new_data_dict["time_taken"+action]=dict_data["time_taken"]

			data_new.append(new_data_dict)
		data=data_new


		return data
	columns =get_columns(filters,col_find_action,col_find_workflow_state)
	data =get_data(filters,col_find_action,col_find_workflow_state)
	return columns, data
