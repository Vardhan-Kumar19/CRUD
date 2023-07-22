// src/components/CrudApp.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';

const CrudApp = () => {
  const [data, setData] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog,setOpenAddDialog]=useState(false);
  const [editData, setEditData] = useState({ id: '', name: '', description: '' });
  const [newData, setNewData] = useState({ id: '', name: '', description: '' });

  // Fetch data from JSON Server on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/data').then((response) => {
        setData(response.data); // Set the fetched data into the state
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item.id === id);
    setEditData(itemToEdit);
    setOpenEditDialog(true);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/data/${id}`).then(() => {
      setData(data.filter((item) => item.id !== id));
      console.log('Delete clicked for ID:', id);
    });
  };

  const handleAdd = () => {
    // Implement the logic to open a form or perform any other action for adding data
    // For simplicity, we'll just set an empty data for adding
    setEditData({ id: newData.id, name: newData.id, description: newData.id });
    console.log(newData);
    setOpenAddDialog(true);
  };

  const handleSave = () => {
    if (editData && editData.id) {
      // Implement the logic to update data for the "Edit" action
      axios.put(`http://localhost:5000/data/${editData.id}`, editData).then(() => {
        setData((prevData) =>
          prevData.map((item) => (item.id === editData.id ? { ...item, ...editData } : item))
        );
      });
      setEditData('');
      setOpenEditDialog(false);
    } else if(newData){
      // Implement the logic to add data for the "Add" action
      axios.post('http://localhost:5000/data', newData).then((response) => {
        setData([...data, response.data]);
      });
      setNewData('');
      setOpenAddDialog(false);
    }
    
  };

  const handleCancelEdit = () => {
    setOpenEditDialog(false);
  };
  const handleCancelAdd = () => {
    setOpenAddDialog(false);
  };

  return (
    <Container>
      <h1>CRUD Operations</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(item.id)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" onClick={handleAdd}>
        Add
      </Button>
      {/* Add form for adding and editing data */}
      <Dialog open={openAddDialog} onClose={handleCancelAdd}>
        <DialogTitle>Add Data</DialogTitle>
        <DialogContent>
          <TextField
            label="ID"
            value={newData.id}
            onChange={(e) => setNewData({ ...newData, id: e.target.value })}
          />
          <TextField
            label="Name"
            value={newData.name}
            onChange={(e) => setNewData({ ...newData, name: e.target.value })}
          />
          <TextField
            label="Description"
            value={newData.description}
            onChange={(e) => setNewData({ ...newData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAdd} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit dialog for editing data */}
      <Dialog open={openEditDialog && !!editData.id} onClose={handleCancelEdit}>
        <DialogTitle>Edit Data</DialogTitle>
        <DialogContent>
          <TextField
            label="ID"
            value={editData.id}
            disabled // Disabling the ID field for editing
          />
          <TextField
            label="Name"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
          <TextField
            label="Description"
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CrudApp;