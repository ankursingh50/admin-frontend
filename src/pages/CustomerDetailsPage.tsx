import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface CustomerDetails {
  iqama_id: string;
  full_name: string;
  mobile_number: string;
  dep_reference_number: string;
  status: string;
  created_at: string;
  date_of_birth: string;
  expiry_date: string;
  gender: string;
  nationality: string;
  issue_date?: string;
  age?: number;
  additional_mobile_number?: string;
  building_number: string;
  street: string;
  neighbourhood: string;
  city: string;
  postal_code: string;
  country: string;
  device_id: string;
  device_type: string;
  location: string;
  account_purpose?: string;
  estimated_withdrawal?: string | number;
  pep_flag?: string;
  disability_flag?: string;
  tax_residency_outside_ksa?: string;
  source_of_income?: string;
  employment_sector?: string;
  employer_industry?: string;
  business_industry?: string;
  salary_income?: string | number;
  business_income?: string | number;
  investment_income?: string | number;
  rental_income?: string | number;
  housewife_allowance?: string | number;
  student_allowance?: string | number;
  pension_income?: string | number;
  other_income?: string | number;
  arabic_name?: string;
  date_of_birth_hijri?: string;
  expiry_date_hijri?: string;
  hafiz_income?: string | number;
  unemployed_income?: string | number;
}

const formatSAR = (amount?: string | number | null) => {
  if (amount === null || amount === undefined) return 'N/A';
  const num = typeof amount === 'number' ? amount : parseFloat((amount as string).replace(/,/g, ''));
  if (isNaN(num)) return amount?.toString() || 'N/A';
  return `${num.toLocaleString('en-US')} SAR`;
};

const DetailItem: React.FC<{ label: string; value: React.ReactNode; alignRight?: boolean }> = ({ label, value, alignRight = false }) => (
  <Box sx={{ minWidth: 180 }}>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: alignRight ? 'right' : 'left' }}>
      {label}
    </Typography>
    <Typography
      variant="body1"
      fontWeight="500"
      sx={alignRight ? { textAlign: 'right' } : undefined}
    >
      {value || 'N/A'}
    </Typography>
  </Box>
);

const API_URL = process.env.REACT_APP_API_BASE_URL;

