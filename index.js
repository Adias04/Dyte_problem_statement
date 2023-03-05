const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

// create connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '', //
  database: 'vit_ffcs'
});

const app = express();
app.use(bodyParser.json());

// create a new slot
app.post('/slots', (req, res) => {
  const { name, start_time, end_time } = req.body;
  pool.query('INSERT INTO slots (name, start_time, end_time) VALUES (?, ?, ?)', [name, start_time, end_time], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating slot');
    } else {
      res.status(201).send(`Slot ${result.insertId} created`);
    }
  });
});

// get all slots
app.get('/slots', (req, res) => {
  pool.query('SELECT * FROM slots', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error getting slots');
    } else {
      res.status(200).send(rows);
    }
  });
});

// update a slot
app.put('/slots/:id', (req, res) => {
  const { name, start_time, end_time } = req.body;
  const id = req.params.id;
  pool.query('UPDATE slots SET name = ?, start_time = ?, end_time = ? WHERE id = ?', [name, start_time, end_time, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating slot');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Slot not found');
    } else {
      res.status(200).send(`Slot ${id} updated`);
    }
  });
});

// delete a slot
app.delete('/slots/:id', (req, res) => {
  const id = req.params.id;
  pool.query('DELETE FROM slots WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting slot');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Slot not found');
    } else {
      res.status(200).send(`Slot ${id} deleted`);
    }
  });
});
// create a new faculty
app.post('/faculties', (req, res) => {
    const { name, email, phone } = req.body;
    pool.query('INSERT INTO faculties (name, email, phone) VALUES (?, ?, ?)', [name, email, phone], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error creating faculty');
      } else {
        res.status(201).send(`Faculty ${result.insertId} created`);
      }
    });
  });
  
  // get all faculties
  app.get('/faculties', (req, res) => {
    pool.query('SELECT * FROM faculties', (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error getting faculties');
      } else {
        res.status(200).send(rows);
      }
    });
  });
  
  // update a faculty
  app.put('/faculties/:id', (req, res) => {
    const { name, email, phone } = req.body;
    const id = req.params.id;
    pool.query('UPDATE faculties SET name = ?, email = ?, phone = ? WHERE id = ?', [name, email, phone, id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error updating faculty');
      } else if (result.affectedRows === 0) {
        res.status(404).send('Faculty not found');
      } else {
        res.status(200).send(`Faculty ${id} updated`);
      }
    });
  });
  
  // delete a faculty
  app.delete('/faculties/:id', (req, res) => {
    const id = req.params.id;
    pool.query('DELETE FROM faculties WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error deleting faculty');
      } else if (result.affectedRows === 0) {
        res.status(404).send('Faculty not found');
      } else {
        res.status(200).send(`Faculty ${id} deleted`);
      }
    });
  });
// create a registration
app.post('/registrations', (req, res) => {
    const { course_id, student_id, slot_id } = req.body;
    
    // check if course exists
    pool.query('SELECT * FROM courses WHERE id = ?', [course_id], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error checking course');
      } else if (rows.length === 0) {
        res.status(400).send('Course does not exist');
      } else {
        const course = rows[0];
        
        // check if faculty is available
        pool.query('SELECT * FROM faculties WHERE id = ?', [course.faculty_id], (err, rows) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error checking faculty');
          } else if (rows.length === 0) {
            res.status(400).send('Faculty does not exist');
          } else {
            const faculty = rows[0];
            
            // check if slot is available
            pool.query('SELECT * FROM slots WHERE id = ?', [slot_id], (err, rows) => {
              if (err) {
                console.error(err);
                res.status(500).send('Error checking slot');
              } else if (rows.length === 0) {
                res.status(400).send('Slot does not exist');
              } else {
                const slot = rows[0];
                
                // check if slot is already registered
                pool.query('SELECT * FROM registrations WHERE slot_id = ?', [slot_id], (err, rows) => {
                  if (err) {
                    console.error(err);
                    res.status(500).send('Error checking registration');
                  } else if (rows.length !== 0) {
                    res.status(400).send('Slot already registered');
                  } else {
                    // create the registration
                    pool.query('INSERT INTO registrations (course_id, student_id, slot_id) VALUES (?, ?, ?)', [course_id, student_id, slot_id], (err, result) => {
                      if (err) {
                        console.error(err);
                        res.status(500).send('Error creating registration');
                      } else {
                        res.status(201).send(`Registration ${result.insertId} created`);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
  
  // get all registrations
  app.get('/registrations', (req, res) => {
    pool.query('SELECT * FROM registrations', (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error getting registrations');
      } else {
        res.status(200).send(rows);
      }
    });
  });
  
  // update a registration
  app.put('/registrations/:id', (req, res) => {
    const { course_id, student_id, slot_id } = req.body;
    const id = req.params.id;
    pool.query('SELECT * FROM registrations WHERE id = ?', [id], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error updating registration');
      } else if (rows.length === 0) {
        res.status(404).send('Registration not found');
      } else {
        const registration = rows[0];
        const { course_id: old_course_id, student_id: old_student_id, slot_id: old_slot_id } = registration;
        
        pool.query('SELECT * FROM courses WHERE id = ?', [course_id], (err, rows) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error getting course');
          } else if (rows.length === 0) {
            res.status(404).send('Course not found');
          } else {
            // check if slot exists and is not already registered
            pool.query('SELECT * FROM registrations WHERE slot_id = ? AND course_id = ?', [slot_id, course_id], (err, rows) => {
              if (err) {
                console.error(err);
                res.status(500).send('Error getting registration');
              } else if (rows.length > 0 && rows[0].id !== id) {
                res.status(409).send('Course already registered in the given slot');
              } else {
                // check if faculty is available to teach the course at the given slot
                pool.query('SELECT * FROM faculties WHERE id = ?', [rows[0].faculty_id], (err, rows) => {
                  if (err) {
                    console.error(err);
                    res.status(500).send('Error getting faculty');
                  } else if (rows.length === 0) {
                    res.status(404).send('Faculty not found');
                  } else if (rows[0].available_slots.indexOf(slot_id) === -1) {
                    res.status(409).send('Faculty not available to teach in the given slot');
                  } else {
                    // update the registration
                    pool.query('UPDATE registrations SET course_id = ?, student_id = ?, slot_id = ? WHERE id = ?', [course_id, student_id, slot_id, id], (err, result) => {
                      if (err) {
                        console.error(err);
                        res.status(500).send('Error updating registration');
                      } else {
                        res.status(200).send(`Registration ${id} updated`);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
  
  
// start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
