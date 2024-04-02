// Define calendar globally
var calendar;

// Define an object to store added holidays
var addedHolidays = {};

document.addEventListener("DOMContentLoaded", function () {
  initializeCalendar();
  setupCheckboxListeners();
});

function initializeCalendar() {
  var calendarEl = document.getElementById("calendar");
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    // Additional FullCalendar options as needed...
  });
  calendar.render();
}

function setupCheckboxListeners() {
  document.querySelectorAll('.countrySelection input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const countryIsoCode = this.id;
      const isChecked = this.checked;
      if (isChecked) {
        fetchHolidays(countryIsoCode, '2024-01-01', '2025-12-31');
      } else {
        removeHolidays(countryIsoCode);
      }
    });
  });
}

function fetchHolidays(countryIsoCode, validFrom, validTo) {
  const urlSchoolHolidays = `https://openholidaysapi.org/SchoolHolidays?countryIsoCode=${countryIsoCode}&validFrom=${validFrom}&validTo=${validTo}`;

  fetch(urlSchoolHolidays)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch holidays');
      }
      return response.json();
    })
    .then(holidays => {
      holidays.forEach(holiday => markHolidayOnCalendar(holiday, countryIsoCode));
    })
    .catch(error => console.error('Error fetching holidays:', error));
}

function removeHolidays(countryIsoCode) {
  if (addedHolidays[countryIsoCode]) {
    addedHolidays[countryIsoCode].forEach(event => event.remove());
    addedHolidays[countryIsoCode] = [];
  }
}

function markHolidayOnCalendar(holiday, countryIsoCode) {
  let startDate = holiday.startDate;
  let endDate = holiday.endDate;
  let eventColor = 'red'; // School holidays color

  let countryName = getCountryName(countryIsoCode);

  let eventTitle = holiday.name[0].text;
  if (holiday.subdivisions && holiday.subdivisions.length > 0) {
    eventTitle += ` (${countryName}, ${holiday.subdivisions[0].shortName})`;
  } else {
    eventTitle += ` (${countryName})`;
  }

  const event = calendar.addEvent({
    title: eventTitle,
    start: startDate,
    end: endDate,
    color: eventColor,
    allDay: true,
    extendedProps: {
      countryIsoCode: countryIsoCode
    }
  });

  if (!addedHolidays[countryIsoCode]) {
    addedHolidays[countryIsoCode] = [];
  }
  addedHolidays[countryIsoCode].push(event);
}

function getCountryName(countryIsoCode) {
  switch (countryIsoCode) {
    case 'DE':
      return 'DE';
    case 'AT':
      return 'AT';
    case 'CH':
      return 'CH';
    case 'FR':
      return 'FR';
    default:
      return ''; // Return empty string if the ISO code is not recognized
  }
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


  holidays.forEach(holiday => markHolidayOnCalendar(holiday, 'public', countryIsoCode, holiday.subdivision));



  