import { getCountdownText } from './utils.js';

export function updateHeaderDate() {
  const dateElement = document.getElementById('today');
  if (dateElement) {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateString = now.toLocaleDateString('pt-BR', options);
    const formattedDate =
      dateString.charAt(0).toUpperCase() + dateString.slice(1);
    dateElement.textContent = formattedDate;
    dateElement.setAttribute('datetime', now.toISOString().split('T')[0]);
  }
}

export function toggleEmptyState(taskList) {
  const emptyStateMessage = document.getElementById('empty-state');
  const hasTasks = taskList && taskList.children.length > 0;
  if (hasTasks) {
    emptyStateMessage.classList.add('hidden');
  } else {
    emptyStateMessage.classList.remove('hidden');
  }
}

export function updatePriorityVisuals() {
  const priorityContainer = document.getElementById('priority-selector');
  const selected = document.querySelector('input[name="priority"]:checked');

  if (selected && priorityContainer) {
    priorityContainer.setAttribute('data-selected', selected.value);
  }
}

export function updateAllCountdowns() {
  const allTasks = document.querySelectorAll('.task-item');
  allTasks.forEach((taskItem) => {
    const deadline = taskItem.dataset.deadline;
    if (!deadline || taskItem.classList.contains('completed')) return;

    const countdownData = getCountdownText(deadline);
    const countdownElement = taskItem.querySelector('.task-countdown');

    if (countdownElement && countdownData) {
      countdownElement.textContent = countdownData.text;
      if (countdownData.isOverdue) {
        taskItem.classList.add('overdue');
      } else {
        taskItem.classList.remove('overdue');
      }
    }
  });
}
