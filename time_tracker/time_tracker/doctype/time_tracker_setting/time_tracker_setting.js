// Copyright (c) 2024, dhinesh@aerele.in and contributors
// For license information, please see license.txt

frappe.ui.form.on('Time Tracker Setting', {
	refresh: function(frm) {
		cur_frm.set_query("document_type", "time_tracker__table", function(doc, cdt, cdn) {
			var d = locals[cdt][cdn];
			return {
				filters: {
					"is_submittable":1
				}
			}
		});

	}
});
