import { useEffect, useState } from 'react';
import api from './api';

const emptyForm = { name: '', email: '', phone: '', department: 'Engineering', salary: '', joining_date: '' };

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadEmployees() {
    try {
      const { data } = await api.get('/employees');
      setEmployees(data);
      setError('');
    } catch {
      setError('Could not load employees. Check that the backend and MySQL are running.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadEmployees(); }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      if (editingId) await api.put(`/employees/${editingId}`, form);
      else await api.post('/employees', form);
      setForm(emptyForm);
      setEditingId(null);
      setError('');
      await loadEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save employee.');
    }
  }

  function editEmployee(employee) {
    setEditingId(employee.id);
    setForm({
      name: employee.name, email: employee.email, phone: employee.phone || '',
      department: employee.department, salary: employee.salary,
      joining_date: employee.joining_date ? String(employee.joining_date).slice(0, 10) : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteEmployee(id) {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await api.delete(`/employees/${id}`);
      await loadEmployees();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete employee.');
    }
  }

  const filtered = employees.filter(e =>
    [e.name, e.email, e.department].some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="container">
      <header className="header">
        <div><p className="eyebrow">PEOPLE OPERATIONS</p><h1>Employee Management</h1><p className="muted">Manage your team records in one place.</p></div>
        <div className="count-card"><span>Total employees</span><strong>{employees.length}</strong></div>
      </header>

      {error && <div className="alert">{error}</div>}

      <section className="panel">
        <h2>{editingId ? 'Update employee' : 'Add new employee'}</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>Full name<input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Aditi Sharma" /></label>
          <label>Email<input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="name@company.com" /></label>
          <label>Phone<input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" /></label>
          <label>Department<select name="department" value={form.department} onChange={handleChange}><option>Engineering</option><option>Human Resources</option><option>Finance</option><option>Marketing</option><option>Sales</option><option>Operations</option></select></label>
          <label>Salary (₹)<input name="salary" type="number" min="0" step="0.01" value={form.salary} onChange={handleChange} required placeholder="50000" /></label>
          <label>Joining date<input name="joining_date" type="date" value={form.joining_date} onChange={handleChange} /></label>
          <div className="actions">
            <button className="primary" type="submit">{editingId ? 'Save changes' : 'Add employee'}</button>
            {editingId && <button className="secondary" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="list-heading"><div><h2>Employees</h2><p className="muted">{filtered.length} record(s)</p></div><input className="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, department..." /></div>
        {loading ? <p className="muted">Loading employees...</p> : (
          <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Department</th><th>Phone</th><th>Salary</th><th>Joining date</th><th>Actions</th></tr></thead>
            <tbody>{filtered.map(e => <tr key={e.id}><td><strong>{e.name}</strong><small>{e.email}</small></td><td><span className="badge">{e.department}</span></td><td>{e.phone || '—'}</td><td>₹{Number(e.salary).toLocaleString('en-IN')}</td><td>{e.joining_date ? String(e.joining_date).slice(0, 10) : '—'}</td><td className="row-actions"><button onClick={() => editEmployee(e)}>Edit</button><button className="delete" onClick={() => deleteEmployee(e.id)}>Delete</button></td></tr>)}
            {filtered.length === 0 && <tr><td colSpan="6" className="empty">No employees found.</td></tr>}</tbody>
          </table></div>
        )}
      </section>
      <footer>Employee Management System · React + Express + MySQL</footer>
    </main>
  );
}
