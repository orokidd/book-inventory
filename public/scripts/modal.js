const modal = document.getElementById('deleteModal');
const cancelBtn = document.getElementById('cancelBtn');
const deleteForm = document.getElementById('deleteForm');
const bookNameSpan = document.getElementById('bookName');

// show modal with correct form action
function openDeleteModal(deleteUrl, bookName) {
  deleteForm.action = deleteUrl; // set form target (e.g. /books/123/delete)
  bookNameSpan.textContent = bookName;
  modal.style.display = 'flex';
}

// hide modal
cancelBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// hide when clicking outside content
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

function closeDeleteFailedModal() {
  const failedModal = document.getElementById('deleteFailedModal');
  failedModal.style.display = 'none';
}