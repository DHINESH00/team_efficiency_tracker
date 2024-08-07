# Copyright (c) 2024, dhinesh@aerele.in and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.model.workflow import get_workflow, get_transitions ,has_approval_access
from frappe.model.docstatus import DocStatus
from frappe.utils import cint
from frappe import _
class WorkflowTransitionError(frappe.ValidationError):
	pass
class ActivityTimerLog(Document):
	pass
@frappe.whitelist()
def create_activity_time_log(dt,dn,action,user,time_taken,status,workflow_state):
	doc=frappe.new_doc("Activity Timer Log")
	doc.action=action
	doc.user=user
	doc.time_taken=time_taken
	doc.dt=dt
	doc.dn=dn
	doc.status=status
	doc.workflow_state=workflow_state
	doc.save(ignore_permissions=True)
	frappe.db.update(dt,dn,"time_tracker_value",0)
	return doc
@frappe.whitelist()
def create_activity_timer_on_workflow(doc, action):
	"""Allow workflow action on the current doc"""
	doc = frappe.get_doc(frappe.parse_json(doc))
	time_tracker_value=doc.time_tracker_value
	frappe.db.update(doc.doctype,doc.name,"time_tracker_value",0)
	doc.load_from_db()
	workflow = get_workflow(doc.doctype)
	transitions = get_transitions(doc, workflow)
	user = frappe.session.user

	# find the transition
	transition = None
	for t in transitions:
		if t.action == action:
			transition = t

	if not transition:
		frappe.throw(_("Not a valid Workflow Action"), WorkflowTransitionError)

	if not has_approval_access(user, doc, transition):
		frappe.throw(_("Self approval is not allowed"))

	# update workflow state field
	doc.set(workflow.workflow_state_field, transition.next_state)

	# find settings for the next state
	next_state = [d for d in workflow.states if d.state == transition.next_state][0]

	# update any additional field
	if next_state.update_field:
		doc.set(next_state.update_field, next_state.update_value)
	action=""
	new_docstatus = cint(next_state.doc_status)
	doc.set("time_tracker_value",0)
	if doc.docstatus.is_draft() and new_docstatus == DocStatus.draft():
		action="Update"
		doc.save()
	elif doc.docstatus.is_draft() and new_docstatus == DocStatus.submitted():
		action="Submit"
		doc.submit()
	elif doc.docstatus.is_submitted() and new_docstatus == DocStatus.submitted():
		action="Update after Submit"
		doc.save()
	elif doc.docstatus.is_submitted() and new_docstatus == DocStatus.cancelled():
		action="Cancel"
		doc.cancel()
	else:
		frappe.throw(_("Illegal Document Status for {0}").format(next_state.state))

	doc.add_comment("Workflow", _(next_state.state))
	time_tracker_dt_list=frappe.db.get_all("Time Tracker Setting Table",{ "parent":"Time Tracker Settings" }, "document_type",pluck="document_type")
	if doc.doctype in time_tracker_dt_list:
		create_activity_time_log(doc.doctype,doc.name,action,frappe.session.user,time_tracker_value,status=doc.get("status"),workflow_state=transition.next_state)
	return doc