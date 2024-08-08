(() => {
  // ../time_tracker/time_tracker/public/js/time_tracker.bundle.js
  frappe.ui.form.Form = class TimerFrom extends frappe.ui.form.Form {
    async render_form(val) {
      await super.render_form(val);
      add_stopwatch(cur_frm.doc.time_tracker_value);
    }
    async save(save_action, callback, btn, on_error) {
      var locally_saved = cur_frm.is_new();
      var workflow_state = cur_frm.doc.workflow_state ? cur_frm.doc.workflow_state : "";
      var status = cur_frm.doc.status ? cur_frm.doc.status : "";
      var dt = frappe.boot.time_tracker_dt_list || [];
      if (dt.includes(cur_frm.doctype)) {
        await super.save(save_action, callback, btn, on_error);
        debugger;
        var Action = "";
        if (locally_saved) {
          Action = "Create";
        } else if (save_action == "save" || save_action == "Save") {
          Action = "Update";
        } else {
          Action = save_action;
        }
        var dt = frappe.boot.time_tracker_dt_list || [];
        if (dt.includes(cur_frm.doctype)) {
          frappe.call({
            async: false,
            method: "time_tracker.time_tracker.doctype.activity_timer_log.activity_timer_log.create_activity_time_log",
            args: {
              dt: cur_frm.doctype,
              dn: cur_frm.doc.name,
              action: Action,
              user: frappe.session.user,
              time_taken: cur_frm.doc.time_tracker_value,
              status,
              workflow_state
            }
          }).then(() => {
            cur_frm.reload_doc();
          });
        }
      } else {
        super.save(save_action, callback, btn, on_error);
      }
    }
  };
  function add_stopwatch(time_tracker_value = 0) {
    var interval = sessionStorage.getItem("intrval");
    var dt = frappe.boot.time_tracker_dt_list || [];
    if (dt.includes(cur_frm.doctype)) {
      let updateStopwatch2 = function(increment) {
        var hours = Math.floor(increment / 3600);
        var minutes = Math.floor((increment - hours * 3600) / 60);
        var seconds = increment - hours * 3600 - minutes * 60;
        $(section).find(".hours").text(hours < 10 ? "0" + hours.toString() : hours.toString());
        $(section).find(".minutes").text(minutes < 10 ? "0" + minutes.toString() : minutes.toString());
        $(section).find(".seconds").text(seconds < 10 ? "0" + seconds.toString() : seconds.toString());
      }, setCurrentIncrement2 = function() {
        currentIncrement += 1;
        cur_frm.doc.time_tracker_value = currentIncrement;
        return currentIncrement;
      }, initialiseTimer2 = function() {
        if (interval) {
          stopTimer2();
        }
        interval = setInterval(function() {
          var current = setCurrentIncrement2();
          updateStopwatch2(current);
        }, 1e3);
        sessionStorage.setItem("intrval", interval);
      }, stopTimer2 = function() {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      };
      var updateStopwatch = updateStopwatch2, setCurrentIncrement = setCurrentIncrement2, initialiseTimer = initialiseTimer2, stopTimer = stopTimer2;
      const timer = `
            <div class="btn btn-primary btn-sm primary-action">
                <span class="hours">00</span>
                <span class="colon">:</span>
                <span class="minutes">00</span>
                <span class="colon">:</span>
                <span class="seconds">00</span>
            </div>`;
      var section = cur_frm.toolbar.page.add_inner_message(timer);
      var currentIncrement = time_tracker_value || 0;
      initialiseTimer2();
    }
  }
})();
//# sourceMappingURL=time_tracker.bundle.YOAEYAIA.js.map
