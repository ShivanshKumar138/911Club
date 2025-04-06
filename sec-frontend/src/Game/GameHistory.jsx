import React, { useState } from "react";
import { Grid, Divider, Pagination, Box, useMediaQuery } from "@mui/material";

const GameHistory = ({ data }) => {
  const pageSize = 10;
  const [page, setPage] = useState(0);

  const columns = [
    { id: "period", label: "Period", width: "35%" },
    { id: "result", label: "Result", width: "45%" },
    { id: "toral", label: "Sum", width: "20%" },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedData = data.slice(page * pageSize, (page + 1) * pageSize);
  const isMediumScreen = useMediaQuery("(max-width:600px)");
  const isSmallScreen = useMediaQuery("(max-width:475px)");
  return (
    <Grid container px={0} sx={{ backgroundColor: "#fff" }}>
      {columns.map((column, index) => (
        <Grid
          item
          key={column.id}
          sx={{
            width: column.width,
            background: "#F95959", // Changed to a golden yellow color
            color: "white",
            padding: "2.5% 5.8%",
            borderTopLeftRadius: index === 0 ? "10px" : "0",
            borderTopRightRadius: index === columns.length - 1 ? "10px" : "0",
            fontWeight: "bold",
            display: "flex",
            fontSize: "0.9rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {column.label}
        </Grid>
      ))}
      <Divider />
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        backgroundColor="#ffffff"
        sx={{ mt: 1.5 }}
      >
        {paginatedData.map((row) => (
          <React.Fragment key={row.id}>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                alignItems: "right",
                textAlign: "right",
                fontSize: "0.9rem",
                color: "black",
              }}
            >
              {row.periodId.toString()}
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                flexDirection: "row", // Align items vertically
                alignItems: "left",
              }}
            >
              {Object.entries(row.sectionOutcome).map(([key, outcome]) => (
                <div
                  key={key}
                  style={{
                    width: "auto",
                    height: isSmallScreen
                      ? "16px"
                      : isMediumScreen
                      ? "20px"
                      : "16px",
                    borderRadius: "50%",
                    border: "1px solid grey",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    color: "black",
                    margin: isMediumScreen ? "2px 3px" : "2px",
                    aspectRatio: "1 / 1", // This ensures a square aspect ratio, keeping it circular
                    fontSize: isSmallScreen
                      ? "13px"
                      : isMediumScreen
                      ? "15px"
                      : "13px",
                  }}
                >
                  {outcome.number}
                </div>
              ))}
            </Grid>

            <Grid
              item
              xs={0.7}
              sx={{
                width: isSmallScreen
                  ? "14px"
                  : isMediumScreen
                  ? "10px"
                  : "13.5px",
                height: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                color: "white",
                borderRadius: "50%",
                mb: 2,
                background: " #F95959",
                aspectRatio: "1 / 1",
              }}
            >
              {row.totalSum.value}
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "10px",
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

export default GameHistory;
