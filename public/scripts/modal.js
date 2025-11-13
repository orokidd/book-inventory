const modal = document.getElementById("deleteModal");
const cancelBtn = document.getElementById("cancelBtn");
const deleteForm = document.getElementById("deleteForm");
const nameSpan = document.getElementById("item-name");

function openDeleteModal(deleteUrl, itemName) {
  deleteForm.action = deleteUrl; // set form target (e.g. /books/123/delete)
  nameSpan.textContent = itemName;
  modal.style.display = "flex";
}

cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

function closeDeleteFailedModal() {
  const failedModal = document.getElementById("deleteFailedModal");
  failedModal.style.display = "none";
}