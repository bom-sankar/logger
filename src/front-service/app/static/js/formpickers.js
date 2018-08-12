function dateFilter(minDate){
    console.log(minDate)
  if ($("#datepicker-popup").length) {
    $('#datepicker-popup').datepicker({
      enableOnReadonly: true,
      todayHighlight: true,
      startDate: minDate[0]
    }).datepicker('setDate', '-7d');
  }
  if ($("#datepicker-popup-to").length) {
    $('#datepicker-popup-to').datepicker({
      enableOnReadonly: true,
      todayHighlight: true,
      startDate: '-6d'
    }).datepicker('setDate', 'today');
  }
 }