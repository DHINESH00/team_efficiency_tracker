// Copyright (c) 2024, dhinesh@aerele.in and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Time Tracker"] = {
	"filters": [
		{
			"fieldname":"doctype_value",
			"label": __("Doctype"),
			"fieldtype": "Select",
			"width": "80",
			"options": frappe.boot.time_tracker_dt_list.join("\n"),
			"reqd": 1,

		},
		
		{
			"fieldname":"from_date",
			"label": __("From Date"),
			"fieldtype": "Date",
			"width": "80",
			"default":  frappe.datetime.add_months(frappe.datetime.get_today(), -1),
			"reqd": 1,
		},
		{
			"fieldname":"to_date",
			"label": __("To Date"),
			"fieldtype": "Date",
			"width": "80",
			"default": frappe.datetime.get_today(),
			"reqd": 1,
		},
	]
};
