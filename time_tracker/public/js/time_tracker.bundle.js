frappe.ui.form.Form =class TimerFrom extends frappe.ui.form.Form{
      async render_form(val){
            await super.render_form(val)
                add_stopwatch(cur_frm.doc.time_tracker_value)
        
        }
        save(save_action, callback, btn, on_error){
            
            var locally_saved = cur_frm.is_new()
            var workflow_state=cur_frm.doc.workflow_state?cur_frm.doc.workflow_state:""
            var status=cur_frm.doc.status?cur_frm.doc.status:""
            var dt=frappe.boot.time_tracker_dt_list || [];
            if (dt.includes(cur_frm.doctype)){
            super.save(save_action, callback, btn, on_error).then(()=>{

                var Action=""
                if( locally_saved){
                    Action ="Create"
                }
                else if (save_action=="Save"){
                    Action="Update"
                }
                else{
                    Action= save_action
                }
                var dt=frappe.boot.time_tracker_dt_list || [];
                if (dt.includes(cur_frm.doctype)){
                frappe.call({
                    async: false,
                    method: "time_tracker.time_tracker.doctype.activity_timer_log.activity_timer_log.create_activity_time_log",
                    args: {
                        dt: cur_frm.doctype,
                        dn: cur_frm.doc.name,
                        action: Action,
                        user: frappe.session.user,
                        time_taken: cur_frm.doc.time_tracker_value,
                        status:status,
                        workflow_state:workflow_state
                        }
                }).then(()=>{

                    frappe.ui.toolbar.clear_cache();

                })
            }
            })
        }
        else{
            super.save(save_action, callback, btn, on_error)
        }
       
    }
    

    
}

function add_stopwatch(time_tracker_value=0){
    
   
    var dt=frappe.boot.time_tracker_dt_list || [];
    if (dt.includes(cur_frm.doctype)){

        const timer = `<div class="btn btn-primary btn-sm primary-action">
        <span class="hours">00</span>
        <span class="colon">:</span>
        <span class="minutes">00</span>
        <span class="colon">:</span>
        <span class="seconds">00</span>
    </div>`;


    var section = cur_frm.toolbar.page.add_inner_message(timer);
    let currentIncrement=(time_tracker_value||0 );
    initialiseTimer()
    function updateStopwatch(increment) {
            var hours = Math.floor(increment / 3600);
            var minutes = Math.floor((increment - (hours * 3600)) / 60);
            var seconds = increment - (hours * 3600) - (minutes * 60);

            $(section).find(".hours").text(hours < 10 ? ("0" + hours.toString()) : hours.toString());
            $(section).find(".minutes").text(minutes < 10 ? ("0" + minutes.toString()) : minutes.toString());
            $(section).find(".seconds").text(seconds < 10 ? ("0" + seconds.toString()) : seconds.toString());
        }
    function setCurrentIncrement() {
            currentIncrement += 1;
            cur_frm.doc.time_tracker_value = currentIncrement;
            return currentIncrement;
        }
    function initialiseTimer() {
            const interval = setInterval(function() {
                var current = setCurrentIncrement();
                updateStopwatch(current);
            }, 1000);
        }
    }
}
frappe.ui.form.States =class TimerFrom_work extends frappe.ui.form.States {
    show_actions() {
		var added = false;
		var me = this;

		// if the loaded doc is dirty, don't show workflow buttons
		if (this.frm.doc.__unsaved === 1) {
			return;
		}

		function has_approval_access(transition) {
			let approval_access = false;
			const user = frappe.session.user;
			if (
				user === "Administrator" ||
				transition.allow_self_approval ||
				user !== me.frm.doc.owner
			) {
				approval_access = true;
			}
			return approval_access;
		}

		frappe.workflow.get_transitions(this.frm.doc).then((transitions) => {
			this.frm.page.clear_actions_menu();
			transitions.forEach((d) => {
				if (frappe.user_roles.includes(d.allowed) && has_approval_access(d)) {
					added = true;
					me.frm.page.add_action_item(__(d.action), function () {
						// set the workflow_action for use in form scripts
						frappe.dom.freeze();
						me.frm.selected_workflow_action = d.action;
						me.frm.script_manager.trigger("before_workflow_action").then(() => {
							frappe
								.xcall("time_tracker.time_tracker.doctype.activity_timer_log.activity_timer_log.create_activity_timer_on_workflow", {
									doc: me.frm.doc,
									action: d.action,
								})
								.then((doc) => {
									frappe.model.sync(doc);
									me.frm.refresh();
									me.frm.selected_workflow_action = null;
									me.frm.script_manager.trigger("after_workflow_action");
								})
								.finally(() => {
                                    
									frappe.dom.unfreeze();
                                    frappe.ui.toolbar.clear_cache();
								});
						});
					});
				}
			});

			this.setup_btn(added);
		});
	}
}