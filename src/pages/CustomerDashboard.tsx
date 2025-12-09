import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { performUserDeletionFlow } from '../services/deleteUserService';

interface Customer {
  full_name: string;
  iqama_id: string;
  mobile_number: string;
  dep_reference_number: string;
  created_at: string;
  status: string;
  current_step?: string;
}

const API_URL = process.env.REACT_APP_API_BASE_URL || "";


const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string | null>(null);

  const open = Boolean(anchorEl);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/customers/onboarded`);
      setCustomers(response.data);
    } catch (err) {
      setError("Could not load customer data. Is the backend server running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!API_URL) {
      setError("API URL is not configured. Please check your .env file for REACT_APP_API_BASE_URL.");
      setLoading(false);
      return;
    }
    fetchCustomers();
  }, []);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    iqamaId: string,
    name: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomerId(iqamaId);
    setSelectedCustomerName(name.replace(/\s+/g, ""));
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomerId(null);
  };

  const handleViewDetails = () => {
    if (selectedCustomerId) {
      navigate(`/customer/${selectedCustomerId}`);
    }
    handleMenuClose();
  };

  const formatStatus = (status: string): string => {
    if (status === 'in_progress') return 'In Progress';
    return status;
  };  

  const handleDelete = async () => {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete ${selectedCustomerName}?`
  );

  if (!confirmDelete || !selectedCustomerId || !selectedCustomerName) {
    handleMenuClose();
    return;
  }

  try {
   
    const result = await performUserDeletionFlow(
      selectedCustomerName,     
      selectedCustomerId,       
      API_URL
    );

    if (result.success) {
  alert("Success! User deleted.");
  await fetchCustomers();
} else {
  console.log("Delete failed at step:", result.step);
  alert("Failed to delete user. Please try again.");
}

  } catch (err) {
    console.error("Delete error:", err);
    alert("Something went wrong.");
  }

  handleMenuClose();
};
 

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>;
  }

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      <Typography variant="h5" sx={{ p: 2, fontWeight: '500' }}>
        Customer List
      </Typography>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-root': { backgroundColor: '#e0e0e0', color: '#333', fontWeight: 'bold' } }}>
              <TableCell>Customer Name</TableCell>
              <TableCell>Iqama ID</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>DEP Ref No.</TableCell> {/* ✅ Changed column label */}
              <TableCell>Start Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Current Step</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.iqama_id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                <TableCell sx={{ fontSize: '14px' }}>{customer.full_name}</TableCell>
                <TableCell sx={{ fontSize: '14px' }}>{customer.iqama_id}</TableCell>
                <TableCell sx={{ fontSize: '14px' }}>{customer.mobile_number || 'N/A'}</TableCell>
                <TableCell sx={{ fontSize: '14px' }}>{customer.dep_reference_number}</TableCell>
                <TableCell sx={{ fontSize: '14px' }}>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                <TableCell sx={{ fontSize: '14px' }}>{formatStatus(customer.status)}</TableCell>
                <TableCell sx={{ fontSize: '14px' }}>{customer.current_step || '—'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleMenuClick(e, customer.iqama_id,customer.full_name)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem onClick={handleViewDetails}>View Details</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Paper>
  );
};

export default CustomerDashboard;
