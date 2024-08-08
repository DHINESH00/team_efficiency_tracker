frappe.ui.form.Form =class TimerFrom extends frappe.ui.form.Form{
      async render_form(val){
            await super.render_form(val)
                add_stopwatch(cur_frm.doc.time_tracker_value)
        
        }
        save(save_action, callback, btn, on_error) {
            var locally_saved = cur_frm.is_new()
            let me = this;
            return new Promise((resolve, reject) => {
                btn && $(btn).prop("disabled", true);
                frappe.ui.form.close_grid_form();
                me.validate_and_save(save_action, callback, btn, on_error, resolve, reject);
            })
                .then(() => {
                    me.show_success_action();
                    var workflow_state=cur_frm.doc.workflow_state?cur_frm.doc.workflow_state:""
                    var status=cur_frm.doc.status?cur_frm.doc.status:""
                    var dt=frappe.boot.time_tracker_dt_list || [];
                    if (dt.includes(cur_frm.doctype)){
                    
                        
                        var Action=""
                        if( locally_saved){
                            Action ="Create"
                        }
                        else if (save_action=="save" ||save_action=="Save"){
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
                            cur_frm.reload_doc()
        
                            
        
                        })
                    }
                  
                }
                })
                .catch((e) => {
                    console.error(e);
                });
            
        }

    //      save(save_action, callback, btn, on_error){
            
    //         var locally_saved = cur_frm.is_new()
    //         var workflow_state=cur_frm.doc.workflow_state?cur_frm.doc.workflow_state:""
    //         var status=cur_frm.doc.status?cur_frm.doc.status:""
    //         var dt=frappe.boot.time_tracker_dt_list || [];
    //         if (dt.includes(cur_frm.doctype)){
    //          super.save(save_action, callback, btn, on_error)
    //             debugger
                
    //             var Action=""
    //             if( locally_saved){
    //                 Action ="Create"
    //             }
    //             else if (save_action=="save" ||save_action=="Save"){
    //                 Action="Update"
    //             }
    //             else{
    //                 Action= save_action
    //             }
    //             var dt=frappe.boot.time_tracker_dt_list || [];
    //             if (dt.includes(cur_frm.doctype)){
    //             frappe.call({
    //                 async: false,
    //                 method: "time_tracker.time_tracker.doctype.activity_timer_log.activity_timer_log.create_activity_time_log",
    //                 args: {
    //                     dt: cur_frm.doctype,
    //                     dn: cur_frm.doc.name,
    //                     action: Action,
    //                     user: frappe.session.user,
    //                     time_taken: cur_frm.doc.time_tracker_value,
    //                     status:status,
    //                     workflow_state:workflow_state
    //                     }
    //             }).then(()=>{
    //                 cur_frm.reload_doc()

                    

    //             })
    //         }
          
    //     }
    //     else{
    //         super.save(save_action, callback, btn, on_error)
    //     }
       
    // }
    

    
}

function add_stopwatch(time_tracker_value = 0) {
    // Declare interval variable to manage the stopwatch interval
    var interval = sessionStorage.getItem('intrval');

    // Get the list of data trackers
    var dt = frappe.boot.time_tracker_dt_list || [];
    if (dt.includes(cur_frm.doctype)) {

        // Stopwatch HTML
        const timer = `
            <div class="btn btn-primary btn-sm primary-action">
                <span class="hours">00</span>
                <span class="colon">:</span>
                <span class="minutes">00</span>
                <span class="colon">:</span>
                <span class="seconds">00</span>
            </div>`;

        // Add stopwatch to the form
        var section = cur_frm.toolbar.page.add_inner_message(timer);
        var currentIncrement = time_tracker_value || 0;

        // Initialize the timer
        initialiseTimer();

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
            
            // Clear any existing interval before starting a new one
            if (interval) {
                stopTimer();
            }
            
            interval = setInterval(function() {
                var current = setCurrentIncrement();
                updateStopwatch(current);
            }, 1000);
            sessionStorage.setItem('intrval',interval);
        }

        // Optional: Add a way to stop the timer if needed
        function stopTimer() {
            if (interval) {
                clearInterval(interval);
                interval = null; // Set to null to indicate the timer is stopped
            }
        }

       
    }
}
