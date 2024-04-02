// Define calendar globally
var calendar;

// Define an array to store added holidays
var addedHolidays = {};

document.addEventListener("DOMContentLoaded", function () {
  // Initialization code for FullCalendar
  var calendarEl = document.getElementById("calendar");
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    // Additional FullCalendar options as needed...
  });
  calendar.render();

  // Event listener for checkbox change
  document.querySelectorAll('.countrySelection input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const countryIsoCode = this.id;
      const isChecked = this.checked;
      if (isChecked) {
        fetchHolidays(countryIsoCode, '2024-01-01', '2025-12-31', countryIsoCode);
      } else {
        removeHolidays(countryIsoCode);
      }
    });
  });
});

// Function to fetch holidays for a given country and optional subdivision
function fetchHolidays(countryIsoCode, validFrom, validTo, subdivisionCode = '') {
  const urlPublicHolidays = `https://openholidaysapi.org/PublicHolidays?countryIsoCode=${countryIsoCode}&validFrom=${validFrom}&validTo=${validTo}${subdivisionCode ? '&subdivisionCode=' + subdivisionCode : ''}`;
  const urlSchoolHolidays = `https://openholidaysapi.org/SchoolHolidays?countryIsoCode=${countryIsoCode}&validFrom=${validFrom}&validTo=${validTo}${subdivisionCode ? '&subdivisionCode=' + subdivisionCode : ''}`;

  // Fetch Public Holidays
  fetch(urlPublicHolidays)
    .then(response => response.json())
    .then(holidays => {
      // Mark Public Holidays on Calendar
      holidays.forEach(holiday => markHolidayOnCalendar(holiday, 'public', countryIsoCode));
    })
    .catch(error => console.error('Error fetching public holidays:', error));

  // Fetch School Holidays
  fetch(urlSchoolHolidays)
    .then(response => response.json())
    .then(holidays => {
      // Mark School Holidays on Calendar
      holidays.forEach(holiday => markHolidayOnCalendar(holiday, 'school', countryIsoCode));
    })
    .catch(error => console.error('Error fetching school holidays:', error));
}

// Function to remove holidays for a given country
function removeHolidays(countryIsoCode) {
  if (addedHolidays[countryIsoCode]) {
    addedHolidays[countryIsoCode].forEach(event => event.remove());
    addedHolidays[countryIsoCode] = [];
  }
}

function markHolidayOnCalendar(holiday, type, countryIsoCode) {
  let startDate = holiday.startDate;
  let endDate = holiday.endDate;

  // Define the event color based on the holiday type
  let eventColor = '';
  switch (type) {
    case 'public':
      eventColor = 'orange';
      break;
    case 'school':
      eventColor = 'red';
      break;
    default:
      eventColor = 'green'; // Default color, if needed
  }

  // Add the event to the calendar
  const event = calendar.addEvent({
    title: holiday.name[0].text, // Assuming holiday.name is an array with at least one element
    start: startDate,
    end: endDate,
    color: eventColor, // Use the determined color for the event
    allDay: true,
    extendedProps: {
      countryIsoCode: countryIsoCode
    }
  });

  // Store the added event
  if (!addedHolidays[countryIsoCode]) {
    addedHolidays[countryIsoCode] = [];
  }
  addedHolidays[countryIsoCode].push(event);
}
