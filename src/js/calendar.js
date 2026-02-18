/* global flatpickr */
import { getTasksFromStorage, updateTaskInStorage } from './storage.js';

export function initMainCalendar() {
  let backdropShield = null;

  return flatpickr('#task-datetime', {
    enableTime: true,
    dateFormat: 'Y-m-d H:i',
    altInput: true,
    altFormat: 'j \\de F, H:i',
    locale: 'pt',
    time_24hr: true,
    disableMobile: 'true',

    parseDate: (datestr, format) => {
      const defaultDate = flatpickr.parseDate(datestr, format);
      if (defaultDate) return defaultDate;
      const ptDate = flatpickr.parseDate(datestr, 'd/m/Y H:i');
      if (ptDate) return ptDate;
      const simpleDate = flatpickr.parseDate(datestr, 'd/m/Y');
      if (simpleDate) return simpleDate;
      return flatpickr.parseDate(datestr, format);
    },

    onChange: function (selectedDates, dateStr, instance) {
      if (selectedDates.length === 0) return;
      const taskDate = selectedDates[0];
      const currentYear = new Date().getFullYear();
      if (taskDate.getFullYear() !== currentYear) {
        instance.set('altFormat', 'j \\de F \\de Y, H:i');
      } else {
        instance.set('altFormat', 'j \\de F, H:i');
      }
      if (instance.altInput) {
        instance.altInput.value = instance.formatDate(
          taskDate,
          instance.config.altFormat
        );
      }
    },

    onOpen: function (selectedDates, dateStr, instance) {
      backdropShield = document.createElement('div');
      backdropShield.classList.add('calendar-backdrop-shield');
      const killEvent = (e) => {
        e.stopPropagation();
        e.preventDefault();
      };
      ['touchstart', 'mousedown', 'click'].forEach((evtType) => {
        backdropShield.addEventListener(evtType, (e) => {
          killEvent(e);
          instance.close();
        });
      });
      document.body.appendChild(backdropShield);
    },

    onClose: function () {
      if (backdropShield) {
        setTimeout(() => {
          if (backdropShield) {
            backdropShield.remove();
            backdropShield = null;
          }
        }, 50);
      }
    },
  });
}

export function initQuickRescheduleCalendar(getTaskId) {
  const rescheduleInput = document.createElement('input');
  rescheduleInput.style.display = 'none';
  document.body.appendChild(rescheduleInput);

  return flatpickr(rescheduleInput, {
    enableTime: true,
    dateFormat: 'Y-m-d H:i',
    locale: 'pt',
    time_24hr: true,
    disableMobile: 'true',

    onOpen: function (selectedDates, dateStr, instance) {
      const shield = document.createElement('div');
      shield.classList.add('calendar-backdrop-shield');
      shield.addEventListener('click', () => instance.close());
      document.body.appendChild(shield);
      instance.customShield = shield;
    },

    onClose: function (selectedDates, dateStr, instance) {
      if (instance.customShield) instance.customShield.remove();

      const currentRescheduleTaskId = getTaskId();

      if (selectedDates.length > 0 && currentRescheduleTaskId) {
        const tasks = getTasksFromStorage();
        const taskIndex = tasks.findIndex(
          (t) => t.id === Number(currentRescheduleTaskId)
        );

        if (taskIndex > -1) {
          const updatedTask = { ...tasks[taskIndex], dateTime: dateStr };
          updateTaskInStorage(updatedTask);
          location.reload();
        }
      }
    },
  });
}
