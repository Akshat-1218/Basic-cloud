const db = require('../config/db');

exports.getEmployees = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM employees ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Employee not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employee' });
  }
};

exports.createEmployee = async (req, res) => {
  const { name, email, phone, department, salary, joining_date } = req.body;
  if (!name || !email || !department || salary === undefined || salary === '') {
    return res.status(400).json({ message: 'Name, email, department and salary are required' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO employees (name, email, phone, department, salary, joining_date) VALUES (?, ?, ?, ?, ?, ?)',
      [name.trim(), email.trim(), phone || null, department, Number(salary), joining_date || null]
    );
    const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'An employee with this email already exists' });
    res.status(500).json({ message: 'Failed to create employee' });
  }
};

exports.updateEmployee = async (req, res) => {
  const { name, email, phone, department, salary, joining_date } = req.body;
  if (!name || !email || !department || salary === undefined || salary === '') {
    return res.status(400).json({ message: 'Name, email, department and salary are required' });
  }
  try {
    const [result] = await db.query(
      'UPDATE employees SET name=?, email=?, phone=?, department=?, salary=?, joining_date=? WHERE id=?',
      [name.trim(), email.trim(), phone || null, department, Number(salary), joining_date || null, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'Employee not found' });
    const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'An employee with this email already exists' });
    res.status(500).json({ message: 'Failed to update employee' });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete employee' });
  }
};
