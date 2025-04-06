import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import {domain} from '../../Components/config';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles({
    card: {
      margin: '20px 0',
      backgroundColor: '#f5f5f5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    dataGrid: {
      '& .MuiDataGrid-root': {
        backgroundColor: '#fafafa',
      },
    },
  });


const ProfileMain = () => {
    const classes = useStyles();
  const [data, setData] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    axios.get(`${domain}/user-profile/` + userId, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => setData(response.data))
    .catch(error => console.error('Error:', error));
  }, [userId]);

  const columns = [
    { field: '_id', headerName: 'ID' },
    { field: 'userId', headerName: 'User ID' },
    { field: 'selectedItem', headerName: 'Selected Item' },
    { field: 'betAmount', headerName: 'Bet Amount' },
    { field: 'multiplier', headerName: 'Multiplier' },
    { field: 'totalBet', headerName: 'Total Bet' },
    { field: 'tax', headerName: 'Tax' },
    { field: 'fee', headerName: 'Fee' },
    { field: 'selectedTimer', headerName: 'Selected Timer' },
    { field: 'periodId', headerName: 'Period ID' },
    { field: 'timestamp', headerName: 'Timestamp' },
    { field: 'result', headerName: 'Result' },
    { field: 'status', headerName: 'Status' },
    { field: 'winLoss', headerName: 'Win/Loss' },
  ];
  const depositColumns = [
    { field: '_id', headerName: 'ID' },
    { field: 'userId', headerName: 'User ID' },
    { field: 'uid', headerName: 'UID' },
    { field: 'depositAmount', headerName: 'Deposit Amount' },
    { field: 'depositDate', headerName: 'Deposit Date' },
    { field: 'depositStatus', headerName: 'Deposit Status' },
    { field: 'depositId', headerName: 'Deposit ID' },
    { field: 'depositMethod', headerName: 'Deposit Method' },
  ];

  const withdrawColumns = [
    { field: '_id', headerName: 'ID' },
    { field: 'status', headerName: 'Status' },
    { field: 'balance', headerName: 'Balance' },
    { field: 'withdrawMethod', headerName: 'Withdraw Method' },
    { field: 'userId', headerName: 'User ID' },
    { field: 'createdAt', headerName: 'Created At' },
    { field: 'updatedAt', headerName: 'Updated At' },
  ];
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Paper>
        <h2>Wallet Amount</h2>
          <p>{data?.walletAmount}</p>
        <h2>Bank Details</h2>
{data?.bankDetails.map((detail, index) => (
  <TableContainer component={Paper} key={index}>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell component="th" scope="row">Name</TableCell>
          <TableCell>{detail.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">Account No</TableCell>
          <TableCell>{detail.accountNo}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">IFSC Code</TableCell>
          <TableCell>{detail.ifscCode}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">Mobile</TableCell>
          <TableCell>{detail.mobile}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row">Bank Name</TableCell>
          <TableCell>{detail.bankName}</TableCell>
        </TableRow>
       
      </TableBody>
    </Table>
  </TableContainer>
))}
 <h2>Direct Subordinates</h2>
<TableContainer component={Paper}>
  <Table>
    <TableBody>
      <TableRow>
        <TableCell component="th" scope="row">No of Register</TableCell>
        <TableCell>{data?.directSubordinates.noOfRegister}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">Deposit Number</TableCell>
        <TableCell>{data?.directSubordinates.depositNumber}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">Deposit Amount</TableCell>
        <TableCell>{data?.directSubordinates.depositAmount}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">First Deposit</TableCell>
        <TableCell>{data?.directSubordinates.firstDeposit}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>

<h2>Team Subordinates</h2>
<TableContainer component={Paper}>
  <Table>
    <TableBody>
      <TableRow>
        <TableCell component="th" scope="row">No of Register</TableCell>
        <TableCell>{data?.teamSubordinates.noOfRegister}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">Deposit Number</TableCell>
        <TableCell>{data?.teamSubordinates.depositNumber}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">Deposit Amount</TableCell>
        <TableCell>{data?.teamSubordinates.depositAmount}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">First Deposit</TableCell>
        <TableCell>{data?.teamSubordinates.firstDeposit}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>    
<h2>Commission From Levels</h2>
{data?.commission && Object.entries(data.commission).map(([level, commission], index) => (
  <p key={index}>{`${level}: ${commission}`}</p>
))}
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <Paper>
        <h2>Bet History</h2>
          {data?.bets && (
          <DataGrid
          rows={data.bets}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          getRowId={(row) => row._id} // Add this line
        />
          )}
          <h2>Deposit History</h2>
    {data?.depositHistory && (
      <DataGrid
        rows={data.depositHistory}
        columns={depositColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    )}
           <h2>Withdraw History</h2>
    {data?.withdraws && (
      <DataGrid
        rows={data.withdraws}
        columns={withdrawColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    )}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default ProfileMain;