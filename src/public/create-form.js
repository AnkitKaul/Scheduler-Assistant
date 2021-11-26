// Date and time picker setup
const datePicker = $('#date').pickadate({
	editable: true,
	min: true,
	format: 'ddd d mmmm, yyyy'
}).pickadate('picker');

const timeOption = {
	editable: true,
	min: [7, 0], // min = 7 AM
	max: [22, 0] // max = 10PM
};

let startPicker = $('#start-time').pickatime(timeOption).pickatime('picker');
let endPicker = $('#end-time').pickatime(timeOption).pickatime('picker');
startPicker.on('open', () => {
	startPicker.close();
});
endPicker.on('open', () => {
	endPicker.close();
});
$(window).on('load', function () {
	// hack-fix timepicker pop up if clicked before page loaded
	setTimeout(() => {
		startPicker.off('open');
		endPicker.off('open');
	}, 500);
});
$('#date').click(() => datePicker.open());
$('#start-time').click(() => startPicker.open());
$('#end-time').click(() => endPicker.open());

// Submit handler
let form = document.getElementsByClassName('needs-validation')[0];
form.onsubmit = event => {
	event.preventDefault();
	let valid = true;
	form.classList.add('was-validated');
	
	// Time handler
	let filledStatus;
	filledStatus = (datePicker.get('select') === null || startPicker.get('select') === null ||
		endPicker.get('select') === null) ? false : true;
	if (filledStatus) {
		const validTime = checkTime(datePicker, startPicker, endPicker);
		if (!validTime) {
			$('#start-feedback').text('Start time must be before end time.');
			$('#start-time').addClass('is-invalid');
			$('#start-time').css('border-color', '#dc3545'); // red 
			$('#end-time').css('border-color', '#dc3545');
			valid = false;
		} else {
			$('#start-time').removeClass('is-invalid');
			$('#start-time').css('border-color', '#28a745'); // green
			$('#end-time').css('border-color', '#28a745');
		}
	}

	//submit request
	if (!form.checkValidity()) valid = false; // html5 input check
	if (valid === false) return false;
	// construct start Date and end Date object
	const { hour: startHour, mins: startMin } = startPicker.get('select');
	const { hour: endHour, mins: endMin } = endPicker.get('select');
	const date = datePicker.get('select').obj.getTime();
	let startDate = new Date(date);
	startDate.setHours(startHour);
	startDate.setMinutes(startMin);
	let endDate = new Date(date);
	endDate.setHours(endHour);
	endDate.setMinutes(endMin);

	let newEvent = {
		eventName: $('#event-name').val().trim(),
		summary: $('#overview').val().trim(),
		startDate: startDate.toJSON(),
		endDate: endDate.toJSON(),
		capacity: $('#capacity').val(),
	};
	//disable submit button
	$('.submit-btn').attr('disabled', true);
	
	$.ajax({
		type: 'POST',
		url: '/event/create',
		data: JSON.stringify(newEvent),
		contentType: 'application/json',
		success: eventCreated => {
			//redirect user to event page
			window.location.href = `/event/id/${eventCreated.id}`;
		},
		error: err => {
			console.log(err);
		},

	});

};

// check if start time < end time
function checkTime(datePicker, startPicker, endPicker) {
	const { hour: startHour, mins: startMin } = startPicker.get('select');
	const { hour: endHour, mins: endMin } = endPicker.get('select');

	const date = datePicker.get('select').obj;
	const startTime = new Date(date.getTime());
	startTime.setHours(startHour);
	startTime.setMinutes(startMin);

	const endTime = new Date(date.getTime());
	endTime.setHours(endHour);
	endTime.setMinutes(endMin);

	return startTime.getTime() < endTime.getTime();
}