const CustomerDetailsPage: React.FC = () => {
  const { iqamaId } = useParams<{ iqamaId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const lightGoldColor = '#f3efe8';
  const accordionHeaderColor = '#6e9994';
  const accordionSubHeaderColor = '#e8f0ef';
  const backButtonColor = '#004d40';

  useEffect(() => {
    if (!API_URL) {
      setError("API URL is not configured. Check .env file.");
      setLoading(false);
      return;
    }
    if (!iqamaId) return;

    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/customers/${iqamaId}`);
        setCustomer(response.data);
      } catch (err) {
        setError('Failed to load customer details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerDetails();
  }, [iqamaId]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!customer) return <Typography>No customer found.</Typography>;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>Customer Details</Typography>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
        <MuiLink component="button" variant="body2" onClick={() => navigate('/dashboard')}>
          Customer Onboarding
        </MuiLink>
        <Typography color="text.primary">Customer Details</Typography>
      </Breadcrumbs>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ p: 2, backgroundColor: lightGoldColor, display: 'flex', alignItems: 'center', width: { xs: '100%', md: '30%' } }}>
          <DetailItem label="Full Name" value={customer.full_name} />
          <DetailItem label="Name in Arabic" value={customer.arabic_name} />
        </Box>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, flexGrow: 1 }}>
          <DetailItem label="Application Reference Number" value={customer.dep_reference_number} />
          <DetailItem label="Mobile Number" value={customer.mobile_number} />
          <DetailItem label="Start Date" value={formatDate(customer.created_at)} />
          <DetailItem label="Status" value={customer.status} />
        </Box>
      </Paper>

      <Accordion defaultExpanded sx={{ mb: 1, boxShadow: 2, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: accordionHeaderColor, color: 'white', borderRadius: 1 }}>
          <Typography fontWeight="bold">Personal Details</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <DetailItem label="National ID Number" value={customer.iqama_id} />
            <DetailItem label="Date of Birth" value={formatDate(customer.date_of_birth)} />
            <DetailItem label="Gender" value={customer.gender} />
            <DetailItem label="Nationality" value={customer.nationality} />
            <DetailItem label="Issue Date" value={formatDate(customer.issue_date || '')} />
            <DetailItem label="Expiry Date" value={formatDate(customer.expiry_date)} />
            <DetailItem label="Age" value={customer.age?.toString()} />
            <DetailItem label="Additional Mobile Number" value={customer.additional_mobile_number} />
            <DetailItem label="Date of Birth (Hijri)" value={customer.date_of_birth_hijri} />
            <DetailItem label="Expiry Date (Hijri)" value={customer.expiry_date_hijri} />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mb: 1, boxShadow: 2, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: accordionSubHeaderColor, borderRadius: 1 }}>
          <Typography fontWeight="bold">General Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <DetailItem label="Device ID" value={customer.device_id} />
            <DetailItem label="Device Type" value={customer.device_type} />
            <DetailItem label="Location" value={customer.location} />
            <DetailItem label="Created At" value={formatDate(customer.created_at)} />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mb: 1, boxShadow: 2, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: accordionSubHeaderColor, borderRadius: 1 }}>
          <Typography fontWeight="bold">Address Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <DetailItem label="Building Number" value={customer.building_number} />
            <DetailItem label="Street" value={customer.street} />
            <DetailItem label="Neighbourhood" value={customer.neighbourhood} />
            <DetailItem label="City" value={customer.city} />
            <DetailItem label="Postal Code" value={customer.postal_code} />
            <DetailItem label="Country" value={customer.country} />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mb: 1, boxShadow: 2, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: accordionSubHeaderColor, borderRadius: 1 }}>
          <Typography fontWeight="bold">Risk Flags</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <DetailItem label="Political Person" value={customer.pep_flag} />
            <DetailItem label="Disability Status" value={customer.disability_flag} />
            <DetailItem label="Tax Residency Outside KSA" value={customer.tax_residency_outside_ksa} />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mb: 1, boxShadow: 2, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: accordionSubHeaderColor, borderRadius: 1 }}>
          <Typography fontWeight="bold">Account Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <DetailItem label="Account Purpose" value={customer.account_purpose} />
            <DetailItem label="Estimated Withdrawals" value={formatSAR(customer.estimated_withdrawal)} alignRight />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mb: 1, boxShadow: 2, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: accordionSubHeaderColor, borderRadius: 1 }}>
          <Typography fontWeight="bold">Employment Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
            <DetailItem label="Source of Income" value={customer.source_of_income} />
            <DetailItem label="Employment Sector" value={customer.employment_sector} />
            <DetailItem label="Employer Industry" value={customer.employer_industry} />
            <DetailItem label="Business Industry" value={customer.business_industry} />
            <DetailItem label="Salary Income" value={formatSAR(customer.salary_income)} />
            <DetailItem label="Business Income" value={formatSAR(customer.business_income)} />
            <DetailItem label="Investment Income" value={formatSAR(customer.investment_income)} />
            <DetailItem label="Rental Income" value={formatSAR(customer.rental_income)} />
            <DetailItem label="Housewife Allowance" value={formatSAR(customer.housewife_allowance)} />
            <DetailItem label="Student Allowance" value={formatSAR(customer.student_allowance)} />
            <DetailItem label="Pension Income" value={formatSAR(customer.pension_income)} />
            <DetailItem label="Hafiz Income" value={formatSAR(customer.hafiz_income)} />
            <DetailItem label="Unemployed Income" value={formatSAR(customer.unemployed_income)} />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
          sx={{ backgroundColor: backButtonColor, '&:hover': { backgroundColor: '#00382e' }, textTransform: 'none', px: 4, borderRadius: '8px' }}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default CustomerDetailsPage;
