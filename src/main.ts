import { Note } from './note';

const notes: Note[] = [];

function addNote(content: string) {
  const newNote: Note = {
    id: Date.now().toString(),
    content,
    timestamp: new Date().toLocaleString()
  };
  notes.push(newNote);
  saveNotes();
  renderNotes();
}

function deleteNote(id: string) {
  if (confirm("Are you sure you want to delete this note?")) {
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
      notes.splice(index, 1);
      saveNotes();
      renderNotes();
    }
  }
}

function editNote(id: string) {
  const note = notes.find(n => n.id === id);
  if (note) {
    const updatedContent = prompt("Edit your note:", note.content);
    if (updatedContent !== null && updatedContent.trim() !== "") {
      note.content = updatedContent.trim();
      saveNotes();
      renderNotes();
    }
  }
}

function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotes() {
  const data = localStorage.getItem('notes');
  if (data) {
    const parsed = JSON.parse(data) as Note[];
    parsed.forEach(n => notes.push(n));
  }
}

function renderNotes() {
  const container = document.querySelector(".note-container");
  if (container) {
    container.innerHTML = "";
    notes.forEach(note => {
      const div = document.createElement("div");
      div.className = "note";
      div.innerHTML = `
        <strong>${note.timestamp}</strong><br>
        ${note.content}<br>
        <button class="edit-btn" data-id="${note.id}">✏️ Edit</button>
        <button class="delete-btn" data-id="${note.id}">🗑️ Delete</button>
      `;
      container.appendChild(div);
    });

    // Add event listeners
    container.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute("data-id");
        if (id) deleteNote(id);
      });
    });

    container.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute("data-id");
        if (id) editNote(id);
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("save-btn") as HTMLButtonElement;
  const input = document.getElementById("note-input") as HTMLTextAreaElement;

  loadNotes();
  renderNotes();

  saveBtn.addEventListener("click", () => {
    if (input.value.trim() !== "") {
      addNote(input.value);
      input.value = "";
      document.getElementById("status")!.textContent = "Note saved successfully! 💙";
    } else {
      alert("Please type something first!");
    }
  });
});
document.getElementById("theme-toggle")!.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
