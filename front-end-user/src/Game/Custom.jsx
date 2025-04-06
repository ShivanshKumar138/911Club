import React, { useState } from "react";
import { Grid, Divider, Pagination, Box } from "@mui/material";

const CustomTable = ({ data }) => {
  // console.log("data", data);
  const pageSize = 10;
  const [page, setPage] = useState(1); // Pagination component is 1-based

  const columns = [
    { id: "period", label: "Period" },
    { id: "trxBlockAddress", label: "Block" },
    { id: "blockTime", label: "Block time" },
    { id: "hash", label: "Hash" },
    { id: "big_small", label: "Result" },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Grid container sx={{ width: "100%", padding: "8px 10px" }}>
      {columns.map((column) => (
        <Grid
          item
          xs={2.4}
          key={column.id}
          sx={{
            backgroundColor: "#F95959",
            color: "white",
            padding: "8px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.8rem",
          }}
        >
          {column.label}
        </Grid>
      ))}
      <Divider />
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        backgroundColor="106518"
      >
        {paginatedData.map((row) => (
          <React.Fragment key={row._id} marginBlock={2}>
            <Grid
              item
              xs={2.4}
              sx={{
                padding: "8px",
                borderBottom: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: "bold",
                color: "black",
              }}
            >
              {row.periodId.slice(0, 3) + "**" + row.periodId.slice(-4)}
            </Grid>
            <Grid
              item
              xs={2.4}
              sx={{
                padding: "8px",
                borderBottom: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: "bold",
                color: "black",
              }}
            >
              {row.trxBlockAddress}
            </Grid>
            <Grid
              item
              xs={2.4}
              sx={{
                padding: "8px",
                borderBottom: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: "bold",
                color: "black",
              }}
            >
              {row.blockTime}
            </Grid>
            <Grid
              item
              xs={2.4}
              sx={{
                padding: "8px",
                borderBottom: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: "bold",
                color: "black",
              }}
            >
              {"** " + row.hash.slice(-4)}{" "}
            </Grid>
            <Grid
              item
              xs={1.2}
              sx={{
                padding: "8px",
                borderBottom: "1px solid #ccc",
                display: "flex",
                alignItems: "center",

                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  background:
                    Array.isArray(row.colorOutcome) &&
                    row.colorOutcome.length === 2
                      ? `linear-gradient(to bottom, ${
                          row.colorOutcome[0] === "red"
                            ? "rgb(253,86,92)"
                            : row.colorOutcome[0] === "green"
                            ? "rgb(64,173,114)"
                            : row.colorOutcome[0]
                        } 50%, ${
                          row.colorOutcome[1] === "red"
                            ? "rgb(253,86,92)"
                            : row.colorOutcome[1] === "green"
                            ? "rgb(64,173,114)"
                            : row.colorOutcome[1]
                        } 50%)`
                      : row.colorOutcome[0] === "red"
                      ? "rgb(253,86,92)"
                      : row.colorOutcome[0] === "green"
                      ? "rgb(64,173,114)"
                      : row.colorOutcome[0],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                {row.numberOutcome}
              </div>
            </Grid>
            <Grid
              item
              xs={1.2}
              sx={{
                padding: "8px",
                borderBottom: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textTransform: "capitalize",
                fontWeight: "bold",
                fontSize: "15px",
                color:
                  row.sizeOutcome.charAt(0).toUpperCase() === "B"
                    ? "#dd9138"
                    : "#5088d3",
              }}
            >
              {row.sizeOutcome.charAt(0).toUpperCase()}
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
          marginBottom: "2.5rem",
          backgroundColor: "#f0f0f0",
          padding: { xs: "10px", sm: "15px" },
          borderRadius: "0 0 10px 10px",
        }}
      >
        <Pagination
          count={Math.ceil(data.length / pageSize)}
          page={page}
          onChange={handleChangePage}
          size="small"
          siblingCount={1}
          boundaryCount={1}
          sx={{
            "& .MuiPagination-ul": {
              flexWrap: "nowrap",
            },
            "& .MuiPaginationItem-root": {
              color: "#000",
              fontSize: { xs: "0.7rem", sm: "0.8rem" },
              margin: "0 1px",
              minWidth: { xs: "24px", sm: "28px" },
              height: { xs: "24px", sm: "28px" },
            },
            "& .MuiPaginationItem-page": {
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            },
            "& .MuiPaginationItem-page.Mui-selected": {
              color: "#fff",
              backgroundColor: "#F95959",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#0a4f11",
              },
            },
            "& .MuiPaginationItem-ellipsis": {
              color: "#000",
              backgroundColor: "transparent",
            },
            "& .MuiPaginationItem-previousNext": {
              backgroundColor: "#F95959",
              color: "#ffffff",
              borderRadius: "4px",
              minWidth: { xs: "24px", sm: "28px" },
              height: { xs: "24px", sm: "28px" },
              "&:hover": {
                backgroundColor: "#0a4f11",
              },
            },
            "& .MuiPaginationItem-icon": {
              fontSize: "1rem",
            },
          }}
        />
      </Box>
    </Grid>
  );
};

export default CustomTable;
