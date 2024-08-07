# Copyright (c) 2024, dhinesh@aerele.in and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class TimeTrackerSettings(Document):
	def validate(self):
		self.create_custom_field_for_time_tracker()
	def create_custom_field_for_time_tracker(self):
		for row in self.time_tracker__table:
			frappe.clear_cache(doctype=row.document_type)
			meta = frappe.get_meta(row.document_type)
			if not meta.get_field("time_tracker_value"):
			# create custom field
				frappe.get_doc(
				{
				"doctype": "Custom Field",
				"dt": row.document_type,
				"__islocal": 1,
				"fieldname": "time_tracker_value",
				"label": "Time Tracker",
				"hidden": 1,
				"allow_on_submit": 1,
				"no_copy": 1,
				"fieldtype": "Int",
				"owner": "Administrator",
				"default":1,
				}
				).save()
def set_time_tracker_value_list(bootinfo):
	time_tracker_dt_list=frappe.db.get_all("Time Tracker Setting Table",{ "parent":"Time Tracker Settings" }, "document_type",pluck="document_type")
	bootinfo["time_tracker_dt_list"]= time_tracker_dt_list
	return bootinfo