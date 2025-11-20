import React, { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../api';
import './Dashboard.css';

function TaskForm({ onSave, editing }) {
  const [title, setTitle] = useState(editing?.title || '');
  const [desc, setDesc] = useState(editing?.description || '');
  const [category, setCategory] = useState(editing?.category || 'general');
  const [due, setDue] = useState(editing?.dueDate ? editing.dueDate.split('T')[0] : '');

  useEffect(() => {
    setTitle(editing?.title || '');
    setDesc(editing?.description || '');
    setCategory(editing?.category || 'general');
    setDue(editing?.dueDate ? editing.dueDate.split('T')[0] : '');
  }, [editing]);

  return (
    <form
      className="task-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ title, description: desc, category, dueDate: due ? new Date(due) : null });
      }}
    >
      <input
        className="input-field"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="input-field"
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="work">Work</option>
        <option value="personal">Personal</option>
        <option value="study">Study</option>
        <option value="general">General</option>
      </select>
      <input className="input-field" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
      <button className="btn-submit" type="submit">{editing ? 'Update Task' : 'Save Task'}</button>
    </form>
  );
}

export default function Dashboard({ token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);

  async function load() {
    const t = await apiGet('/tasks', token);
    setTasks(t || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function createTask(data) {
    const res = await apiPost('/tasks', data, token);
    setTasks((prev) => [res, ...prev]);
    setEditing(null);
  }

  async function updateTask(id, data) {
    const res = await apiPut('/tasks/' + id, data, token);
    setTasks((prev) => prev.map((p) => (p._id === id ? res : p)));
    setEditing(null);
  }

  async function deleteTask(id) {
    await apiDelete('/tasks/' + id, token);
    setTasks((prev) => prev.filter((p) => p._id !== id));
  }

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === 'done').length,
    inprogress: tasks.filter((t) => t.status === 'inprogress').length,
    todo: tasks.filter((t) => t.status === 'todo').length,
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Task Dashboard</h2>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-main">
        <div className="form-section">
          <h3>{editing ? 'Edit Task' : 'Create Task'}</h3>
          <TaskForm onSave={(data) => (editing ? updateTask(editing._id, data) : createTask(data))} editing={editing} />
        </div>

        <div className="stats-section">
          <h3>Statistics</h3>
          <div className="stats-cards">
            <div className="stat-card total">Total: {stats.total}</div>
            <div className="stat-card todo">Todo: {stats.todo}</div>
            <div className="stat-card inprogress">In Progress: {stats.inprogress}</div>
            <div className="stat-card done">Done: {stats.done}</div>
          </div>
        </div>
      </div>

      <div className="tasks-list">
        <h3>Your Tasks</h3>
        {tasks.map((t) => (
          <div className="task-card" key={t._id}>
            <div className="task-info">
              <strong>{t.title}</strong> <span className="task-category">({t.category})</span>
              <p>{t.description}</p>
              <small>Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</small>
            </div>
            <div className="task-actions">
              <button className="btn-edit" onClick={() => setEditing(t)}>
                Edit
              </button>
              <button className="btn-delete" onClick={() => deleteTask(t._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
