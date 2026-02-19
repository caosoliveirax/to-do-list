export function showToast(onConfirm, onUndo) {
  const toastContainer = document.querySelector('.toast-container');

  const toastCard = document.createElement('div');
  toastCard.classList.add('toast-card');

  toastCard.innerHTML = `
      <div class="toast-content">
        <span class="toast-text">Tarefa excluída</span>
        <button class="toast-button" type="button">Desfazer</button>
      </div>
      <div class="progress-track">
        <div class="progress-fill"></div>
      </div>
  `;

  toastContainer.appendChild(toastCard);

  void toastCard.offsetWidth;
  toastCard.classList.add('open');

  const undoButton = toastCard.querySelector('.toast-button');
  const progressFill = toastCard.querySelector('.progress-fill');

  progressFill.classList.add('is-animating');

  const closeAndDestroyToast = () => {
    toastCard.classList.remove('open');
    setTimeout(() => {
      if (toastCard.parentElement) {
        toastCard.remove();
      }
    }, 300);
  };

  let timerId = setTimeout(() => {
    onConfirm();
    closeAndDestroyToast();
  }, 6000);

  undoButton.onclick = () => {
    clearTimeout(timerId);
    onUndo();
    closeAndDestroyToast();
  };
}
