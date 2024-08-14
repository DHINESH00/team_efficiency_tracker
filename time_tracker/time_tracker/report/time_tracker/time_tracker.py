# Copyright (c) 2024, dhinesh@aerele.in and contributors
# For license information, please see license.txt

import frappe
from frappe import _

def execute(filters=None):
	def get_col():
		return [
			{
			"label": _("Document"),
			"fieldtype": "Data",
			"fieldname": "ref_docname",
			"width": 100,

			},
			{
			"label": _("Action"),
			"fieldtype": "Data",
			"fieldname": "activity",
			"width": 100,

			},
			{
			"label": _("Time Taken"),
			"fieldtype": "Data",
			"fieldname": "time_taken",
			"width": 100,

			},
			{
			"label": _("Opened"),
			"fieldtype": "Data",
			"fieldname": "open_time",
			"width": 100,

			},
			{
			"label": _("Closed"),
			"fieldtype": "Data",
			"fieldname": "close_time",
			"width": 100,

			},
			{
			"label": _("Activity Date"),
			"fieldtype": "Data",
			"fieldname": "activity_date",
			"width": 100,

			},
						
						{
				"label": _("User"),
			"fieldtype": "Data",
			"fieldname": "activity_by",
			"width": 100,

			},

		]
	def get_data(filters):
		data=frappe.db.sql("""Select 
					 dn as ref_docname,
					 if (action ="Create",action, if(workflow_state is null,action,workflow_state)) as activity,
					 DATE_SUB(creation, INTERVAL time_taken SECOND) as open_time,
					 creation as close_time,
					 Date(creation)as activity_date,
					 ROUND(time_taken/60,3) as time_taken,
					 owner as activity_by
					 from `tabActivity Timer Log`
					 where dt = %s
					 and
					 Date(creation) <=%s
					 and
					 Date(creation) >=%s
					 order by creation,modified,ref_docname
					 
					 """,(filters.get("doctype_value"),filters.get("to_date"),filters.get("from_date")),as_dict=1)
		return data
	
	columns =get_col()
	data =get_data(filters)
	return columns, data
